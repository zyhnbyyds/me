<script lang="ts" setup>
import type { BlogMeta, CommentItem } from '~/types/blog'
import { ulid } from 'ulid'

const route = useRoute()
const titleRef = ref<HTMLElement | null>(null)
const commentIpt = ref('')
const commentRef = ref<HTMLTextAreaElement | null>(null)
const [loading, load] = useToggle(false)

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})
const { data: comments } = await useAsyncData<CommentItem[]>('/api/blog/comment', () => {
  if (!page.value)
    return new Promise(() => { })
  return $fetch('/api/blog/comment', {
    method: 'get',
    query: { id: page.value.path.replaceAll('/', '_') },
  })
})

const { loggedIn, user, clear, openInPopup } = useUserSession()

const meta = computed(() => {
  return page.value?.meta as unknown as BlogMeta
})

useSeoMeta({
  title: page.value?.title,
  description: meta.value?.description,
  ogImage: meta.value?.image,
})

const { y } = inject<{ x: Ref<number>, y: Ref<number> }>('scroll', { x: ref(0), y: ref(0) })
y.value = 0

const { height } = useElementBounding(titleRef)

const positionStyle = computed(() => {
  const percent = Math.abs(y.value) / 60
  if (y.value <= 60) {
    return {
      top: `${(60 - y.value) < 0 ? 0 : (60 - y.value)}px`,
      left: `${208 * percent < 20 ? 20 : 208 * percent}px`,
      fontSize: `${20 - ((20 * percent) > 6 ? 6 : 20 * percent)}px`,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    }
  }
  return {
    top: `${0}px`,
    left: '208px',
    fontSize: '14px',
  }
})

async function hdClickSend(val: EmojiInfo[]) {
  if (!page.value || !loggedIn.value || !user.value)
    return

  const id = page.value.path.replaceAll('/', '_')

  const body = { id, comment: JSON.stringify(val), fromUserId: user.value.id, toUserId: 0 }
  load(true)
  await $fetch('/api/blog/comment', { method: 'post', body })
  if (comments.value) {
    comments.value.unshift({
      fileId: id,
      type: 'comment',
      fromUserId: String(user.value.id),
      toUserId: '0',
      commentId: ulid(),
      timestamp: Date.now().toString(),
      content: val,
      fromUser: user.value,
      toUser: null,
    })
  }
  load(false)
}
</script>

<template>
  <div w-full>
    <header sticky top-0 h-50px w-full flex-col-center justify-between px-4 text-5 blur-common>
      <div flex-col-center gap-4>
        <div class="h-9 w-9 flex-center inline-flex cursor-pointer bg-hover-common" @click="$router.back()">
          <Icon name="material-symbols:arrow-back" />
        </div>
        <p font-bold>
          帖子
        </p>
      </div>

      <h1
        ref="titleRef" :style="positionStyle" absolute left-0 top-0 min-h-50px flex-col-center justify-end pr-4
        font-bold :class="y > 60 ? 'w-[calc(100%-208px)]' : ''"
      >
        {{ page?.title }}
      </h1>
    </header>
    <div class="markdown-body">
      <!-- 标题高度 -->
      <p :style="{ height: `${height}px` }" />
      <ContentRenderer v-if="page" :value="page" />
    </div>

    <USeparator mb-2 px-2 type="dashed" label="留下你的评论~" />

    <div mx-5>
      <div mb-2 flex items-center justify-end text-3 font-bold>
        <div v-if="!loggedIn">
          <button
            flex-col-center cursor-pointer rounded-md bg-light-7 px-2 py-1 dark:bg-dark-3
            @click="openInPopup('/auth/github')"
          >
            <Icon name="skill-icons:github-dark" mr-1 />
            登录
          </button>
        </div>

        <div v-else flex-col-center>
          <Icon name="carbon:logout" mr-2 text-4 class="rotate-90 cursor-pointer" @click="clear" />
          <UAvatar size="sm" :src="user?.avatar_url" />
          <div ml-2>
            {{ user?.name }}
          </div>
        </div>
      </div>

      <BlogComment ref="commentRef" v-model="commentIpt" :loading="loading" @send="(val) => hdClickSend(val)" />

      <USeparator v-if="comments && comments.length > 0" class="my-5" px-2 type="dashed" label="评论列表" />

      <BlogCommentList :comments="comments ?? []" />
    </div>

    <footer h-80 />
  </div>
</template>

<style scoped>
.chat-ipt > img {
  height: 20px !important;
  width: 20px !important;
}
</style>
