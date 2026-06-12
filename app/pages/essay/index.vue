<script lang="ts" setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { EssayItem, EssayMedia } from '../../../shared/types/essay'
import type { PreviewItem } from '../../types/preview'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

definePageMeta({
  title: '随笔',
  description: '一些随想与记录',
  keepalive: true,
})

const page = ref(1)
const pageSize = 20
const essayList = ref<EssayItem[]>([])
const total = ref(0)
const loading = ref(false)
const hasMore = computed(() => essayList.value.length < total.value)

// ─── Live Photo 视频预览 ──────────────────────────────────
const playingLiveId = ref('')

function getMediaImage(m: EssayMedia): string {
  if (typeof m === 'string') return m
  return m.image
}

function isLive(m: EssayMedia): boolean {
  return typeof m === 'object' && m.type === 'live'
}

function getLiveVideo(m: EssayMedia): string {
  if (typeof m === 'object' && 'video' in m) return m.video
  return ''
}

function buildPreviewItems(images: EssayMedia[] | null): PreviewItem[] {
  if (!images) return []
  return images.map((m, index) => ({
    src: getMediaImage(m),
    alt: `随笔图片 ${index + 1}`,
    provider: 'myserver' as const,
  }))
}

async function fetchEssays(loadMore = false) {
  if (loading.value) return
  loading.value = true

  try {
    const { data } = await $fetch<Result<{ list: EssayItem[]; total: number }>>(
      '/api/essay',
      {
        params: { page: page.value, size: pageSize },
      },
    )

    if (data) {
      if (loadMore) {
        essayList.value.push(...data.list)
      } else {
        essayList.value = data.list
      }
      total.value = data.total
    }
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  page.value++
  await fetchEssays(true)
}

onMounted(() => {
  fetchEssays()
})
</script>

<template>
  <div class="h-full overflow-y-auto px-5 py-4">
    <h1 class="mb-6 text-6 font-bold">随笔</h1>

    <!-- 瀑布流 -->
    <div
      v-if="essayList.length > 0"
      class="columns-1 gap-4 md:columns-2 lg:columns-3"
    >
      <div
        v-for="item in essayList"
        :key="item.id"
        class="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-common bg-white/60 p-4 backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-dark-500/60"
      >
        <!-- 文字内容 -->
        <p
          v-if="item.content"
          class="whitespace-pre-wrap text-3.5 leading-relaxed"
        >
          {{ item.content }}
        </p>

        <!-- 图片 / Live -->
        <div
          v-if="item.images && item.images.length > 0"
          class="mt-3 space-y-2"
        >
          <template v-for="(m, idx) in item.images" :key="idx">
            <!-- Live Photo：点击封面后切换为视频预览 -->
            <div
              v-if="isLive(m)"
              class="relative h-50 w-full cursor-pointer overflow-hidden rounded-lg"
              @click="
                playingLiveId === getMediaImage(m)
                  ? (playingLiveId = '')
                  : (playingLiveId = getMediaImage(m))
              "
            >
              <img
                :src="getMediaImage(m)"
                alt=""
                class="h-full w-full object-cover transition-opacity duration-200"
                :class="
                  playingLiveId === getMediaImage(m)
                    ? 'opacity-0'
                    : 'opacity-100'
                "
              />
              <video
                v-show="playingLiveId === getMediaImage(m)"
                :src="getLiveVideo(m)"
                muted
                autoplay
                loop
                playsinline
                class="absolute inset-0 h-full w-full object-cover"
              />
              <div
                class="flex items-center gap-1 absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-2.5 text-white backdrop-blur-sm"
              >
                <Icon name="material-symbols:live-tv" text-3 />
                LIVE
              </div>
            </div>

            <!-- 普通图片 -->
            <div v-else class="h-50 w-full overflow-hidden rounded-lg">
              <PreviewImg
                :src="getMediaImage(m)"
                :alt="`随笔图片 ${idx + 1}`"
                :preview-items="buildPreviewItems(item.images)"
                :preview-index="idx"
                provider="myserver"
                @select="() => void 0"
              />
            </div>
          </template>
        </div>

        <!-- 时间 -->
        <div class="mt-3 text-3 text-gray-400">
          {{ dayjs(item.createdAt).fromNow() }}
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="flex-center py-20 text-gray-400">
      还没有随笔～
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="flex-center py-6">
      <Btn :loading="loading" @click="loadMore">加载更多</Btn>
    </div>

    <!-- 加载中 -->
    <Loading :loading="loading" />
  </div>
</template>
