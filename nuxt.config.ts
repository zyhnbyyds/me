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
    '@formkit/auto-animate/nuxt',
  ],

  ssr: false,

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'zh-CN',
      },
      meta: [
        {
          name: 'description',
          content: '张宇解的博客,一个现代化的博客网站,分享技术文章和见解',
        },
        { name: 'keywords', content: '张宇解,博客,前端开发,技术文章,见解' },
        { name: 'author', content: '张宇解,zyhnbyyds,张宇行' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'me', href: 'mailto:19939926438@163.com' },
        { rel: 'author', href: 'https://github.com/zyhnbyyds' },
      ],
    },
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
    experimental: {
      tasks: true,
    },
    storage: {
      me: {
        driver: 'redis',
        port: import.meta.env.REDIS_PORT,
        host: import.meta.env.REDIS_HOST,
        password: import.meta.env.REDIS_PASSWORD,
      },
    },
    scheduledTasks: {
      '* * * * *': 'health',
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
          langs: ['c', 'js', 'json', 'ts', 'tsx', 'vue', 'java', 'rust', 'yml'],
        },
      },
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
    enabled: false,
  },

  runtimeConfig: {
    oauth: {
      github: {
        clientId: import.meta.env.GITHUB_CLIENT_ID,
        clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
        redirectURL: 'http://localhost:3100/auth/github',
      },
    },
    database: {
      host: import.meta.env.DATABASE_HOST,
      user: import.meta.env.DATABASE_USER,
      password: import.meta.env.DATABASE_PASSWORD,
      database: import.meta.env.DATABASE_NAME,
      port: parseInt(import.meta.env.DATABASE_PORT || '3306'),
    },
    public: {
      showUploadBtnGithubUserId: import.meta.env
        .GALLERY_SHOW_UPLOAD_BTN_USER_ID,
      superAdminGithubUserId: import.meta.env.SUPER_ADMIN_GITHUB_USER_ID,
    },
  },
})
