import { writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { ulid } from 'ulid'
import type { EssayMedia } from '~~/shared/types/essay'
import { findMotionPhotoVideo } from '~~/server/utils/motionPhoto'
import { requireEssayAuth } from '~~/server/utils/essay-auth'
import {
  detectFileType,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_DISPLAY,
} from '~~/server/utils/file-type'
import { stripExif } from '~~/server/utils/exif'

const MAX_SIZE = 50 * 1024 * 1024 // 50MB

export default defineEventHandler(async (event) => {
  // 使用 essay token 鉴权，不再每次传输密码明文
  requireEssayAuth(event)

  const config = useRuntimeConfig(event)

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: '没有上传文件' })
  }

  // 提取文件（忽略旧版 password 字段，鉴权已通过 cookie token 完成）
  const files: Array<{ filename: string; data: Buffer }> = []

  for (const part of formData) {
    if (part.name === 'file' && part.filename) {
      files.push({
        filename: part.filename,
        data: part.data,
      })
    }
  }

  if (files.length === 0) {
    throw createError({ statusCode: 400, statusMessage: '没有上传文件' })
  }

  const urls: string[] = []
  const media: EssayMedia[] = []

  for (const file of files) {
    // ─── 安全校验 1：基于文件头 Magic Number 检测真实类型 ───
    const detected = detectFileType(file.data)
    if (!detected) {
      throw createError({
        statusCode: 400,
        statusMessage: `无法识别的文件类型，仅支持 ${ALLOWED_MIME_DISPLAY}`,
      })
    }

    // ─── 安全校验 2：后缀白名单（与检测出的真实类型对应）───
    if (!ALLOWED_EXTENSIONS.has(detected.ext)) {
      throw createError({
        statusCode: 400,
        statusMessage: `不支持的文件类型: ${detected.mime}`,
      })
    }

    // ─── 安全校验 3：文件大小 ──────────────────────────────
    if (file.data.length > MAX_SIZE) {
      throw createError({
        statusCode: 400,
        statusMessage: `文件大小超过 ${MAX_SIZE / 1024 / 1024}MB`,
      })
    }

    // ─── 安全处理：JPEG 剥离 EXIF 元数据 ──────────────────
    let fileData = file.data
    if (detected.ext === '.jpg' || detected.ext === '.jpeg') {
      fileData = stripExif(file.data)
    }

    // ─── 生成安全文件名（使用检测出的真实后缀，不用用户提供的文件名）───
    const newName = `${ulid()}${detected.ext}`
    const dir = config.uploadDir as string

    await mkdir(dir, { recursive: true })
    await writeFile(resolve(dir, newName), fileData)

    const imageUrl = `/api/essay/file/${newName}`
    const motionVideo =
      detected.ext === '.jpg' || detected.ext === '.jpeg'
        ? findMotionPhotoVideo(fileData)
        : null

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
