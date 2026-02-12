import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export async function getOps(event: H3Event, id: string, userId?: number) {
  const storage = useStorage('me')
  const client = await serverSupabaseClient(event)

  const likedKey = `liked:${userId}:${id}`
  const likesKey = `likes:${id}`

  const [looked, looks, liked, likes, countResult] = await Promise.all([
    storage.getItem<boolean>(`looked:${id}`),
    storage.getItem<number>(`looks:${id}`),
    userId ? storage.getItem<boolean>(likedKey) : false,
    storage.getItem<number>(likesKey),
    client.from('blog_comment').select('*', { count: 'exact', head: true }).eq('file_id', id),
  ])

  const comments = countResult?.count ?? 0

  const res = {
    looked: looked || false,
    looks: looks || 0,
    liked: liked || false,
    likes: likes || 0,
    comments,
  }

  return res
}
