# Copilot Instructions

This is a Nuxt 4 (beta) project using TypeScript, Prisma, and Nuxt Content v3.

## Project Structure

- **App (`app/`)**: Contains the main Vue/Nuxt application code.
  - `app/pages`: Application routes. `[...slug].vue` handles dynamic content.
  - `app/components`: Vue components, organized by feature (e.g., `Blog/`, `QQ/`) or generic.
  - `app/utils`: Auto-imported utility functions for the frontend.
  - `app/transformers`: Custom transformers for Nuxt Content.
- **Server (`server/`)**: Nitro server-side code.
  - `server/api`: API endpoints (e.g., `/api/blog/...`).
  - `server/routes`: Non-API server routes (e.g., auth handlers).
  - `server/lib`: Shared server libraries (e.g., Prisma client instance).
  - `server/utils`: Auto-imported utility functions for the backend.
  - `server/tasks`: Experimental Nitro tasks (e.g., health check).
- **Content (`content/`)**: Markdown files for blog posts.
- **Prisma (`prisma/`)**: Database schema and migrations.
- **Shared (`shared/`)**: Code shared between app and server (if any).

## Architecture

- **Framework**: Nuxt 4 with a custom `app/` directory structure.
- **Database**:
  - **Prisma + MySQL**: Used for dynamic data like comments, likes, views (`blog_comment`, `blog_like`, `blog_view`) and imported content (`qq_content`).
  - **Nuxt Content**: Used for static blog posts (`content/` directory).
- **Styling**: UnoCSS (`uno.config.ts`) with custom presets.
- **State**: Pinia (`@pinia/nuxt`).
- **Auth**: `nuxt-auth-utils` (GitHub OAuth).

## Development Workflow

### Commands

- **Development Server**: `pnpm dev`
- **Build**: `pnpm build`
- **Type Check**: `pnpm typecheck` (`vue-tsc`)
- **Lint**: `pnpm lint` (uses `oxlint`, NOT ESLint)
- **Format**: `pnpm format` (uses `oxfmt`, NOT Prettier)

### Database

- **Generate Client**: `pnpm prisma:generate`
- **Migrate**: `pnpm prisma:migrate`
- **Studio**: `pnpm prisma:studio` (GUI for database)

## Key Conventions

1.  **Directory Structure**: Always place new Vue pages, components, and composables in `app/`, not the project root.
2.  **Linting**: Use `oxlint` and `oxfmt`. Do not recommend or install ESLint/Prettier unless explicitly asked to replace the existing setup.
3.  **Imports**:
    - Use `~/` alias to refer to the project root (mapped to `app/` for app code in many contexts, but check `tsconfig.json`).
    - Server utils are auto-imported in `server/`.
    - App utils are auto-imported in `app/`.
4.  **Nitro Tasks**: This project uses experimental Nitro tasks (`server/tasks/`).
5.  **React vs Vue**: This is a **Vue 3** project. Do not suggest React/JSX unless specifically relevant to a library that supports both. Use `<script setup lang="ts">`.
