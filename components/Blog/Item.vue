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
  <div class="w-full flex flex-col gap-2 rounded-0 hover:bg-op-3 bg-hover-common-trans">
    <div class="w-full flex gap-2 p-4">
      <NuxtImg
        src="/me.png"
        alt="Avatar"
        :quality="10"
        class="h-8 w-8 rounded-full"
      />
      <div flex-1>
        <p class="flex items-center gap-2 text-sm font-semibold">
          <span>{{ blobItem.title }}</span>
          <span class="text-12px text-gray">{{ '@Yuhang_zhang' }} · {{ dayjs(blobItem.publishAt).fromNow() }}</span>
        </p>
        <p class="mt-2 text-sm">
          {{ blobItem?.description }}
        </p>

        <NuxtImg :quality="60" mt-2 h-auto w-full rounded-15px shadow-md :src="`/blog/${blobItem?.image}`" />
        <BlogItemFooter
          :id="blobItem.path.replaceAll('/', '_')"
          :reading-time="blobItem.readingTime || 0"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
