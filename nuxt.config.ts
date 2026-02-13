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

  ssr: true,

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'zh-CN',
      },
      title: 'NuxtBase',
      titleTemplate: '%s - NuxtBase',
      meta: [
        { name: 'description', content: 'NuxtBase, 一个现代化的博客网站，分享技术文章和见解' },
        { name: 'keywords', content: 'Nuxt, Vue, 前端开发, 博客, YuhangZhang' },
        { name: 'author', content: 'YuhangZhang' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'bingbot', content: 'index, follow' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'msapplication-TileImage', content: '/mstile-150x150.png' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
        { rel: 'me', href: 'mailto:19939926438@163.com' },
        { rel: 'author', href: 'https://github.com/zyhnbyyds' },
      ],
    },
  },

  supabase: {
    redirect: false,
  },

  build: {
    analyze: true,
  },
  compatibilityDate: '2025-07-17',

  vite: {
    optimizeDeps: {
      exclude: ['@nuxtjs/mdc'],
    },
    build: {},
  },

  icon: {
    serverBundle: 'local',
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
        redirectURL: 'http://localhost:3100/auth/github',
      },
    },
    public: {
      showUploadBtnGithubUserId: import.meta.env.GALLERY_SHOW_UPLOAD_BTN_USER_ID,
    },
  },
})
