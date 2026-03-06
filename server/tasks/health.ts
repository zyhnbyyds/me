import logger from 'consola'

export default defineTask({
  meta: {
    name: 'health',
    description: '健康检查任务',
  },
  async run() {
    try {
      const response = await $fetch<{
        status: string
        timestamp: string
        redis: string
        db: string
      }>('/api/health')
      logger.info('health check', response)
      return { result: response }
    } catch (e: unknown) {
      const err = e as {
        status?: number
        statusCode?: number
        message?: string
      }
      const status = err?.status ?? err?.statusCode ?? 0
      logger.warn('health check failed', status, err?.message ?? e)
      return { result: null, error: status || String(e) }
    }
  },
})
