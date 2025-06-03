import type { BucketItem } from 'minio'
import consola from 'consola'
import oss from '~/server/utils/minio'

export default defineEventHandler(async () => {
  const socket = oss.listObjectsV2('me-photos', 'album/', true)
  const objList: BucketItem[] = []
  return new Promise((resolve, reject) => {
    socket.on('data', (res) => {
      objList.push(res)
    })

    socket.on('end', () => {
      resolve(objList)
    })
    socket.on('error', (err) => {
      consola.error(err)
      reject(err)
    })
  })
})
