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
  parentId: string
  depth: number
  replyList: CommentItem[]
}

export interface ReplyCommentItem extends CommentItem {
  isClickReply: boolean
  replyList: ReplyCommentItem[]
}

export type PostCommentBody = Pick<CommentItem, 'fromUserId' | 'toUserId' | 'parentId' | 'depth'> & {
  id: string
  comment: EmojiInfo[]
}

export interface ContentMeta {
  title: string
  description: string
  image?: string
  publishAt: string
  updateAt?: string
  tags?: string[]
}
