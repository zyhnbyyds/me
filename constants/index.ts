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

// 主页、探索、通知、个人资料
export const menuList: MenuBarItem[] = [
  {
    title: '主页',
    icon: 'material-symbols:home-outline-rounded',
    aIcon: 'material-symbols:home-rounded',
    path: '/',
    key: 'home',
  },
  {
    title: '探索',
    icon: 'material-symbols:search-rounded',
    aIcon: 'material-symbols:search-rounded',
    path: '/explore',
    key: 'explore',
  },
  {
    title: '通知',
    icon: 'material-symbols:notifications-outline-rounded',
    path: '/notifications',
    aIcon: 'material-symbols:notifications-rounded',
    key: 'notifications',
  },
  {
    title: '个人资料',
    icon: 'material-symbols:person',
    aIcon: 'material-symbols:person-rounded',
    path: '/profile',
    key: 'profile',
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
    value: 'follow',
  },
]
