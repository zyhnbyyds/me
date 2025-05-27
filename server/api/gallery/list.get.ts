import type { BucketItem } from 'minio'
import oss from '~/server/utils/minio'

export default defineEventHandler(async () => {
  const socket = oss.listObjectsV2('me-oss', 'me/', true)
  const objList: BucketItem[] = []
  return new Promise((resolve, reject) => {
    socket.on('data', (res) => {
      objList.push(res)
    })

    socket.on('end', () => {
      resolve(objList)
    })
    socket.on('error', (err) => {
      reject(err)
    })
  })
})
