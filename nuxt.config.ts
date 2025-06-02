import { transformContentFileAfterParse } from './transformers/contentFileAfterParse'

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
  ],

  hooks: {
    'content:file:afterParse': transformContentFileAfterParse,
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  ssr: true,

  nitro: {
    storage: {
      me: {
        driver: 'redis',
        port: import.meta.env.REDIS_PORT,
        host: import.meta.env.REDIS_HOST,
        password: import.meta.env.REDIS_PASSWORD,
      },
    },

    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  colorMode: {
    classPrefix: '',
    classSuffix: '',
  },

  css: [
    '~/assets/css/md.css',
    '~/assets/css/main.css',
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
        },
      },
    },
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
      port: Number.parseInt(import.meta.env.OSS_PORT, 10) || 9000,
      useSSL: import.meta.env.OSS_USE_SSL === 'true',
      accessKey: import.meta.env.OSS_ACCESS_KEY_ID,
      secretKey: import.meta.env.OSS_SECRET_ACCESS_KEY,
      baseURL: import.meta.env.OSS_BASE_URL || 'http://localhost:9000',
      s3ForcePathStyle: true,
    },
  },

  experimental: {
    typedPages: true,
  },

  compatibilityDate: '2025-04-19',

  image: {
    providers: {
      minio: {
        name: 'minio',
        provider: '~/providers/minio.provider.ts',
        options: {
          baseUrl: import.meta.env.OSS_MINIO_BASE_URL,
        },
      },
    },
    provider: 'minio',
  },
})
