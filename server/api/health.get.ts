/**
 * 健康检查接口，供负载均衡 / 容器编排 / 监控 探测使用
 * GET /api/health
 * 包含 Redis、Supabase 状态检查
 */
export default defineEventHandler(async (event) => {
  const timestamp = new Date().toISOString()
  const checks: { redis: 'ok' | 'error'; supabase: 'ok' | 'error' } = {
    redis: 'error',
    supabase: 'error',
  }

  // Redis 状态检查（使用项目配置的 useStorage('me')）
  try {
    const storage = useStorage('me')
    await storage.getItem('health:ping')
    checks.redis = 'ok'
  } catch {
    checks.redis = 'error'
  }

  // Supabase 状态检查
  try {
    const { serverSupabaseClient } = await import('#supabase/server')
    const client = await serverSupabaseClient(event)
    await client.auth.getSession()
    checks.supabase = 'ok'
  } catch {
    checks.supabase = 'error'
  }

  const ok = checks.redis === 'ok' && checks.supabase === 'ok'

  setResponseStatus(event, ok ? 200 : 503)

  return {
    status: ok ? 'ok' : 'degraded',
    timestamp,
    redis: checks.redis,
    supabase: checks.supabase,
  }
})
