import type qqList from '~/server/data/data.json'

export type QQContentItem = (typeof qqList)[number]

/**
 * qq空间说说
 */
// export interface QQContentItem {
//   certified: number
//   cmtnum: number
//   commentlist: Commentlist[]
//   conlist: any
//   content: string
//   createTime: string
//   created_time: number
//   editMask: number
//   fwdnum: number
//   has_more_con: number
//   isEditable: number
//   issigin: number
//   lastmodify: number
//   lbs: Lbs
//   name: string
//   pic: Pic[]
//   pic_template: string
//   pictotal: number
//   right: number
//   rt_sum: number
//   secret: number
//   source_appid: string
//   source_name: string
//   source_url: string
//   t1_source: number
//   t1_subtype: number
//   t1_termtype: number
//   tid: string
//   ugc_right: number
//   uin: number
//   wbid: number
// }

// export interface Commentlist {
//   IsPasswordLuckyMoneyCmtRight: string
//   abledel: number
//   content: string
//   createTime: string
//   createTime2: string
//   create_time: number
//   list_3: List3[]
//   name: string
//   private: number
//   reply_num: number
//   source_name: string
//   source_url: string
//   stored_extend_info: StoredExtendInfo2[]
//   t2_source: number
//   t2_subtype: number
//   t2_termtype: number
//   tid: number
//   uin: number
// }

// export interface List3 {
//   abledel: number
//   content: string
//   createTime: string
//   createTime2: string
//   create_time: number
//   name: string
//   source_name: string
//   source_url: string
//   stored_extend_info?: StoredExtendInfo[]
//   t3_source: number
//   t3_subtype: number
//   t3_termtype: number
//   tid: number
//   uin: number
// }

// export interface StoredExtendInfo {
//   k: string
//   v: string
// }

// export interface StoredExtendInfo2 {
//   k: string
//   v: string
// }

// export interface Lbs {
//   id: string
//   idname: string
//   name: string
//   pos_x: string
//   pos_y: string
// }

// export interface Pic {
//   absolute_position: number
//   b_height: number
//   b_width: number
//   curlikekey: string
//   height: number
//   pic_id: string
//   pictype: number
//   richsubtype: number
//   rtype: number
//   smallurl: string
//   unilikekey: string
//   url1: string
//   url2: string
//   url3: string
//   who: number
//   width: number
// }
