<script lang="ts" setup>
definePageMeta({
  keepalive: false,
})

const route = useRoute()
const config = useRuntimeConfig()

const commentIpt = ref('')
const blobPageRef = ref<HTMLElement>()

const [loading, load] = useToggle(false)

const { data: page, pending } = useAsyncData(
  decodeURIComponent(route.path),
  () => {
    return queryCollection('blog').path(decodeURIComponent(route.path)).first()
  },
)

const blogId = computed(() => page.value?.path?.replaceAll('/', '_') ?? '')

const { data: comments, refresh: refreshComments } = useAsyncData<
  ReplyCommentItem[]
>(
  () => `blog-comment:${blogId.value || 'empty'}`,
  () => {
    if (!blogId.value) return Promise.resolve([])
    return $fetch('/api/blog/comment', {
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
    return $fetch('/api/blog/ops', {
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

const { y, restoreScrollPosition } = useRouteScrollRestore(blobPageRef)

// 当前激活的 TOC 锚点
const activeHeadingId = ref('')

function updateActiveHeading() {
  if (!import.meta.client || !blobPageRef.value) return
  const headings = blobPageRef.value.querySelectorAll(
    'h1[id], h2[id], h3[id], h4[id]',
  )
  let current = ''
  for (const el of headings) {
    const rect = el.getBoundingClientRect()
    if (rect.top <= 80) {
      current = el.id
    }
  }
  activeHeadingId.value = current
}

useEventListener(blobPageRef, 'scroll', updateActiveHeading, { passive: true })

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
  const headerHeight = 56
  const rect = target.getBoundingClientRect()
  const scrollTop =
    blobPageRef.value?.scrollTop ??
    window.pageYOffset ??
    document.documentElement.scrollTop
  const top = rect.top + scrollTop - headerHeight
  blobPageRef.value?.scrollTo({ top, behavior: 'smooth' })
  activeHeadingId.value = id
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
async function hdCommentDeleted(_deletedCount: number) {
  await Promise.all([refreshComments(), refreshOps()])
}
</script>

<template>
  <div h-screen w-full flex>
    <div
      class="h-full w-80% relative overflow-auto scrollbar"
      ref="blobPageRef"
    >
      <CHead :title="page?.title" />
      <!-- 文章内容区 -->
      <div class="markdown-body" min-h50>
        <ClientOnly>
          <ContentRenderer :value="page ?? {}" />
          <Loading :loading="pending" />

          <template #fallback>
            <Loading :loading="pending" />
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
              bg-c-border
              flex-col-center
              cursor-pointer
              dark:bg-c-hover
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

      <footer h-80 />
    </div>
    <div
      class="<lg:hidden sticky top-10 right-0 flex-1 h-full overflow-hidden flex flex-col"
    >
      <!-- TOC 目录 -->
      <div
        v-if="tocItems.length > 0"
        px-6
        py-4
        class="flex-1 min-h-0 overflow-auto toc-scroll"
      >
        <div
          class="toc-title mb-3 text-3 font-semibold tracking-wider uppercase opacity-50"
        >
          目录
        </div>
        <div class="flex flex-col gap-0.5">
          <button
            v-for="item in tocItems"
            :key="item.id"
            type="button"
            class="toc-item text-left text-3 py-1.5 px-2 rounded-md transition-all duration-200 border-l-2"
            :style="{ paddingLeft: `${item.level * 12 + 8}px` }"
            :class="
              activeHeadingId === item.id
                ? 'border-c-accent text-c-accent dark:text-c-accent bg-c-hover dark:bg-c-hover opacity-100 font-medium'
                : 'border-transparent opacity-55 hover:opacity-90 hover:bg-c-bg dark:hover:bg-c-hover'
            "
            @click="jumpToHeading(item.id)"
          >
            {{ item.text }}
          </button>
        </div>
      </div>
    </div>

    <BackTop class="<md:hidden" v-model="y" fixed right-6 bottom-6 />
  </div>
</template>

<style scoped>
.chat-ipt > img {
  height: 20px !important;
  width: 20px !important;
}

.toc-scroll {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.toc-scroll:hover {
  scrollbar-color: rgb(200 200 200) transparent;
}

/* 心跳动效 */
.heart-pop-enter-active {
  animation: heart-beat 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes heart-beat {
  0% {
    transform: scale(0.6);
  }
  60% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

/* 文章内容淡入 */
.content-fade-enter-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.content-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
</style>
