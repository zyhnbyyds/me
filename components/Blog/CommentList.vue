<script setup lang="ts">
import type { CommentItem } from '~/types/blog'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

defineProps<{
  comments: CommentItem[]
}>()

function formatDate(timestamp: string) {
  dayjs.extend(relativeTime)
  dayjs.locale('zh-cn')
  return dayjs(new Date(Number(timestamp))).fromNow().replaceAll(' ', '')
}
</script>

<template>
  <div>
    <div v-for="(comment, i) in comments" :key="i">
      <div flex rounded-2 p-2 pb-0 text-3.5 transition-all hover:bg-light2>
        <UAvatar :src="comment.fromUser.avatar_url" />
        <div ml-2 w-full>
          <div>
            <span mr-1 font-bold>{{ comment.fromUser.name }}</span>
            <span class="text-[#536471] text-op-80">
              <span>@{{ comment.fromUser.login }}</span>
              <span> · </span>
              <span text-3>{{ formatDate(comment.timestamp) }}</span>
            </span>
            <span float-end text-3 text-gray-4>
              {{ comment.fromUser.location }}
            </span>
          </div>
          <div flex break-all text-4 text-dark-8>
            <div v-for="(item, i) in comment.content" :key="i">
              <img v-if="item.type === 'emoji'" :src="`/emojis/${item.value}`" class="emoji-sm">
              <span v-else>{{ item.value }}</span>
            </div>
          </div>

          <footer h-8 flex flex-col-center justify-between>
            <Icon name="carbon:add-comment" text-4 class="text-[#536471]" text-op-80 />
          </footer>
        </div>
      </div>

      <USeparator my-2 />
    </div>
  </div>
</template>

<style scoped>
.emoji-sm {
  width: 20px;
  height: 20px;
}
</style>
