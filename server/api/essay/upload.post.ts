import { writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { ulid } from 'ulid'
import type { EssayMedia } from '~~/shared/types/essay'
import { findMotionPhotoVideo } from '~~/server/utils/motionPhoto'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 50 * 1024 * 1024 // 50MB

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: '没有上传文件' })
  }

  // 提取密码和文件
  let password = ''
  const files: Array<{ filename: string; data: Buffer; type: string }> = []

  for (const part of formData) {
    if (part.name === 'password') {
      password = part.data.toString()
    } else if (part.name === 'file' && part.filename) {
      files.push({
        filename: part.filename,
        data: part.data,
        type: part.type || '',
      })
    }
  }

  // 验证密码
  if (!config.essayPassword || password !== config.essayPassword) {
    throw createError({ statusCode: 403, statusMessage: '密码错误' })
  }

  if (files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: '没有上传文件' })
  }

  const urls: string[] = []
  const media: EssayMedia[] = []

  for (const file of files) {
    // 校验类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: `不支持的文件类型: ${file.type}`,
      })
    }

    // 校验大小
    if (file.data.length > MAX_SIZE) {
      throw createError({
        statusCode: 400,
        statusMessage: '文件大小超过 10MB',
      })
    }

    // 生成唯一文件名
    const ext = file.filename.split('.').pop() || 'jpg'
    const newName = `${ulid()}.${ext}`
    const dir = config.uploadDir as string

    await mkdir(dir, { recursive: true })
    await writeFile(resolve(dir, newName), file.data)

    const imageUrl = `/api/essay/file/${newName}`
    const motionVideo =
      file.type === 'image/jpeg' ? findMotionPhotoVideo(file.data) : null

    if (motionVideo) {
      const videoName = `${ulid()}.mp4`
      await writeFile(resolve(dir, videoName), motionVideo.buffer)

      const liveMedia: EssayMedia = {
        type: 'live',
        image: imageUrl,
        video: `/api/essay/file/${videoName}`,
      }

      media.push(liveMedia)
      urls.push(imageUrl)
      continue
    }

    media.push({ type: 'image', image: imageUrl })
    urls.push(imageUrl)
  }

  return Result.success({ urls, media })
})
