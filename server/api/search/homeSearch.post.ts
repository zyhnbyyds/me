import type { HomeSearchBody } from '~~/server/types/search'
import type { QQContentItem } from '~~/shared/types/qq'
import type { BlogCollectionItem } from '@nuxt/content'
import consola from 'consola'

type HomeSearchResultItem = {
  keyword: string
  source: 'qq' | 'blog'
  id: string
  path: string
}

function mapToSearchResult(item: QQContentItem | BlogCollectionItem): HomeSearchResultItem {
  if ('tid' in item) {
    return {
      keyword: item.content,
      source: 'qq',
      id: item.tid,
      path: `/qq?tid=${item.tid}`,
    }
  }

  return {
    keyword: item.title,
    source: 'blog',
    id: item.id ?? '',
    path: item.path,
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<HomeSearchBody>(event)
  const { keyword } = body

  if (!keyword) {
    return Result.success([])
  }

  try {
    const contentResult = await queryCollection(event, 'blog').where('title', 'LIKE', `%${keyword}%`).all()

    const qqResult = await $fetch<{ data: QQContentItem[] }>('/api/qq/list', { query: { content: keyword } })

    const searchResults = [...qqResult.data, ...contentResult].map((item) => mapToSearchResult(item))

    return Result.success(searchResults)
  } catch (error) {
    consola.error(error)
    const message = error instanceof Error ? error.message : String(error)
    return Result.fail(500, message)
  }
})
