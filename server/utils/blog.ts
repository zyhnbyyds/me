import { ulid } from 'ulid'
import type { H3Event } from 'h3'

const VIEWER_COOKIE = 'blog_viewer_id'

export function normalizeBlogId(input?: string | null) {
  if (!input) return ''
  return input.replaceAll('/', '_')
}

export function getOrSetBlogViewerId(event: H3Event) {
  const existing = getCookie(event, VIEWER_COOKIE)
  if (existing) return existing

  const viewerId = ulid()
  setCookie(event, VIEWER_COOKIE, viewerId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  return viewerId
}

export function assertSuperAdmin(userId: number, superAdminIdRaw?: string) {
  const superAdminId = Number(superAdminIdRaw || '')
  if (!superAdminId || Number.isNaN(superAdminId)) {
    throw createError({
      statusCode: 500,
      statusMessage: 'SUPER_ADMIN_GITHUB_USER_ID is not configured correctly',
    })
  }

  if (userId !== superAdminId) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
}
