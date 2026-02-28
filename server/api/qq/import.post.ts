import type { Pic, QQContentComment } from '~~/shared/types/qq'
import { serverSupabaseClient } from '#supabase/server'
import list from '~~/server/data/data.json'
import { Result } from '~~/server/utils/result'

type ImportRecord = {
  tid: string
  name: string | null
  content: string | null
  source_name: string | null
  commentlist: QQContentComment[] | null
  video: unknown[] | null
  pic: Pic[] | null
}

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  try {
    const result = await Promise.all(
      list.map(async (item) => {
        const record: ImportRecord = {
          tid: item.tid,
          name: item.name ?? null,
          content: item.content ?? null,
          source_name: item.source_name ?? null,
          commentlist: (item.commentlist as QQContentComment[]) ?? null,
          video: (item.video as unknown[]) ?? null,
          pic: (item.pic as Pic[]) ?? null,
        }
        return await client
          .from('qq_content')
          .update({
            commentlist: JSON.stringify(record.commentlist),
            pic: JSON.stringify(record.pic),
            video: JSON.stringify(record.video),
          })
          .eq('tid', item.tid)
          .select()
      }),
    )
    return Result.success(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return Result.fail(500, message)
  }
})
