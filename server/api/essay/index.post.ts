import { ulid } from 'ulid'
import type { Prisma } from '~~/prisma/client/client'
import type { CreateEssayBody } from '~~/shared/types/essay'
import { prisma } from '~~/server/lib/prisma'
import { requireEssayAuth } from '~~/server/utils/essay-auth'

export default defineEventHandler(async (event) => {
  // 使用 essay token 鉴权，不再每次传输密码明文
  requireEssayAuth(event)

  const body = await readBody<CreateEssayBody>(event)
  const { content, images } = body

  if (!content && (!images || images.length === 0)) {
    throw createError({ statusCode: 400, statusMessage: '内容不能为空' })
  }

  const id = ulid()

  try {
    await prisma.essay.create({
      data: {
        id,
        content: content ?? null,
        images: (images ?? null) as unknown as Prisma.InputJsonValue,
      },
    })

    return Result.success({ id })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
