<script lang='ts' setup>
import type { ContentCollectionItem } from '@nuxt/content'
import type { BlogMeta } from '~/types/blog'

interface Props {
  blobItem: ContentCollectionItem
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
  <div>
    <!-- TODO: 添加数据 -->
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 p-4">
        <img
          src="/public/me.png"
          alt="Avatar"
          class="h-8 w-8 rounded-full"
        >
        <div>
          <p class="flex items-center gap-2 text-sm font-semibold">
            <span>{{ 'YuhangZhang' }}</span>
            <span class="text-12px text-gray">{{ '@yuhang_zhang' }} · {{ '3分钟前' }}</span>
          </p>
          <p class="mt-2 text-sm">
            {{ blobItem?.title }}
          </p>

          <img mt-2 h-auto w-full rounded-15px :src="getImageUrl(meta?.image)">

          <BlogItemFooter
            :meta="meta"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
