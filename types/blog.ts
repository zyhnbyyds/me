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
  fromUserId: number
  toUserId: number
  commentId: string
  timestamp: number
  content: EmojiInfo[]
  fromUser: User
  toUser?: User | null
  toCommentId?: string | null
  depth: number
  replyList: ReplyCommentItem[]
}

export interface ReplyCommentItem extends CommentItem {
  isClickReply: boolean
}

export type PostCommentBody = Pick<CommentItem, 'fromUserId' | 'toUserId' | 'commentId' | 'depth'> & {
  id: string
  comment: EmojiInfo[]
}
