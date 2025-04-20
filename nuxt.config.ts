import { pwa } from './config/pwa'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxt/devtools',
  ],

  icon: {
    cssLayer: 'base',
    mode: 'css',
  },

  ssr: false,

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

  pwa,

  devtools: {
    enabled: true,
  },

  compatibilityDate: '2025-04-19',
})
