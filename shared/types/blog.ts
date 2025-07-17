export interface EmojiInfo {
  type: 'emoji' | 'text'
  value: string
}

export interface GithubUser {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string | null
  hireable: boolean | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  email_verified?: boolean
}

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
  fromUser: GithubUser
  toUser?: GithubUser | null
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
