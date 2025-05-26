<script lang='ts' setup>
import type { BlogCollectionItem } from '@nuxt/content'

export interface Props {
  list: BlogCollectionItem[] | null
}

defineOptions({
  name: 'NContentList',
})

defineProps<Props>()

const { push } = useRouter()
const $api = useNuxtApp().$api

async function goToBlogInfo(blobItem: BlogCollectionItem) {
  push(blobItem.path)
  await $api('/api/blog/look', { method: 'post', body: blobItem })
}
</script>

<template>
  <ul>
    <li v-for="blobItem in (list ?? [])" :key="blobItem.id" class="border-b-0.5px border-common" cursor-pointer>
      <div @click="goToBlogInfo(blobItem)">
        <BlogItem :blob-item="blobItem" />
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
