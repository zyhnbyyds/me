import type { PageQuery } from '~/types/page'
import type { QQContentItem } from '~/types/qq'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient (event)
  const { current = 1, size = 20 } = getQuery<PageQuery>(event)
  const currentNumber = Number(current) || 1
  const sizeNumber = Number(size) || 20

  const offset = (currentNumber - 1) * sizeNumber
  console.warn(`Fetching QQ content list: current=${currentNumber}, size=${sizeNumber} offset=${offset}, end=${Number(offset) + sizeNumber - 1}`)

  const { data, error } = await client
    .from('qq_content')
    .select('*', { count: 'exact' })
    .order('created_time', { ascending: false })
    .range(offset, offset + sizeNumber - 1)

  if (error) {
    createError({ statusCode: 500, statusMessage: error.message })
  }

  if (!data || data.length === 0) {
    return []
  }
  const transformedData = data.map((item) => {
    return {
      ...item,
      commentlist: item.commentlist ? JSON.parse(item.commentlist) : null,
      pic: item.pic ? JSON.parse(item.pic) : null,
      video: item.video ? JSON.parse(item.video) : null,
    } as QQContentItem
  })

  return transformedData
})
