import type { Pic, QQContentComment } from '~/types/qq'
import { serverSupabaseClient } from '#supabase/server'
import list from '~/server/data/data.json'
import { Result } from '~/server/utils/result'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  let result: any
  try {
    result = await Promise.all(list.map(async (item) => {
      const record = {
        tid: item.tid,
        name: item.name ?? null,
        content: item.content ?? null,
        source_name: item.source_name ?? null,
        commentlist: item.commentlist as QQContentComment[] ?? null,
        video: item.video ?? null,
        pic: item.pic as Pic[] ?? null,
      }
      return await client.from('qq_content').update(record).eq('tid', item.tid).select()
    }))
  }
  catch (error) {
    return Result.fail(500, error as string)
  }
  return Result.success(result)
})
