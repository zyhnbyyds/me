import { ulid } from 'ulid'
import { prisma } from '~~/server/lib/prisma'
import { getOrSetBlogViewerId, normalizeBlogId } from '~~/server/utils/blog'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ id?: string; path?: string }>(event)
  const id = normalizeBlogId(body.id ?? body.path)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid blog id' })
  }
  const viewerId = getOrSetBlogViewerId(event)
  const { user } = await getUserSession(event)

  await prisma.$executeRaw`
    INSERT INTO blog_view (id, file_id, viewer_id, user_id)
    VALUES (${ulid()}, ${id}, ${viewerId}, ${user?.id ? BigInt(user.id) : null})
    ON DUPLICATE KEY UPDATE user_id = COALESCE(user_id, VALUES(user_id))
  `

  return true
})
