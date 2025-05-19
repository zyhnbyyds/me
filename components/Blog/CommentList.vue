<script setup lang="ts">
import type Comment from './Comment.vue'
import type { ReplyCommentItem } from '~/types/blog'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

defineProps<{
  comments: ReplyCommentItem[]
}>()

const emits = defineEmits<{
  (e: 'reply', comment: ReplyCommentItem): void
  (e: 'send', text: EmojiInfo[], comment: ReplyCommentItem): void
}>()

const replyContent = ref('')
const commentsIptRefList = ref<InstanceType<typeof Comment>[]>()

const [loading] = useToggle(false)

function formatDate(timestamp: string) {
  dayjs.extend(relativeTime)
  dayjs.locale('zh-cn')
  return dayjs(new Date(Number(timestamp))).fromNow().replaceAll(' ', '')
}

function hdClickReply(comment: ReplyCommentItem, isReply = false) {
  replyContent.value = ''
  emits('reply', comment)
  nextTick(() => {
    if (commentsIptRefList.value && toValue(commentsIptRefList.value)[0]) {
      toValue(commentsIptRefList.value)[0].focus()
    }
  })
}

function handleSend(text: EmojiInfo[], comment: ReplyCommentItem) {
  if (replyContent.value) {
    emits('send', text, comment)
  }
}
</script>

<template>
  <div>
    <div v-for="(comment, i) in comments" :key="i" class="group">
      <div relative flex rounded-2 p-2 pb-0 text-3.5 transition-all hover:bg-light2>
        <UAvatar :src="comment.fromUser.avatar_url" />
        <div ml-2 w-full>
          <div>
            <span mr-1 font-bold>{{ comment.fromUser.name }}</span>
            <span class="text-[#536471] text-op-80">
              <span>@{{ comment.fromUser.login }}</span>
              <span> · </span>
              <span text-3>{{ formatDate(comment.timestamp) }}</span>
            </span>
            <span
              float-end flex-col-center inline-flex
              text-3 text-gray-4
            >
              <Icon mr-2px name="material-symbols:location-on-outline" />
              <span>
                {{ comment.fromUser.location }}
              </span>
            </span>
          </div>
          <div mt-2 break-all text-3.5 text-dark-6>
            <span v-for="(item, idx) in comment.content" :key="`${idx}item`">
              <img v-if="item.type === 'emoji'" :src="`/emojis/${item.value}`" class="emoji-sm">
              <span v-else>{{ item.value }}</span>
            </span>
          </div>

          <footer flex items-start py-2>
            <span mr-2 flex-col-center :class="comment.isClickReply ? 'text-blue-5' : 'text-[#536471]'" inline-flex flex-nowrap cursor-pointer select-none rounded-md px-1.2 py-0.7 transition-all hover:bg-light-5 @click="hdClickReply(comment)">
              <Icon mr1 name="carbon:add-comment" text-4 text-op-80 />
              <span text-3>回复</span>
            </span>
          </footer>
          <BlogComment v-if="comment.isClickReply" ref="commentsIptRefList" v-model="replyContent" flex-1 :loading="loading" @send="handleSend($event, comment)" />

          <div v-if="comment.replyList && comment.replyList.length > 0" mt-2>
            <CommentList :comments="comment.replyList ?? []" @reply="(comment) => hdClickReply(comment, true)" @send="handleSend" />
          </div>
        </div>
      </div>

      <USeparator my-2 />
    </div>
  </div>
</template>

<style scoped>
.emoji-sm {
  display: inline-block;
  width: 20px;
  height: 20px;
}
</style>
