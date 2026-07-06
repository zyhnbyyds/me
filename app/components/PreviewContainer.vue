<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue'
import { previewContextKey } from '../types/preview'
import type { PreviewContext, PreviewItem } from '../types/preview'

const { duration = 500 } = defineProps<{
  duration?: number
}>()

const visible = ref(false)
const floating = ref(false)
const items = ref<PreviewItem[]>([])
const activeIndex = ref(0)
const currentItem = computed(() => items.value[activeIndex.value] ?? null)
const hasMultiple = computed(() => items.value.length > 1)
const hasPrev = computed(() => hasMultiple.value && activeIndex.value > 0)
const hasNext = computed(
  () => hasMultiple.value && activeIndex.value < items.value.length - 1,
)
const imageFit = ref<'cover' | 'contain'>('cover')
const previewStyle = ref<CSSProperties | null>(null)

const sourceRegistry = new Map<string, HTMLImageElement>()
let openFitTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (openFitTimer) {
    clearTimeout(openFitTimer)
    openFitTimer = null
  }

  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function registerSource(src: string, element: HTMLImageElement | null) {
  if (!element) return
  sourceRegistry.set(src, element)
}

function unregisterSource(src: string) {
  sourceRegistry.delete(src)
}

function getSourceElement(src?: string) {
  if (!src) return null
  return sourceRegistry.get(src) ?? null
}

function getSourceMetrics(element: HTMLElement | null) {
  if (!element) return null

  const rect = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    borderRadius: style.borderRadius || '0px',
  }
}

function getImageRatio(item: PreviewItem | null) {
  if (!item) return 1

  const source = getSourceElement(item.src)
  if (source?.naturalWidth && source?.naturalHeight) {
    return source.naturalWidth / source.naturalHeight
  }

  const rect = source?.getBoundingClientRect()
  if (rect?.width && rect.height) {
    return rect.width / rect.height
  }

  return 1
}

function createPreviewStyle(metrics: {
  left: number
  top: number
  width: number
  height: number
  borderRadius: string
}) {
  return {
    width: `${metrics.width}px`,
    height: `${metrics.height}px`,
    transform: `translate3d(${metrics.left}px, ${metrics.top}px, 0)`,
    borderRadius: metrics.borderRadius,
    transitionDuration: `${duration}ms`,
  } satisfies CSSProperties
}

function getFallbackSourceStyle() {
  return createPreviewStyle({
    left: window.innerWidth / 2,
    top: window.innerHeight / 2,
    width: 0,
    height: 0,
    borderRadius: '16px',
  })
}

function getTargetStyle(item: PreviewItem | null) {
  const ratio = getImageRatio(item)
  const maxWidth = window.innerWidth * 0.84
  const maxHeight = window.innerHeight * 0.82

  let width = maxWidth
  let height = width / ratio

  if (height > maxHeight) {
    height = maxHeight
    width = height * ratio
  }

  return createPreviewStyle({
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
    borderRadius: '20px',
  })
}

function animateToTarget() {
  if (!import.meta.client || !currentItem.value) return
  previewStyle.value = getTargetStyle(currentItem.value)
}

function scheduleContainFit() {
  clearTimers()
  openFitTimer = setTimeout(
    () => {
      if (floating.value && visible.value) {
        imageFit.value = 'contain'
      }
    },
    Math.min(duration, 240),
  )
}

function setActive(index: number) {
  if (!items.value.length) return

  const nextIndex = Math.min(Math.max(index, 0), items.value.length - 1)
  if (nextIndex === activeIndex.value) return

  activeIndex.value = nextIndex

  if (floating.value && visible.value) {
    imageFit.value = 'contain'
    nextTick(() => {
      requestAnimationFrame(() => {
        animateToTarget()
      })
    })
  }
}

function open(
  previewItems: PreviewItem[],
  index = 0,
  triggerEl?: HTMLElement | null,
) {
  if (!previewItems.length) return

  clearTimers()
  items.value = previewItems
  activeIndex.value = Math.min(Math.max(index, 0), previewItems.length - 1)

  const sourceMetrics = getSourceMetrics(
    triggerEl ?? getSourceElement(previewItems[activeIndex.value]?.src),
  )

  imageFit.value = 'cover'
  previewStyle.value = sourceMetrics
    ? createPreviewStyle(sourceMetrics)
    : getFallbackSourceStyle()

  floating.value = true

  nextTick(() => {
    requestAnimationFrame(() => {
      visible.value = true
      animateToTarget()
      scheduleContainFit()
    })
  })
}

function resetPreviewState() {
  floating.value = false
  visible.value = false
  items.value = []
  activeIndex.value = 0
  previewStyle.value = null
  imageFit.value = 'cover'
}

function close() {
  if (!floating.value) return

  clearTimers()
  visible.value = false
  imageFit.value = 'cover'

  const sourceMetrics = getSourceMetrics(
    getSourceElement(currentItem.value?.src),
  )
  previewStyle.value = sourceMetrics
    ? createPreviewStyle(sourceMetrics)
    : getFallbackSourceStyle()

  closeTimer = setTimeout(() => {
    resetPreviewState()
  }, duration)
}

function prev() {
  if (!hasPrev.value) return
  setActive(activeIndex.value - 1)
}

function next() {
  if (!hasNext.value) return
  setActive(activeIndex.value + 1)
}

const previewInfo: PreviewContext = {
  visible,
  floating,
  duration,
  items,
  activeIndex,
  currentItem,
  hasMultiple,
  hasPrev,
  hasNext,
  imageFit,
  previewStyle,
  open,
  close,
  prev,
  next,
  setActive,
  registerSource,
  unregisterSource,
}

