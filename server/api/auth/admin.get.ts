/**
 * 返回当前登录用户是否为管理员。
 * GET /api/auth/admin
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const config = useRuntimeConfig(event)
  const adminId = Number(config.superAdminGithubUserId || '0')
  return { isAdmin: adminId > 0 && user.id === adminId }
})
