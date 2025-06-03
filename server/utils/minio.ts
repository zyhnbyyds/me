import { Client } from 'minio'
import { ulid } from 'ulid'

const { minio } = useRuntimeConfig()

const oss = new Client(minio)
console.log(JSON.stringify(minio))

export default oss

export function transFileNameToSavePath(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext) {
    throw new Error('File must have an extension')
  }
  let suffix = ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'ico'].includes(ext)) {
    suffix = 'album'
  }
  else if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) {
    suffix = 'video'
  }
  else if (['mp3', 'wav', 'flac'].includes(ext)) {
    suffix = 'audio'
  }
  else if (['pdf', 'doc', 'docx', 'txt', 'zip'].includes(ext)) {
    suffix = 'document'
  }
  else {
    throw new Error(`Unsupported file type ${ext}`)
  }
  return `${suffix}/${ulid()}.${ext}`
}
