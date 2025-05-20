import type { User } from '#auth-utils'
import type { CommentItem } from '~/types/blog'
import { transformStoreKeyToDataField } from '~/server/utils/comment'

export default defineEventHandler(async (event) => {
  const { id } = getQuery<{ id: string }>(event)
  const storage = useStorage('me')

  const commentStoreKeys = await storage.getKeys(`comments:${id}:`)

  if (!commentStoreKeys || !commentStoreKeys.length)
    return []

  const commentStoreKeysData = commentStoreKeys.map(transformStoreKeyToDataField)

  const firstKey = commentStoreKeysData.filter(key => (key.depth === 1 && key.toUserId === 0))
  const secondKey = commentStoreKeysData.filter(key => (key.depth >= 2 && key.toUserId !== 0))

  firstKey.forEach(async (data) => {
    secondKey.forEach((itm) => {
      const replyList = secondKey.filter(item => item.toCommentId === data.commentId)
      if (data.commentId === itm.toCommentId) {
        // data.replyList.push(itm)
      }
      else {
        // data.replyList.push(itm)
      }
    })
  })

  const comments = await Promise.all(
    commentStoreKeys.map(async (key) => {
      const comment = await storage.getItem<string>(key)
      const transformedData = transformStoreKeyToDataField(key)
      const fromUser = await storage.getItem<User>(`user:${transformedData.fromUserId}`)

      let toUser: User | null = null
      if (transformedData.toUserId !== 0) {
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

// function hdNestedComments(keyData: Omit<CommentItem, 'content' | 'toUser' | 'fromUser'>[], parentData:Omit<CommentItem, 'content' | 'toUser' | 'fromUser'>) {
//   const filterChild = keyData.filter(item => item.toCommentId === parentData.commentId)

//   return filterChild
// }
