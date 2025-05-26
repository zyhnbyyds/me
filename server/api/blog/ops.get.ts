import { getOps } from '~/server/utils/ops'

export default defineEventHandler(async (event) => {
  const { id } = getQuery<{ id: string }>(event)
  const { user } = await getUserSession(event)
  const ops = await getOps(id, user?.id)
  if (!ops) {
    return false
  }
  return ops
})
