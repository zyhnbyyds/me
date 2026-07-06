<script lang="ts" setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

definePageMeta({
  title: '首页',
  description: '博客和QQ空间动态的聚合页',
  keepalive: true,
})

const { push } = useRouter()
const pageSize = 20

interface FeedMedia {
  type: 'image' | 'video'
  src: string
  poster?: string
}

interface FeedItem {
  id: string
  type: 'blog' | 'qq'
  title: string
  description: string
  content?: string
  image?: string
  date: number
  tags: string[]
  path: string
  readingTime?: number
  qqData?: Record<string, unknown>
  media?: FeedMedia
}

interface CardPosition {
  top: number
  left: number
  width: number
  colIndex: number
}

// ─── 状态 ─────────────────────────────────────────────────
const keyword = ref('')
const searchInput = ref('')
const page = ref(1)
const activeDate = ref('')
const showSearch = ref(true)
const feedItems = ref<FeedItem[]>([])

const scrollRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const cardRefs = ref<(HTMLElement | null)[]>([])

const containerHeight = ref(0)
const cardPositions = ref<CardPosition[]>([])
const cardAnimationDelays = ref<number[]>([])

let searchTimer: ReturnType<typeof setTimeout> | null = null
let layoutFrame: number | null = null
let resizeObserver: ResizeObserver | null = null

// ─── VueUse ───────────────────────────────────────────────
const { y, restoreScrollPosition } = useRouteScrollRestore(scrollRef, {
  key: '/',
})
const { arrivedState } = useScroll(scrollRef)
const { width: pageWidth } = useWindowSize()
const { width: containerWidth } = useElementSize(containerRef)

// ─── 数据 ─────────────────────────────────────────────────
const { data: feedResult, refresh } = await useAsyncData(
  'home-feed',
  () =>
    $fetch<{ data: FeedItem[]; total: number }>('/api/feed/list', {
      params: {
        current: page.value,
        size: pageSize,
        keyword: keyword.value || undefined,
        date: activeDate.value || undefined,
      },
    }),
  { default: () => ({ data: [], total: 0 }) },
)

// ─── 计算属性 ─────────────────────────────────────────────
const feedList = computed(() => feedResult.value?.data ?? [])
const totalCount = computed(() => feedResult.value?.total ?? 0)
const hasMore = computed(() => page.value * pageSize < totalCount.value)
const layoutWidth = computed(() => pageWidth.value || containerWidth.value)

const layoutMetrics = computed(() => {
  const width = layoutWidth.value

  if (width < 640) {
    return {
      columns: 1,
      gap: 12,
      padding: 8,
    }
  }

  if (width < 1024) {
    return {
      columns: 2,
      gap: 16,
      padding: 12,
    }
  }

  if (width < 1400) {
    return {
      columns: 3,
      gap: 20,
      padding: 16,
    }
  }

  return {
    columns: 4,
    gap: 20,
    padding: 20,
  }
})

const columnCount = computed(() => layoutMetrics.value.columns)

