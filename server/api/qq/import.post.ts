import type { Pic, QQContentComment } from '~~/shared/types/qq'
import list from '~~/server/data/data.json'
import { Result } from '~~/server/utils/result'
import { prisma } from '~~/server/lib/prisma'

type ImportRecord = {
  tid: string
  name: string | null
  content: string | null
  source_name: string | null
  commentlist: QQContentComment[] | null
  video: unknown[] | null
  pic: Pic[] | null
}

export default defineEventHandler(async () => {
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

        return prisma.qq_content.upsert({
          where: { tid: record.tid },
          update: {
            commentlist: record.commentlist ? JSON.stringify(record.commentlist) : null,
            pic: record.pic ? JSON.stringify(record.pic) : null,
            video: record.video ? JSON.stringify(record.video) : null,
          },
          create: {
            tid: record.tid,
            name: record.name,
            content: record.content,
            source_name: record.source_name,
            commentlist: record.commentlist ? JSON.stringify(record.commentlist) : null,
            pic: record.pic ? JSON.stringify(record.pic) : null,
            video: record.video ? JSON.stringify(record.video) : null,
          },
        })
      }),
    )

    return Result.success(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return Result.fail(500, message)
  }
})
