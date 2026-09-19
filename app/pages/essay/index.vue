<script lang="ts" setup>
import type { EssayItem } from '~~/shared/types/essay'

definePageMeta({
  title: '随笔',
  description: '一些随想与记录',
  keepalive: true,
})

const pageSize = 20
const page = ref(1)
const essayList = ref<EssayItem[]>([])
const total = ref(0)
const loading = ref(false)

const scrollRef = ref<HTMLElement>()
const { y } = useRouteScrollRestore(scrollRef, { key: 'essay' })

const hasMore = computed(() => essayList.value.length < total.value)
const isFirstLoading = computed(
  () => loading.value && essayList.value.length === 0,
)

async function fetchEssays(loadMore = false) {
  if (loading.value) return
  loading.value = true

  try {
    const { data } = await $fetch<Result<{ list: EssayItem[]; total: number }>>(
      '/api/essay',
      { params: { page: page.value, size: pageSize } },
    )

    if (data) {
      essayList.value = loadMore
        ? [...essayList.value, ...data.list]
        : data.list
      total.value = data.total
    }
  } catch {
    // 请求失败时回退页码，保证重试能取到同一批数据
    if (loadMore) page.value = Math.max(1, page.value - 1)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (loading.value || !hasMore.value) return
  page.value += 1
  await fetchEssays(true)
}

onMounted(() => {
  fetchEssays()
})

// 滚动到底部自动加载，同时也保留按钮作为兜底入口
useInfiniteScroll(scrollRef, () => void loadMore(), {
  distance: 240,
  canLoadMore: () => hasMore.value && !loading.value,
})
</script>

<template>
  <div ref="scrollRef" class="scrollbar h-full overflow-y-auto">
    <div class="mx-auto max-w-3xl px-5 pt-6 pb-24">
      <!-- 页头 -->
      <header class="mb-9 flex items-end justify-between gap-4">
        <div>
          <h1 class="text-6 font-bold tracking-tight md:text-7">随笔</h1>
          <p class="mt-1.5 text-3 text-c-text-weak">
            一些随想与记录<template v-if="total"> · 共 {{ total }} 条</template>
          </p>
        </div>

        <NuxtLink
          to="/essay/write"
          class="flex shrink-0 items-center gap-1.5 rounded-full bg-c-text px-3.5 py-2 text-3 font-medium text-c-bg transition-opacity hover:op-85"
        >
          <Icon name="material-symbols:edit-outline" text-4 />
          写随笔
        </NuxtLink>
      </header>

      <!-- 初次加载骨架 -->
      <EssaySkeleton v-if="isFirstLoading" />

      <!-- 时间线 -->
      <div v-else-if="essayList.length > 0" class="essay-timeline">
        <div
          v-for="item in essayList"
          :key="item.id"
          class="essay-timeline__item"
        >
          <span class="essay-timeline__dot" aria-hidden="true" />
          <EssayCard :item="item" />
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="flex flex-col items-center gap-3 py-24 text-c-text-weak"
      >
        <Icon name="material-symbols:ink-pen-outline" text-10 op-40 />
        <p class="text-3.5">还没有随笔～</p>
        <NuxtLink
          to="/essay/write"
          class="text-3 text-c-accent transition-opacity hover:opacity-75"
        >
          写下第一条
        </NuxtLink>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore && !isFirstLoading" class="flex justify-center pt-5">
        <button
          type="button"
          class="flex cursor-pointer items-center gap-1.5 rounded-full border border-common bg-c-surface/60 px-4 py-2 text-3 text-c-text-alt transition-colors hover:border-c-accent/40 hover:text-c-accent disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
          @click="loadMore"
        >
          <Icon
            :name="
              loading
                ? 'material-symbols:progress-activity'
                : 'material-symbols:expand-more'
            "
            text-4
            :class="loading && 'animate-spin'"
          />
          {{ loading ? '加载中…' : '加载更多' }}
        </button>
      </div>

      <p
        v-else-if="essayList.length > 0"
        class="pt-6 text-center text-2.5 text-c-text-weak op-70"
      >
        — 已经到底啦 —
      </p>
    </div>

    <BackTop v-model="y" absolute right-6 bottom-6 class="<md:hidden" />
  </div>
</template>

<style scoped>
/* ── 时间线 ─────────────────────────────────────────────── */
.essay-timeline {
  position: relative;
}

/* 竖向轴线 */
.essay-timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 1.1rem;
  bottom: 1.5rem;
  width: 1px;
  background: var(--c-border);
}

/* 留出轴线与节点的空间（放在 item 上，节点定位才以轴线为基准） */
.essay-timeline__item {
  position: relative;
  padding-left: 34px;
  padding-bottom: 2.25rem;
}

/* 时间线节点：空心圆，hover 时点亮 */
.essay-timeline__dot {
  position: absolute;
  left: 0.5px;
  top: 0.3rem;
  height: 10px;
  width: 10px;
  border-radius: 9999px;
  border: 1.5px solid color-mix(in srgb, var(--c-text-weak) 60%, transparent);
  background: var(--c-bg);
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.essay-timeline__item:hover .essay-timeline__dot {
  border-color: var(--c-accent);
  background: var(--c-accent);
  box-shadow: 0 0 0 4px var(--c-hover);
}
</style>
