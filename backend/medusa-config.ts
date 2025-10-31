import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'
import { MeilisearchPluginOptions } from '@rokmohar/medusa-plugin-meilisearch'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const DATABASE_URL = process.env.DATABASE_URL
const REDIS_URL = process.env.REDIS_URL
const DEPLOYMENT_TYPE = process.env.DEPLOYMENT_TYPE || 'local'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:9000'
const STORE_CORS = process.env.STORE_CORS || BACKEND_URL
const ADMIN_CORS = process.env.ADMIN_CORS || BACKEND_URL
const AUTH_CORS = process.env.AUTH_CORS || BACKEND_URL
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'supersecret'

const IS_ADMIN_DISABLED = process.env.IS_ADMIN_DISABLED === 'true'

const CACHE_REDIS_URL = process.env.CACHE_REDIS_URL
const EVENTS_REDIS_URL = process.env.EVENTS_REDIS_URL
const WE_REDIS_URL = process.env.WE_REDIS_URL
const LOCKING_REDIS_URL = process.env.LOCKING_REDIS_URL

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT
const MINIO_ACCESS_KEY_ID = process.env.MINIO_ACCESS_KEY_ID
const MINIO_SECRET_ACCESS_KEY = process.env.MINIO_SECRET_ACCESS_KEY
const MINIO_REGION = process.env.MINIO_REGION
const MINIO_BUCKET = process.env.MINIO_BUCKET
const MINIO_FILE_URL = process.env.MINIO_FILE_URL

const S3_ENDPOINT = process.env.S3_ENDPOINT
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY
const S3_REGION = process.env.S3_REGION
const S3_BUCKET = process.env.S3_BUCKET
const S3_FILE_URL = process.env.S3_FILE_URL

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL

const STRIPE_API_KEY = process.env.STRIPE_API_KEY
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: DATABASE_URL,
    ...(DEPLOYMENT_TYPE === 'local' ? {
      databaseDriverOptions: {
        ssl: false,
        sslmode: 'disable',
      },
    } : {}),
    redisUrl: REDIS_URL,
    http: {
      storeCors: STORE_CORS,
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
    }
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: IS_ADMIN_DISABLED,
  },
  modules: [
    ...(CACHE_REDIS_URL ? [{
      key: Modules.CACHING,
      resolve: '@medusajs/medusa/caching',
      options: {
        providers: [
          {
            resolve: '@medusajs/caching-redis',
            id: 'caching-redis',
            // Optional, makes this the default caching provider
            is_default: true,
            options: {
              redisUrl: CACHE_REDIS_URL,
            },
          },
        ],
      },
    }] : []),
    ...(EVENTS_REDIS_URL ? [{
      key: Modules.EVENT_BUS,
      resolve: '@medusajs/medusa/event-bus-redis',
      options: {
        redisUrl: EVENTS_REDIS_URL,
      },
    }] : []),
    ...(WE_REDIS_URL ? [{
      key: Modules.WORKFLOW_ENGINE,
      resolve: '@medusajs/medusa/workflow-engine-redis',
      options: {
        redis: {
          url: WE_REDIS_URL,
        },
      },
    }] : []),
    ...(LOCKING_REDIS_URL ? [{
      key: Modules.LOCKING,
      resolve: '@medusajs/medusa/locking',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/locking-redis',
            id: 'locking-redis',
            is_default: true,
            options: {
              redisUrl: LOCKING_REDIS_URL,
            },
          },
        ],
      },
    }] : []),
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          ...(MINIO_ENDPOINT && MINIO_ACCESS_KEY_ID && MINIO_SECRET_ACCESS_KEY ? [{
            resolve: '@medusajs/medusa/file-s3',
            id: 'minio',
            options: {
              file_url: MINIO_FILE_URL,
              access_key_id: MINIO_ACCESS_KEY_ID,
              secret_access_key: MINIO_SECRET_ACCESS_KEY,
              region: MINIO_REGION,
              bucket: MINIO_BUCKET,
              endpoint: MINIO_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          }] : []),
          ...(S3_ENDPOINT && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY ? [{
            resolve: '@medusajs/medusa/file-s3',
            id: 's3',
            options: {
              file_url: S3_FILE_URL,
              access_key_id: S3_ACCESS_KEY_ID,
              secret_access_key: S3_SECRET_ACCESS_KEY,
              region: S3_REGION,
              bucket: S3_BUCKET,
              endpoint: S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          }] : []),
          ...(!MINIO_ENDPOINT && !S3_ENDPOINT ? [{
            resolve: '@medusajs/file-local',
            id: 'local',
            options: {
              upload_dir: 'static',
              backend_url: `${BACKEND_URL}/static`
            }
          }] : [])
        ],
      },
    },
    ...((SENDGRID_API_KEY && SENDGRID_FROM_EMAIL) || (RESEND_API_KEY && RESEND_FROM_EMAIL) ? [{
      key: Modules.NOTIFICATION,
      resolve: '@medusajs/notification',
      options: {
        providers: [
          ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL ? [{
            resolve: '@medusajs/notification-sendgrid',
            id: 'sendgrid',
            options: {
              channels: ['email'],
              api_key: SENDGRID_API_KEY,
              from: SENDGRID_FROM_EMAIL,
            }
          }] : []),
          ...(RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
            resolve: './src/modules/email-notifications',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: RESEND_API_KEY,
              from: RESEND_FROM_EMAIL,
            },
          }] : []),
        ]
      }
    }] : []),
    ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET ? [{
      key: Modules.PAYMENT,
      resolve: '@medusajs/payment',
      options: {
        providers: [
          {
            resolve: '@medusajs/payment-stripe',
            id: 'stripe',
            options: {
              apiKey: STRIPE_API_KEY,
              webhookSecret: STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    }] : [])
  ],
  plugins: [
    ...(MEILISEARCH_HOST && MEILISEARCH_API_KEY ? [{
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: MEILISEARCH_HOST,
          apiKey: MEILISEARCH_API_KEY
        },
        settings: {
          products: {
            type: 'products',
            enabled: true,
            fields: ['id', 'title', 'description', 'handle', 'variant_sku', 'thumbnail'],
            indexSettings: {
              searchableAttributes: ['title', 'description', 'variant_sku'],
              displayedAttributes: ['id', 'handle', 'title', 'description', 'variant_sku', 'thumbnail'],
              filterableAttributes: ['id', 'handle'],
            },
            primaryKey: 'id',
          }
        }
      } satisfies MeilisearchPluginOptions
    }] : [])
  ],
})
