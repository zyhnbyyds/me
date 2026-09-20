<script lang="ts" setup>
import type { EssayMarkdownBody } from '~~/shared/types/essay'

const {
  body,
  clamp = true,
  collapsedHeight = 22,
} = defineProps<{
  /** 服务端解析好的 Markdown AST */
  body: EssayMarkdownBody | null
  /** 是否允许折叠超长内容 */
  clamp?: boolean
  /** 折叠时保留的高度（rem） */
  collapsedHeight?: number
}>()

const contentRef = ref<HTMLElement>()
const innerRef = ref<HTMLElement>()

/** 是否展开 */
const expanded = ref(false)
/** 内容自然高度（px） */
const naturalHeight = ref(0)
/** 折叠阈值对应的像素高度 */
const collapsedPx = ref(0)
/**
 * 内容高度是否超出折叠阈值 —— 超出才有必要给用户「展开」入口。
 * 这里不加余量：只要有一像素被 max-height 裁掉，就必须给出入口，
 * 否则会出现「内容被截断却没有展开按钮」的情况。
 */
const overflowing = computed(
  () => clamp && naturalHeight.value > collapsedPx.value,
)
/** 处于折叠（被裁剪）状态 */
const collapsed = computed(() => overflowing.value && !expanded.value)

const contentStyle = computed(() => {
  if (!clamp) return undefined
  // 展开时用实测的自然高度，过渡结束后正好等于内容高度，不留多余空白
  return {
    maxHeight: expanded.value
      ? `${naturalHeight.value + 1}px`
      : `${collapsedPx.value}px`,
  }
})

function remToPx(rem: number) {
  if (!import.meta.client) return rem * 16
  const rootFontSize =
    parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  return rem * rootFontSize
}

function updateCollapsedPx() {
  collapsedPx.value = remToPx(collapsedHeight)
}

// 首帧就取到正确阈值，避免 max-height 从 0 撑开造成闪动
updateCollapsedPx()

let observer: ResizeObserver | undefined

/**
 * 用 ResizeObserver 观察内容本身，而不是外层容器：
 * 外层高度被 max-height 截断，观察它无法感知「内容变高」；
 * 观察内容则能覆盖异步渲染完成、图片加载、字体切换、窗口缩放等所有高度变化。
 */
function observeContent() {
  observer?.disconnect()
  if (!import.meta.client || !innerRef.value) return

  observer = new ResizeObserver(() => {
    naturalHeight.value = innerRef.value?.offsetHeight ?? 0
  })
  observer.observe(innerRef.value)
}

