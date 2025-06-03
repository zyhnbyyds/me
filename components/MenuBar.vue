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
}

defineProps<Props>()

const active = computed(() => {
  return useRoute().path.split('/')[1] || '/'
})

function handleMenuChange(path: string) {
  useRouter().push(path)
}
</script>

<template>
  <ul class="font-twitter">
    <li v-for="item in list" :key="item.key" class="w-a" @click="handleMenuChange(item.path)">
      <div
        :to="item.path" class="mb-3 w-a inline-flex cursor-pointer items-center p-2 text-5 bg-hover-common-trans"
        :class="item.key === active ? 'font-bold' : ''"
      >
        <div class="h-8 w-8 flex-center text-8 font-bold">
          <Icon v-show="item.key === active" :name="item.aIcon" />
          <Icon v-show="item.key !== active" :name="item.icon" />
        </div>
        <span class="ml-5 mr-4 inline-block w-a overflow-hidden text-ellipsis text-nowrap <lg:hidden">
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
