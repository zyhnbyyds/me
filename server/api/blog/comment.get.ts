import type { CommentItem } from '~~/shared/types/blog'
import type { User } from '#auth-utils'
import type { CommentItemDataField } from '~~/server/utils/comment'
import { buildFlattenedTwoLevelTree } from '~~/server/utils/comment'
import { prisma } from '~~/server/lib/prisma'

interface BlogCommentRow {
  id: string
  file_id: string
  from_user_id: number
  to_user_id: number
  parent_id: string
  depth: number
  content: unknown
  from_user_snapshot: User | null
  to_user_snapshot: User | null
  created_at: string
}

const unknownUser: User = { name: '未知用户', id: 0, avatar_url: '' } as User

function enrichWithUserData(
  nodes: CommentItemDataField[],
  itemMap: Map<string, CommentItem>,
): Array<CommentItem & { isClickReply?: boolean }> {
  return nodes.map((node) => {
    const full = itemMap.get(node.commentId)
    const replyList =
      node.replyList.length > 0
        ? enrichWithUserData(node.replyList, itemMap)
        : []
    return {
      ...node,
      content: full?.content ?? [],
      fromUser: full?.fromUser ?? unknownUser,
      toUser: full?.toUser ?? null,
      replyList,
      isClickReply: false,
    }
  })
}

export default defineEventHandler(async (event) => {
  const { id } = getQuery<{ id: string }>(event)
  if (!id) return []

  let rows: BlogCommentRow[] = []
  try {
    const result = await prisma.blog_comment.findMany({
      where: { file_id: id },
      orderBy: { created_at: 'asc' },
    })
    rows = JSON.parse(
      JSON.stringify(result, (_k, v) =>
        typeof v === 'bigint' ? Number(v) : v,
      ),
    ) as BlogCommentRow[]
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw createError({ statusCode: 500, statusMessage: message })
  }

  if (!rows || rows.length === 0) return []

  const itemMap = new Map<string, CommentItem>()
  const dataFields: CommentItemDataField[] = []

  for (const row of rows as BlogCommentRow[]) {
    const item: CommentItem = {
      type: 'comment',
      fileId: row.file_id,
      fromUserId: row.from_user_id,
      toUserId: row.to_user_id,
      commentId: row.id,
      timestamp: new Date(row.created_at).getTime(),
      content: (row.content as CommentItem['content']) || [],
      fromUser: (row.from_user_snapshot as User) ?? unknownUser,
      toUser: (row.to_user_snapshot as User) ?? null,
      parentId: row.parent_id,
      depth: row.depth,
      replyList: [],
    }
    itemMap.set(row.id, item)
    dataFields.push({
      type: item.type,
      fileId: item.fileId,
      fromUserId: item.fromUserId,
      toUserId: item.toUserId,
      commentId: item.commentId,
      timestamp: item.timestamp,
      parentId: item.parentId,
      depth: item.depth,
      replyList: [],
      key: item.commentId,
    })
  }

  const tree = buildFlattenedTwoLevelTree(dataFields, '0')
  return enrichWithUserData(tree, itemMap)
})
