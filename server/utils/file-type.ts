/**
 * 基于文件头 Magic Number 检测真实文件类型。
 * 不信任客户端声明的 Content-Type。
 */

export interface FileTypeResult {
  ext: string // 安全后缀，如 '.jpg'
  mime: string // 真实 MIME，如 'image/jpeg'
}

// 允许的类型白名单：magic bytes → { ext, mime }
const MAGIC_DB: Array<{
  offset: number
  bytes: number[]
  result: FileTypeResult
}> = [
  {
    offset: 0,
    bytes: [0xff, 0xd8, 0xff],
    result: { ext: '.jpg', mime: 'image/jpeg' },
  },
  {
    offset: 0,
    bytes: [0x89, 0x50, 0x4e, 0x47],
    result: { ext: '.png', mime: 'image/png' },
  },
  {
    offset: 0,
    bytes: [0x47, 0x49, 0x46, 0x38],
    result: { ext: '.gif', mime: 'image/gif' },
  },
  {
    offset: 0,
    bytes: [0x52, 0x49, 0x46, 0x46], // RIFF
    result: null!, // 需要进一步检查 WEBP
  },
]

// WebP: RIFF .... WEBP (offset 0 "RIFF", offset 8 "WEBP")
const WEBP_BYTES = [0x57, 0x45, 0x42, 0x50] // "WEBP"

/**
 * 检测 Buffer 的真实文件类型。
 * @returns 检测结果，若无法识别则返回 null
 */
export function detectFileType(buffer: Buffer): FileTypeResult | null {
  if (buffer.length < 12) return null

  for (const entry of MAGIC_DB) {
    if (entry.offset + entry.bytes.length > buffer.length) continue

    const match = entry.bytes.every(
      (byte, i) => buffer[entry.offset + i] === byte,
    )
    if (!match) continue

    // 特殊处理 RIFF → 检查是否为 WebP
    if (entry.result === null) {
      if (
        buffer.length >= 12 &&
        buffer[8] === WEBP_BYTES[0] &&
        buffer[9] === WEBP_BYTES[1] &&
        buffer[10] === WEBP_BYTES[2] &&
        buffer[11] === WEBP_BYTES[3]
      ) {
        return { ext: '.webp', mime: 'image/webp' }
      }
      return null
    }

    return entry.result
  }

  return null
}

/**
 * 允许上传的安全后缀白名单（与 detectFileType 能检测出的类型对应）
 */
export const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
])

/**
 * 允许的 MIME 类型（用于错误提示，仅供参考）
 */
export const ALLOWED_MIME_DISPLAY =
  'image/jpeg, image/png, image/gif, image/webp'
