export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const { password } = await readBody<{ password?: string }>(event)

  if (!config.essayPassword) {
    throw createError({ statusCode: 500, statusMessage: '未配置随笔密码' })
  }

  if (password === config.essayPassword) {
    return Result.success({ valid: true })
  }

  return Result.fail(403, '密码错误')
})
