import type { PageQuery } from '~~/shared/types/page'
import type { QQContentItem } from '~~/shared/types/qq'
import consola from 'consola'
import { prisma } from '~~/server/lib/prisma'

interface QQContentRow {
  commentlist: string | QQContentItem['commentlist']
  pic: string | QQContentItem['pic']
  video: string | QQContentItem['video']
  [key: string]: unknown
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
  return JSON.parse(JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? Number(v) : v))) as T
}

export default defineEventHandler(async (event) => {
  const {
    current = 1,
    size = 20,
    tid = '',
    content,
  } = getQuery<PageQuery & { tid?: string; content?: string }>(event)
  const currentNumber = Number(current) || 1
  const sizeNumber = Number(size) || 20

  const offset = (currentNumber - 1) * sizeNumber

  let searchSingleResult: QQContentItem | null = null
  if (tid) {
    try {
      const row = await prisma.qq_content.findUnique({ where: { tid } })
      if (row) {
        const normalized = normalizeBigInt(row) as unknown as QQContentRow
        searchSingleResult = {
          ...(normalized as unknown as Record<string, unknown>),
          commentlist: parseJSONField<QQContentItem['commentlist']>(normalized.commentlist),
          pic: parseJSONField<QQContentItem['pic']>(normalized.pic),
          video: parseJSONField<QQContentItem['video']>(normalized.video),
          isSearchSingle: true,
        } as QQContentItem
      }
    } catch (e) {
      consola.error(e)
      throw createError({ statusCode: 500, statusMessage: '查询失败' })
    }
  }

  const keyword = (content ?? '').trim()

  const where = {
    ...(keyword
      ? {
          content: {
            contains: keyword,
          },
        }
      : {}),
    ...(tid
      ? {
          tid: {
            not: tid,
          },
        }
      : {}),
  } as const

  try {
    const [rows, total] = await Promise.all([
      prisma.qq_content.findMany({
        where,
        orderBy: { created_time: 'desc' },
        skip: offset,
        take: sizeNumber,
      }),
      prisma.qq_content.count({ where }),
    ])

    const normalizedRows = normalizeBigInt(rows) as unknown as QQContentRow[]

    const transformedData = [searchSingleResult, ...normalizedRows]
      .filter((item) => item !== null)
      .map((item) => {
        const row = item as QQContentRow
        return {
          ...(row as unknown as Record<string, unknown>),
          commentlist: parseJSONField<QQContentItem['commentlist']>(row.commentlist),
          pic: parseJSONField<QQContentItem['pic']>(row.pic),
          video: parseJSONField<QQContentItem['video']>(row.video),
        } as QQContentItem
      })

    return {
      data: transformedData,
      total,
    }
  } catch (e) {
    consola.error(e)
    throw createError({ statusCode: 500, statusMessage: '查询失败' })
  }
})
