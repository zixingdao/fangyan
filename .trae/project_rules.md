# 长沙方言项目 - 架构与开发规范 (Project Rules)

## 1. 核心上下文
- **项目名称**: 长沙方言采集平台
- **目标**: 采集方言音频，服务于阿里项目。
- **环境**: Windows

## 2. 技术栈 (Tech Stack)
- **Monorepo**: pnpm workspace
- **Shared**: Zod (Schema定义) + TypeScript
- **UI Library**: React + Ant Design / Tailwind (在 packages/ui 中定义)
- **用户端前端 (Client)**:
  - 框架: React 18
  - 语言: TypeScript
  - 构建: Vite
  - 状态: Zustand
  - 路由: React Router v6
  - 工具: Axios + React Query
- **管理端前端 (Admin)**:
  - 框架: React 18
  - 语言: TypeScript
  - 构建: Vite
  - 状态: Zustand
  - 路由: React Router v6
  - 工具: Axios + React Query
- **后端 (Server)**:
  - 运行时: Node.js
  - 框架: NestJS
  - 数据库: MySQL (优先)
  - ORM: TypeORM / Prisma
  - 认证: JWT + Passport
  - 日志: Winston
- **部署**: Docker + Nginx (集成部署：后端托管前端静态资源)

## 3. 目录结构规范
```text
长沙方言软件/
├── pnpm-workspace.yaml       # Monorepo 配置
├── packages/
│   ├── shared/               # [核心] Zod Schemas & Types
│   └── ui/                   # [核心] 通用 UI 组件库
├── apps/
│   ├── client/               # 用户端 (React)
│   │   ├── src/features/    # 业务特性 (Auth, Recording)
│   │   └── src/providers/   # 全局 Context
│   ├── admin/                # 管理端 (React)
│   │   ├── src/features/    # 业务特性 (UserMgr, Dashboard)
│   │   └── src/providers/
│   └── server/               # 后端 (NestJS)
│       ├── src/modules/     # 业务模块 (Auth, User)
│       └── src/common/      # 公共拦截器
└── docs/                     # 文档
```

## 4. 命名与代码风格
- **文件命名**:
  - React组件: `PascalCase` (如 `UserProfile.tsx`)
  - Hook文件: `camelCase` (如 `useAuth.ts`)
  - 普通TS文件: `camelCase` (如 `api.ts`)
- **变量/函数**: `camelCase`
- **类/组件**: `PascalCase`
- **常量/枚举**: `UPPER_CASE` 或 `PascalCase`
- **注释**: 必须使用 **中文**。
- **路径引用**: 必须使用 `@/` 别名引用 `src` 目录。

## 5. 开发流程规范 (Development Workflow)

### 5.1 增加功能 (Adding Features)
遵循 **Schema-First** 原则：
1.  **Shared Schema**: 在 `packages/shared` 中定义 Zod Schema (如 `loginSchema`)。
2.  **Shared Type**: 自动推导或定义 TS 类型 (如 `LoginDto`)。
3.  **Backend Entity**: 定义数据库实体。
4.  **Backend Controller**: 使用 Shared DTO 进行参数验证。
5.  **Frontend Feature**: 在 `apps/client/src/features/xxx` 中开发。
    - API: 引用 Shared DTO 定义请求/响应类型。
    - UI: 使用 `packages/ui` 组件，引用 Shared Schema 做表单验证。

### 5.2 修复与重构 (Fixing & Refactoring)
1.  **架构一致性**: 严格遵守 NestJS 模块化架构和 React 组件化规范。
2.  **类型安全**: 严禁使用 `any`。充分利用 TypeScript 类型推导。
3.  **状态管理**: 避免 Prop Drilling，合理使用 Zustand 全局状态。
4.  **组件拆分**: 保持组件单一职责，逻辑复杂时提取 Custom Hook。

## 6. 安全规范
- **权限控制**: 后端必须在路由层使用 `authenticateToken` 或 `authenticateAdmin`。
- **参数校验**: 前端表单验证 + 后端 Service 层验证。
- **文件上传**: 必须限制文件类型 (MIME) 和大小 (Limit)。
