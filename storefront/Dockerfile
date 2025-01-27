FROM node:20.18-bookworm-slim AS base

FROM base AS dependency-installer
WORKDIR /opt/storefront/deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /opt/storefront/build
ARG MEDUSA_BACKEND_URL=http://host.docker.internal:9000
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
COPY --from=dependency-installer /opt/storefront/deps/node_modules ./node_modules
COPY . .
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
RUN apt-get update \
  && apt-get install --no-install-recommends -y tini=0.19.0-1 \
  && rm -rf /var/lib/apt/lists/*
USER node
WORKDIR /opt/storefront
COPY --from=builder --chown=node:node /opt/storefront/build/ .
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ARG PORT=8000
ENV PORT=$PORT
EXPOSE $PORT
ARG MEDUSA_BACKEND_URL=http://host.docker.internal:9000
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV HOSTNAME=0.0.0.0
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npm", "start"]
