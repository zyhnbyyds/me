<script lang="ts" setup>
/**
 * AppIcon — 极简 SVG 图标组件
 * 渲染自定义 SVG 图标，统一 24×24 画布，2px 描边
 * active 态自动加粗描边 + 浅色填充
 */
import iconDefs from '~/config/icons'

const props = withDefaults(
  defineProps<{
    /** 图标名称，对应 icons.ts 中的 key */
    name: string
    /** 图标尺寸 */
    size?: number | string
    /** 是否为激活态（加粗 + 浅色填充） */
    active?: boolean
  }>(),
  {
    size: 24,
  },
)

const def = computed(() => iconDefs[props.name])

const px = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)

// 激活态：stroke 加粗到 2.5，叠加 12% 填充营造"实心"感
const sw = computed(() => (props.active ? 2.5 : 2))
const fillOpacity = computed(() => (props.active ? 0.12 : 0))
</script>

<template>
  <svg
    v-if="def"
    :viewBox="def.viewBox"
    :width="px"
    :height="px"
    fill="none"
    stroke="currentColor"
    :stroke-width="sw"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="app-icon shrink-0 transition-all duration-200"
    aria-hidden="true"
  >
    <path
      v-for="(d, i) in def.paths"
      :key="i"
      :d="d"
      fill="currentColor"
      :fill-opacity="fillOpacity"
    />
  </svg>
  <!-- 回退：未找到图标时显示占位 -->
  <span
    v-else
    class="app-icon--fallback inline-flex items-center justify-center rounded"
    :style="{ width: px, height: px }"
  >
    ?
  </span>
</template>

<style scoped>
.app-icon {
  vertical-align: middle;
}
.app-icon--fallback {
  background: #e5e7eb;
  color: #9ca3af;
  font-size: 0.75em;
}
</style>
