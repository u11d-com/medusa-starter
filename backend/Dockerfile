ARG NODE_VERSION=23.7
FROM node:${NODE_VERSION}-bookworm-slim AS base

FROM base AS deps
WORKDIR /opt/medusa/deps

COPY package*.json yarn.lock* pnpm-lock.yaml* .yarn* ./
# Install dependencies
RUN \
  if [ -f yarn.lock ]; then corepack enable yarn && yarn install --immutable; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /opt/medusa/build

COPY --from=deps /opt/medusa/deps .
COPY . .
# Build the application
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
WORKDIR /opt/medusa
COPY --from=builder --chown=node:node /opt/medusa/build .
COPY --from=builder --chown=node:node /opt/medusa/build/node_modules ./.medusa/server/node_modules
ARG PORT=9000
ARG NODE_ENV=production
ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV
EXPOSE $PORT
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["./start.sh"]
