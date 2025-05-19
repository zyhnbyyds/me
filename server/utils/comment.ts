import type { CommentItem } from '~/types/blog'

export function transformStoreKeyToDataField(key: string): Omit<CommentItem, 'content' | 'toUser' | 'fromUser'> {
  const [type, fileId, fromUserId, _to, toUserId, commentId, timestamp] = key.split(':')

  return {
    type,
    fileId,
    fromUserId,
    toUserId,
    commentId,
    timestamp,
  }
}
