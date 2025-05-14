<script lang='ts' setup>
import type { BlogOps } from '~/types/blog'

const props = defineProps<{
  id: string
}>()

const { data: blogOps } = useAsyncData(`blogOps-${props.id}`, () => $fetch<BlogOps>('/api/blog/ops', {
  params: {
    id: props.id,
  },
}))

function handleClickLike() {
  if (!blogOps.value) {
    return
  }
  if (blogOps.value?.liked) {
    blogOps.value.likes--
  }
  else {
    blogOps.value.likes++
  }
  blogOps.value.liked = !blogOps.value.liked
  $fetch('/api/blog/like', {
    method: 'post',
    body: {
      id: props.id,
      isLiked: blogOps.value.liked,
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
    <span class="flex-col-center gap-1 text-gray" @click.stop="handleClickLike">
      <Icon text-4 :name="blogOps?.liked ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'" :class="blogOps?.liked ? 'text-red' : ''" />
      <span>{{ blogOps?.likes }}</span>
    </span>
    <span class="flex-col-center gap-1 text-12px text-gray">
      <Icon name="mdi:eye-outline" text-4 />
      <span>{{ blogOps?.looks }}</span>
    </span>
  </div>
</template>

<style scoped></style>
