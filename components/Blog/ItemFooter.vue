<script lang='ts' setup>
import type { BlogOps } from '~/types/blog'

const props = defineProps<{
  id: string
}>()

const blogOps = await $fetch<BlogOps>('/api/blog/ops', {
  params: {
    id: props.id,
  },
})

function handleClickLike() {
  if (blogOps?.liked) {
    blogOps.likes--
  }
  else {
    blogOps.likes++
  }
  blogOps.liked = !blogOps.liked
  $fetch('/api/blog/like', {
    method: 'post',
    body: {
      id: props.id,
      liked: blogOps.liked,
    },
  })
}
</script>

<template>
  <!-- 喜欢、评论、浏览 -->
  <div class="mt-2 flex items-center justify-end gap-5 text-14px">
    <span class="flex-col-center gap-1 text-12px text-gray">
      <Icon name="mdi:tooltip-minus-outline" text-4 />
      <span>{{ blogOps?.comments }}</span>
    </span>
    <span class="flex-col-center gap-1 text-gray">
      <Icon text-4 :name=" blogOps?.liked ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'" :class="blogOps?.liked ? 'text-red' : ''" @click.stop="handleClickLike" />
      <span>{{ blogOps?.likes }}</span>
    </span>
    <span class="flex-col-center gap-1 text-12px text-gray">
      <Icon name="mdi:eye-outline" text-4 />
      <span>{{ blogOps?.looks }}</span>
    </span>
  </div>
</template>

<style scoped></style>
