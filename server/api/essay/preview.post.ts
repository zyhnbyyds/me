import type { EssayMarkdownBody } from '~~/shared/types/essay'
import { parseEssayBody } from '~~/server/utils/essay'
import { requireEssayAuth } from '~~/server/utils/essay-auth'

/**
 * 写随笔时的 Markdown 实时预览。
 * 与列表页共用 `parseEssayBody`，避免前端两套渲染结果不一致。
 */
export default defineEventHandler(async (event) => {
  requireEssayAuth(event)

  const body = await readBody<{ content?: string }>(event)

  const parsed: EssayMarkdownBody | null = await parseEssayBody(
    body?.content ?? null,
  )

  return Result.success(parsed)
})
