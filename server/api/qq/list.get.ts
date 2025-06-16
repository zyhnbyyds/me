import type { QQContentItem } from '~/types/qq'
import { Result } from '~/server/utils/result'
import qqList from '../../data/data.json'

export default defineEventHandler(() => {
  return Result.success<QQContentItem[]>(qqList)
})
