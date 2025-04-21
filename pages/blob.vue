<script lang='ts' setup>
import { homeTabList } from '~/constants'

const { data: blobs } = await useAsyncData(() => queryCollection('content').limit(10).all())

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
  <Tab v-model="activeTab" blur-common sticky top-0 w-full :list="homeTabList" />
  <ClientOnly>
    <NContentList :list="blobs" />
  </ClientOnly>
</template>

<style scoped></style>
