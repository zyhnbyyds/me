import type { PageQuery } from '~/types/page'
import type { QQContentItem } from '~/types/qq'
import { serverSupabaseClient } from '#supabase/server'
import { Result } from '~/server/utils/result'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { current = 1, size = 20 } = getQuery<PageQuery>(event)
  const offset = (current - 1) * size

  const { data, error } = await client
    .from('qq_content')
    .select()
    .order('created_time', { ascending: false })
    .range(offset, offset + size - 1)

  if (error) {
    return Result.fail(500, error.message)
  }
  if (!data || data.length === 0) {
    return Result.success([])
  }
  const transformedData = data.map((item) => {
    return {
      ...item,
      commentlist: item.commentlist ? JSON.parse(item.commentlist) : null,
      pic: item.pic ? JSON.parse(item.pic) : null,
      video: item.video ? JSON.parse(item.video) : null,
    } as QQContentItem
  })

  return Result.success<QQContentItem[]>(transformedData)
})
