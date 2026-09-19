<script lang="ts" setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { EssayItem } from '~~/shared/types/essay'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const { item } = defineProps<{
  item: EssayItem
}>()

const relativeTimeText = computed(() => dayjs(item.createdAt).fromNow())
const absoluteTimeText = computed(() =>
  dayjs(item.createdAt).format('YYYY-MM-DD HH:mm'),
)

const hasMedia = computed(() => Boolean(item.images?.length))
/** 仅在 Markdown 解析失败时回退为纯文本展示 */
const plainText = computed(() => (item.body ? null : item.content))
</script>

<template>
  <article class="group">
    <header
      class="mb-3 flex items-baseline justify-between gap-3 text-3 text-c-text-weak"
    >
      <time :datetime="item.createdAt" :title="absoluteTimeText">
        {{ relativeTimeText }}
      </time>
      <span class="tabular-nums op-70">{{ absoluteTimeText }}</span>
    </header>

    <!-- 图片 / 实况照片 -->
    <EssayMediaGrid v-if="hasMedia" :media="item.images!" />

    <!-- Markdown 正文 -->
    <EssayMarkdown
      v-if="item.body"
      :body="item.body"
      :class="hasMedia && 'mt-3.5'"
    />

    <!-- 解析失败时的纯文本兜底 -->
    <p
      v-else-if="plainText"
      class="whitespace-pre-wrap break-words text-3.5 leading-relaxed"
      :class="hasMedia && 'mt-3.5'"
    >
      {{ plainText }}
    </p>
  </article>
</template>
