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

async function goToBlogInfo(blobItem: BlogCollectionItem) {
  push(blobItem.path)
  await $fetch('/api/blog/look', { method: 'post', body: blobItem })
}
</script>

<template>
  <div class="p-4 min-h-[calc(100vh-50px)]">
    <ul gap-4 grid grid-cols-3 class="<lg:grid-cols-2 <md:grid-cols-1">
      <li v-for="blobItem in (list ?? [])" :key="blobItem.id" cursor-pointer>
        <div @click="goToBlogInfo(blobItem)">
          <BlogItem :blob-item="blobItem" />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
