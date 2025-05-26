/* eslint-disable node/prefer-global/process */
import readingTime from 'reading-time'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@nuxt/devtools',
    '@nuxt/icon',
    '@nuxt/fonts',
    'nuxt-auth-utils',
  ],

  hooks: {
    'content:file:afterParse': (ctx) => {
      const { file, content } = ctx

      const wordsPerMinute = 180
      const text = typeof file.body === 'string' ? file.body : ''

      content.readingTime = Math.ceil(readingTime(text, { wordsPerMinute }).minutes)
    },
  },

  icon: {
    cssLayer: 'base',
    mode: 'svg',
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  fonts: {
    provider: 'local',
  },

  ssr: true,

  nitro: {
    storage: {
      me: {
        driver: 'redis',
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
      },
    },

    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    routeRules: {
      '/blog/**': {
        static: true,
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
  },

  compatibilityDate: '2025-04-19',
})
