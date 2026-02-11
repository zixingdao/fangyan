# Stage 1: Build shared packages
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy workspace config
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Copy packages
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui

# Copy apps source
COPY apps/client ./apps/client
COPY apps/admin ./apps/admin
COPY apps/server ./apps/server

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared
RUN pnpm --filter @changsha/shared build

# Stage 2: Build Client (User)
FROM base AS build-client
RUN pnpm --filter @changsha/client build

# Stage 3: Build Admin
FROM base AS build-admin
RUN pnpm --filter @changsha/admin build

# Stage 4: Build Server
FROM base AS build-server
RUN pnpm --filter @changsha/server build

# Stage 5: Production
FROM node:20-alpine AS production
ENV NODE_ENV=production

WORKDIR /app

# Install production dependencies only (for server)
# We need to copy package.json and pnpm-lock.yaml to install deps
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY apps/server/package.json ./apps/server/

RUN corepack enable && pnpm install --prod --frozen-lockfile

# Copy built artifacts
# 1. Server code
COPY --from=build-server /app/apps/server/dist ./apps/server/dist
# 2. Shared code (if needed at runtime, usually compiled into dist, but sometimes needed)
# Actually NestJS build usually bundles everything in dist/main.js? 
# No, standard NestJS build keeps node_modules external.
# So we need node_modules (installed above) and dist.

# 3. Static files (Client & Admin)
# Create public directories
RUN mkdir -p apps/server/public/user
RUN mkdir -p apps/server/public/admin

# Copy Client build to public/user
COPY --from=build-client /app/apps/client/dist ./apps/server/public/user

# Copy Admin build to public/admin
COPY --from=build-admin /app/apps/admin/dist ./apps/server/public/admin

# Copy other necessary files
COPY apps/server/ecosystem.config.js ./apps/server/

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["node", "dist/main"]
