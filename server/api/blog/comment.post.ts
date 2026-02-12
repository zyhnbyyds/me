import type { PostCommentBody } from '~~/shared/types/blog'
import type { TablesInsert } from '~~/app/types/database.types'
import { serverSupabaseClient } from '#supabase/server'
import { ulid } from 'ulid'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readBody<PostCommentBody>(event)
  const { id, comment, fromUserId, toUserId, parentId = '0', depth = 1 } = body

  const client = await serverSupabaseClient(event)
  const commentId = ulid()

  const row = {
    id: commentId,
    file_id: id,
    from_user_id: fromUserId,
    to_user_id: toUserId ?? 0,
    parent_id: parentId,
    depth,
    content: comment,
    from_user_snapshot: user,
    to_user_snapshot: body.toUser ?? null,
  } satisfies Record<string, unknown>

  const { error } = await client
    .from('blog_comment')
    .insert(row as unknown as TablesInsert<'blog_comment'>)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return [true, commentId]
})