// ─── 工具函数 ─────────────────────────────────────────────
function resetSearchTimer() {
  if (searchTimer) clearTimeout(searchTimer)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getQQPrimaryMedia(item: FeedItem): FeedMedia | undefined {
  if (item.type !== 'qq' || !isRecord(item.qqData)) return undefined
  const pics = item.qqData.pic
  if (!Array.isArray(pics) || pics.length === 0) return undefined

  const firstPicIndex = pics.findIndex((pic) => isRecord(pic))
  if (firstPicIndex < 0) return undefined

  const firstPic = pics[firstPicIndex]
  if (!isRecord(firstPic)) return undefined

  const isVideo = Number(firstPic.is_video ?? 0) === 1
  if (isVideo) {
    return {
      type: 'video',
      src: `/qq/videos/video_${item.id}_${firstPicIndex}.mp4`,
      poster: `/qq/images/image_${item.id}_${firstPicIndex}.jpg`,
    }
  }

  return {
    type: 'image',
    src: `/qq/images/image_${item.id}_${firstPicIndex}.jpg`,
  }
}

function enrichFeedItem(item: FeedItem): FeedItem {
  if (item.type === 'blog') {
    return {
      ...item,
      media: item.image
        ? {
            type: 'image',
            src: item.image,
          }
        : undefined,
    }
  }

  return {
    ...item,
    media: getQQPrimaryMedia(item),
  }
}

function resetLayoutFrame() {
  if (layoutFrame !== null) {
    cancelAnimationFrame(layoutFrame)
    layoutFrame = null
  }
}

// ─── 业务函数 ─────────────────────────────────────────────
function handleSearch() {
  resetSearchTimer()
  searchTimer = setTimeout(() => {
    keyword.value = searchInput.value.trim()
    activeDate.value = ''
    page.value = 1
    refresh()
  }, 400)
}

async function loadMore() {
  if (!hasMore.value) return
  page.value++
  await refresh()
}

const scheduleLayout = useDebounceFn(() => {
  resetLayoutFrame()

  layoutFrame = window.requestAnimationFrame(() => {
    layoutFrame = null
    calculateLayout()
  })
}, 16)

function calculateLayout() {
  if (
    !containerRef.value ||
    cardRefs.value.length === 0 ||
    !containerWidth.value
  ) {
    cardPositions.value = []
    containerHeight.value = 0
    cardAnimationDelays.value = []
    return
  }

  const { gap, padding } = layoutMetrics.value
  const cols = columnCount.value
  const availableWidth = containerWidth.value - padding * 2 - gap * (cols - 1)

  if (availableWidth <= 0) {
    cardPositions.value = []
    containerHeight.value = 0
    cardAnimationDelays.value = []
    return
  }

  const colWidth = availableWidth / cols

  const columnHeights = Array(cols).fill(padding)
  const positions: CardPosition[] = []

  for (let i = 0; i < cardRefs.value.length; i++) {
    const card = cardRefs.value[i]
    if (!card) continue

    const minColIndex = columnHeights.indexOf(Math.min(...columnHeights))
    const height = card.offsetHeight

    positions.push({
      top: columnHeights[minColIndex],
      left: padding + minColIndex * (colWidth + gap),
      width: colWidth,
      colIndex: minColIndex,
    })

    columnHeights[minColIndex] += height + gap
  }

  cardPositions.value = positions
  containerHeight.value = Math.max(...columnHeights)

  // 计算每个卡片的延迟，限制最大延迟到 300ms 以加快首屏显示速度
  cardAnimationDelays.value = feedItems.value.map((_, i) =>
    Math.min(i * 20, 300),
  )
}

function setupResizeObserver() {
  if (!import.meta.client) return

  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  resizeObserver = new ResizeObserver(() => {
    scheduleLayout()
  })

  if (containerRef.value) resizeObserver.observe(containerRef.value)

  cardRefs.value.forEach((card) => {
    if (card) resizeObserver!.observe(card)
  })
}

async function goToDetail(item: FeedItem) {
  if (item.type === 'blog') {
    await $fetch('/api/blog/look', {
      method: 'post',
      body: { path: item.path },
    })
  }
  push(item.path)
}

// ─── Watch ────────────────────────────────────────────────
watch(
  feedList,
  (value) => {
    const enriched = value.map(enrichFeedItem)
    feedItems.value =
      page.value === 1 ? enriched : [...feedItems.value, ...enriched]
  },
  { immediate: true },
)

watch(y, (currentY, previousY) => {
  if (currentY <= 8) {
    showSearch.value = true
    return
  }

  if (currentY > previousY) {
    showSearch.value = false
  } else if (currentY < previousY) {
    showSearch.value = true
  }
})

watch(
  () => arrivedState.bottom,
  (isBottom) => {
    if (isBottom && hasMore.value) loadMore()
  },
)

watch(feedItems, () => {
  cardRefs.value = cardRefs.value.slice(0, feedItems.value.length)

  if (import.meta.client) {
    nextTick(() => {
      setupResizeObserver()
      scheduleLayout()
    })
  }
})

watch([columnCount, pageWidth, containerWidth], () => {
  nextTick(() => {
    scheduleLayout()
  })
})

// ─── 生命周期 ─────────────────────────────────────────────
onMounted(() => {
  nextTick(() => {
    setupResizeObserver()
    scheduleLayout()
    restoreScrollPosition()
  })
})

onBeforeUnmount(() => {
  resetSearchTimer()
  resetLayoutFrame()
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="h-full flex relative overflow-hidden bg-c-bg dark:bg-c-bg">
    <!-- 左侧主内容 -->
    <div class="flex-1 flex flex-col h-full min-w-0">
      <div
        class="absolute left-10 top-3 z-1000 w-1/3 <md:left-4 <md:top-3 <md:w-[calc(100%-32px)] transition-all duration-250 ease-out"
        :class="
          showSearch
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-3 pointer-events-none'
        "
      >
        <Icon
          name="carbon:search"
          class="absolute left-2.5 top-1/2 -translate-y-1/2 text-3.5 text-c-text-weak"
        />
        <input
          v-model="searchInput"
          type="text"
          placeholder="搜索..."
          class="w-full pl-8 pr-3 py-2 rounded-lg bg-c-bg dark:bg-c-surface border border-c-border dark:border-dark-500 text-13px text-c-text dark:text-c-text-alt outline-none transition-all focus:border-c-accent focus:ring-1 focus:ring-c-accent/20 placeholder-gray-400"
          @input="handleSearch"
        />
      </div>

      <!-- Feed 列表 -->
      <div
        ref="scrollRef"
        class="flex-1 overflow-y-auto overflow-x-hidden scrollbar pb-20 pt6 <sm:pt4"
      >
        <div class="px-4 <sm:px-2.5 py-4 <sm:py-0.5 max-w-full">
          <div
            v-if="feedItems.length === 0"
            class="flex flex-col items-center justify-center py-20 text-c-text-weak"
          >
            <Icon name="carbon:document-blank" class="text-12 mb-3" />
            <span class="text-sm">暂无内容</span>
          </div>

          <div
            ref="containerRef"
            class="relative w-full mx-auto"
            :style="{ height: `${containerHeight}px`, maxWidth: '1600px' }"
          >
            <div
              v-for="(item, index) in feedItems"
              :key="item.id"
              :ref="(el) => (cardRefs[index] = el as any)"
              class="absolute w-full"
              :style="{
                top: `${cardPositions[index]?.top ?? 0}px`,
                left: `${cardPositions[index]?.left ?? 0}px`,
                width: `${cardPositions[index]?.width ?? 0}px`,
                transition: `opacity 0.35s ease-out ${cardAnimationDelays[index] ?? 0}ms`,
                opacity: cardPositions[index] ? 1 : 0,
                willChange: 'opacity',
              }"
            >
              <div
                class="group relative h-full flex flex-col bg-c-surface dark:bg-c-bg rounded-xl border border-c-border dark:border-dark-600 shadow-sm hover:shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1"
                @click="goToDetail(item)"
              >
                <!-- 类型标识 -->
                <div
                  class="absolute top-1.5 left-2 z-10 px-2 py-0.5 rounded-full text-10px font-medium"
                  :class="
                    item.type === 'blog'
                      ? 'bg-c-accent/80 text-white'
                      : 'bg-c-hover0/80 text-white'
                  "
                >
                  {{ item.type === 'blog' ? '博客' : '动态' }}
                </div>

                <div
                  v-if="item.media"
                  class="w-full relative aspect-video overflow-hidden bg-gradient-to-br from-c-bg to-c-border dark:from-dark-700 dark:to-dark-600"
                >
                  <NuxtImg
                    v-if="item.media.type === 'image'"
                    loading="lazy"
                    quality="60"
                    class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    :src="item.media.src"
                    :alt="item.title"
                    style="will-change: transform"
                  />
                  <NuxtImg
                    v-else-if="item.media.poster"
                    loading="lazy"
                    quality="60"
                    class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    :src="item.media.poster"
                    :alt="item.title"
                    style="will-change: transform"
                  />
                  <video
                    v-else
                    preload="metadata"
                    muted
                    playsinline
                    class="w-full h-full object-cover pointer-events-none"
                    :src="item.media.src"
                    @loadedmetadata="
                      ($event.target as HTMLVideoElement).currentTime = 0
                    "
                  />
                </div>

                <!-- 内容区 -->
                <div class="p-4 <sm:p-3 flex flex-col flex-1 gap-3 min-h-0">
                  <h2
                    v-if="item.type === 'blog'"
                    class="text-base font-bold text-c-text dark:text-c-text leading-tight line-clamp-2 transition-colors"
                  >
                    {{ item.title }}
                  </h2>

                  <QQContentRender
                    v-if="item.type === 'qq'"
                    :content="item.description || item.title || ''"
                    custom-class="text-14px text-c-text dark:text-c-text-alt line-clamp-4 leading-relaxed"
                    emoji-size="small"
                  />

                  <p
                    v-if="item.type === 'blog' && item.description"
                    class="text-13px text-c-text-alt dark:text-c-text-weak line-clamp-2 leading-relaxed"
                  >
                    {{ item.description }}
                  </p>

                  <div
                    v-if="item.tags?.length"
                    class="flex flex-wrap gap-1.5 mt-1 mb-auto"
                  >
                    <span
                      v-for="tag in item.tags"
                      :key="tag"
                      class="inline-flex items-center px-2 py-0.5 rounded-md text-11px font-medium bg-c-bg dark:bg-c-bg text-c-text-alt dark:text-c-text-weak"
                    >
                      # {{ tag }}
                    </span>
                  </div>

                  <div
                    class="flex items-center justify-between mt-auto pt-3 border-t border-c-border dark:border-dark-600 text-12px text-c-text-alt dark:text-c-text-weak"
                  >
                    <span class="text-11px">{{
                      dayjs(item.date).format('YYYY-MM-DD')
                    }}</span>
                    <span v-if="item.type === 'blog'" class="text-11px"
                      >{{ item.readingTime ?? 5 }} min</span
                    >
                    <span
                      v-else
                      class="text-11px font-medium text-emerald-500/70"
                      >QQ空间</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Loading :loading="hasMore" />
        </div>
      </div>
    </div>

    <BackTop class="absolute right-3 bottom-3" v-model="y" />
  </div>
</template>

<style scoped></style>
