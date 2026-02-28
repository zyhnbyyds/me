import type { PostCommentBody } from '~~/shared/types/blog'
import { ulid } from 'ulid'
import type { Prisma } from '~~/prisma/client/client'
import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readBody<PostCommentBody>(event)
  const { id, comment, fromUserId, toUserId, parentId = '0', depth = 1 } = body

  const commentId = ulid()

  try {
    await prisma.blog_comment.create({
      data: {
        id: commentId,
        file_id: id,
        from_user_id: BigInt(fromUserId),
        to_user_id: BigInt(toUserId ?? 0),
        parent_id: parentId,
        depth,
        content: comment as unknown as Prisma.InputJsonValue,
        from_user_snapshot: user as unknown as Prisma.InputJsonValue,
        to_user_snapshot: (body.toUser ?? null) as unknown as Prisma.InputJsonValue,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw createError({ statusCode: 500, statusMessage: message })
  }

  return [true, commentId]
})
