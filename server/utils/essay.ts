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

/**
 * 把随笔的 Markdown 正文压成纯文本。
 *
 * 主页信息流与日历只需要「能读、能搜」的摘要，
 * 直接展示 Markdown 语法符号（##、**、[](...)）会很杂乱，这里先清洗掉。
 */
export function essayToPlainText(content: string | null): string {
  if (!content) return ''

  return (
    content
      // 代码块整段丢弃，摘要里保留代码没有意义
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/~~~[\s\S]*?~~~/g, ' ')
      // 行内标记：保留可见文字
      .replace(/`([^`]*)`/g, '$1')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 行首标记：标题、引用、列表、分隔线
      .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, '')
      .replace(/^[ \t]{0,3}>[ \t]?/gm, '')
      .replace(/^[ \t]{0,3}(?:[-*+]|\d+\.)[ \t]+/gm, '')
      .replace(/^[ \t]{0,3}(?:[-*_][ \t]*){3,}$/gm, ' ')
      // 强调符号与表格分隔符
      .replace(/[*_~]{1,3}/g, '')
      .replace(/\|/g, ' ')
      // 压缩空白，让摘要紧凑
      .replace(/[ \t]+/g, ' ')
      .replace(/\s*\n\s*/g, ' ')
      .trim()
  )
}

/** 取随笔摘要，超长时截断并加省略号 */
export function essaySummary(content: string | null, maxLength = 60): string {
  const plain = essayToPlainText(content)
  if (plain.length <= maxLength) return plain

  return `${plain.slice(0, maxLength)}…`
}
