<script lang="ts" setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { EssayItem } from '../../../shared/types/essay'

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

// 图片预览
const previewVisible = ref(false)
const previewSrc = ref('')

function openPreview(src: string) {
  previewSrc.value = src
  previewVisible.value = true
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

        <!-- 图片 -->
        <div
          v-if="item.images && item.images.length > 0"
          class="mt-3 space-y-2"
        >
          <img
            v-for="(img, idx) in item.images"
            :key="idx"
            :src="img"
            loading="lazy"
            alt=""
            class="w-full cursor-pointer max-h-50 rounded-lg object-cover"
            @click="openPreview(img)"
          />
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
