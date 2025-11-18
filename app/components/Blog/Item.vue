<script lang='ts' setup>
import type { BlogCollectionItem } from '@nuxt/content'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

defineProps<Props>()
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

interface Props {
  blobItem: BlogCollectionItem
}
</script>

<template>
  <!-- TODO: 添加数据 -->
  <div class="flex flex-col gap-2 w-full">
    <NuxtImg :quality="60" rounded-5 w-full object-contain class="border-1 border-common" :src="`/blog/${blobItem?.image}`" />
    <div px-2>
      <p class="text-sm">
        <span>{{ blobItem.title }}</span>
      </p>
      <span class="text-12px text-gray">{{ dayjs(blobItem.publishAt).fromNow() }}</span>
    </div>
  </div>
</template>

<style scoped></style>
