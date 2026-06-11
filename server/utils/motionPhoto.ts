const XMP_END = '</x:xmpmeta>'
const MP4_FTYP_OFFSET = 4

function isMp4At(buffer: Buffer, offset: number): boolean {
  return (
    offset >= 0 &&
    offset + 12 <= buffer.length &&
    buffer.toString('ascii', offset + MP4_FTYP_OFFSET, offset + 8) === 'ftyp'
  )
}

function extractXmp(buffer: Buffer): string | null {
  const text = buffer.toString('utf8')
  const start = text.indexOf('<x:xmpmeta')
  const end = text.indexOf(XMP_END)

  if (start === -1 || end === -1) return null

  return text.slice(start, end + XMP_END.length)
}

function findAttr(source: string, name: string): string | null {
  const escapedName = name.replace(':', String.raw`\:`)
  const match = source.match(new RegExp(`${escapedName}=["']([^"']+)["']`))
  return match?.[1] ?? null
}

function findMotionItemLength(xmp: string): number | null {
  const items = xmp.match(/<rdf:li\b[^>]*>/g) ?? []

  for (const item of items) {
    const semantic =
      findAttr(item, 'Container:ItemSemantic') ??
      findAttr(item, 'GContainerItem:Semantic') ??
      findAttr(item, 'Item:Semantic')

    if (semantic !== 'MotionPhoto') continue

    const length =
      findAttr(item, 'Container:ItemLength') ??
      findAttr(item, 'GContainerItem:Length') ??
      findAttr(item, 'Item:Length')

    if (!length) continue

    const parsedLength = Number(length)
    if (Number.isSafeInteger(parsedLength) && parsedLength > 0) {
      return parsedLength
    }
  }

  return null
}

function hasMotionPhotoFlag(xmp: string): boolean {
  return (
    findAttr(xmp, 'Camera:MotionPhoto') === '1' ||
    findAttr(xmp, 'GCamera:MotionPhoto') === '1' ||
    findAttr(xmp, 'Camera:MicroVideo') === '1' ||
    findAttr(xmp, 'GCamera:MicroVideo') === '1'
  )
}

function findLegacyMicroVideoLength(xmp: string): number | null {
  const offset =
    findAttr(xmp, 'Camera:MicroVideoOffset') ??
    findAttr(xmp, 'GCamera:MicroVideoOffset')

  if (!offset) return null

  const parsedOffset = Number(offset)
  return Number.isSafeInteger(parsedOffset) && parsedOffset > 0
    ? parsedOffset
    : null
}

export interface MotionPhotoVideo {
  mime: 'video/mp4'
  start: number
  length: number
  buffer: Buffer
}

export function findMotionPhotoVideo(buffer: Buffer): MotionPhotoVideo | null {
  const xmp = extractXmp(buffer)
  if (!xmp || !hasMotionPhotoFlag(xmp)) return null

  const videoLength =
    findMotionItemLength(xmp) ?? findLegacyMicroVideoLength(xmp)
  if (!videoLength) return null

  const start = buffer.length - videoLength
  if (!isMp4At(buffer, start)) return null

  return {
    mime: 'video/mp4',
    start,
    length: videoLength,
    buffer: buffer.subarray(start),
  }
}
