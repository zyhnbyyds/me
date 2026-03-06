import type { H3Event } from 'h3'
import { prisma } from '~~/server/lib/prisma'
import { getOrSetBlogViewerId } from '~~/server/utils/blog'

export async function getOps(event: H3Event, id: string, userId?: number) {
  const viewerId = getOrSetBlogViewerId(event)
  const [lookedRow, looksRows, likedRows, likesRows, comments] =
    await Promise.all([
      prisma.$queryRaw<Array<{ c: bigint }>>`
      SELECT COUNT(1) AS c FROM blog_view WHERE file_id = ${id} AND viewer_id = ${viewerId}
    `,
      prisma.$queryRaw<Array<{ c: bigint }>>`
      SELECT COUNT(1) AS c FROM blog_view WHERE file_id = ${id}
    `,
      userId
        ? prisma.$queryRaw<Array<{ c: bigint }>>`
          SELECT COUNT(1) AS c FROM blog_like WHERE file_id = ${id} AND user_id = ${BigInt(userId)}
        `
        : Promise.resolve([{ c: BigInt(0) }]),
      prisma.$queryRaw<Array<{ c: bigint }>>`
      SELECT COUNT(1) AS c FROM blog_like WHERE file_id = ${id}
    `,
      prisma.blog_comment.count({ where: { file_id: id } }),
    ])

  const looked = Number(lookedRow?.[0]?.c ?? 0) > 0
  const looks = Number(looksRows?.[0]?.c ?? 0)
  const liked = Number(likedRows?.[0]?.c ?? 0) > 0
  const likes = Number(likesRows?.[0]?.c ?? 0)

  const res = {
    looked,
    looks,
    liked,
    likes,
    comments,
  }

  return res
}
