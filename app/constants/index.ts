import type { MenuBarItem } from '~/components/MenuBar.vue'
import type { TabItem } from '~/components/Tab.vue'

export const appName = 'NuxtBase'
export const appDescription = 'NuxtBase'

export const me = {
  name: 'YuhangZhang',
  description: '前端开发者',
  email: '19939926438@163.com',
  github: 'https://github.com/zyhnbyyds',
}

export interface SocialLink {
  name: string
  icon: string
  /** 交互类型：link=跳转链接, qrcode=二维码弹窗, copy=复制到剪贴板 */
  action: 'link' | 'qrcode' | 'copy'
  /** link 类型：跳转 URL */
  url?: string
  /** qrcode 类型：二维码图片路径 */
  qrcode?: string
  /** copy 类型：复制的内容 */
  copyText?: string
}

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    icon: 'ri:github-fill',
    action: 'link',
    url: 'https://github.com/zyhnbyyds',
  },
  {
    name: 'QQ',
    icon: 'ri:qq-fill',
    action: 'qrcode',
    qrcode: '/social/qq-qrcode.png',
  },
  {
    name: '微信',
    icon: 'ri:wechat-fill',
    action: 'qrcode',
    qrcode: '/social/wechat-qrcode.png',
  },
  {
    name: '推特',
    icon: 'ri:twitter-x-fill',
    action: 'link',
    url: 'https://x.com/',
  },
  {
    name: '抖音',
    icon: 'ri:tiktok-fill',
    action: 'link',
    url: 'https://www.douyin.com/',
  },
  {
    name: '邮箱',
    icon: 'ri:mail-fill',
    action: 'copy',
    copyText: '19939926438@163.com',
  },
]

export const appVersion = '1.0.0'

export const menuList: MenuBarItem[] = [
  {
    title: '主页',
    icon: 'home',
    aIcon: 'home',
    path: '/',
    key: 'home',
    isSvg: true,
  },
  {
    title: '日历',
    icon: 'calendar',
    aIcon: 'calendar',
    path: '/calendar',
    key: 'calendar',
    isSvg: true,
  },
  {
    title: '探索',
    icon: 'explore',
    aIcon: 'explore',
    path: '/explore',
    key: 'explore',
    isSvg: true,
  },
  {
    title: 'QQ空间',
    icon: 'qq',
    aIcon: 'qq',
    path: '/qq',
    key: 'qq',
    isSvg: true,
  },
  {
    title: '随笔',
    icon: 'essay',
    aIcon: 'essay',
    path: '/essay',
    key: 'essay',
    isSvg: true,
  },
  {
    title: '音乐',
    icon: 'music',
    aIcon: 'music',
    path: '/music',
    key: 'music',
    isSvg: true,
  },
]

export const appIcon = '/favicon.ico'

export const homeTabList: TabItem[] = [
  {
    label: '推荐',
    value: 'recommend',
  },
  {
    label: '最新',
    value: 'newest',
  },
  {
    label: '动态',
    value: 'qq',
  },
]
