import { getOps } from '~~/server/utils/ops'
import { normalizeBlogId } from '~~/server/utils/blog'

export default defineEventHandler(async (event) => {
  const { id } = getQuery<{ id: string }>(event)
  const blogId = normalizeBlogId(id)
  if (!blogId) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid blog id' })
  }
  const { user } = await getUserSession(event)
  const ops = await getOps(event, blogId, user?.id)
  if (!ops) {
    return false
  }
  return ops
})
