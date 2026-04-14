# Copilot 说明

这是一个使用 TypeScript、Prisma 和 Nuxt Content v3 的 Nuxt 4（beta）项目。

## 项目结构

- **App (`app/`)**：包含主要的 Vue/Nuxt 应用代码。
  - `app/pages`：应用路由。`[...slug].vue` 用于处理动态内容。
  - `app/components`：Vue 组件，按功能（如 `Blog/`、`QQ/`）或通用类型组织。
  - `app/utils`：前端自动导入的工具函数。
  - `app/transformers`：Nuxt Content 的自定义转换器。
- **Server (`server/`)**：Nitro 服务端代码。
  - `server/api`：API 接口（例如 `/api/blog/...`）。
  - `server/routes`：非 API 的服务端路由（例如认证处理器）。
  - `server/lib`：共享的服务端库（例如 Prisma 客户端实例）。
  - `server/utils`：后端自动导入的工具函数。
  - `server/tasks`：实验性的 Nitro 任务（例如健康检查）。
- **Content (`content/`)**：博客文章使用的 Markdown 文件。
- **Prisma (`prisma/`)**：数据库 Schema 与迁移文件。
- **Shared (`shared/`)**：前后端共享的代码（如果有）。

## 架构

- **框架**：Nuxt 4，使用自定义的 `app/` 目录结构。
- **数据库**：
  - **Prisma + MySQL**：用于评论、点赞、浏览量（`blog_comment`、`blog_like`、`blog_view`）以及导入内容（`qq_content`）等动态数据。
  - **Nuxt Content**：用于静态博客文章（`content/` 目录）。
- **样式**：UnoCSS（`uno.config.ts`），使用自定义 preset。
- **状态管理**：Pinia（`@pinia/nuxt`）。
- **认证**：`nuxt-auth-utils`（GitHub OAuth）。

## 开发工作流

### 命令

- **开发服务器**：`pnpm dev`
- **构建**：`pnpm build`
- **类型检查**：`pnpm typecheck`（`vue-tsc`）
- **Lint**：`pnpm lint`（使用 `oxlint`，不是 ESLint）
- **格式化**：`pnpm format`（使用 `oxfmt`，不是 Prettier）

### 数据库

- **生成客户端**：`pnpm prisma:generate`
- **执行迁移**：`pnpm prisma:migrate`
- **数据库可视化**：`pnpm prisma:studio`（数据库 GUI）

## 关键约定

1.  **目录结构**：新增的 Vue 页面、组件和 composable 一律放在 `app/` 下，不要放在项目根目录。
2.  **Lint 与格式化**：使用 `oxlint` 和 `oxfmt`。除非明确要求替换现有方案，否则不要推荐或安装 ESLint/Prettier。
3.  **导入约定**：
    - 使用 `~/` 别名指向项目根目录（在很多应用代码场景下会映射到 `app/`，但请以 `tsconfig.json` 为准）。
    - `server/` 下的工具函数会自动导入。
    - `app/` 下的工具函数会自动导入。
4.  **Nitro Tasks**：该项目使用实验性的 Nitro 任务（`server/tasks/`）。
5.  **React 与 Vue**：这是一个 **Vue 3** 项目。除非某个同时支持两者的库确实相关，否则不要建议 React/JSX。请使用 `<script setup lang="ts">`。
6.  **VueUse 优先**：如果 `@vueuse/nuxt` 或 VueUse 已经能覆盖需求，优先使用现成的 VueUse 能力，而不是重复手写同类工具函数或监听逻辑。
7.  **拆分与封装**：可以封装为组件的内容尽量封装为组件。页面文件不要过长，优先保证可读性；相似的 UI 结构、交互流程和业务逻辑要注意提取、拆分和复用，避免重复堆积在单个页面中。
