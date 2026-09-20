import type { BlogCollectionItem } from '@nuxt/content'
import dayjs from 'dayjs'
import { queryCollection } from '@nuxt/content/server'
import { prisma } from '~~/server/lib/prisma'
import { essaySummary, essayToPlainText } from '~~/server/utils/essay'

interface QQCalendarRow {
  tid: string
  name: string
  content: string
  created_time: number
  createtime?: string
  pic?: unknown
  video?: unknown
  commentlist?: unknown
}

export interface CalendarEvent {
  id: string
  source: 'blog' | 'qq' | 'essay'
  date: string
  timestamp: number
  title?: string
  description?: string
  content?: string
  path?: string
  image?: string
  images?: unknown
  tags?: string[]
  name?: string
  tid?: string
  [key: string]: unknown
}

export default defineEventHandler(async (event) => {
  const { year, month, day } = getQuery<{
    year?: string
    month?: string
    day?: string
  }>(event)

  const y = Number.parseInt(year ?? String(dayjs().year()), 10)
  const m = month ? Number.parseInt(month, 10) : null
  const d = day ? Number.parseInt(day, 10) : null

  let startDate: dayjs.Dayjs
  let endDate: dayjs.Dayjs

  if (d && m) {
    startDate = dayjs(`${y}-${m}-${d}`).startOf('day')
    endDate = dayjs(`${y}-${m}-${d}`).endOf('day')
  } else if (m) {
    startDate = dayjs(`${y}-${m}-1`).startOf('month')
    endDate = dayjs(`${y}-${m}-1`).endOf('month')
  } else {
    startDate = dayjs(`${y}-1-1`).startOf('year')
    endDate = dayjs(`${y}-12-31`).endOf('year')
  }

  const startStr = startDate.toISOString()
  const endStr = endDate.toISOString()
  const startTs = startDate.unix()
  const endTs = endDate.unix()

  const [blogItems, qqResult, essayRows] = await Promise.all([
    queryCollection(event, 'blog')
      .where('publishAt', 'BETWEEN', [startStr, endStr])
      .all() as Promise<BlogCollectionItem[]>,
    (async () => {
      const rows = await prisma.qq_content.findMany({
        where: {
          created_time: {
            gte: BigInt(startTs),
            lte: BigInt(endTs),
          },
        },
        orderBy: { created_time: 'asc' },
      })
      return JSON.parse(
        JSON.stringify(rows, (_k, v) =>
          typeof v === 'bigint' ? Number(v) : v,
        ),
      ) as QQCalendarRow[]
    })(),
    prisma.essay.findMany({
      where: { created_at: { gte: startDate.toDate(), lte: endDate.toDate() } },
      orderBy: { created_at: 'asc' },
    }),
  ])

  const events: CalendarEvent[] = []

  for (const item of blogItems) {
    const pubDate = item.publishAt ? new Date(item.publishAt) : new Date()
    events.push({
      id: item.id ?? item.path ?? '',
      source: 'blog',
      date: dayjs(pubDate).format('YYYY-M-D'),
      timestamp: dayjs(pubDate).valueOf(),
      title: item.title,
      description: item.description,
      path: item.path,
      image: item.image,
      tags: item.tags,
    })
  }

  for (const row of qqResult) {
    const createdTime = row.created_time ?? Math.floor(Date.now() / 1000)
    const ts = createdTime * 1000
    const date = dayjs.unix(createdTime).format('YYYY-M-D')
    events.push({
      id: row.tid,
      source: 'qq',
      date,
      timestamp: ts,
      content: row.content,
      name: row.name,
      tid: row.tid,
      createtime: row.createtime,
      pic: row.pic,
      video: row.video,
      commentlist: row.commentlist,
    })
  }

  for (const row of essayRows) {
    const createdAt = row.created_at
    events.push({
      id: `essay-${row.id}`,
      source: 'essay',
      date: dayjs(createdAt).format('YYYY-M-D'),
      timestamp: createdAt.getTime(),
      title: essaySummary(row.content, 40) || '图片随笔',
      content: essayToPlainText(row.content),
      path: `/essay?id=${row.id}`,
      images: row.images,
    })
  }

  events.sort((a, b) => a.timestamp - b.timestamp)

  return { events }
})
