<script lang='ts' setup>
import type { BlogCollectionItem } from '@nuxt/content'

export type ContentExclude = Pick<BlogCollectionItem, 'id' | 'path' | 'title' | 'description' | 'meta' | 'navigation'>

definePageMeta({
  title: '搜索',
  description: '搜索博客内容',
})

const searchIpt = ref('')
const searchList = ref<ContentExclude[]>([])

async function searchFn() {
  searchList.value = await queryCollection('blog').orWhere(
    q => q.where('title', 'LIKE', `%${searchIpt.value}%`)
      .where('description', 'LIKE', `%${searchIpt.value}%`),
  ).select('meta', 'path', 'description', 'title', 'id', 'navigation').limit(10).all()
}

watchEffect(() => {
  if (searchIpt.value) {
    searchFn()
  }
  else {
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
