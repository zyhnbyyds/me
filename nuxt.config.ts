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
    '@nuxt/icon',
    'nuxt-typed-router',
  ],

  app: {
    layoutTransition: {
      name: 'fade-scale',
      mode: 'out-in',
    },
    pageTransition: {
      name: 'fade-scale',
      mode: 'out-in',
    },
  },

  icon: {
    serverBundle: 'local',
    class: 'name',
    mode: 'svg',
    cssSelectorPrefix: 'ni',
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
  },
})