function toggle() {
  expanded.value = !expanded.value

  // 收起后内容变短，若视口停在下方会看到突兀的跳动，这里把它拉回视野内
  if (!expanded.value) {
    nextTick(() => {
      contentRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }
}

onMounted(() => {
  updateCollapsedPx()
  observeContent()
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

// 窗口尺寸变化可能改变 rem 基准，重新计算折叠阈值
useEventListener('resize', updateCollapsedPx)

// 内容切换时回到折叠态
watch(
  () => body,
  () => {
    expanded.value = false
    nextTick(observeContent)
  },
)
</script>

<template>
  <div class="essay-md-wrap">
    <div class="relative">
      <div
        ref="contentRef"
        class="markdown-body essay-md overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :style="contentStyle"
      >
        <!-- flow-root 阻止外边距折叠，保证量到的高度包含末段外边距 -->
        <div ref="innerRef" class="flow-root">
          <ContentRenderer v-if="body" :value="body as any" />
        </div>
      </div>

      <!-- 云雾遮罩：底部模糊 + 云团缓慢飘动 -->
      <Transition name="essay-fog">
        <div v-if="collapsed" class="essay-fog" aria-hidden="true">
          <div class="essay-fog__mist" />
          <div class="essay-fog__cloud" />
        </div>
      </Transition>

      <!--
        展开 / 收起：折叠时浮在云雾之上（不占布局、不被裁切），
        展开后回到内容下方居中，跟随阅读进度自然出现
      -->
      <Transition name="essay-toggle">
        <div
          v-if="overflowing"
          class="essay-toggle-slot"
          :class="
            collapsed ? 'essay-toggle-slot--float' : 'essay-toggle-slot--inline'
          "
        >
          <button
            type="button"
            class="essay-toggle"
            :title="expanded ? '收起全文' : '展开全文'"
            :aria-expanded="expanded"
            :aria-label="expanded ? '收起全文' : '展开全文'"
            @click="toggle"
          >
            <Icon
              name="material-symbols:keyboard-arrow-down-rounded"
              text-5
              class="essay-toggle__icon"
              :class="expanded && 'rotate-180'"
            />
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* ── 内容排版：去掉页面级留白与底色，压缩行间距 ── */
.essay-md {
  margin: 0;
  padding: 0;
  background: transparent;
  font-size: 0.875rem;
  line-height: 1.75;
}

.essay-md :deep(h1),
.essay-md :deep(h2),
.essay-md :deep(h3),
.essay-md :deep(h4),
.essay-md :deep(h5),
.essay-md :deep(h6) {
  margin: 1em 0 0.5em;
  padding-bottom: 0;
  border-bottom: none;
  font-weight: 600;
  line-height: 1.45;
}

.essay-md :deep(h1) {
  font-size: 1.2rem;
}
.essay-md :deep(h2) {
  font-size: 1.075rem;
}
.essay-md :deep(h3) {
  font-size: 1rem;
}
.essay-md :deep(h4),
.essay-md :deep(h5),
.essay-md :deep(h6) {
  font-size: 0.9375rem;
}

.essay-md :deep(p) {
  margin: 0.55em 0;
}

.essay-md :deep(ul),
.essay-md :deep(ol) {
  margin: 0.55em 0;
  padding-left: 1.35em;
}

/* 全局 reset 会清掉列表符号，这里显式恢复 */
.essay-md :deep(ul) {
  list-style: disc;
}

.essay-md :deep(ol) {
  list-style: decimal;
}

.essay-md :deep(li) {
  margin: 0.25em 0;
}

.essay-md :deep(li::marker) {
  color: var(--c-accent);
}

.essay-md :deep(blockquote) {
  margin: 0.7em 0;
  padding: 0.15em 0.9em;
  border-left-width: 3px;
  border-left-color: var(--c-accent);
  border-radius: 0 0.5rem 0.5rem 0;
  background: var(--c-hover);
}

.essay-md :deep(blockquote p) {
  margin: 0.3em 0;
}

.essay-md :deep(pre) {
  margin: 0.7em 0;
  padding: 0.8em 0.9em;
  border-radius: 0.65rem;
  font-size: 0.8125rem;
  line-height: 1.6;
}

.essay-md :deep(code) {
  font-size: 0.8125em;
}

.essay-md :deep(a) {
  color: var(--c-accent);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--c-accent) 35%, transparent);
}

.essay-md :deep(a:hover) {
  border-bottom-color: var(--c-accent);
}

.essay-md :deep(img) {
  margin: 0.7em 0;
  max-width: 100%;
  border-radius: 0.65rem;
}

.essay-md :deep(hr) {
  margin: 1.1em 0;
  border-style: dashed;
}

.essay-md :deep(table) {
  margin: 0.7em 0;
  font-size: 0.8125rem;
}

/* ══ 云雾遮罩 ══════════════════════════════════════════ */
.essay-fog {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 7rem;
  pointer-events: none;
  overflow: hidden;
}

/* 底部模糊：靠 mask 让模糊强度自下而上衰减，形成雾气散开的感觉 */
.essay-fog__mist {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  -webkit-mask-image: linear-gradient(
    to top,
    #000 0%,
    rgba(0, 0, 0, 0.55) 45%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to top,
    #000 0%,
    rgba(0, 0, 0, 0.55) 45%,
    transparent 100%
  );
}

/* 云团：几处径向渐变叠加，缓慢漂移，做出云雾翻涌的效果 */
.essay-fog__cloud {
  position: absolute;
  inset: -20% -15% -35% -15%;
  background:
    radial-gradient(42% 62% at 18% 88%, var(--c-bg) 0%, transparent 72%),
    radial-gradient(55% 78% at 52% 100%, var(--c-bg) 0%, transparent 76%),
    radial-gradient(38% 58% at 86% 82%, var(--c-bg) 0%, transparent 70%),
    linear-gradient(
      to top,
      var(--c-bg) 6%,
      color-mix(in srgb, var(--c-bg) 70%, transparent) 42%,
      transparent 88%
    );
  filter: blur(7px);
  animation: essay-fog-drift 11s ease-in-out infinite alternate;
}

@keyframes essay-fog-drift {
  from {
    transform: translate3d(-3%, 4%, 0) scale(1);
  }
  to {
    transform: translate3d(3%, -2%, 0) scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .essay-fog__cloud {
    animation: none;
  }
}

/* 云雾进出场：进入时自下而上浮现，离开时向上飘散 */
.essay-fog-enter-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.essay-fog-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.essay-fog-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.essay-fog-leave-to {
  opacity: 0;
  transform: translateY(-14px) scale(1.03);
}

/* ══ 展开 / 收起按钮 ═══════════════════════════════════ */
/* 折叠时：悬浮在云雾之上，不参与布局也不被 max-height 裁切 */
.essay-toggle-slot--float {
  position: absolute;
  inset-inline: 0;
  bottom: 0.5rem;
  display: flex;
  justify-content: center;
  /* 容器铺满整行，放行内部按钮的点击 */
  pointer-events: none;
}

.essay-toggle-slot--float .essay-toggle {
  pointer-events: auto;
  box-shadow: 0 2px 10px var(--c-shadow);
}

/* 展开时：回到内容下方居中 */
.essay-toggle-slot--inline {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}

.essay-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.9rem;
  width: 1.9rem;
  border-radius: 9999px;
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  color: var(--c-text-weak);
  cursor: pointer;
  transition:
    color 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease;
}

.essay-toggle:hover {
  border-color: color-mix(in srgb, var(--c-accent) 45%, transparent);
  background: var(--c-hover);
  color: var(--c-accent);
}

/* rotate-180 生成的是独立的 rotate 属性（不是 transform），两者都要过渡 */
.essay-toggle__icon {
  transition:
    rotate 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.essay-toggle-enter-active,
.essay-toggle-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.essay-toggle-enter-from,
.essay-toggle-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
