export async function getOps(id: string, userId?: number) {
  const storage = useStorage('me')

  const likedKey = `liked:${userId}:${id}`
  const likesKey = `likes:${id}`

  const [looked, looks, liked, likes, comments] = await Promise.all([
    storage.getItem<boolean>(`looked:${id}`),
    storage.getItem<number>(`looks:${id}`),
    userId ? storage.getItem<boolean>(likedKey) : false,
    storage.getItem<number>(likesKey),
    storage.getItem<number>(`comments:count:${id}`),
  ])

  const res = {
    looked: looked || false,
    looks: looks || 0,
    liked: liked || false,
    likes: likes || 0,
    comments: comments || 0,
  }

  return res
}
