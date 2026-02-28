/**
 * 健康检查接口，供负载均衡 / 容器编排 / 监控 探测使用
 * GET /api/health
 * 检查 Redis 与数据库连通性
 */
import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  const timestamp = new Date().toISOString()
  const checks: { redis: 'ok' | 'error'; db: 'ok' | 'error' } = {
    redis: 'error',
    db: 'error',
  }

  // Redis 状态检查（使用项目配置的 useStorage('me')）
  try {
    const storage = useStorage('me')
    await storage.getItem('health:ping')
    checks.redis = 'ok'
  } catch {
    checks.redis = 'error'
  }

  // 数据库（Prisma）状态检查
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.db = 'ok'
  } catch {
    checks.db = 'error'
  }

  console.log(
    {
      host: import.meta.env.DATABASE_HOST,
      user: import.meta.env.DATABASE_USER,
      password: import.meta.env.DATABASE_PASSWORD,
      database: import.meta.env.DATABASE_NAME,
      port: parseInt(import.meta.env.DATABASE_PORT || '3306'),
      connectionLimit: 5,
    },
    {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: parseInt(process.env.DATABASE_PORT || '3306'),
      connectionLimit: 5,
    },
  )

  const ok = checks.redis === 'ok' && checks.db === 'ok'

  setResponseStatus(event, ok ? 200 : 503)

  return {
    status: ok ? 'ok' : 'degraded',
    timestamp,
    redis: checks.redis,
    db: checks.db,
  }
})
