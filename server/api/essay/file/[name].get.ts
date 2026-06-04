import { createReadStream, existsSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { resolve, extname } from 'node:path'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
}

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: '缺少文件名' })
  }

  // 防止路径遍历
  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    throw createError({ statusCode: 400, statusMessage: '非法文件名' })
  }

  const config = useRuntimeConfig(event)
  const dir = config.uploadDir as string
  const filePath = resolve(dir, name)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: '文件不存在' })
  }

  const ext = extname(name).toLowerCase()
  const mime = MIME[ext] || 'application/octet-stream'
  const fileStat = await stat(filePath)

  setHeader(event, 'Content-Type', mime)
  setHeader(event, 'Content-Length', fileStat.size)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return sendStream(event, createReadStream(filePath))
})
