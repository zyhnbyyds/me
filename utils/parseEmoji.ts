export interface EmojiInfo {
  type: 'emoji' | 'text'
  value: string
}

/**
 * 解析包含 emoji 的 HTML 内容
 * 该函数旨在将给定的 HTML 字符串转换为一个包含文本和 emoji 信息的数组
 * 主要用于处理用户输入的包含 emoji 的文本内容
 *
 * @param html 代表用户输入内容的 HTML 字符串
 * @returns 返回一个对象数组，每个对象包含类型（'emoji' 或 'text'）和对应的值
 */
export function parseEmojiContent(html: string): EmojiInfo[] {
  const container = document.createElement('div')
  container.innerHTML = html

  const result: { type: 'emoji' | 'text', value: string }[] = []

  container.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        result.push({
          type: 'text',
          value: text,
        })
      }
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      if (el.tagName === 'IMG' && el.getAttribute('src')?.startsWith('/emojis/')) {
        const src = el.getAttribute('src')!
        const filename = src.split('/').pop()!
        result.push({
          type: 'emoji',
          value: filename,
        })
      }
      else {
        // 嵌套元素中也可能有文字或 emoji，再递归处理
        result.push(...parseEmojiContent(el.innerHTML))
      }
    }
  })

  return result
}
