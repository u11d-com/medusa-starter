FROM node:23.7-bookworm-slim AS base

FROM base AS dependency-installer
WORKDIR /opt/medusa/deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then corepack enable yarn && yarn --immutable; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /opt/medusa/build
COPY --from=dependency-installer /opt/medusa/deps/node_modules ./node_modules
COPY . .
RUN \
  if [ -f yarn.lock ]; then corepack enable && yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
RUN apt-get update \
  && apt-get install --no-install-recommends -y tini=0.19.0-1 \
  && rm -rf /var/lib/apt/lists/*
USER node
WORKDIR /opt/medusa
COPY --from=dependency-installer --chown=node:node /opt/medusa/deps/node_modules ./.medusa/server/node_modules
COPY --from=builder --chown=node:node /opt/medusa/build .
ARG PORT=9000
ARG NODE_ENV=production
ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV
EXPOSE $PORT
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["./start.sh"]
