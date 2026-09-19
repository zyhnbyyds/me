<script lang="ts" setup>
import type { EssayMarkdownBody } from '~~/shared/types/essay'

const {
  body,
  clamp = true,
  maxHeight = '22rem',
} = defineProps<{
  /** 服务端解析好的 Markdown AST */
  body: EssayMarkdownBody | null
  /** 是否允许超长内容折叠 */
  clamp?: boolean
  /** 折叠时展示的最大高度 */
  maxHeight?: string
}>()

const contentRef = ref<HTMLElement>()
const expanded = ref(false)
/** 内容超出折叠高度时为 true，用于显示「展开全文」 */
const overflowing = ref(false)

const collapsed = computed(() => clamp && !expanded.value && overflowing.value)

/**
 * 可折叠时始终限制高度：否则 scrollHeight 与 clientHeight 相等，
 * 永远判断不出内容溢出。展开时给一个足够大的上限以保留过渡动画。
 */
const contentStyle = computed(() =>
  clamp ? { maxHeight: expanded.value ? '9999px' : maxHeight } : undefined,
)

/**
 * 受限状态下 clientHeight 被 maxHeight 截断，
 * 而 scrollHeight 始终是内容完整高度，两者对比即可判断是否溢出。
 */
function measure() {
  const el = contentRef.value
  if (!el || expanded.value) return
  overflowing.value = el.scrollHeight - el.clientHeight > 4
}

onMounted(() => {
  measure()
  // Markdown 内联图片加载后会改变高度，加载完成后再量一次
  contentRef.value
    ?.querySelectorAll('img')
    .forEach((img) => img.addEventListener('load', measure, { once: true }))
})

watch(
  () => body,
  () => {
    expanded.value = false
    nextTick(measure)
  },
)
</script>

<template>
  <div class="essay-md-wrap relative">
    <div
      ref="contentRef"
      class="markdown-body essay-md overflow-hidden transition-[max-height] duration-300"
      :style="contentStyle"
    >
      <ContentRenderer v-if="body" :value="body as any" />
    </div>

    <!-- 折叠时的渐隐遮罩（避开下方按钮区域） -->
    <div
      v-if="collapsed"
      class="pointer-events-none absolute inset-x-0 bottom-[1.6rem] h-14 bg-linear-to-t from-c-bg to-transparent"
    />

    <button
      v-if="clamp && overflowing"
      type="button"
      class="mt-2 inline-flex items-center gap-0.5 text-3 text-c-accent cursor-pointer transition-opacity hover:opacity-75"
      @click="expanded = !expanded"
    >
      {{ expanded ? '收起' : '展开全文' }}
      <Icon
        :name="
          expanded
            ? 'material-symbols:expand-less'
            : 'material-symbols:expand-more'
        "
        text-4
      />
    </button>
  </div>
</template>

<style scoped>
/* ── 卡片内的 Markdown 排版：去掉页面级留白与底色，压缩行间距 ── */
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
</style>
