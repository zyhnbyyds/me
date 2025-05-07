export interface BlogMeta {
  title: string
  description: string
  image?: string
  publishedAt: string
  updatedAt?: string
  tags?: string[]
}

export interface BlogOps {
  looked: boolean
  views: number
  liked: boolean
  likes: number
  comments: number
}
