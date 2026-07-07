<script lang="ts" setup>
import type { MusicSong } from '../../shared/types/music'

definePageMeta({
  title: '音乐',
  description: '我喜欢的音乐',
  keepalive: true,
})

const PAGE_SIZE = 30

const songs = ref<MusicSong[]>([])
const page = ref(1)
const hasMore = ref(true)
const loading = ref(false)
const containerRef = ref<HTMLElement | null>(null)

async function fetchSongs(pageNum: number) {
  if (loading.value) return
  loading.value = true
  try {
    const { data } = await $fetch<
      Result<{ songs: MusicSong[]; total: number; hasMore: boolean }>
    >(`/api/music/songs?page=${pageNum}&pageSize=${PAGE_SIZE}`)
    if (data) {
      songs.value.push(...data.songs)
      hasMore.value = data.hasMore
    }
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
}

// 滚动懒加载
useInfiniteScroll(
  containerRef,
  () => {
    if (hasMore.value && !loading.value) {
      page.value++
      fetchSongs(page.value)
    }
  },
  { distance: 200 },
)

// 初始加载
onMounted(() => {
  fetchSongs(1)
})
</script>

<template>
  <div ref="containerRef" class="h-full overflow-y-auto">
    <div class="px-4 py-6 sm:px-6">
      <!-- 头部 -->
      <div class="mb-6 flex items-center gap-4">
        <h1 class="text-6 font-bold">我喜欢的音乐</h1>
        <span class="mt-1 text-3.5 text-c-text-alt/70 dark:text-c-text-weak/70">
          {{ songs.length }} 首
        </span>
      </div>

      <!-- 歌曲列表 -->
      <ul class="overflow-hidden rounded-xl border border-common">
        <li
          v-for="(song, idx) in songs"
          :key="song.id"
          class="flex items-center gap-3 border-b border-dashed border-common px-4 py-3 transition-colors last:border-b-0 hover:bg-c-hover/40 dark:hover:bg-c-hover/40"
        >
          <!-- 序号 -->
          <span
            class="w-6 shrink-0 text-right text-3 text-c-text-weak tabular-nums"
          >
            {{ idx + 1 }}
          </span>

          <!-- 封面 -->
          <div
            class="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-c-hover dark:bg-c-border"
          >
            <img
              v-if="song.cover"
              :src="song.cover"
              :alt="song.title"
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <div
              v-else
              class="flex-center h-full w-full text-2.5 text-c-text-weak"
            >
              <Icon name="material-symbols:music-note" text-4 />
            </div>
          </div>

          <!-- 歌曲信息 -->
          <div class="min-w-0 flex-1">
            <p class="truncate text-3.5 font-medium">
              {{ song.title }}
            </p>
            <p class="truncate text-3 text-c-text-alt dark:text-c-text-weak">
              {{ song.artist || '未知艺术家' }}
              <template v-if="song.album"> · {{ song.album }}</template>
            </p>
          </div>

          <!-- 来源标签 -->
          <span
            v-if="song.sourceName"
            class="shrink-0 rounded-full bg-c-hover px-2.5 py-0.5 text-2.5 font-medium text-c-accent dark:bg-c-hover dark:text-c-accent"
          >
            {{ song.sourceName }}
          </span>

          <!-- 外链 -->
          <a
            v-if="song.sourceUrl"
            :href="song.sourceUrl"
            target="_blank"
            rel="noopener"
            class="shrink-0 text-c-text-weak transition-colors hover:text-c-accent"
            :title="`在 ${song.sourceName || '来源'} 中打开`"
            @click.stop
          >
            <Icon name="material-symbols:open-in-new" text-4 />
          </a>
        </li>
      </ul>

      <Loading :loading="loading" text="加载中…" />

      <div
        v-if="!hasMore && songs.length > 0"
        class="flex-center py-6 text-3.5 text-c-text-weak"
      >
        已加载全部 {{ songs.length }} 首歌曲
      </div>

      <div
        v-if="!loading && songs.length === 0"
        class="flex-center py-20 text-c-text-weak"
      >
        还没有歌曲～
      </div>
    </div>
  </div>
</template>
