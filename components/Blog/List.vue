<script lang='ts' setup>
import type { ContentCollectionItem } from '@nuxt/content'

export interface Props {
  list: ContentCollectionItem[] | null
}

defineOptions({
  name: 'NContentList',
})

defineProps<Props>()

const { push } = useRouter()

async function goToBolgInfo(blobItem: ContentCollectionItem) {
  push(blobItem.path)
  await $fetch('/api/blog/look', { method: 'post', body: blobItem })
}
</script>

<template>
  <ul>
    <li v-for="blobItem in (list ?? [])" :key="blobItem.id" class="border-b-0.5px border-common" cursor-pointer>
      <div @click="goToBolgInfo(blobItem)">
        <BlogItem :blob-item="blobItem" />
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
