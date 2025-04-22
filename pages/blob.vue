<script lang='ts' setup>
import { homeTabList } from '~/constants'

const limit = ref(10)

// 一次性加载所有content
const { data: blobs } = await useAsyncData('content', () => {
  return queryCollection('content').limit(limit.value).all()
})

useSeoMeta({
  title: 'yuhangzhang的博客列表',
  description: '博客',
})

definePageMeta({
  path: '/',
})

const activeTab = ref(homeTabList[0].value)
</script>

<template>
  <Tab v-model="activeTab" sticky top-0 w-full blur-common :list="homeTabList" />
  <ClientOnly>
    <NContentList :list="blobs" />
  </ClientOnly>
</template>

<style scoped></style>
