import type { PageQuery } from '~~/shared/types/page'
import type { QQContentItem } from '~~/shared/types/qq'
import { serverSupabaseClient } from '#supabase/server'
import consola from 'consola'

interface QQContentRow {
  commentlist: string | QQContentItem['commentlist']
  pic: string | QQContentItem['pic']
  video: string | QQContentItem['video']
  [key: string]: unknown
}

function parseJSONField<T>(value: string | T | null | undefined): T | null {
  if (!value) return null
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const {
    current = 1,
    size = 20,
    tid = '',
    content,
  } = getQuery<PageQuery & { tid?: string; content?: string }>(event)
  const currentNumber = Number(current) || 1
  const sizeNumber = Number(size) || 20

  const offset = (currentNumber - 1) * sizeNumber

  let searchSingleResult: QQContentItem | null = null
  if (tid) {
    const { data, error } = await client.from('qq_content').select('*').eq('tid', tid).single()

    if (error) {
      consola.error(error)
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    searchSingleResult = {
      ...(data as QQContentRow),
      commentlist: parseJSONField<QQContentItem['commentlist']>((data as QQContentRow).commentlist),
      pic: parseJSONField<QQContentItem['pic']>((data as QQContentRow).pic),
      video: parseJSONField<QQContentItem['video']>((data as QQContentRow).video),
      isSearchSingle: true,
    } as QQContentItem
    searchSingleResult.isSearchSingle = true
  }

  const { data, error, count } = await client
    .from('qq_content')
    .select('*', { count: 'exact' })
    .like('content', `%${content || ''}%`)
    .neq('tid', tid)
    .order('created_time', { ascending: false })
    .range(offset, offset + sizeNumber - 1)

  if (error) {
    consola.error(error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  if (!data || data.length === 0) {
    return {
      data: [],
      total: 0,
    }
  }
  const transformedData = [searchSingleResult, ...data]
    .filter((item) => item !== null)
    .map((item) => {
      const row = item as QQContentRow
      return {
        ...item,
        commentlist: parseJSONField<QQContentItem['commentlist']>(row.commentlist),
        pic: parseJSONField<QQContentItem['pic']>(row.pic),
        video: parseJSONField<QQContentItem['video']>(row.video),
      } as QQContentItem
    })

  return {
    data: transformedData,
    total: count,
  }
})
