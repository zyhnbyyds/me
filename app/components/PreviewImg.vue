<script lang="ts" setup>
import type { ImageProviders } from '@nuxt/image'
import { computed, inject, onBeforeUnmount, ref } from 'vue'
import { previewContextKey } from '../types/preview'
import type { PreviewContext, PreviewItem } from '../types/preview'

const {
  src,
  active = false,
  provider = 'ipx',
  alt,
  previewItems,
  previewIndex = 0,
} = defineProps<{
  src: string
  active?: boolean
  provider?: keyof ImageProviders
  alt?: string
  previewItems?: PreviewItem[]
  previewIndex?: number
}>()

const emits = defineEmits<{
  select: [name: string]
}>()

void active

const wrapperRef = ref<HTMLElement>()
const loading = ref(true)
const previewInfo = inject<PreviewContext | null>(previewContextKey, null)

const resolvedPreviewItems = computed<PreviewItem[]>(() => {
  if (previewItems?.length) return previewItems

  return [
    {
      src,
      alt,
      provider,
    },
  ]
})

function getImageElement() {
  return wrapperRef.value?.querySelector('img') ?? null
}

function handleImgLoad() {
  loading.value = false

  const imageElement = getImageElement()
  if (imageElement instanceof HTMLImageElement) {
    previewInfo?.registerSource(src, imageElement)
  }
}

function hdClickPreview() {
  if (loading.value) {
    return
  }

  emits('select', src)

  previewInfo?.open(resolvedPreviewItems.value, previewIndex, getImageElement())
}

onBeforeUnmount(() => {
  previewInfo?.unregisterSource(src)
})
</script>

<template>
  <div ref="wrapperRef" relative :class="loading ? 'loading-mask' : ''">
    <NuxtImg
      :src="src"
      :alt="alt || src"
      loading="lazy"
      preload
      rounded-md
      w-full
      cursor-pointer
      transition-all
      duration-250
      ease-out
      object-cover
      object-center
      hover:scale-[1.015]
      :provider="provider as any"
      @load="handleImgLoad"
      @click="hdClickPreview"
    />
  </div>
</template>

<style scoped>
.loading-mask::after {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: inline-block;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 37%, #e0e0e0 63%);
  background-size: 200% 100%;
  border-radius: 5px;
  animation: skeleton-loading 1s infinite linear;
  content: '';
}

.dark .loading-mask::after {
  background: linear-gradient(90deg, #2c2c2c 25%, #3c3c3c 37%, #2c2c2c 63%);
  background-size: 200% 100%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: 0% 0;
  }
}
</style>
