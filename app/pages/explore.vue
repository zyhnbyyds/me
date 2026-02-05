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
  const { data } = await $fetch<Result<SearchResItem[]>>('/api/search/homeSearch', {
    method: 'POST',
    body: {
      keyword: searchIpt.value,
    },
  })

  searchList.value = data ?? []
}

watchEffect(() => {
  if (searchIpt.value) {
    searchFn()
  } else {
    searchList.value = []
  }
})
</script>

<template>
  <header class="px-5 py-4">
    <SearchIpt v-model="searchIpt" :list="searchList" placeholder="搜索" />
  </header>
</template>

<style scoped></style>
