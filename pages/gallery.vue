<script lang='ts' setup>
import type { BucketItem } from 'minio'

const { $api } = useNuxtApp()

const { data } = useAsyncData('gallery', async () => {
  return await $api<BucketItem[]>('/api/gallery/list')
}, { default: () => [] })
</script>

<template>
  <!--
    TODO: 完善相册
    1. 添加图片预览
    2. 瀑布流
    3. 视频播放
    4. 无缝展示
    5. 远程存储
    -->
  <div>
    <CHead title="相册" />
    <div flex flex-wrap>
      <NuxtImg
        v-for="(item, index) in data"
        :key="index"
        class="h-50"
        height="200"
        width="200"
        format="webp"
        :quality="20"
        :src="item.name"
        fit="contain"
        provider="minio"
      />
    </div>
  </div>
</template>

<style scoped></style>
