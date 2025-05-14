/// <reference types="vite/client" />

interface ViteTypeOptions {

}

interface ImportMetaEnv {
  readonly REDIS_HOST: string
  readonly REDIS_PORT: string
  readonly REDIS_PASSWORD: string
  readonly REDIS_DB: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
