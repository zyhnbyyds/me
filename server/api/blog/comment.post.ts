import { ulid } from 'ulid'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ id: string, comment: string }>(event)
  const { id, comment } = body
  const storage = useStorage('me')
  const comments = await storage.getItem<string[]>(`comments:${id}`)

  if (comments) {
    comments.push(comment)
    await storage.setItem(`comments:${id}:${ulid()}`, comments)
  }
  else {
    await storage.setItem(`comments:${id}:${ulid()}`, [comment])
  }

  return true
})
