<script lang='ts' setup>
import type { BlogOps } from '~/types/blog'

const props = defineProps<{
  id: string
  readingTime: number
}>()

const { $api } = useNuxtApp()

const { data: blogOps } = useAsyncData(`blogOps-${props.id}`, () => $api<BlogOps>('/api/blog/ops', {
  params: {
    id: props.id,
  },
}))

function _handleClickLike() {
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
  $api('/api/blog/like', {
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
  <div class="mt-5 flex items-center justify-between text-14px">
    <span v-if="props.readingTime >= 2" flex-col-center text-3 text-gray>
      <span class="i-carbon:alarm" text-4.6 />
      <span>
        {{ props.readingTime }}分钟
      </span>
    </span>
    <span v-else />

    <span flex items-center gap-5>
      <span class="flex-col-center gap-1 text-12px text-gray">
        <span class="i-mdi:tooltip-minus-outline" text-4 />
        <span>{{ blogOps?.comments }}</span>
      </span>
      <span class="flex-col-center gap-1 text-12px text-gray">
        <span class="i-mdi:eye-outline" text-4 />
        <span>{{ blogOps?.looks }}</span>
      </span>
    </span>
  </div>
</template>

<style scoped></style>
