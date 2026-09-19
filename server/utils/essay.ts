import type { EssayMarkdownBody } from '~~/shared/types/essay'

/**
 * 将随笔正文（Markdown）解析为 AST。
 *
 * 放在服务端解析的原因：
 * 1. 列表页与写作预览共用同一套解析结果，保证「所见即所得」；
 * 2. @nuxtjs/mdc 的解析器依赖若干 CJS 模块，在浏览器端打包会失败。
 */
export async function parseEssayBody(
  content: string | null,
): Promise<EssayMarkdownBody | null> {
  const source = content?.trim()
  if (!source) return null

  try {
    // parseMarkdown 返回 { data, body, toc }，这里只取渲染需要的 AST，
    // 避免把 frontmatter、目录等无关数据传给前端。
    const { body } = await parseMarkdown(source)
    return body as unknown as EssayMarkdownBody
  } catch {
    // 解析失败时返回 null，前端会降级为纯文本展示
    return null
  }
}
