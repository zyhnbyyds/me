import type { BlogCollectionItem } from '@nuxt/content'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogCollectionItem & { isLiked: boolean }>(event)
  const { id, isLiked } = body
  const storage = useStorage('me')
  const likes = await storage.getItem<number>(`likes:${id}`)

  const { user } = await requireUserSession(event)
  const likedKey = `liked:${user.id}:${id}`
  const likesKey = `likes:${id}`

  await storage.setItem(likedKey, isLiked)

  const currentLikes = likes ?? 0
  const nextLikes = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
  await storage.setItem(likesKey, nextLikes)

  return true
})
