<script lang="ts" setup>
const route = useRoute()
const { $api } = useNuxtApp()
const config = useRuntimeConfig()

const commentIpt = ref('')
const blobPageRef = ref<HTMLElement>()

const [loading, load] = useToggle(false)
const likeLoading = ref(false)

const { data: page } = useAsyncData(decodeURIComponent(route.path), () => {
  return queryCollection('blog').path(decodeURIComponent(route.path)).first()
})

const blogId = computed(() => page.value?.path?.replaceAll('/', '_') ?? '')

const { data: comments, refresh: refreshComments } = useAsyncData<
  ReplyCommentItem[]
>(
  () => `blog-comment:${blogId.value || 'empty'}`,
  () => {
    if (!blogId.value) return Promise.resolve([])
    return $api('/api/blog/comment', {
      method: 'get',
      query: { id: blogId.value },
    })
  },
  { default: () => [], watch: [blogId] },
)

const { data: ops, refresh: refreshOps } = useAsyncData<BlogOps>(
  () => `blog-ops:${blogId.value || 'empty'}`,
  () => {
    if (!blogId.value) {
      return Promise.resolve({
        looked: false,
        looks: 0,
        liked: false,
        likes: 0,
        comments: 0,
      })
    }
    return $api('/api/blog/ops', {
      method: 'get',
      query: { id: blogId.value },
    })
  },
  {
    default: () => ({
      looked: false,
      looks: 0,
      liked: false,
      likes: 0,
      comments: 0,
    }),
    watch: [blogId],
  },
)

const { loggedIn, user, clear, openInPopup } = useUserSession()

const superAdminUserId = computed(() =>
  Number(config.public.superAdminGithubUserId || '0'),
)

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

interface TocNavItem extends TocLink {
  level: number
}

const tocLinks = computed(() => {
  return (page.value?.body?.toc?.links ?? []) as TocLink[]
})

const tocItems = computed<TocNavItem[]>(() => {
  const result: TocNavItem[] = []
  const visit = (list: TocLink[], level = 0) => {
    for (const item of list) {
      result.push({ ...item, level })
      if (item.children?.length) {
        visit(item.children, level + 1)
      }
    }
  }
  visit(tocLinks.value)
  return result
})

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
  ogImage: page.value?.image,
})

const { y } = useScroll(blobPageRef)

watch(
  blogId,
  async (id) => {
    if (!import.meta.client || !id) return
    await $fetch('/api/blog/look', { method: 'post', body: { id } })
    await refreshOps()
  },
  { immediate: true },
)

function jumpToHeading(id: string) {
  if (!import.meta.client) return
  const target = document.getElementById(id)
  if (!target) return
  const headerHeight = 56 // 如有变化可调整
  const rect = target.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const top = rect.top + scrollTop - headerHeight
  blobPageRef.value?.scrollTo({ top, behavior: 'smooth' })
}

async function hdClickSend(val: EmojiInfo[]) {
  if (!blogId.value || !loggedIn.value || !user.value) return

  const body = {
    id: blogId.value,
    comment: val,
    fromUserId: user.value.id,
    toUserId: 0,
    depth: 1,
  }
  load(true)
  try {
    const [flag, commentId] = await $fetch<[boolean, string]>(
      '/api/blog/comment',
      {
        method: 'post',
        body,
      },
    )
    if (flag) {
      comments.value.unshift({
        fileId: blogId.value,
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
      if (ops.value) {
        ops.value.comments += 1
      }
    }
  } finally {
    load(false)
  }
}

async function hdToggleLike() {
  if (!blogId.value || likeLoading.value) return
  if (!loggedIn.value) {
    openInPopup('/auth/github')
    return
  }

  const nextLiked = !ops.value?.liked
  likeLoading.value = true
  try {
    await $fetch('/api/blog/like', {
      method: 'post',
      body: { id: blogId.value, isLiked: nextLiked },
    })

    if (ops.value) {
      ops.value.liked = nextLiked
      ops.value.likes = Math.max(0, ops.value.likes + (nextLiked ? 1 : -1))
    }
  } finally {
    likeLoading.value = false
  }
}

async function hdCommentDeleted(_deletedCount: number) {
  await Promise.all([refreshComments(), refreshOps()])
}
</script>

<template>
  <div h-full relative>
    <div h-full w-full overflow-auto ref="blobPageRef" class="scrollbar">
      <CHead :title="page?.title" />

      <Teleport to="#default-right">
        <div class="<lg:hidden relative h-full overflow-hidden">
          <div
            v-if="tocItems.length > 0"
            px-8
            py-4
            class="h-[calc(100%-80px)] overflow-auto"
          >
            <div class="toc-title" mb-2 text-3.5 font-bold>目录</div>
            <div class="flex flex-col gap-1">
              <button
                v-for="item in tocItems"
                :key="item.id"
                type="button"
                class="text-left op-70 hover:op-100 hover:bg-common text-3 py-1 transition-all rounded-sm"
                :style="{ paddingLeft: `${item.level * 16 + 8}px` }"
                @click="jumpToHeading(item.id)"
              >
                {{ item.text }}
              </button>
            </div>
          </div>
          <div
            px-5
            py-3
            flex-center
            gap-5
            text-4
            h-20
            absolute
            bottom-0
            left-0
            w-full
          >
            <button
              class="flex items-center gap-1 rounded-md px-2 py-1 transition-all"
              :class="
                ops?.liked
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'bg-hover-common-trans'
              "
              :disabled="likeLoading"
              @click="hdToggleLike"
            >
              <Icon :name="ops?.liked ? 'mdi:heart' : 'mdi:heart-outline'" />
              <span>{{ ops?.likes ?? 0 }}</span>
            </button>

            <div class="flex items-center gap-1 text-[#536471]">
              <Icon name="mdi:eye-outline" />
              <span>{{ ops?.looks ?? 0 }}</span>
            </div>

            <div class="flex items-center gap-1 text-[#536471]">
              <Icon name="carbon:chat" />
              <span>{{ ops?.comments ?? 0 }}</span>
            </div>
          </div>
        </div>
      </Teleport>

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
            <span
              text-4
              mr-2
              class="i-carbon:logout cursor-pointer rotate-180"
              @click="clear"
            />
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

        <BlogCommentList
          v-model:loading="loading"
          v-model:comments="comments"
          :blog="page"
          :super-admin-user-id="superAdminUserId"
          @deleted="hdCommentDeleted"
        />
      </div>

      <BackTop class="<md:hidden" v-model="y" absolute right-6 bottom-6 />
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
