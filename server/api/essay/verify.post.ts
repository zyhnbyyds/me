import {
  setEssayTokenCookie,
  checkEssayRateLimit,
  recordEssayFailedAttempt,
  clearEssayFailedAttempts,
} from '~~/server/utils/essay-auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  // 频率限制：防止暴力破解
  await checkEssayRateLimit(event)

  const { password } = await readBody<{ password?: string }>(event)

  if (!config.essayPassword) {
    throw createError({ statusCode: 500, statusMessage: '未配置随笔密码' })
  }

  if (password === config.essayPassword) {
    // 验证成功：签发短期 token cookie，清除失败计数
    setEssayTokenCookie(event)
    await clearEssayFailedAttempts(event)
    return Result.success({ valid: true })
  }

  // 验证失败：记录失败次数
  await recordEssayFailedAttempt(event)
  return Result.fail(403, '密码错误')
})
