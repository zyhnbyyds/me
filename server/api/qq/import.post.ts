import type { Pic, QQContentComment } from '~/types/qq'
import { serverSupabaseClient } from '#supabase/server'
import list from '~/server/data/data.json'
import { Result } from '~/server/utils/result'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  try {
    await Promise.all(list.map(async (item) => {
      const record = {
        tid: item.tid,
        uin: item.uin ?? null,
        name: item.name ?? null,
        content: item.content ?? null,
        created_time: item.created_time ?? null,
        createTime: item.createTime ?? null,
        lastmodify: item.lastmodify ?? null,
        source_name: item.source_name ?? null,
        commentlist: item.commentlist as QQContentComment[] ?? null,
        video: item.video ?? null,
        pic: item.pic as Pic[] ?? null,
      }
      return await client.from('qq_content').insert(record).select()
    }))
  }
  catch (error) {
    return Result.fail(500, error as string)
  }
  return Result.success('QQ content imported successfully')
})
