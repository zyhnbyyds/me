import type { CommentItem } from '~/types/blog'

export type CommentItemDataField = Omit<CommentItem, 'content' | 'toUser' | 'fromUser' | 'replyList'> & { replyList: CommentItemDataField[], key: string }
export function transformStoreKeyToDataField(key: string): CommentItemDataField {
  const [type, fileId, fromUserId, _to, toUserId, commentId, _toComment, parentId = '0', depth, timestamp] = key.split(':')

  return {
    type,
    fileId,
    fromUserId: +fromUserId,
    toUserId: +toUserId,
    commentId,
    timestamp: Number.isNaN(Number(timestamp)) ? 0 : +timestamp,
    parentId,
    depth: +depth,
    replyList: [],
    key,
  }
}

export function transformDataFieldToStoreKey(data: CommentItemDataField): string {
  return [
    data.type,
    data.fileId,
    data.fromUserId,
    'to',
    data.toUserId ? '0' : '',
    data.toUserId,
    data.commentId,
    data.parentId ? 'toComment' : '',
    'parentId',
    data.parentId,
    data.depth,
    data.timestamp,
  ].join(':')
}

export function buildCommentTree(list: CommentItemDataField[], rootId: string) {
  const map = new Map<string, CommentItemDataField[]>()

  // 构建 parentId 映射表
  for (const item of list) {
    if (!map.has(item.parentId)) {
      map.set(item.parentId, [])
    }
    map.get(item.parentId)!.push(item)
  }

  // 递归构建树
  function buildTree(parentId: string): CommentItemDataField[] {
    const children = map.get(parentId) || []
    for (const child of children) {
      child.replyList = buildTree(child.commentId)
    }
    return children
  }

  return buildTree(rootId)
}

export function buildFlattenedTwoLevelTree(list: CommentItemDataField[], rootId: string): CommentItemDataField[] {
  const map = new Map<string, CommentItemDataField[]>()

  // 1. 构建 parentId -> children 的映射
  for (const item of list) {
    if (!map.has(item.parentId)) {
      map.set(item.parentId, [])
    }
    map.get(item.parentId)!.push(item)
  }

  // 2. 递归收集所有子节点
  const collectAllDescendants = (parentId: string): CommentItemDataField[] => {
    const result: CommentItemDataField[] = []
    const children = map.get(parentId) || []

    for (const child of children) {
      result.push(child)
      result.push(...collectAllDescendants(child.commentId)) // 拍平继续递归
    }

    return result
  }

  // 3. 获取所有 root 评论，并附上拍平的 replyList
  const roots = map.get(rootId) || []
  for (const root of roots) {
    root.replyList = collectAllDescendants(root.commentId)
  }

  return sortByTimestamp(roots)
}

export function sortByTimestamp(list: CommentItemDataField[], isRevert = false) {
  const sorted = list.sort((a, b) => {
    if (a.replyList.length !== 0) {
      a.replyList = sortByTimestamp(a.replyList, true)
    }
    if (isRevert) {
      return a.timestamp - b.timestamp
    }
    return b.timestamp - a.timestamp
  })
  return sorted
}
