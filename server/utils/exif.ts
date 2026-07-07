/**
 * 从 JPEG Buffer 中剥离 EXIF 元数据。
 *
 * JPEG 结构：
 *   SOI (FF D8) → APP1/EXIF (FF E1) → ... → SOS → 图像数据 → EOI (FF D9)
 * 本函数移除所有 APP1 标记段（包含 EXIF/XMP），保留图像像素数据。
 *
 * 参考：https://exiftool.org/TagNames/EXIF.html
 */

export function stripExif(buffer: Buffer): Buffer {
  // 只处理 JPEG（以 FF D8 开头）
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return buffer
  }

  const chunks: Buffer[] = []
  let offset = 2 // 跳过 SOI (FF D8)

  while (offset < buffer.length - 1) {
    // 查找标记（以 FF 开头，但不是 FF 00 填充字节）
    if (buffer[offset] !== 0xff) {
      // 不应该出现，安全返回原数据
      return buffer
    }

    const marker = buffer[offset + 1]

    // SOS (FF DA)：图像数据开始，之后的数据全部保留
    if (marker === 0xda) {
      chunks.push(buffer.subarray(offset))
      break
    }

    // 单字节标记（FF D0-FF D7, FF D8, FF D9）
    if (
      marker === 0xd0 ||
      marker === 0xd1 ||
      marker === 0xd2 ||
      marker === 0xd3 ||
      marker === 0xd4 ||
      marker === 0xd5 ||
      marker === 0xd6 ||
      marker === 0xd7 ||
      marker === 0xd8 ||
      marker === 0xd9
    ) {
      // EOI (FF D9)：文件结束
      if (marker === 0xd9) {
        break
      }
      // 其他单字节标记，跳过
      chunks.push(buffer.subarray(offset, offset + 2))
      offset += 2
      continue
    }

    // 带长度的标记段：读取长度
    if (offset + 4 > buffer.length) break

    const length = (buffer[offset + 2] << 8) | buffer[offset + 3]

    // APP1 (FF E1)：EXIF/XMP 元数据 —— 跳过不写入
    if (marker === 0xe1) {
      offset += 2 + length
      continue
    }

    // 其他标记段：保留
    const segmentEnd = offset + 2 + length
    if (segmentEnd > buffer.length) break
    chunks.push(buffer.subarray(offset, segmentEnd))
    offset = segmentEnd
  }

  // 如果剥离后内容明显不对（比原数据小超过 90% 可能有问题），返回原数据
  const result = Buffer.concat(chunks)
  if (result.length < buffer.length * 0.1) {
    return buffer
  }

  return result
}
