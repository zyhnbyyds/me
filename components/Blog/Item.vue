<script lang='ts' setup>
import type { BlogCollectionItem } from '@nuxt/content'
import type { BlogMeta } from '~/types/blog'

interface Props {
  blobItem: BlogCollectionItem
}

const props = defineProps<Props>()

const meta = computed(() => {
  return props.blobItem.meta as unknown as BlogMeta
})

function getImageUrl(name?: string) {
  if (!name) {
    return ''
  }
  return new URL(`../../public/blog/${name}`, import.meta.url).href
}
</script>

<template>
  <!-- TODO: 添加数据 -->
  <div class="w-full flex flex-col gap-2 rounded-0 hover:bg-op-3 bg-hover-common">
    <div class="w-full flex gap-2 p-4">
      <img
        src="/public/me.png"
        alt="Avatar"
        class="h-8 w-8 rounded-full"
      >
      <div flex-1>
        <p class="flex items-center gap-2 text-sm font-semibold">
          <span>{{ blobItem.title }}</span>
          <span class="text-12px text-gray">{{ '@Yuhang_zhang' }} · {{ '3分钟前' }}</span>
        </p>
        <p class="mt-2 text-sm">
          {{ blobItem?.description }}
        </p>

        <img mt-2 h-auto w-full rounded-15px :src="getImageUrl(meta?.image)">

        <BlogItemFooter
          :id="blobItem.path.replaceAll('/', '_')"
          :reading-time="blobItem.readingTime || 0"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
