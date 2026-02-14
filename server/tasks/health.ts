import logger from 'consola'

export default defineTask({
  meta: {
    name: 'health',
    description: '健康检查任务',
  },
  async run() {
    const response = await $fetch('/api/health')
    logger.info('health check', response)
    return {
      result: response,
    }
  },
})
