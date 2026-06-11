export interface EssayImageMedia {
  type: 'image'
  image: string
}

export interface EssayLiveMedia {
  type: 'live'
  image: string
  video: string
}

export type EssayMedia = string | EssayImageMedia | EssayLiveMedia

export interface EssayItem {
  id: string
  content: string | null
  images: EssayMedia[] | null
  createdAt: string
  updatedAt: string
}

export interface CreateEssayBody {
  content?: string
  images?: EssayMedia[]
}
