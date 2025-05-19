import { ulid } from 'ulid'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ id: string, comment: string, fromUserId: string, toUserId: string, commentId: string }>(event)
  const { id, comment, fromUserId, toUserId, commentId } = body
  const storage = useStorage('me')

  await storage.setItem(`comments:${id}:${fromUserId}:to:${toUserId}:${ulid()}:toCommentId:${commentId}:${Date.now()}`, comment)

  const commentCount = await storage.getItem<number>(`comments:count:${id}`)
  if (!commentCount) {
    await storage.setItem(`comments:count:${id}`, 1)
  }
  else {
    await storage.setItem(`comments:count:${id}`, commentCount + 1)
  }

  return true
})
