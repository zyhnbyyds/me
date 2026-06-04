import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const { password } = await readBody<{ password?: string }>(event)
  if (!config.essayPassword || password !== config.essayPassword) {
    throw createError({ statusCode: 403, statusMessage: '密码错误' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少 ID' })
  }

  try {
    await prisma.essay.delete({ where: { id } })
    return Result.ok()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
