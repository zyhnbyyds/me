import type { BlogCollectionItem } from '@nuxt/content'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogCollectionItem & { isLiked: boolean }>(event)
  const { id, isLiked } = body
  const storage = useStorage('me')
  const likes = await storage.getItem<number>(`likes:${id}`)

  const { user } = await requireUserSession(event)
  const likedKey = `liked:${user.id}:${id}`
  const likesKey = `likes:${user.id}:${id}`

  await storage.setItem(likedKey, isLiked)

  if (likes) {
    if (isLiked) {
      await storage.setItem(likesKey, likes + 1)
    }
    else {
      await storage.setItem(likesKey, likes - 1)
    }
  }
  else {
    await storage.setItem(likesKey, 1)
  }

  return true
})
