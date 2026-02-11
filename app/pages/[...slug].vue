<script lang="ts" setup>
const route = useRoute()
const { $api } = useNuxtApp()

const commentIpt = ref('')

const [loading, load] = useToggle(false)

const { data: page } = useAsyncData(decodeURIComponent(route.path), () => {
  return queryCollection('blog').path(decodeURIComponent(route.path)).first()
})
const { data: comments } = useAsyncData<ReplyCommentItem[]>(
  '/api/blog/comment',
  () => {
    if (!page.value) return new Promise(() => {})
    return $api('/api/blog/comment', {
      method: 'get',
      query: { id: page.value.path.replaceAll('/', '_') },
    })
  },
  { default: () => [], watch: [page] },
)

const { loggedIn, user, clear, openInPopup } = useUserSession()

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
  ogImage: page.value?.image,
})

const { y } = inject<{ x: Ref<number>; y: Ref<number> }>('scroll', { x: ref(0), y: ref(0) })

setTimeout(() => {
  y.value = 0
}, 300)

onBeforeRouteLeave(() => {
  y.value = 0
})

async function hdClickSend(val: EmojiInfo[]) {
  if (!page.value || !loggedIn.value || !user.value) return

  const id = page.value.path.replaceAll('/', '_')
  const body = { id, comment: val, fromUserId: user.value.id, toUserId: 0, depth: 1 }
  load(true)
  const [flag, commentId] = await $fetch<[boolean, string]>('/api/blog/comment', {
    method: 'post',
    body,
  })
  if (flag) {
    comments.value.unshift({
      fileId: id,
      type: 'comment',
      fromUserId: user.value.id,
      toUserId: 0,
      commentId,
      timestamp: Date.now(),
      content: val,
      fromUser: user.value,
      isClickReply: false,
      depth: 1,
      replyList: [],
      parentId: '0',
    })
  }

  load(false)
}
</script>

<template>
  <div>
    <div w-full>
      <CHead :title="page?.title" />

      <div class="markdown-body">
        <ClientOnly>
          <ContentRenderer v-if="page" :value="page" />

          <div py-5 flex-center>
            <NuxtImg
              v-if="page?.image"
              :quality="70"
              class="w-full object-cover"
              :src="`/blog/${page?.image}`"
            />
          </div>
          <template #fallback>
            <Loading mt20 :loading="true" />
          </template>
        </ClientOnly>
      </div>

      <Separator mx-5 my-6 text-3 label="留下你的评论" />

      <div mx-5>
        <div text-3 font-bold mb-2 flex items-center justify-end>
          <div v-if="!loggedIn">
            <button
              px-2
              py-1
              rounded-md
              bg-light-700
              flex-col-center
              cursor-pointer
              dark:bg-dark-300
              @click="openInPopup('/auth/github')"
            >
              <Icon name="skill-icons:github-dark" mr-1 />
              登录
            </button>
          </div>

          <div v-else flex-col-center>
            <span text-4 mr-2 class="i-carbon:logout cursor-pointer rotate-180" @click="clear" />
            <img rounded-full h-5 w-5 :src="user?.avatar_url" />
            <div ml-2>
              {{ user?.name }}
            </div>
          </div>
        </div>

        <BlogComment
          v-model="commentIpt"
          placeholder="来评论一下吧，留下你的足迹..."
          :loading="loading"
          @send="hdClickSend"
        />

        <Separator
          v-if="comments && comments.length > 0"
          class="my-5"
          px-2
          type="dashed"
          label="评论列表"
        />

        <BlogCommentList v-model:loading="loading" v-model:comments="comments" :blog="page" />
      </div>

      <footer h-80 />
    </div>
  </div>
</template>

<style scoped>
.chat-ipt > img {
  height: 20px !important;
  width: 20px !important;
}
</style>
