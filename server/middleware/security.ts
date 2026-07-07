/**
 * 全局安全中间件：
 * 1. 设置常见安全响应头
 * 2. 对写接口做基础速率限制
 */
import type { H3Event } from 'h3'

// ─── 安全响应头 ────────────────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'x-xss-protection': '0', // 现代浏览器已废弃，设为 0 避免反射型 XSS 过滤器被滥用
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  // CSP: 允许本站资源、Google Analytics、阿里云 SDK、Iconify 图标 API
  'content-security-policy': [
    "default-src 'self'",
    "script-src 'self' https://www.googletagmanager.com https://sdk.rum.aliyuncs.com 'unsafe-inline' 'wasm-unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://*.githubusercontent.com https://avatars.githubusercontent.com https://koishi.js.org https://*.music.126.net",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com https://*.aliyuncs.com https://api.iconify.design",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
}

// ─── 速率限制配置 ──────────────────────────────────────────

interface RateLimitConfig {
  windowMs: number // 时间窗口 (ms)
  max: number // 窗口内最大请求数
}

const RATE_LIMIT_ROUTES: Array<{
  pattern: RegExp
  methods: string[]
  config: RateLimitConfig
}> = [
  {
    // 随笔密码校验：严格限制
    pattern: /^\/api\/essay\/verify/,
    methods: ['POST'],
    config: { windowMs: 15 * 60 * 1000, max: 5 },
  },
  {
    // 评论发布
    pattern: /^\/api\/blog\/comment/,
    methods: ['POST'],
    config: { windowMs: 60 * 1000, max: 10 },
  },
  {
    // 点赞
    pattern: /^\/api\/blog\/like/,
    methods: ['POST'],
    config: { windowMs: 60 * 1000, max: 30 },
  },
  {
    // 随笔发布/上传/删除
    pattern: /^\/api\/essay\/(?!verify|file)/,
    methods: ['POST', 'DELETE'],
    config: { windowMs: 60 * 1000, max: 20 },
  },
]

async function getStorage() {
  return useStorage('me')
}

function getClientIp(event: H3Event): string {
  return (
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    getRequestHeader(event, 'x-real-ip') ||
    '127.0.0.1'
  )
}

async function checkRateLimit(event: H3Event): Promise<void> {
  const path = event.path
  const method = event.method

  for (const route of RATE_LIMIT_ROUTES) {
    if (!route.pattern.test(path)) continue
    if (!route.methods.includes(method)) continue

    const ip = getClientIp(event)
    const key = `ratelimit:${ip}:${path}:${method}`
    const storage = await getStorage()

    const current = (await storage.getItem<number>(key)) || 0

    if (current >= route.config.max) {
      throw createError({
        statusCode: 429,
        statusMessage: '请求过于频繁，请稍后再试',
      })
    }

    await storage.setItem(key, current + 1, {
      ttl: route.config.windowMs / 1000,
    })

    return
  }
}

// ─── 中间件入口 ────────────────────────────────────────────

export default defineEventHandler(async (event) => {
  // 设置安全响应头
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    setResponseHeader(event, key, value)
  }

  // 速率限制（仅对 API 路由生效）
  if (event.path.startsWith('/api/')) {
    await checkRateLimit(event)
  }
})
