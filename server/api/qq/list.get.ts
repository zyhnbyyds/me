import type { PageQuery } from '~~/shared/types/page'
import consola from 'consola'
import { prisma } from '~~/server/lib/prisma'

type QQContentRow = Record<string, unknown> & {
  // 数据库里这些字段是 TEXT，可能是 JSON 字符串
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
  return JSON.parse(JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? Number(v) : v))) as T
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
    tid = '',
    content,
  } = getQuery<PageQuery & { tid?: string; content?: string }>(event)
  const currentNumber = Number(current) || 1
  const sizeNumber = Number(size) || 20

  const offset = (currentNumber - 1) * sizeNumber

  let searchSingleResult: QQContentRow | null = null
  if (tid) {
    try {
      const row = await prisma.qq_content.findUnique({ where: { tid } })
      if (row) {
        const normalized = normalizeBigInt(row) as unknown as QQContentRow
        searchSingleResult = {
          ...transformRow(normalized),
          isSearchSingle: true,
        }
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
        return transformRow(item as QQContentRow)
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
