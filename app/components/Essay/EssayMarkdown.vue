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

function measureHeight() {
  naturalHeight.value = innerRef.value?.offsetHeight ?? 0
}

/**
 * 用 ResizeObserver 观察内容本身，而不是外层容器：
 * 外层高度被 max-height 截断，观察它无法感知「内容变高」；
 * 观察内容则能覆盖异步渲染完成、图片加载、字体切换、窗口缩放等所有高度变化。
 *
 * 注册时先主动量一次：浏览器在后台标签页会节流 ResizeObserver 回调，
 * 只依赖回调会让内容一直处于「未测量」状态，展开入口迟迟不出现。
 */
function observeContent() {
  observer?.disconnect()
  if (!import.meta.client || !innerRef.value) return

  measureHeight()
  observer = new ResizeObserver(measureHeight)
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

onMounted(async () => {
  updateCollapsedPx()
  observeContent()

  // ContentRenderer 是异步组件，挂载当帧内容还没渲染出来，
  // 这里等本轮渲染结束再量一次，不必完全依赖 ResizeObserver 的回调时机
  await nextTick()
  measureHeight()
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

/**
 * 内容节点挂载 / 卸载时补测一次。
 * MutationObserver 基于 DOM 变化通知，不像 ResizeObserver 那样在页面不可见时被节流，
 * 因此「异步组件渲染完成」这类关键时点不会漏测。
 */
useMutationObserver(innerRef, measureHeight, {
  childList: true,
  subtree: true,
})

// 标签页切回可见时立刻重测：浏览器在页面不可见时会节流 ResizeObserver
useEventListener(document, 'visibilitychange', measureHeight)

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

// ─── 过渡：统一用 UnoCSS 类表达，不必再各写一份 CSS ────────
const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

const FOG_TRANSITION = {
  enterActiveClass: `transition-all duration-450 ${EASE}`,
  leaveActiveClass: `transition-all duration-450 ${EASE}`,
  enterFromClass: 'opacity-0 translate-y-3',
  leaveToClass: 'opacity-0 -translate-y-3.5 scale-103',
}

const TOGGLE_TRANSITION = {
  enterActiveClass: 'transition-all duration-300 ease-out',
  leaveActiveClass: 'transition-all duration-300 ease-out',
  enterFromClass: 'opacity-0 scale-80',
  leaveToClass: 'opacity-0 scale-80',
}

const ICON_TRANSITION = `transition-[rotate] duration-400 ${EASE}`
</script>

<template>
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
    <Transition v-bind="FOG_TRANSITION">
      <div
        v-if="collapsed"
        class="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden"
        aria-hidden="true"
      >
        <!-- 靠 mask 让模糊强度自下而上衰减，形成雾气散开的感觉 -->
        <div
          class="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_top,#000_0%,rgba(0,0,0,0.55)_45%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,#000_0%,rgba(0,0,0,0.55)_45%,transparent_100%)]"
        />
        <!-- 云团：多层径向渐变叠加后缓慢漂移 -->
        <div class="essay-fog-cloud" />
      </div>
    </Transition>

    <!--
      展开 / 收起：折叠时浮在云雾之上（不占布局、不被裁切），
      展开后回到内容下方居中，跟随阅读进度自然出现
    -->
    <Transition v-bind="TOGGLE_TRANSITION">
      <div
        v-if="overflowing"
        class="flex justify-center"
        :class="
          collapsed ? 'pointer-events-none absolute inset-x-0 bottom-2' : 'pt-2'
        "
      >
        <button
          type="button"
          class="flex-center size-7.5 cursor-pointer rounded-full border border-c-border bg-c-surface text-c-text-weak transition-all duration-250 hover:border-c-accent/45 hover:bg-c-hover hover:text-c-accent"
          :class="
            collapsed &&
            'pointer-events-auto shadow-[0_2px_10px_var(--c-shadow)]'
          "
          :title="expanded ? '收起全文' : '展开全文'"
          :aria-expanded="expanded"
          :aria-label="expanded ? '收起全文' : '展开全文'"
          @click="toggle"
        >
          <Icon
            name="material-symbols:keyboard-arrow-down-rounded"
            text-5
            :class="[ICON_TRANSITION, expanded && 'rotate-180']"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/*
 * 这两类样式无法用 UnoCSS 表达，故保留 scoped CSS：
 * 1. Markdown 元素由 ContentRenderer 渲染，拿不到 class，只能用 :deep 选择器；
 * 2. 云团是多层径向渐变背景，写成 arbitrary value 会远超可读范围。
 */
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

/* 云团：几处径向渐变叠加，缓慢漂移做出云雾翻涌的感觉 */
.essay-fog-cloud {
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
  .essay-fog-cloud {
    animation: none;
  }
}
</style>
