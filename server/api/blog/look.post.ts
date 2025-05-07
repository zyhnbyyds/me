import type { ContentCollectionItem } from '@nuxt/content'

export default defineEventHandler(async (event) => {
  const body = await readBody<ContentCollectionItem>(event)
  const { id } = body
  const storage = useStorage('me')
  const looks = await storage.getItem<number>(`looks:${id}`)
  if (looks) {
    await storage.setItem(`looks:${id}`, looks + 1)
  }
  else {
    await storage.setItem(`looks:${id}`, 1)
  }

  return true
})
