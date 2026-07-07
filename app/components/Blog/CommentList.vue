<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'
import type Comment from './Comment.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import ConfirmModal from '../ConfirmModal.vue'

const props = defineProps<{
  blog?: BlogCollectionItem | null
  isAdmin?: boolean
}>()

const emit = defineEmits<{
  (e: 'deleted', deletedCount: number): void
}>()

const replyContent = ref('')
const comments = defineModel<ReplyCommentItem[]>('comments', { default: [] })
const loading = defineModel('loading', { default: false })
const commentsIptRefList = ref<InstanceType<typeof Comment>[]>()
const placeholder = ref('说点什么再走嘛')

const showConfirm = ref(false)
const pendingDeleteComment = ref<ReplyCommentItem | null>(null)

const { loggedIn, user } = useUserSession()

const isSuperAdmin = computed(() => props.isAdmin ?? false)

function formatDate(timestamp: number) {
  dayjs.extend(relativeTime)
  dayjs.locale('zh-cn')
  return dayjs(new Date(timestamp)).fromNow().replaceAll(' ', '')
}

function removeCommentById(
  list: ReplyCommentItem[],
  commentId: string,
): ReplyCommentItem[] {
  return list
    .filter((item) => item.commentId !== commentId)
    .map((item) => ({
      ...item,
      replyList: item.replyList?.length
        ? removeCommentById(item.replyList, commentId)
        : [],
    }))
}

function hdClickReply(
  replay: ReplyCommentItem & { isClickReply: boolean },
  isReply = false,
) {
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

async function hdDeleteComment(comment: ReplyCommentItem) {
  if (!props.blog || !isSuperAdmin.value || !import.meta.client) return
  pendingDeleteComment.value = comment
  showConfirm.value = true
}

async function confirmDelete() {
  if (!props.blog || !pendingDeleteComment.value) return
  loading.value = true
  try {
    const id = props.blog.path.replaceAll('/', '_')
    const res = await $fetch<{ ok: boolean; deleted: number }>(
      '/api/blog/comment',
      {
        method: 'delete',
        body: { id, commentId: pendingDeleteComment.value.commentId },
      },
    )
    comments.value = removeCommentById(
      comments.value,
      pendingDeleteComment.value.commentId,
    )
    emit('deleted', res.deleted || 1)
  } finally {
    loading.value = false
    showConfirm.value = false
    pendingDeleteComment.value = null
  }
}

function cancelDelete() {
  showConfirm.value = false
  pendingDeleteComment.value = null
}

async function hdClickSend(val: EmojiInfo[], comment: ReplyCommentItem) {
  if (!props.blog || !loggedIn.value || !user.value || !replyContent.value)
    return
  comment.isClickReply = false
  const id = props.blog.path.replaceAll('/', '_')
  const body: PostCommentBody = {
    id,
    comment: val,
    fromUserId: user.value.id,
    toUserId: comment.fromUserId,
    depth: comment.depth + 1,
    parentId: comment.commentId,
    toUser: comment.fromUser,
  }
  loading.value = true
  try {
    const [flag, commentId] = await $fetch<[boolean, string]>(
      '/api/blog/comment',
      {
        method: 'post',
        body,
      },
    )
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
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div v-for="(comment, i) in comments" v-auto-animate :key="i" class="group">
      <div
        text-3.2
        p-2
        pb-0
        rounded-2
        flex
        transition-all
        relative
        hover:bg-light200
        hover:dark:bg-c-surface
      >
        <img rounded-full h-5 w-5 :src="comment.fromUser.avatar_url" />
        <div ml-2 w-full>
          <div>
            <span font-bold mr-1
              >{{ comment.fromUser.name }}
              {{
                comment.depth === 1
                  ? ''
                  : `回复 ${comment.toUser && comment.toUser.name} `
              }}</span
            >
            <span class="text-[var(--c-text-alt)] text-op-80">
              <span v-if="comment.depth === 1"
                >@{{ comment.fromUser.login }}</span
              >
              <span> · </span>
              <span text-3>{{ formatDate(comment.timestamp) }}</span>
            </span>
            <span text-3 text-c-text-weak flex-col-center inline-flex float-end>
              <Icon name="material-symbols:location-on-outline" mr-2px />
              <span>
                {{ comment.fromUser.location }}
              </span>
            </span>
          </div>
          <div text-3.5 text-dark-600 mt-2 break-all dark:text-light600>
            <span v-for="(item, idx) in comment.content" :key="`${idx}item`">
              <img
                v-if="item.type === 'emoji'"
                :src="`/emojis/${item.value}`"
                class="emoji-sm"
              />
              <span v-else>{{ item.value }}</span>
            </span>
          </div>

          <footer py-2 flex items-start>
            <span
              :class="
                comment.isClickReply
                  ? 'text-c-accent'
                  : 'text-[var(--c-text-alt)] dark:text-light5'
              "
              hover:dark:bg-c-bg-2
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
              hover:bg-c-hover
              @click="hdClickReply(comment, true)"
            >
              <Icon name="carbon:add-comment" text-4 text-op-80 mr1 />
              <span text-3>回复</span>
            </span>

            <span
              v-if="isSuperAdmin"
              text-3
              class="text-c-accent cursor-pointer select-none rounded-md px-1.2 py-0.7 hover:bg-c-hover dark:hover:bg-c-hover"
              @click="hdDeleteComment(comment)"
            >
              删除
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
              :is-admin="isAdmin"
              @deleted="emit('deleted', $event)"
            />
          </div>
        </div>
      </div>

      <Separator m-2 />
    </div>
  </div>
  <ConfirmModal
    :visible="showConfirm"
    title="删除评论"
    message="确定要删除这条评论吗？"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<style scoped>
.emoji-sm {
  display: inline-block;
  width: 20px;
  height: 20px;
}
</style>
