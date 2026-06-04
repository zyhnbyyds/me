import { ulid } from 'ulid'
import type { Prisma } from '~~/prisma/client/client'
import type { CreateEssayBody } from '~~/shared/types/essay'
import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  // 验证密码
  const { password } = await readBody<{ password?: string } & CreateEssayBody>(
    event,
  )
  if (!config.essayPassword || password !== config.essayPassword) {
    throw createError({ statusCode: 403, statusMessage: '密码错误' })
  }

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
