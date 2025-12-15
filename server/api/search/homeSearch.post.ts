import type { HomeSearchBody } from '~~/server/types/search'
import consola from 'consola'

export default defineEventHandler(async (event) => {
  const body = await readBody<HomeSearchBody>(event)
  const { keyword } = body

  if (!keyword) {
    return Result.success([])
  }

  try {
    const contentResult = await queryCollection(event, 'blog').where('title', 'LIKE', `%${keyword || ''}%`).all()

    const qqResult = await $fetch('/api/qq/list', { query: { content: keyword } })

    const searchResults = [...qqResult.data, ...contentResult].map((item: any) => {
      return {
        keyword: item?.tid ? item.content : item.title,
        source: item?.tid ? 'qq' : 'blog',
        id: item?.tid ? item.tid : item.id,
        path: item?.tid ? `/qq?tid=${item.tid}` : item.path,
      }
    })

    return Result.success(searchResults)
  }
  catch (error) {
    consola.error(error)
    Result.fail(500, error as string)
  }
})
