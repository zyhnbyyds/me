import { ulid } from 'ulid'
import { prisma } from '~~/server/lib/prisma'
import { normalizeBlogId } from '~~/server/utils/blog'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ id?: string; path?: string; isLiked: boolean }>(
    event,
  )
  const id = normalizeBlogId(body.id ?? body.path)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid blog id' })
  }
  const { isLiked } = body

  const { user } = await requireUserSession(event)
  if (isLiked) {
    await prisma.$executeRaw`
      INSERT INTO blog_like (id, file_id, user_id)
      VALUES (${ulid()}, ${id}, ${BigInt(user.id)})
      ON DUPLICATE KEY UPDATE user_id = user_id
    `
  } else {
    await prisma.$executeRaw`
      DELETE FROM blog_like
      WHERE file_id = ${id} AND user_id = ${BigInt(user.id)}
    `
  }

  return true
})
