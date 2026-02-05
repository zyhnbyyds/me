<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'
import type Comment from './Comment.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

const props = defineProps<{
  blog?: BlogCollectionItem | null
}>()

const replyContent = ref('')
const comments = defineModel<ReplyCommentItem[]>('comments', { default: [] })
const loading = defineModel('loading', { default: false })
const commentsIptRefList = ref<InstanceType<typeof Comment>[]>()
const placeholder = ref('说点什么再走~')

const { loggedIn, user } = useUserSession()

function formatDate(timestamp: number) {
  dayjs.extend(relativeTime)
  dayjs.locale('zh-cn')
  return dayjs(new Date(timestamp)).fromNow().replaceAll(' ', '')
}

function hdClickReply(replay: ReplyCommentItem & { isClickReply: boolean }, isReply = false) {
  if (isReply) {
    placeholder.value = `回复${replay.fromUser.name}`
  }
  replyContent.value = ''
  comments.value = comments.value.map((item) => {
    if (item.commentId === replay.commentId) {
      if (replay.isClickReply) {
        item.isClickReply = false
      } else {
        item.isClickReply = true
      }
    }
    return item
  })

  nextTick(() => {
    if (commentsIptRefList.value && toValue(commentsIptRefList.value)[0]) {
      toValue(commentsIptRefList.value)[0]?.focus()
    }
  })
}

async function hdClickSend(val: EmojiInfo[], comment: ReplyCommentItem) {
  if (!props.blog || !loggedIn.value || !user.value || !replyContent.value) return
  comment.isClickReply = false
  const id = props.blog.path.replaceAll('/', '_')
  const body: PostCommentBody = {
    id,
    comment: val,
    fromUserId: user.value.id,
    toUserId: comment.fromUserId,
    depth: comment.depth + 1,
    parentId: comment.commentId,
  }
  loading.value = true
  const [flag, commentId] = await $fetch<[boolean, string]>('/api/blog/comment', {
    method: 'post',
    body,
  })
  if (!flag) return
  const toAddComment = {
    fileId: id,
    type: 'comment',
    fromUserId: user.value.id,
    toUserId: comment.fromUserId,
    timestamp: Date.now(),
    content: val,
    fromUser: user.value,
    toUser: comment.fromUser,
    parentId: comment?.commentId ?? '0',
    isClickReply: false,
    depth: comment.depth + 1,
    replyList: [],
    commentId,
  }
  comment.isClickReply = false
  if (comment.depth === 1) {
    comment.replyList = comment.replyList ? [...comment.replyList] : []
    comment.replyList.push(toAddComment)
  } else if (comment.depth >= 2) {
    comments.value.push(toAddComment)
  }

  loading.value = false
}
</script>

<template>
  <div>
    <div v-for="(comment, i) in comments" :key="i" class="group">
      <div
        text-3.2
        p-2
        pb-0
        rounded-2
        flex
        transition-all
        relative
        hover:bg-light200
        hover:dark:bg-dark-700
      >
        <img rounded-full h-5 w-5 :src="comment.fromUser.avatar_url" />
        <div ml-2 w-full>
          <div>
            <span font-bold mr-1
              >{{ comment.fromUser.name }}
              {{
                comment.depth === 1 ? '' : `回复 ${comment.toUser && comment.toUser.name} `
              }}</span
            >
            <span class="text-[#536471] text-op-80">
              <span v-if="comment.depth === 1">@{{ comment.fromUser.login }}</span>
              <span> · </span>
              <span text-3>{{ formatDate(comment.timestamp) }}</span>
            </span>
            <span text-3 text-gray-400 flex-col-center inline-flex float-end>
              <Icon name="material-symbols:location-on-outline" mr-2px />
              <span>
                {{ comment.fromUser.location }}
              </span>
            </span>
          </div>
          <div text-3.5 text-dark-600 mt-2 break-all dark:text-light600>
            <span v-for="(item, idx) in comment.content" :key="`${idx}item`">
              <img v-if="item.type === 'emoji'" :src="`/emojis/${item.value}`" class="emoji-sm" />
              <span v-else>{{ item.value }}</span>
            </span>
          </div>

          <footer py-2 flex items-start>
            <span
              :class="comment.isClickReply ? 'text-blue-5' : 'text-[#536471] dark:text-light5'"
              hover:dark:bg-dark-2
              mr-2
              px-1.2
              py-0.7
              rounded-md
              flex-col-center
              inline-flex
              flex-nowrap
              cursor-pointer
              select-none
              transition-all
              hover:bg-light-500
              @click="hdClickReply(comment, true)"
            >
              <Icon name="carbon:add-comment" text-4 text-op-80 mr1 />
              <span text-3>回复</span>
            </span>
          </footer>
          <BlogComment
            v-if="comment.isClickReply"
            ref="commentsIptRefList"
            v-model="replyContent"
            :placeholder="placeholder"
            flex-1
            :loading="loading"
            @send="hdClickSend($event, comment)"
          />

          <div v-if="comment.replyList && comment.replyList.length > 0" mt-2>
            <BlogCommentList
              v-model:comments="comment.replyList"
              :blog="blog"
              @send="hdClickSend"
            />
          </div>
        </div>
      </div>

      <Separator m-2 />
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
