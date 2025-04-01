ARG NODE_VERSION=22.14
FROM node:${NODE_VERSION}-bookworm-slim AS base

FROM base AS deps
WORKDIR /opt/storefront/deps
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Install dependencies
COPY package*.json yarn.lock* pnpm-lock.yaml* .yarn* ./
RUN \
  if [ -f yarn.lock ]; then corepack enable yarn && yarn --immutable; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /opt/storefront/build
ARG MEDUSA_BACKEND_URL=http://host.docker.internal:9000
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test_123
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

# Build the application
COPY --from=deps /opt/storefront/deps .
COPY . .
COPY --from=deps /opt/storefront/deps/yarn.lock ./yarn.lock
RUN \
  if [ -f yarn.lock ]; then corepack enable yarn && yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  fi

FROM base AS runner
RUN apt-get update \
  && apt-get install --no-install-recommends -y tini=0.19.0-1 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

USER node
WORKDIR /opt/storefront

COPY --from=builder --chown=node:node /opt/storefront/build/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node /opt/storefront/build/.next/standalone ./
COPY --from=builder --chown=node:node /opt/storefront/build/.next/static ./.next/static

ARG NODE_ENV=production
ARG PORT=8000
ARG MEDUSA_BACKEND_URL=http://host.docker.internal:9000
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test_123
ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

EXPOSE $PORT


ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "server.js"]
