/**
 * 健康检查接口，供负载均衡 / 容器编排 / 监控 探测使用
 * GET /api/health
 *
 * 安全考虑：不对外暴露具体是 Redis 还是 DB 出问题，
 * 仅返回整体状态。详细诊断信息写入服务端日志。
 */
import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  let healthy = true

  // Redis / 存储 状态检查
  try {
    const storage = useStorage('me')
    await storage.getItem('health:ping')
  } catch {
    healthy = false
    console.warn('[health] storage check failed')
  }

  // 数据库（Prisma）状态检查
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch {
    healthy = false
    console.warn('[health] database check failed')
  }

  setResponseStatus(event, healthy ? 200 : 503)

  return {
    status: healthy ? 'ok' : 'degraded',
  }
})
