<script lang='ts' setup>
export interface MenuBarItem {
  title: string
  /** 未激活 */
  icon: string
  /** 激活 */
  aIcon: string
  path: string
  isLink?: boolean
  key: string
}

interface Props {
  list: MenuBarItem[]
  isFold?: boolean
}
const { isFold = false } = defineProps<Props>()

const active = computed(() => {
  if (!import.meta.client)
    return '/'
  const { path } = useRoute()
  const splits = path.split('/')
  if (splits[1] === 'blog') {
    return '/'
  }
  return `/${splits[1]}` || '/'
})

function handleMenuChange(path: string) {
  useRouter().push(path)
}
</script>

<template>
  <ul>
    <li v-for="item in list" :key="item.path" class="w-a" @click="handleMenuChange(item.path)">
      <div
        :to="item.path" class="text-5 mb-3 p-2 bg-hover-common-trans inline-flex w-a cursor-pointer items-center"
        :class="item.path === active ? 'font-bold' : ''"
      >
        <div class="text-7 font-bold flex-center h-8 w-8">
          <Icon v-show="item.path === active" :name="item.aIcon" />
          <Icon v-show="item.path !== active" :name="item.icon" />
        </div>
        <span :class="{ hidden: isFold }" class="ml-5 mr-4 w-a inline-block text-nowrap text-ellipsis overflow-hidden <lg:hidden">
          {{ item.title }}
        </span>
      </div>
    </li>
  </ul>
</template>

<style scoped>
</style>
