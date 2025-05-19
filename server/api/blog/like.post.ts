import type { BlogCollectionItem } from '@nuxt/content'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogCollectionItem & { isLiked: boolean }>(event)
  const { id, isLiked } = body
  const storage = useStorage('me')
  const likes = await storage.getItem<number>(`likes:${id}`)

  await storage.setItem(`liked:${id}`, isLiked)

  if (likes) {
    if (isLiked) {
      await storage.setItem(`likes:${id}`, likes + 1)
    }
    else {
      await storage.setItem(`likes:${id}`, likes - 1)
    }
  }
  else {
    await storage.setItem(`likes:${id}`, 1)
  }

  return true
})
