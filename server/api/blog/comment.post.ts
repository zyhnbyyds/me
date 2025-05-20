import type { PostCommentBody } from '~/types/blog'
import { ulid } from 'ulid'

export default defineEventHandler(async (event) => {
  const body = await readBody<PostCommentBody>(event)
  const { id, comment, fromUserId, toUserId, commentId, depth } = body
  const storage = useStorage('me')

  await storage.setItem(`comments:${id}:${fromUserId}:to:${toUserId}:${ulid()}:toCommentId:${commentId}:${depth}:${Date.now()}`, comment)

  const commentCount = await storage.getItem<number>(`comments:count:${id}`)
  if (!commentCount) {
    await storage.setItem(`comments:count:${id}`, 1)
  }
  else {
    await storage.setItem(`comments:count:${id}`, commentCount + 1)
  }

  return true
})
