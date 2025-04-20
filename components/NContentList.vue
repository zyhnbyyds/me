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
    <li v-for="blobItem in (list ?? [])" :key="blobItem.id" cursor-pointer hover="text-red">
      <NuxtLink :to="blobItem.path" class="text-16px">
        {{ blobItem.title }}{{ blobItem.path }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped></style>
