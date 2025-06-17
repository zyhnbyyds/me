import type { QQContentItem } from '~/types/qq'
import { Result } from '~/server/utils/result'
import qqList from '../../data/data.json'

export default defineEventHandler(() => {
  // TODO: 完善分页，数据库存储
  return Result.success<QQContentItem[]>(qqList.slice(0, 100))
})
