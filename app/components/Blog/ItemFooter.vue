<script lang='ts' setup>
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
  <div class="text-14px mt-5 flex items-center justify-between">
    <span v-if="props.readingTime >= 2" text-3 text-gray flex-col-center>
      <Icon name="carbon:alarm" text-4.6 />
      <span>
        {{ props.readingTime }}分钟
      </span>
    </span>
    <span v-else />

    <span flex gap-5 items-center>
      <span class="text-12px text-gray flex-col-center gap-1">
        <Icon name="mdi:tooltip-minus-outline" text-4.6 />
        <span>{{ blogOps?.comments }}</span>
      </span>
      <span class="text-12px text-gray flex-col-center gap-1">
        <Icon name="mdi:eye-outline" text-4.6 />
        <span>{{ blogOps?.looks }}</span>
      </span>
    </span>
  </div>
</template>

<style scoped></style>
