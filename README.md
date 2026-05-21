# 张宇解的博客

一个基于 Nuxt 4 + Vue 3 + Prisma + UnoCSS 的现代化个人博客网站，集成博客文章、QQ 空间说说、评论互动等功能。

## ✨ 功能特性

- 📝 **博客系统**：基于 Nuxt Content v3 的 Markdown 博客，支持代码高亮、目录导航
- 💬 **QQ 空间**：同步展示 QQ 空间说说，支持图片预览与视频播放
- 💬 **评论互动**：支持嵌套评论回复、Emoji 表情，GitHub OAuth 登录
- 👍 **点赞 & 浏览**：文章点赞与浏览统计
- 🔍 **全文搜索**：支持博客与 QQ 动态的全局搜索
- 📅 **日历视图**：以日历形式回顾发布内容
- 🌓 **暗色模式**：自动适应系统主题，支持手动切换
- 📱 **响应式设计**：适配桌面与移动端

## 🛠️ 技术栈

| 类别     | 技术                                                                        |
| -------- | --------------------------------------------------------------------------- |
| 框架     | [Nuxt 4](https://nuxt.com/) (Beta)                                          |
| UI       | [Vue 3](https://vuejs.org/) + UnoCSS                                        |
| 数据库   | [Prisma](https://www.prisma.io/) + MySQL (MariaDB)                          |
| 内容管理 | [Nuxt Content v3](https://content.nuxt.com/)                                |
| 认证     | [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) (GitHub OAuth) |
| 工具库   | [VueUse](https://vueuse.org/)、dayjs、video.js                              |
| 图标     | [Iconify](https://iconify.design/) (Material Symbols / MingCute)            |
| 包管理   | pnpm                                                                        |

## 📁 项目结构

```
├── app/                    # Vue 应用代码
│   ├── pages/              # 页面路由
│   │   ├── index.vue       # 首页（Feed 聚合流）
│   │   ├── [...slug].vue   # 博客详情页
│   │   ├── qq.vue          # QQ 空间动态
│   │   ├── explore.vue     # 全文搜索
│   │   └── calendar.vue    # 日历视图
│   ├── components/         # 组件
│   │   ├── Blog/           # 博客相关组件
│   │   ├── QQ/             # QQ 空间相关组件
│   │   └── *.vue           # 通用 UI 组件
│   ├── layouts/            # 布局
│   ├── middleware/         # 路由中间件
│   ├── plugins/            # 插件
│   ├── transformers/       # Nuxt Content 转换器
│   ├── utils/              # 前端工具函数
│   └── constants/          # 常量配置
├── server/                 # Nitro 服务端
│   ├── api/                # API 接口
│   │   ├── blog/           # 博客评论/点赞/浏览
│   │   ├── qq/             # QQ 空间数据
│   │   ├── feed/           # 首页 Feed 聚合
│   │   ├── search/         # 全文搜索
│   │   └── calendar/       # 日历数据
│   ├── routes/auth/        # GitHub OAuth 认证
│   ├── lib/                # Prisma 客户端
│   ├── utils/              # 后端工具函数
│   └── tasks/              # Nitro 定时任务
├── content/                # Markdown 博客文章
├── prisma/                 # 数据库 Schema & 迁移
├── shared/                 # 前后端共享类型
└── public/                 # 静态资源
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- MySQL 数据库
- Redis（可选，用于 Nitro 存储）

### 环境变量

创建 `.env` 文件并配置以下变量：

```env
# 数据库
DATABASE_URL="mysql://user:password@localhost:3306/dbname"

# GitHub OAuth
NUXT_SESSION_PASSWORD="your-session-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Redis (可选)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# 超级管理员 GitHub 用户 ID
NUXT_PUBLIC_SUPER_ADMIN_GITHUB_USER_ID="your-github-id"
```

### 安装与运行

```bash
# 安装依赖
pnpm install

# 生成 Prisma 客户端
pnpm prisma:generate

# 执行数据库迁移
pnpm prisma:migrate

# 启动开发服务器 (http://localhost:3100)
pnpm dev

# 构建生产版本
pnpm build
```

## 📦 常用命令

| 命令                   | 说明                          |
| ---------------------- | ----------------------------- |
| `pnpm dev`             | 启动开发服务器（端口 3100）   |
| `pnpm build`           | 构建生产版本                  |
| `pnpm typecheck`       | TypeScript 类型检查           |
| `pnpm lint`            | 代码检查（oxlint）            |
| `pnpm lint:fix`        | 自动修复 Lint 问题            |
| `pnpm format`          | 代码格式化（oxfmt）           |
| `pnpm prisma:generate` | 生成 Prisma 客户端            |
| `pnpm prisma:migrate`  | 执行数据库迁移                |
| `pnpm prisma:studio`   | 打开 Prisma Studio 数据库 GUI |

## 🗄️ 数据库模型

### blog_comment — 博客评论

支持嵌套回复结构，存储评论内容和用户快照。

### blog_like — 博客点赞

`file_id + user_id` 唯一约束，确保每篇文章每人只能点赞一次。

### blog_view — 浏览记录

`file_id + viewer_id` 唯一约束，去重浏览统计。

### qq_content — QQ 空间说说

完整保留 QQ 空间数据结构，包含文字、图片、视频、位置等信息。

## 🎨 设计规范

- 使用 UnoCSS 原子化 CSS，配合 `presetWind4` 和 `presetAttributify`
- 自定义快捷方式：`hw-full`、`flex-center`、`bg-hover-common` 等
- 暗色模式通过 `dark:` 前缀变体实现
- 响应式断点：`<lg`、`<md` 等

## 📝 编写博客

在 `content/` 目录下创建 `.md` 文件，支持 Frontmatter：

```md
---
title: 文章标题
description: 文章描述
image: /blog/cover.jpg
publishAt: 2025-01-01
updateAt: 2025-06-01
tags:
  - Vue
  - Nuxt
---

文章内容...
```

## 📄 许可

[MIT](./LICENSE)
