import type { PostCommentBody } from '~/types/blog'
import { ulid } from 'ulid'

export default defineEventHandler(async (event) => {
  const body = await readBody<PostCommentBody>(event)
  const { id, comment, fromUserId, toUserId, commentId: parentId = '0', depth } = body
  const storage = useStorage('me')

  const commentId = ulid()
  await storage.setItem(`comments:${id}:${fromUserId}:to:${toUserId}:${commentId}:parentId:${parentId}:${depth}:${Date.now()}`, comment)

  const commentCount = await storage.getItem<number>(`comments:count:${id}`)
  if (!commentCount) {
    await storage.setItem(`comments:count:${id}`, 1)
  }
  else {
    await storage.setItem(`comments:count:${id}`, commentCount + 1)
  }

  return [true, commentId]
})
