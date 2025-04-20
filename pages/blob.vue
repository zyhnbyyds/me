<script lang='ts' setup>
const { data: blobs } = await useAsyncData(() => queryCollection('content').limit(10).all())

useSeoMeta({
  title: '博客列表',
  description: '博客',
})

definePageMeta({
  path: '/',
})
</script>

<template>
  <NContentList :list="blobs" />
</template>

<style scoped></style>
