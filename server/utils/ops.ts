export async function getOps(id: string) {
  const storage = useStorage('me')
  const [looked, looks, liked, likes, comments] = await Promise.all([
    storage.getItem<boolean>(`looked:${id}`),
    storage.getItem<number>(`looks:${id}`),
    storage.getItem<boolean>(`liked:${id}`),
    storage.getItem<number>(`likes:${id}`),
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
