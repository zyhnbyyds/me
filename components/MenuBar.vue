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
  <ul class="font-twitter">
    <li v-for="item in list" :key="item.path" class="w-a" @click="handleMenuChange(item.path)">
      <div
        :to="item.path" class="mb-3 w-a inline-flex cursor-pointer items-center p-2 text-5 bg-hover-common-trans"
        :class="item.path === active ? 'font-bold' : ''"
      >
        <div class="h-8 w-8 flex-center text-8 font-bold">
          <Icon v-show="item.path === active" :name="item.aIcon" />
          <Icon v-show="item.path !== active" :name="item.icon" />
        </div>
        <span :class="{ hidden: isFold }" class="ml-5 mr-4 inline-block w-a overflow-hidden text-ellipsis text-nowrap <lg:hidden">
          {{ item.title }}
        </span>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.font-twitter {
  font-family:
    TwitterChirp,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
}
</style>
