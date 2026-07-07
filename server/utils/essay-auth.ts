/**
 * 随笔模块的轻量鉴权工具。
 *
 * 设计思路：
 * - verify.post.ts 校验密码成功后，调用 createEssayToken() 签发一个
 *   httpOnly signed cookie（有效期 30 分钟）。
 * - 后续 index.post.ts / upload.post.ts / [id].delete.ts 调用
 *   requireEssayAuth() 校验该 cookie，不再每次传输密码明文。
 * - 密码校验接口通过 checkEssayRateLimit() 做基于 IP 的失败次数限制。
 */
import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'essay_token'
const TOKEN_TTL_MS = 30 * 60 * 1000 // 30 分钟
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 分钟

// ─── HMAC 签名 / 验证 ──────────────────────────────────────

function getSecret(event: any): string {
  const config = useRuntimeConfig(event)
  return (config.essayPassword as string) || 'fallback-secret'
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString('base64url')
}

function base64UrlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf8')
}

// ─── Token 签发 ────────────────────────────────────────────

export function createEssayToken(event: any): string {
  const secret = getSecret(event)
  const exp = Date.now() + TOKEN_TTL_MS
  const payload = base64UrlEncode(JSON.stringify({ exp }))
  const signature = sign(payload, secret)
  return `${payload}.${signature}`
}

// ─── Token 校验 ────────────────────────────────────────────

export function verifyEssayToken(event: any, token: string): boolean {
  const secret = getSecret(event)
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [payload, signature] = parts
  const expectedSig = sign(payload!, secret)

  // 恒定时间比较防止时序攻击
  try {
    const sigBuf = Buffer.from(signature!, 'base64url')
    const expectedBuf = Buffer.from(expectedSig, 'base64url')
    if (!timingSafeEqual(sigBuf, expectedBuf)) return false
  } catch {
    return false
  }

  // 校验过期
  try {
    const { exp } = JSON.parse(base64UrlDecode(payload!))
    if (typeof exp !== 'number' || Date.now() > exp) return false
  } catch {
    return false
  }

  return true
}

// ─── Cookie 读写 ───────────────────────────────────────────

export function setEssayTokenCookie(event: any): string {
  const token = createEssayToken(event)
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/api/essay',
    maxAge: TOKEN_TTL_MS / 1000,
    secure: process.env.NODE_ENV === 'production',
  })
  return token
}

export function getEssayTokenFromCookie(event: any): string | null {
  return getCookie(event, COOKIE_NAME) || null
}

/**
 * 校验随笔鉴权：从 cookie 读取 token 并验证。
 * 未通过时抛出 403。
 */
export function requireEssayAuth(event: any): void {
  const token = getEssayTokenFromCookie(event)
  if (!token || !verifyEssayToken(event, token)) {
    throw createError({
      statusCode: 403,
      statusMessage: '未授权，请先验证密码',
    })
  }
}

// ─── 频率限制 ──────────────────────────────────────────────

async function getStorage() {
  return useStorage('me')
}

export async function checkEssayRateLimit(event: any): Promise<void> {
  const ip =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    getRequestHeader(event, 'x-real-ip') ||
    'unknown'

  const storage = await getStorage()
  const lockoutKey = `essay:lockout:${ip}`

  // 检查是否在锁定中
  const lockoutUntil = await storage.getItem<number>(lockoutKey)
  if (lockoutUntil && Date.now() < lockoutUntil) {
    const remainingMinutes = Math.ceil((lockoutUntil - Date.now()) / 60000)
    throw createError({
      statusCode: 429,
      statusMessage: `尝试次数过多，请 ${remainingMinutes} 分钟后再试`,
    })
  }

  // 清理过期的锁定
  if (lockoutUntil) {
    await storage.removeItem(lockoutKey)
  }
}

export async function recordEssayFailedAttempt(event: any): Promise<void> {
  const ip =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    getRequestHeader(event, 'x-real-ip') ||
    'unknown'

  const storage = await getStorage()
  const attemptsKey = `essay:attempts:${ip}`
  const lockoutKey = `essay:lockout:${ip}`

  const attempts = (await storage.getItem<number>(attemptsKey)) || 0
  const newAttempts = attempts + 1

  if (newAttempts >= MAX_ATTEMPTS) {
    // 锁定
    await storage.setItem(lockoutKey, Date.now() + LOCKOUT_DURATION_MS)
    await storage.removeItem(attemptsKey)
    throw createError({
      statusCode: 429,
      statusMessage: `密码错误次数过多，请 15 分钟后再试`,
    })
  }

  await storage.setItem(attemptsKey, newAttempts)
}

export async function clearEssayFailedAttempts(event: any): Promise<void> {
  const ip =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    getRequestHeader(event, 'x-real-ip') ||
    'unknown'

  const storage = await getStorage()
  await storage.removeItem(`essay:attempts:${ip}`)
  await storage.removeItem(`essay:lockout:${ip}`)
}
