import type { User } from '#auth-utils'
import type { CommentItemDataField } from '~/server/utils/comment'
import type { CommentItem } from '~/types/blog'
import { buildFlattenedTwoLevelTree, transformStoreKeyToDataField } from '~/server/utils/comment'

export default defineEventHandler(async (event) => {
  const { id } = getQuery<{ id: string }>(event)
  const storage = useStorage('me')

  const commentStoreKeys = await storage.getKeys(`comments:${id}:`)

  if (!commentStoreKeys || !commentStoreKeys.length)
    return []

  const commentStoreKeysData = commentStoreKeys.map(transformStoreKeyToDataField)

  const commentTree = buildFlattenedTwoLevelTree(commentStoreKeysData, '0')

  async function extraCommentDataAddFn(keyWithDataList: CommentItemDataField[]): Promise<CommentItem[]> {
    const res = await Promise.all(
      keyWithDataList.map(async (itm) => {
        const comment = await storage.getItem<EmojiInfo[]>(itm.key)
        const transformedData = transformStoreKeyToDataField(itm.key)
        const fromUser = await storage.getItem<User>(`user:${transformedData.fromUserId}`)

        let toUser: User | null = null
        if (transformedData.toUserId !== 0) {
          toUser = await storage.getItem<User>(`user:${transformedData.toUserId}`)
        }

        let replyList: CommentItem[] = []
        if (itm.replyList.length > 0) {
          replyList = await extraCommentDataAddFn(itm.replyList)
        }

        return {
          ...transformedData,
          content: comment || [],
          fromUser: fromUser ?? { name: '未知用户', id: 0, avatar_url: '' } as User,
          toUser,
          replyList,
        } satisfies CommentItem
      }),
    )
    return res
  }

  const comments = await extraCommentDataAddFn(commentTree)

  return comments
})
