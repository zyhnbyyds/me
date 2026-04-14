import type { PageQuery } from '~~/shared/types/page'
import { prisma } from '~~/server/lib/prisma'

interface FeedItem {
  id: string
  type: 'blog' | 'qq'
  title: string
  description: string
  content?: string
  image?: string
  date: number
  tags: string[]
  path: string
  readingTime?: number
  qqData?: Record<string, unknown>
}

type QQContentRow = Record<string, unknown> & {
  commentlist?: string | unknown
  pic?: string | unknown
  video?: string | unknown
  conlist?: string | unknown
  lbs?: string | unknown
  pic_template?: string | unknown
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

function normalizeBigInt<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? Number(v) : v)),
  ) as T
}

function transformRow(row: QQContentRow): QQContentRow {
  return {
    ...row,
    commentlist: parseJSONField(row.commentlist),
    pic: parseJSONField(row.pic),
    video: parseJSONField(row.video),
    conlist: parseJSONField(row.conlist),
    lbs: parseJSONField(row.lbs),
    pic_template: parseJSONField(row.pic_template),
  }
}

export default defineEventHandler(async (event) => {
  const {
    current = 1,
    size = 20,
    keyword = '',
    date = '',
  } = getQuery<PageQuery & { keyword?: string; date?: string }>(event)

  const currentNumber = Number(current) || 1
  const sizeNumber = Number(size) || 20
  const searchKeyword = (keyword ?? '').toString().trim()
  const targetDate = (date ?? '').toString().trim()

  // 1. 获取博客文章（从 Nuxt Content）
  let blogItems: FeedItem[] = []
  try {
    const blogPosts = await queryCollection(event, 'blog').all()
    blogItems = blogPosts.map((post) => ({
      id: post.path ?? post.stem ?? '',
      type: 'blog' as const,
      title: post.title ?? '',
      description: post.description ?? '',
      image: post.image
        ? String(post.image).startsWith('/')
          ? post.image
          : `/blog/${post.image}`
        : undefined,
      date: new Date(post.updateAt ?? post.publishAt ?? '').getTime(),
      tags: post.tags ?? [],
      path: post.path ?? '',
      readingTime: post.readingTime ?? 5,
    }))
  } catch {
    blogItems = []
  }

  // 2. 获取 QQ 动态（从数据库）
  let qqItems: FeedItem[] = []
  try {
    const qqWhere = searchKeyword
      ? { content: { contains: searchKeyword } }
      : {}
    const qqRows = await prisma.qq_content.findMany({
      where: qqWhere,
      orderBy: { created_time: 'desc' },
    })
    const normalizedRows = normalizeBigInt(qqRows) as unknown as QQContentRow[]
    qqItems = normalizedRows.map((row) => {
      const transformed = transformRow(row)
      const content = (transformed.content as string) ?? ''
      return {
        id: transformed.tid as string,
        type: 'qq' as const,
        title: content
          ? content.slice(0, 40) + (content.length > 40 ? '...' : '')
          : '分享了动态',
        description: content,
        date: ((transformed.created_time as number) ?? 0) * 1000,
        tags: [],
        path: `/qq?tid=${transformed.tid}`,
        readingTime: 1,
        qqData: transformed,
      }
    })
  } catch {
    qqItems = []
  }

  // 3. 合并并排序
  let allItems = [...blogItems, ...qqItems]

  // 关键字过滤（博客部分在内存过滤,QQ部分已在数据库过滤）
  if (searchKeyword) {
    allItems = allItems.filter((item) => {
      if (item.type === 'qq') return true // 已在数据库过滤
      const kw = searchKeyword.toLowerCase()
      return (
        item.title.toLowerCase().includes(kw) ||
        item.description.toLowerCase().includes(kw) ||
        item.tags.some((t) => t.toLowerCase().includes(kw))
      )
    })
  }

  // 日期过滤（支持 YYYY-MM 月份或 YYYY-MM-DD 精确到天）
  if (targetDate) {
    if (targetDate.length === 7) {
      // 月份过滤: YYYY-MM
      const [yearStr, monthStr] = targetDate.split('-')
      const year = Number(yearStr)
      const month = Number(monthStr) - 1 // 0-indexed
      allItems = allItems.filter((item) => {
        const d = new Date(item.date)
        return d.getFullYear() === year && d.getMonth() === month
      })
    } else {
      // 精确到天: YYYY-MM-DD
      const dayStart = new Date(targetDate).getTime()
      const dayEnd = dayStart + 86400000
      allItems = allItems.filter(
        (item) => item.date >= dayStart && item.date < dayEnd,
      )
    }
  }

  // 按时间倒序
  allItems.sort((a, b) => b.date - a.date)

  const total = allItems.length
  const offset = (currentNumber - 1) * sizeNumber
  const pagedItems = allItems.slice(offset, offset + sizeNumber)

  return {
    data: pagedItems,
    total,
    current: currentNumber,
    size: sizeNumber,
  }
})
