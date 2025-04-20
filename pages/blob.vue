<script lang='ts' setup>
import { homeTabList } from '~/constants'

const { data: blobs } = await useAsyncData(() => queryCollection('content').limit(10).all())

useSeoMeta({
  title: '博客列表',
  description: '博客',
})

definePageMeta({
  path: '/',
})

const activeTab = ref(homeTabList[0].value)
</script>

<template>
  <div>
    <Tab v-model="activeTab" :list="homeTabList" />
    <NContentList :list="blobs" />
  </div>
</template>

<style scoped></style>
