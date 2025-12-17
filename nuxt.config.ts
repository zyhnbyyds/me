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
    '@nuxtjs/seo',
  ],

  site: {
    url: 'https://zyujie.me',
    name: '张宇解的个人博客',
  },

  ssr: true,

  supabase: {
    redirect: false,
  },
  compatibilityDate: '2025-07-17',

  icon: {
    serverBundle: 'auto',
  },

  seo: {
    meta: {
      title: '张宇解的个人博客',
      description: '张宇解的个人博客',
    },
  },

  hooks: {
    'content:file:afterParse': transformContentFileAfterParse,
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
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
  sourcemap: false,

  colorMode: {
    classPrefix: '',
    classSuffix: '',
  },

  css: [
    '~/assets/css/md.css',
    '~/assets/css/main.css',
    'vue-boom/dist/index.css',
  ],

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
    renderer: {
      anchorLinks: {
        h1: false,
        h2: false,
        h3: false,
      },
    },
    experimental: {
      sqliteConnector: 'native',
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

  image: {
    providers: {
      minio: {
        name: 'minio',
        provider: './app/providers/minio.provider.ts',
        options: {
          baseUrl: import.meta.env.OSS_MINIO_BASE_URL,
        },
      },
    },
  },
})
