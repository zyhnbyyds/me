/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REDIS_HOST: string
  readonly REDIS_PORT: string
  readonly REDIS_PASSWORD: string
  readonly REDIS_DB: string
  readonly GITHUB_CLIENT_ID: string
  readonly GITHUB_CLIENT_SECRET: string

  DATABASE_HOST: string
  DATABASE_USER: string
  DATABASE_PASSWORD: string
  DATABASE_NAME: string
  DATABASE_PORT: string
  NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
