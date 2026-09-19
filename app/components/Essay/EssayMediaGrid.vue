<script lang="ts" setup>
import type { EssayLiveMedia, EssayMedia } from '~~/shared/types/essay'
import type { PreviewItem } from '../../types/preview'

const { media } = defineProps<{
  media: EssayMedia[]
}>()

/** 只有一张图时用大图铺满，多张时用等宽网格 */
const isSingle = computed(() => media.length === 1)

/** 当前正在播放的 Live Photo（以封面地址作为唯一标识） */
const playingKey = ref('')

function getImage(m: EssayMedia): string {
  return typeof m === 'string' ? m : m.image
}

function isLive(m: EssayMedia): boolean {
  return typeof m === 'object' && m.type === 'live'
}

function getVideo(m: EssayMedia): string {
  return isLive(m) ? (m as EssayLiveMedia).video : ''
}

const previewItems = computed<PreviewItem[]>(() =>
  media.map((m, index) => ({
    src: getImage(m),
    alt: `随笔图片 ${index + 1}`,
    provider: 'myserver' as const,
  })),
)

function toggleLive(m: EssayMedia) {
  const key = getImage(m)
  playingKey.value = playingKey.value === key ? '' : key
}
</script>

<template>
  <div :class="isSingle ? '' : 'grid grid-cols-2 gap-2 md:grid-cols-3'">
    <div
      v-for="(m, idx) in media"
      :key="`${getImage(m)}-${idx}`"
      class="group/media relative overflow-hidden rounded-xl bg-c-bg"
      :class="isSingle ? 'aspect-[3/2] max-h-85 w-full' : 'aspect-square'"
    >
      <!-- Live Photo：点击封面切换为视频播放 -->
      <template v-if="isLive(m)">
        <button
          type="button"
          class="block hw-full cursor-pointer"
          :aria-label="
            playingKey === getImage(m) ? '暂停实况照片' : '播放实况照片'
          "
          @click="toggleLive(m)"
        >
          <img
            :src="getImage(m)"
            alt="实况照片封面"
            class="h-full w-full object-cover transition-all duration-300"
            :class="
              playingKey === getImage(m)
                ? 'scale-105 opacity-0'
                : 'opacity-100 group-hover/media:scale-105'
            "
          />
          <video
            v-show="playingKey === getImage(m)"
            :src="getVideo(m)"
            muted
            autoplay
            loop
            playsinline
            class="absolute inset-0 h-full w-full object-cover"
          />
        </button>

        <div
          class="pointer-events-none flex items-center gap-1 absolute left-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-2.5 text-white backdrop-blur-sm"
        >
          <Icon name="material-symbols:live-tv" text-3 />
          LIVE
        </div>
      </template>

      <!-- 普通图片：点击打开大图预览 -->
      <PreviewImg
        v-else
        :src="getImage(m)"
        :alt="`随笔图片 ${idx + 1}`"
        :preview-items="previewItems"
        :preview-index="idx"
        provider="myserver"
        @select="() => void 0"
      />
    </div>
  </div>
</template>
