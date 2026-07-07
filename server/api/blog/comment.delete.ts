import { assertSuperAdmin, normalizeBlogId } from '~~/server/utils/blog'
import { prisma } from '~~/server/lib/prisma'
import { assertSameOrigin } from '~~/server/utils/csrf'

export default defineEventHandler(async (event) => {
  // CSRF 纵深防护：校验 Origin/Referer
  assertSameOrigin(event)

  const body = await readBody<{
    id?: string
    path?: string
    commentId: string
  }>(event)
  const fileId = normalizeBlogId(body.id ?? body.path)
  const commentId = body.commentId

  if (!fileId || !commentId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
    })
  }

  const { user } = await requireUserSession(event)
  const config = useRuntimeConfig(event)
  assertSuperAdmin(user.id, config.superAdminGithubUserId)

  const rows = await prisma.blog_comment.findMany({
    where: { file_id: fileId },
    select: { id: true, parent_id: true },
  })

  const idSet = new Set<string>([commentId])
  let expanded = true
  while (expanded) {
    expanded = false
    for (const row of rows) {
      if (!idSet.has(row.id) && idSet.has(row.parent_id)) {
        idSet.add(row.id)
        expanded = true
      }
    }
  }

  const ids = Array.from(idSet)
  const deleted = await prisma.blog_comment.deleteMany({
    where: { id: { in: ids }, file_id: fileId },
  })

  return { ok: true, deleted: deleted.count }
})
