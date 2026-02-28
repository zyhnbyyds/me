import type { H3Event } from 'h3'
import { prisma } from '~~/server/lib/prisma'

export async function getOps(_event: H3Event, id: string, userId?: number) {
  const storage = useStorage('me')

  const likedKey = `liked:${userId}:${id}`
  const likesKey = `likes:${id}`

  const [looked, looks, liked, likes, comments] = await Promise.all([
    storage.getItem<boolean>(`looked:${id}`),
    storage.getItem<number>(`looks:${id}`),
    userId ? storage.getItem<boolean>(likedKey) : false,
    storage.getItem<number>(likesKey),
    prisma.blog_comment.count({ where: { file_id: id } }),
  ])

  const res = {
    looked: looked || false,
    looks: looks || 0,
    liked: liked || false,
    likes: likes || 0,
    comments,
  }

  return res
}
