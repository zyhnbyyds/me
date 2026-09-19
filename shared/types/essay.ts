export interface EssayImageMedia {
  type: 'image'
  image: string
}

export interface EssayLiveMedia {
  type: 'live'
  image: string
  video: string
}

export type EssayMedia = string | EssayImageMedia | EssayLiveMedia

/**
 * 随笔正文解析后的 Markdown AST（由 @nuxtjs/mdc 解析，结构对应 Minimark）。
 * 前端交给 `<ContentRenderer>` 渲染；为 null 表示正文为空或解析失败，
 * 此时调用方应降级为纯文本展示。
 */
export interface EssayMarkdownBody {
  type: string
  children?: unknown[]
  [key: string]: unknown
}

export interface EssayItem {
  id: string
  /** 正文原文（Markdown 源码） */
  content: string | null
  /** 正文 Markdown 解析结果，用于富文本渲染 */
  body: EssayMarkdownBody | null
  images: EssayMedia[] | null
  createdAt: string
  updatedAt: string
}

export interface CreateEssayBody {
  content?: string
  images?: EssayMedia[]
}
