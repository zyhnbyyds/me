import type { CommentItem } from '~/types/blog'

export function transformStoreKeyToDataField(key: string): Omit<CommentItem, 'content'> {
  const [type, fileDirName, categary, fileName, fromUserId, _to, toUserId, commentId, timestamp] = key.split(':')

  return {
    type,
    fileDirName,
    categary,
    fileName,
    fromUserId,
    toUserId,
    commentId,
    timestamp,
  }
}
