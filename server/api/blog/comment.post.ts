import type { PostCommentBody } from '~~/shared/types/blog'
import { ulid } from 'ulid'
import type { Prisma } from '~~/prisma/client/client'
import { prisma } from '~~/server/lib/prisma'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readBody<PostCommentBody>(event)
  const { id, comment, parentId = '0', depth = 1 } = body

  // 安全：强制使用 session 中的真实 user.id，忽略请求体中的 fromUserId
  // 防止身份伪造 / IDOR 攻击
  const fromUserId = user.id

  // toUserId 仅做展示用途：如果传入了且非 0，校验目标用户真实存在
  let toUserId = 0
  if (body.toUserId && body.toUserId > 0) {
    // 轻量校验：检查目标用户是否已缓存在 storage 中（登录过的用户）
    const storage = useStorage('me')
    const targetUser = await storage.getItem(`user:${body.toUserId}`)
    if (targetUser) {
      toUserId = body.toUserId
    }
    // 如果未缓存，仍允许评论但不关联 to_user_id（避免伪造不存在的用户 ID）
  }

  const commentId = ulid()

  try {
    await prisma.blog_comment.create({
      data: {
        id: commentId,
        file_id: id,
        from_user_id: BigInt(fromUserId),
        to_user_id: BigInt(toUserId),
        parent_id: parentId,
        depth,
        content: comment as unknown as Prisma.InputJsonValue,
        from_user_snapshot: user as unknown as Prisma.InputJsonValue,
        to_user_snapshot: (body.toUser ??
          null) as unknown as Prisma.InputJsonValue,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw createError({ statusCode: 500, statusMessage: message })
  }

  return [true, commentId]
})
