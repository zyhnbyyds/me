import type { EssayItem } from '~~/shared/types/essay'
import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery<{ page?: string; size?: string }>(event)
  const page = Math.max(1, parseInt(query.page || '1'))
  const size = Math.min(50, Math.max(1, parseInt(query.size || '20')))

  try {
    const [rows, total] = await Promise.all([
      prisma.essay.findMany({
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.essay.count(),
    ])

    const list: EssayItem[] = rows.map((row) => ({
      id: row.id,
      content: row.content,
      images: row.images as string[] | null,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    }))

    return Result.success({ list, total, page, size })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
