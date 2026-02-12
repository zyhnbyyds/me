import type { BlogCollectionItem } from '@nuxt/content'
import { serverSupabaseClient } from '#supabase/server'
import dayjs from 'dayjs'

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
  source: 'blog' | 'qq'
  date: string
  timestamp: number
  title?: string
  description?: string
  content?: string
  path?: string
  image?: string
  tags?: string[]
  name?: string
  tid?: string
  [key: string]: unknown
}

export default defineEventHandler(async (event) => {
  const { year, month, day } = getQuery<{ year?: string; month?: string; day?: string }>(event)

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

  const [blogItems, qqResult] = await Promise.all([
    queryCollection(event, 'blog')
      .where('publishAt', 'BETWEEN', [startStr, endStr])
      .all() as Promise<BlogCollectionItem[]>,
    (async () => {
      const client = await serverSupabaseClient(event)
      const { data } = await client
        .from('qq_content')
        .select('*')
        .gte('created_time', startTs)
        .lte('created_time', endTs)
        .order('created_time', { ascending: true })
      return (data ?? []) as QQCalendarRow[]
    })(),
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

  events.sort((a, b) => a.timestamp - b.timestamp)

  return { events }
})
