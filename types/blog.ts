import type { User } from '#auth-utils'

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
  looks: number
  liked: boolean
  likes: number
  comments: number
}

export interface CommentItem {
  type: string
  fileId: string
  fromUserId: string
  toUserId: string
  commentId: string
  timestamp: string
  content: EmojiInfo[]
  fromUser: User
  toUser: User | null
}
