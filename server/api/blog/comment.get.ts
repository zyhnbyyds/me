import type { User } from '#auth-utils'
import { transformStoreKeyToDataField } from '~/server/utils/comment'

export default defineEventHandler(async (event) => {
  const { id } = getQuery<{ id: string }>(event)
  const storage = useStorage('me')

  const commentStoreKeys = await storage.getKeys(`comments:${id}:`)

  const comments = await Promise.all(
    commentStoreKeys.map(async (key) => {
      const comment = await storage.getItem<string>(key)
      const transformedData = transformStoreKeyToDataField(key)
      const fromUser = await storage.getItem<User>(`user:${transformedData.fromUserId}`)

      let toUser: User | null = null
      if (transformedData.toUserId !== '0') {
        toUser = await storage.getItem<User>(`user:${transformedData.toUserId}`)
      }

      return {
        ...transformedData,
        content: comment,
        fromUser,
        toUser,
        depth: 1,
      }
    }),
  )

  return comments
})
