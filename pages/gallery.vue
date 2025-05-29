<script lang='ts' setup>
import type { BucketItem } from 'minio'

const { $api } = useNuxtApp()

const { data, status } = useAsyncData('gallery', async () => {
  return await $api<BucketItem[]>('/api/gallery/list')
}, { default: () => [] })

const isPreviewing = inject<Ref<boolean>>('previewVisible', ref(false))
const activeName = ref<string | null>(null)

function hdPreviewImg(name?: string) {
  if (!name) {
    isPreviewing.value = false
    activeName.value = null
    return
  }

  isPreviewing.value = true
  activeName.value = name
}
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
    <div v-if="status === 'success'" columns-3 gap-x-2>
      <PreviewImg
        v-for="(item, index) in data"
        :key="index"
        :name="item.name"
        :active="activeName === item.name"
        @click="hdPreviewImg(item.name)"
      />
    </div>

    <div v-if="status === 'pending'" pt-20 text-center class="font-italic">
      Loading...
    </div>
  </div>
</template>

<style scoped></style>
