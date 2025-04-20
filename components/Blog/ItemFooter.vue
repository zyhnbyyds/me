<script lang='ts' setup>
import type { BlogMeta } from '~/types/blog'

defineProps<{
  meta?: BlogMeta
}>()
</script>

<template>
  <!-- 喜欢、评论、浏览 -->
  <div class="mt-2 flex items-center justify-end gap-5 text-14px">
    <span class="flex-col-center gap-1 text-12px text-gray">
      <Icon name="mdi:tooltip-minus-outline" text-4 />
      <span>{{ meta?.comments }}</span>
    </span>
    <span class="flex-col-center gap-1 text-gray">
      <Icon text-4 :name=" meta?.liked ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'" :class="meta?.liked ? 'text-red' : ''" />
      <span>{{ meta?.likes }}</span>
    </span>
    <span class="flex-col-center gap-1 text-12px text-gray">
      <Icon name="mdi:eye-outline" text-4 />
      <span>{{ meta?.views }}</span>
    </span>
  </div>
</template>

<style scoped></style>
