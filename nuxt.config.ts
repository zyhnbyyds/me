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
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
  },

  devtools: {
    enabled: true,
  },

  compatibilityDate: '2025-04-19',
})
