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
    icon: 'material-symbols:home-outline-rounded',
    aIcon: 'material-symbols:home-rounded',
    path: '/',
    key: 'home',
  },
  {
    title: '日历',
    icon: 'material-symbols:calendar-month-outline-sharp',
    aIcon: 'material-symbols:calendar-month-sharp',
    path: '/calendar',
    key: 'calendar',
  },
  {
    title: '探索',
    icon: 'material-symbols:search-rounded',
    aIcon: 'material-symbols:search-rounded',
    path: '/explore',
    key: 'explore',
  },
  {
    title: 'QQ空间',
    icon: 'mingcute:qq-line',
    aIcon: 'mingcute:qq-fill',
    path: '/qq',
    key: 'qq',
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
