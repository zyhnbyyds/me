import { prisma } from '~~/server/lib/prisma'
import { requireEssayAuth } from '~~/server/utils/essay-auth'

export default defineEventHandler(async (event) => {
  // 使用 essay token 鉴权，不再每次传输密码明文
  requireEssayAuth(event)

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
