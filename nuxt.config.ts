/* eslint-disable node/prefer-global/process */
import { transformContentFileAfterParse } from './app/transformers/contentFileAfterParse'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@nuxt/devtools',
    'nuxt-auth-utils',
    '@nuxt/image',
    '@nuxt/icon',
    'nuxt-typed-router',
    '@nuxtjs/supabase',
  ],

  ssr: false,

  supabase: {
    redirect: false,
  },

  build: {
    analyze: true,
  },
  compatibilityDate: '2025-07-17',

  vite: {
    optimizeDeps: {
      // 避免对由模块声明的、pnpm 嵌套依赖的预构建解析失败警告
      exclude: [
        '@supabase/supabase-js',
        'remark-gfm',
        'remark-emoji',
        'remark-mdc',
        'remark-rehype',
        'rehype-raw',
        'parse5',
        'unist-util-visit',
        'unified',
        'debug',
      ],
    },
    build: {},
  },

  hooks: {
    'content:file:afterParse': transformContentFileAfterParse,
  },

  nitro: {
    storage: {
      me: {
        driver: 'redis',
        port: import.meta.env.REDIS_PORT,
        host: import.meta.env.REDIS_HOST,
        password: import.meta.env.REDIS_PASSWORD,
      },
    },
  },

  colorMode: {
    classPrefix: '',
    classSuffix: '',
  },

  css: ['~/assets/css/md.css', '~/assets/css/main.css', 'vue-boom/dist/index.css'],

  content: {
    build: {
      transformers: ['~/transformers/contentId.ts'],
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['c', 'js', 'json', 'ts', 'tsx', 'vue', 'java', 'rust', 'yml'],
        },
      },
    },
    database: {
      type: 'postgres',
      url: process.env.DATABASE_URL ?? '',
    },
    experimental: { sqliteConnector: 'better-sqlite3' },
    renderer: {
      anchorLinks: {
        h1: false,
        h2: false,
        h3: false,
      },
    },
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  runtimeConfig: {
    oauth: {
      github: {
        clientId: import.meta.env.GITHUB_CLIENT_ID,
        clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
        redirectURL: 'http://localhost:3002/auth/github',
      },
    },
    minio: {
      endPoint: import.meta.env.OSS_ENDPOINT,
      port: Number.parseInt(import.meta.env.OSS_PORT, 10) || 443,
      useSSL: import.meta.env.OSS_USE_SSL === 'true',
      accessKey: import.meta.env.OSS_ACCESS_KEY_ID,
      secretKey: import.meta.env.OSS_SECRET_ACCESS_KEY,
      pathStyle: true,
    },
    public: {
      showUploadBtnGithubUserId: import.meta.env.GALLERY_SHOW_UPLOAD_BTN_USER_ID,
    },
  },
})
