/// <reference types="vite/client" />

interface ViteTypeOptions {

}

interface ImportMetaEnv {
  readonly REDIS_HOST: string
  readonly REDIS_PORT: string
  readonly REDIS_PASSWORD: string
  readonly REDIS_DB: string
  readonly GITHUB_CLIENT_ID: string
  readonly GITHUB_CLIENT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
