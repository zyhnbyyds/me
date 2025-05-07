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
  ],

  icon: {
    cssLayer: 'base',
    mode: 'css',
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  fonts: {
    provider: 'local',
  },

  ssr: false,

  nitro: {
    storage: {
      me: {
        driver: 'redis',
        port: 6379,
        host: 'localhost',
      },
    },

    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: [
        '/',
      ],
    },
    routeRules: {
      '/blob/**': {
        static: true,
      },
    },
  },

  colorMode: {
    classPrefix: '',
    classSuffix: '',
  },

  css: [
    '@unocss/reset/tailwind.css',
    '~/styles/md.css',
    '~/styles/main.css',
  ],

  content: {
    build: {
      transformers: ['~/transformers/contentId'],
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
    database: {
      type: 'postgres',
      url: 'postgresql://postgres:zhang123456@localhost:6666/postgres',
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

  compatibilityDate: '2025-04-19',
})
