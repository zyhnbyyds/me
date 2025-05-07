import type { ContentCollectionItem } from '@nuxt/content'

export default defineEventHandler(async (event) => {
  const body = await readBody<ContentCollectionItem>(event)
  const { id } = body
  const storage = useStorage('blog')
  const likes = await storage.getItem<number>(id)
  if (likes) {
    await storage.setItem(id, likes + 1)
  }
  else {
    await storage.setItem(id, 1)
  }

  return true
})
