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
