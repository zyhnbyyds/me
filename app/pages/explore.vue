<script lang="ts" setup>
export interface SearchResItem {
  keyword: string
  id: string
  source: 'blog' | 'qq'
  path: string
}

definePageMeta({
  title: '搜索',
  description: '搜索博客内容',
})

const searchIpt = ref('')
const searchList = ref<SearchResItem[]>([])
const activeIndex = ref(-1)

async function searchFn() {
  const { data } = await $fetch<Result<SearchResItem[]>>(
    '/api/search/homeSearch',
    {
      method: 'POST',
      body: {
        keyword: searchIpt.value,
      },
    },
  )

  searchList.value = data ?? []
  activeIndex.value = -1
}

watchEffect(() => {
  if (searchIpt.value) {
    searchFn()
  } else {
    searchList.value = []
    activeIndex.value = -1
  }
})

const router = useRouter()

function goToItem(item: SearchResItem) {
  router.push(item.path)
}

// 键盘上下选择选项
function onKeydown(e: KeyboardEvent) {
  const len = searchList.value.length
  if (len === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % len
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + len) % len
  } else if (e.key === 'Enter') {
    if (activeIndex.value >= 0 && activeIndex.value < len) {
      e.preventDefault()
      const item = searchList.value[activeIndex.value]
      if (item) goToItem(item)
    }
  }
}

// 滚动到当前选中项
const listEl = ref<HTMLElement>()
watch(activeIndex, (index) => {
  if (index < 0 || !listEl.value) return
  const item = listEl.value.children[index] as HTMLElement | undefined
  item?.scrollIntoView({ block: 'nearest' })
})
</script>

<template>
  <div class="px-5 py-4">
    <!-- 搜索框 -->
    <div class="relative h-10">
      <input
        v-model="searchIpt"
        type="text"
        px-5
        pl-10
        rounded-full
        h-10
        w-full
        dark:text-white
        dark:bg-c-surface
        class="outline-1 outline-light-900 outline-solid transition-colors focus:outline-2 dark:outline-dark-500 focus:outline-blue"
        placeholder="搜索"
        @keydown="onKeydown"
      />
      <div flex-center h-5 w-5 left-3 absolute class="top-1/2 -translate-y-50%">
        <Icon name="material-symbols:search" text-5 />
      </div>
    </div>

    <!-- 结果列表：直接展示在页面下方 -->
    <div
      class="mt-4 h-[calc(100vh-100px)] rounded-lg w-full overflow-hidden backdrop-blur-lg dark:bg-c-surface/60"
    >
      <ul v-show="searchList.length > 0" ref="listEl" class="h-full overflow-y-auto">
        <li
          v-for="(item, index) in searchList"
          :key="item.id"
          text-3.5
          lh-40px
          px-4
          border-b
          border-common
          rounded-0
          border-dashed
          h-40px
          w-full
          cursor-pointer
          text-left
          text-nowrap
          text-ellipsis
          overflow-hidden
          hover:text-black
          hover:bg-c-hover
          dark:hover:bg-c-hover
          :class="index === activeIndex ? 'bg-c-accent/25 text-c-accent dark:bg-c-accent/30 dark:text-c-accent' : ''"
          @click="goToItem(item)"
          @mouseenter="activeIndex = index"
        >
          {{ item.keyword }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
