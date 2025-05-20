import type { CommentItem } from '~/types/blog'

export function transformStoreKeyToDataField(key: string): Omit<CommentItem, 'content' | 'toUser' | 'fromUser'> {
  const [type, fileId, fromUserId, _to, toUserId, commentId, _toComment, toCommentId, depth, timestamp] = key.split(':')

  return {
    type,
    fileId,
    fromUserId: +fromUserId,
    toUserId: +toUserId,
    commentId,
    timestamp: +timestamp,
    toCommentId,
    depth: +depth,
    replyList: [],
  }
}
