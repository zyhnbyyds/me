import type { BlogCollectionItem } from '@nuxt/content'

export default defineEventHandler(async (event) => {
  const body = await readBody<BlogCollectionItem>(event)
  const { path } = body
  const id = path.replaceAll('/', '_')
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
