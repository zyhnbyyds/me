<script lang='ts' setup>
import type { ContentCollectionItem } from '@nuxt/content'

export interface Props {
  list: ContentCollectionItem[] | null
}

defineOptions({
  name: 'NContentList',
})

defineProps<Props>()
</script>

<template>
  <ul>
    <li v-for="blobItem in (list ?? [])" :key="blobItem.id" class="border-b-0.5px border-gray-300 dark:border-dark-500" cursor-pointer>
      <NuxtLink :to="blobItem.path">
        <BlogItem :blob-item="blobItem" />
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped></style>
