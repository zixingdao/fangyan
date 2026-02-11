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

# Copy apps source (needed for dependencies resolution)
# 我们需要把所有 apps 的 package.json 也复制过来，否则 pnpm install 可能会报错
COPY apps/client/package.json ./apps/client/
COPY apps/admin/package.json ./apps/admin/
COPY apps/server/package.json ./apps/server/

# Install dependencies
# 增加 --ignore-scripts 来跳过所有包的生命周期脚本，避免 ts-node/bin 软链接创建失败的警告
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Build shared
RUN pnpm --filter @changsha/shared build

# Build UI
RUN pnpm --filter @changsha/ui build

# Stage 2: Build Client (User)
FROM base AS build-client
COPY apps/client ./apps/client
RUN pnpm --filter @changsha/client build

# Stage 3: Build Admin
FROM base AS build-admin
COPY apps/admin ./apps/admin
RUN pnpm --filter @changsha/admin build

# Stage 4: Build Server
FROM base AS build-server
COPY apps/server ./apps/server
RUN pnpm --filter @changsha/server build

# Stage 5: Production
FROM node:20-alpine AS production
ENV NODE_ENV=production
# 这一步非常重要，确保 pnpm 可用
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Install production dependencies only (for server)
# We need to copy package.json and pnpm-lock.yaml to install deps
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY apps/server/package.json ./apps/server/

# 为了避免 postinstall 脚本尝试编译原生依赖（如 sql.js/sqlite3）导致失败或警告
# 我们添加 --ignore-scripts
RUN corepack enable && pnpm install --prod --no-frozen-lockfile --ignore-scripts

# 关键修复：确保 NestJS 运行时能找到 dist 下的文件
# 复制共享库的构建产物（因为 NestJS 运行时可能需要引用）
# 注意：这里我们从 base 阶段复制，因为 base 阶段执行了 build 命令
COPY --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --from=base /app/packages/ui/dist ./packages/ui/dist

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

EXPOSE 80

CMD ["node", "dist/main"]
