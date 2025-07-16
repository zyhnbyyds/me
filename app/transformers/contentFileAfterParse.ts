import type { FileAfterParseHook } from '@nuxt/content'
import type { ContentMeta } from '~/types/blog'
import readingTime from 'reading-time'

export function transformContentFileAfterParse(ctx: FileAfterParseHook) {
  const { file, content } = ctx

  const wordsPerMinute = 180
  const text = typeof file.body === 'string' ? file.body : ''
  const meta = content.meta as ContentMeta

  content.readingTime = Math.ceil(readingTime(text, { wordsPerMinute }).minutes)

  Object.keys(meta).forEach((key) => {
    if (['readingTime', 'title', 'description', 'image', 'tags', 'publishAt', 'updateAt'].includes(key)) {
      if (key === 'publishAt' || key === 'updateAt') {
        content[key] = meta[key] ? new Date(meta[key]).toISOString() : null
      }
      else {
        content[key] = meta[key as keyof ContentMeta]
      }
    }
  })
}
