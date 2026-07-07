/**
 * CSRF 防护工具。
 *
 * 背景：
 * - nuxt-auth-utils 的 session cookie 默认 sameSite='lax'，可防御跨站 POST/DELETE。
 * - 本工具作为纵深防御层，对破坏性操作额外校验 Origin/Referer 头。
 * - 仅在校验不通过时拒绝请求；无法获取 Origin/Referer 的合法客户端（如部分
 *   移动端 APP、开发工具）不会被误伤（宽容模式）。
 */

import type { H3Event } from 'h3'

function isSameOrigin(event: H3Event): boolean {
  const origin = getRequestHeader(event, 'origin')
  const referer = getRequestHeader(event, 'referer')
  const host = getRequestHeader(event, 'host')

  // 如果没有 Origin 和 Referer（例如服务端发起的请求、部分 APP），放行
  if (!origin && !referer) return true

  if (!host) return false

  const hostNormalized = host.replace(/:\d+$/, '')

  // 检查 Origin
  if (origin) {
    try {
      const originHost = new URL(origin).host.replace(/:\d+$/, '')
      if (originHost === hostNormalized) return true
    } catch {
      // URL 解析失败
    }
  }

  // 检查 Referer
  if (referer) {
    try {
      const refererHost = new URL(referer).host.replace(/:\d+$/, '')
      if (refererHost === hostNormalized) return true
    } catch {
      // URL 解析失败
    }
  }

  return false
}

/**
 * 校验请求是否来自同源，防止 CSRF 攻击。
 * 对破坏性操作（DELETE 等）调用此函数。
 * 校验不通过时抛出 403。
 */
export function assertSameOrigin(event: H3Event): void {
  if (!isSameOrigin(event)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'CSRF 校验失败：跨站请求被拒绝',
    })
  }
}
