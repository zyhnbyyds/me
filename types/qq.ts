/**
 * qq空间说说
 */
export interface QQContentItem {
  cmtnum: number
  commentlist: QQContentComment[] | null
  content: string
  createTime: string
  created_time: number
  source_name?: string
  editMask: number
  isEditable: number
  issigin: number
  lastmodify: number
  name: string
  pic?: Pic[] | null
  tid: string
  uin?: number | null
  video?: any[] | null
}

export interface QQContentComment {
  content: string
  createTime: string
  list_3: List3[]
  name: string
  private: number
  reply_num: number
  source_name: string
  source_url: string
  tid: number
}

export interface List3 {
  content: string
  createTime: string
  name: string
  tid: number
}

export interface Pic {
  absolute_position: number
  b_height: number
  b_width: number
  curlikekey: string
  height: number
  pic_id: string
  pictype: number
  richsubtype: number
  rtype: number
  smallurl: string
  unilikekey: string
  url1: string
  url2: string
  url3: string
  who: number
  width: number
}