const rootStyle = useState<Record<string, string> | null>(
  'preview-lock-style',
  () => null,
)

watch(floating, (value) => {
  if (!import.meta.client) return

  const root = document.documentElement

  if (value) {
    rootStyle.value = {
      overflow: root.style.overflow,
      touchAction: root.style.touchAction,
    }
    root.style.overflow = 'hidden'
    root.style.touchAction = 'none'
    return
  }

  if (!rootStyle.value) return

  root.style.overflow = rootStyle.value.overflow ?? ''
  root.style.touchAction = rootStyle.value.touchAction ?? ''
  rootStyle.value = null
})

useEventListener('keydown', (event: KeyboardEvent) => {
  if (!floating.value) return

  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prev()
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  }
})

const { width: viewportWidth, height: viewportHeight } = useWindowSize()

watch([viewportWidth, viewportHeight], () => {
  if (!floating.value || !visible.value) return

  requestAnimationFrame(() => {
    animateToTarget()
  })
})

onBeforeUnmount(() => {
  clearTimers()
})

provide('previewInfo', previewInfo)
provide(previewContextKey, previewInfo)

function hdStopPreview() {
  close()
}
</script>

<template>
  <div class="preview-container h-full w-full">
    <slot />
    <div id="previewImg" class="preview-img" />
    <div v-if="previewInfo.floating.value" class="fixed inset-0 z-9998">
      <div
        class="absolute inset-0 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity ease-out"
        :style="{
          transitionDuration: `${previewInfo.duration}ms`,
          opacity: previewInfo.visible.value ? 1 : 0,
        }"
        @click="hdStopPreview"
      />

      <div class="absolute inset-0">
        <div
          v-if="previewInfo.currentItem.value && previewInfo.previewStyle.value"
          class="absolute left-0 top-0 overflow-hidden border border-white/10 bg-black/15 shadow-[0_24px_64px_var(--c-shadow)] transition-[transform,width,height,border-radius] ease-[cubic-bezier(0.22,1,0.36,1)]"
          :style="previewInfo.previewStyle.value"
          @click.stop
        >
          <Transition name="preview-media" mode="out-in">
            <NuxtImg
              :key="previewInfo.currentItem.value.src"
              :src="previewInfo.currentItem.value.src"
              :alt="previewInfo.currentItem.value.alt || '预览图片'"
              :provider="previewInfo.currentItem.value.provider as any"
              class="h-full w-full transition-[filter] duration-200 ease-out"
              :class="
                previewInfo.imageFit.value === 'cover'
                  ? 'object-cover'
                  : 'object-contain bg-black/20'
              "
            />
          </Transition>
        </div>
      </div>

      <div
        class="absolute inset-0 transition-opacity duration-200"
        :class="
          previewInfo.visible.value
            ? 'opacity-100'
            : 'pointer-events-none opacity-0'
        "
        @click="hdStopPreview"
      >
        <button
          type="button"
          class="absolute right-4 top-4 z-10 h-11 w-11 flex items-center justify-center rounded-full border border-white/12 bg-black/35 text-white transition-colors hover:bg-black/55"
          aria-label="关闭预览"
          @click.stop="hdStopPreview"
        >
          <Icon name="carbon:close" class="text-5" />
        </button>

        <div
          class="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-white/12 bg-black/35 px-3 py-1.5 text-12px text-white/88"
        >
          {{ previewInfo.activeIndex.value + 1 }} /
          {{ previewInfo.items.value.length }}
        </div>

        <button
          v-if="previewInfo.hasPrev.value"
          type="button"
          class="absolute left-4 top-1/2 z-10 h-12 w-12 flex items-center justify-center rounded-full border border-white/12 bg-black/35 text-white transition-colors hover:bg-black/55 -translate-y-1/2"
          aria-label="上一张"
          @click.stop="previewInfo.prev"
        >
          <Icon name="carbon:chevron-left" class="text-6" />
        </button>

        <button
          v-if="previewInfo.hasNext.value"
          type="button"
          class="absolute right-4 top-1/2 z-10 h-12 w-12 flex items-center justify-center rounded-full border border-white/12 bg-black/35 text-white transition-colors hover:bg-black/55 -translate-y-1/2"
          aria-label="下一张"
          @click.stop="previewInfo.next"
        >
          <Icon name="carbon:chevron-right" class="text-6" />
        </button>

        <div
          v-if="previewInfo.hasMultiple.value"
          class="absolute bottom-4 left-1/2 z-10 flex max-w-[min(92vw,960px)] -translate-x-1/2 gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/28 px-3 py-3 backdrop-blur-md <md:bottom-3 <md:max-w-[94vw]"
          @click.stop
        >
          <button
            v-for="(item, index) in previewInfo.items.value"
            :key="item.src"
            type="button"
            class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-200"
            :class="
              index === previewInfo.activeIndex.value
                ? 'border-white/80 opacity-100 scale-102'
                : 'border-white/10 opacity-65 hover:opacity-90'
            "
            @click="previewInfo.setActive(index)"
          >
            <NuxtImg
              :src="item.src"
              :alt="item.alt || `预览缩略图 ${index + 1}`"
              :provider="item.provider as any"
              class="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-media-enter-active,
.preview-media-leave-active {
  transition:
    opacity 160ms ease,
    transform 220ms ease;
}

.preview-media-enter-from,
.preview-media-leave-to {
  opacity: 0;
  transform: scale(0.972);
}
</style>
