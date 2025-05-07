import { getOps } from '~/server/utils/ops'

export default defineEventHandler(async (event) => {
  const { id } = getQuery<{ id: string }>(event)
  const ops = getOps(id)
  if (!ops) {
    return false
  }
  return ops
})
