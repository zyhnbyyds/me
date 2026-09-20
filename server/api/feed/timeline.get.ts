import { prisma } from '~~/server/lib/prisma'

interface TimelineDay {
  date: string
  blogCount: number
  qqCount: number
  essayCount: number
  total: number
}

interface TimelineMonth {
  month: string
  days: TimelineDay[]
  total: number
}

interface TimelineYear {
  year: number
  months: TimelineMonth[]
  total: number
}

function normalizeBigInt<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? Number(v) : v)),
  ) as T
}

export default defineEventHandler(async (event) => {
  // 收集所有日期
  const dateMap = new Map<string, { blog: number; qq: number; essay: number }>()

  const toDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  // 1. 博客文章日期
  try {
    const blogPosts = await queryCollection(event, 'blog').all()
    for (const post of blogPosts) {
      const dateStr = post.updateAt ?? post.publishAt
      if (!dateStr) continue
      const d = new Date(dateStr)
      const key = toDateKey(d)
      const entry = dateMap.get(key) ?? { blog: 0, qq: 0, essay: 0 }
      entry.blog++
      dateMap.set(key, entry)
    }
  } catch {
    // 忽略错误
  }

  // 2. QQ 动态日期
  try {
    const qqRows = await prisma.qq_content.findMany({
      select: { created_time: true },
      orderBy: { created_time: 'desc' },
    })
    const normalized = normalizeBigInt(qqRows) as {
      created_time: number | null
    }[]
    for (const row of normalized) {
      if (!row.created_time) continue
      const d = new Date(row.created_time * 1000)
      const key = toDateKey(d)
      const entry = dateMap.get(key) ?? { blog: 0, qq: 0, essay: 0 }
      entry.qq++
      dateMap.set(key, entry)
    }
  } catch {
    // 忽略错误
  }

  // 3. 随笔日期
  try {
    const essayRows = await prisma.essay.findMany({
      select: { created_at: true },
      orderBy: { created_at: 'desc' },
    })
    for (const row of essayRows) {
      const key = toDateKey(row.created_at)
      const entry = dateMap.get(key) ?? { blog: 0, qq: 0, essay: 0 }
      entry.essay++
      dateMap.set(key, entry)
    }
  } catch {
    // 忽略错误
  }

  // 4. 按年 > 月 > 日 组织
  const yearMap = new Map<number, Map<string, TimelineDay[]>>()
  for (const [dateStr, counts] of dateMap) {
    const [yearStr, monthStr] = dateStr.split('-')
    const year = Number(yearStr)
    const monthKey = `${yearStr}-${monthStr}`

    if (!yearMap.has(year)) yearMap.set(year, new Map())
    const monthMap = yearMap.get(year)!
    if (!monthMap.has(monthKey)) monthMap.set(monthKey, [])
    monthMap.get(monthKey)!.push({
      date: dateStr,
      blogCount: counts.blog,
      qqCount: counts.qq,
      essayCount: counts.essay,
      total: counts.blog + counts.qq + counts.essay,
    })
  }

  // 排序并输出
  const timeline: TimelineYear[] = []
  const sortedYears = [...yearMap.keys()].sort((a, b) => b - a)

  for (const year of sortedYears) {
    const monthMap = yearMap.get(year)!
    const months: TimelineMonth[] = []
    const sortedMonths = [...monthMap.keys()].sort((a, b) => b.localeCompare(a))

    for (const monthKey of sortedMonths) {
      const days = monthMap
        .get(monthKey)!
        .sort((a, b) => b.date.localeCompare(a.date))
      months.push({
        month: monthKey,
        days,
        total: days.reduce((sum, d) => sum + d.total, 0),
      })
    }

    timeline.push({
      year,
      months,
      total: months.reduce((sum, m) => sum + m.total, 0),
    })
  }

  return { data: timeline }
})
