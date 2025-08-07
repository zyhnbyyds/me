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
  <div class="bg-hover-common-trans rounded-0 flex flex-col gap-2 w-full hover:bg-op-30">
    <div class="p-4 flex gap-2 w-full">
      <NuxtImg
        src="/me.png"
        alt="Avatar"
        :quality="10"
        class="rounded-full h-8 w-8"
      />
      <div flex-1>
        <p class="text-sm font-semibold flex gap-2 items-center">
          <span>{{ blobItem.title }}</span>
          <span class="text-12px text-gray">{{ '@Yuhang_zhang' }} · {{ dayjs(blobItem.publishAt).fromNow() }}</span>
        </p>
        <p class="text-sm mt-2">
          {{ blobItem?.description }}
        </p>

        <NuxtImg :quality="60" mt-2 rounded-15px max-h-500px w-full shadow-md object-cover :src="`/blog/${blobItem?.image}`" />
        <BlogItemFooter
          :id="blobItem.path.replaceAll('/', '_')"
          :reading-time="blobItem.readingTime || 0"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
