import { Buffer } from 'node:buffer'
import { Readable } from 'node:stream'
import { consola } from 'consola'
import oss, { transFileNameToSavePath } from '~/server/utils/minio'

export default defineEventHandler(async (event) => {
  const permitUserid = import.meta.env.GALLERY_SHOW_UPLOAD_BTN_USER_ID
  const { user } = await getUserSession(event)

  if (!user || permitUserid !== user.id) {
    return createError({ status: 401, message: '没有权限' })
  }

  const formData = await readFormData(event)
  if (!formData) {
    throw createError({ status: 400, message: 'Invalid form data' })
  }
  for (const [_key, value] of formData.entries()) {
    if (value instanceof File) {
      const savePath = transFileNameToSavePath(value)

      const buffer = await value.arrayBuffer()
      const stream = Readable.from(Buffer.from(buffer))
      consola.log(`Uploading file: ${value.name} to path: ${savePath}`, `${(value.size / (1024 * 1024)).toFixed(2)}MB`)

      await oss.putObject(
        'me-photos',
        savePath,
        stream,
        value.size,
        { 'Content-Type': value.type },
      )
      consola.success(`File uploaded successfully: ${value.name} to path: ${savePath}`)
    }
  }
  return true
})
