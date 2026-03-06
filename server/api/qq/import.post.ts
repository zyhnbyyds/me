import type { Pic, QQContentComment } from '~~/shared/types/qq'
import list from '~~/server/data/data.json'
import { Result } from '~~/server/utils/result'
import { prisma } from '~~/server/lib/prisma'
import {} from '../../../prisma/client/commonInputTypes'

export default defineEventHandler(async () => {
  try {
    const result = await Promise.all(
      list.map(async (item) => {
        const record = {
          ...item,
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
            commentlist: record.commentlist
              ? JSON.stringify(record.commentlist)
              : null,
            pic: record.pic ? JSON.stringify(record.pic) : null,
            video: record.video ? JSON.stringify(record.video) : null,
          },
          create: {
            created_time: record.created_time,
            createtime: record.createTime,
            cmtnum: record.cmtnum,
            tid: record.tid,
            name: record.name,
            content: record.content,
            source_name: record.source_name,
            commentlist: record.commentlist
              ? JSON.stringify(record.commentlist)
              : null,
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
