<script lang="ts" setup>
import type {
  MusicPlaylist,
  MusicPlaylistSummary,
  MusicSong,
} from '../../shared/types/music'

definePageMeta({
  title: '音乐',
  description: '我的歌单',
  keepalive: true,
})

// ─── 数据 ─────────────────────────────────────────────────
const playlistSummaries = ref<MusicPlaylistSummary[]>([])
const playlistDetails = ref<Map<string, MusicPlaylist>>(new Map())
const expandedId = ref<string | null>(null)
const loading = ref(false)
const loadingDetail = ref(false)

async function fetchPlaylists() {
  loading.value = true
  try {
    const { data } = await $fetch<Result<MusicPlaylistSummary[]>>(
      '/api/music/playlists',
    )
    playlistSummaries.value = data ?? []
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
}

async function togglePlaylist(id: string) {
  if (expandedId.value === id) {
    expandedId.value = null
    return
  }

  expandedId.value = id

  // 已有缓存则跳过
  if (playlistDetails.value.has(id)) return

  loadingDetail.value = true
  try {
    const { data } = await $fetch<Result<MusicPlaylist | null>>(
      `/api/music/playlists/${id}`,
    )
    if (data) {
      playlistDetails.value.set(id, data)
    }
  } catch {
    // ignore
  } finally {
    loadingDetail.value = false
  }
}

const currentPlaylist = computed(() => {
  if (!expandedId.value) return null
  return playlistDetails.value.get(expandedId.value) ?? null
})

// ─── 来源平台颜色映射 ─────────────────────────────────────
function sourceColor(name: string | null): string {
  if (!name)
    return 'bg-c-bg text-c-text-alt dark:bg-c-border dark:text-c-text-weak'
  const map: Record<string, string> = {
    网易云音乐: 'bg-c-hover text-c-accent dark:bg-c-hover dark:text-c-accent',
    QQ音乐: 'bg-c-hover text-green-600 dark:bg-c-hover dark:text-green-400',
    酷狗音乐: 'bg-c-hover text-c-accent dark:bg-c-hover dark:text-c-accent',
    Spotify:
      'bg-c-hover text-emerald-600 dark:bg-c-hover dark:text-emerald-400',
    'Apple Music':
      'bg-c-hover text-pink-600 dark:bg-c-hover dark:text-pink-400',
  }
  return (
    map[name] ??
    'bg-c-bg text-c-text-alt dark:bg-c-border dark:text-c-text-weak'
  )
}

onMounted(() => {
  fetchPlaylists()
})
</script>

<template>
  <div class="h-full overflow-y-auto px-5 py-4">
    <h1 class="mb-6 text-6 font-bold">音乐</h1>

    <!-- 加载歌单列表 -->
    <Loading :loading="loading" text="加载歌单中…" />

    <!-- 空状态 -->
    <div
      v-if="!loading && playlistSummaries.length === 0"
      class="flex-center py-20 text-c-text-weak"
    >
      还没有歌单～
    </div>

    <!-- 歌单列表 -->
    <div v-if="playlistSummaries.length > 0" class="grid gap-4 md:grid-cols-2">
      <div
        v-for="playlist in playlistSummaries"
        :key="playlist.id"
        class="overflow-hidden rounded-xl border border-common bg-c-surface/60 backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-c-surface/60"
      >
        <!-- 歌单头部：可点击展开 -->
        <div
          class="flex cursor-pointer items-center gap-4 p-4 select-none"
          @click="togglePlaylist(playlist.id)"
        >
          <!-- 封面 -->
          <div
            class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-c-hover dark:bg-c-border"
          >
            <img
              v-if="playlist.cover"
              :src="playlist.cover"
              :alt="playlist.title"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex-center h-full w-full text-3 text-c-text-weak"
            >
              <Icon name="material-symbols:music-note" text-6 />
            </div>
          </div>

          <!-- 信息 -->
          <div class="min-w-0 flex-1">
            <h3 class="truncate text-4.5 font-bold">
              {{ playlist.title }}
            </h3>
            <p class="mt-1 text-3 text-c-text-alt dark:text-c-text-weak">
              {{ playlist.songCount }} 首
              <template v-if="playlist.description">
                · {{ playlist.description }}
              </template>
            </p>
          </div>

          <!-- 展开箭头 -->
          <Icon
            :name="
              expandedId === playlist.id
                ? 'material-symbols:expand-less'
                : 'material-symbols:expand-more'
            "
            class="shrink-0 text-c-text-weak transition-transform duration-200"
            text-6
          />
        </div>

        <!-- 歌曲列表（展开） -->
        <Transition name="expand">
          <div v-if="expandedId === playlist.id" class="border-t border-common">
            <Loading
              :loading="loadingDetail && !currentPlaylist"
              text="加载中…"
            />

            <div v-if="currentPlaylist">
              <!-- 无歌曲 -->
              <div
                v-if="currentPlaylist.songs.length === 0"
                class="flex-center py-8 text-3.5 text-c-text-weak"
              >
                歌单暂无歌曲
              </div>

              <!-- 歌曲列表 -->
              <ul v-else>
                <li
                  v-for="(song, idx) in currentPlaylist.songs"
                  :key="song.id"
                  class="flex items-center gap-3 border-b border-dashed border-common px-4 py-3 transition-colors last:border-b-0 hover:bg-c-hover/50 dark:hover:bg-c-hover/50"
                >
                  <!-- 序号 -->
                  <span
                    class="w-6 shrink-0 text-right text-3 text-c-text-weak tabular-nums"
                  >
                    {{ idx + 1 }}
                  </span>

                  <!-- 歌曲封面 -->
                  <div
                    class="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-c-hover dark:bg-c-border"
                  >
                    <img
                      v-if="song.cover"
                      :src="song.cover"
                      :alt="song.title"
                      class="h-full w-full object-cover"
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
                    <p
                      class="truncate text-3 text-c-text-alt dark:text-c-text-weak"
                    >
                      {{ song.artist || '未知艺术家' }}
                      <template v-if="song.album"> · {{ song.album }}</template>
                    </p>
                  </div>

                  <!-- 来源 -->
                  <span
                    v-if="song.sourceName"
                    class="shrink-0 rounded-full px-2.5 py-0.5 text-2.5 font-medium"
                    :class="sourceColor(song.sourceName)"
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
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
