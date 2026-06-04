export interface EssayItem {
  id: string
  content: string | null
  images: string[] | null
  createdAt: string
  updatedAt: string
}

export interface CreateEssayBody {
  content?: string
  images?: string[]
}
