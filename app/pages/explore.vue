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
}

watchEffect(() => {
  if (searchIpt.value) {
    searchFn()
  } else {
    searchList.value = []
  }
})

const router = useRouter()

function goToItem(item: SearchResItem) {
  router.push(item.path)
}
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
        dark:bg-dark-500
        class="outline-1 outline-light-900 outline-solid transition-colors focus:outline-2 dark:outline-dark-500 focus:outline-blue"
        placeholder="搜索"
      />
      <div flex-center h-5 w-5 left-3 absolute class="top-1/2 -translate-y-50%">
        <Icon name="material-symbols:search" text-5 />
      </div>
    </div>

    <!-- 结果列表：直接展示在页面下方 -->
    <div
      class="mt-4 h-[calc(100vh-100px)] rounded-lg w-full overflow-hidden backdrop-blur-lg dark:bg-dark-500/60"
    >
      <ul v-show="searchList.length > 0" class="h-full overflow-y-auto">
        <li
          v-for="item in searchList"
          :key="item.id"
          text-3.5
          lh-40px
          px-4
          border-b
          border-common
          bg-transparent
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
          hover:bg-light-200
          dark:hover:bg-dark-300
          @click="goToItem(item)"
        >
          {{ item.keyword }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
