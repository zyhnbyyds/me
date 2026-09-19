<script lang="ts" setup>
const {
  label,
  loading = false,
  disabled = false,
  type = 'button',
} = defineProps<{
  label?: string
  /** 加载中：展示旋转图标并自动禁用，避免重复提交 */
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="flex items-center justify-center gap-1.5 text-3.5 text-white px-4 py-2 rounded-lg bg-c-accent cursor-pointer select-none transition-colors active:bg-c-accent-hover hover:bg-c-accent-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-c-accent"
  >
    <Icon
      v-if="loading"
      name="material-symbols:progress-activity"
      class="animate-spin"
      text-4
    />
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<style scoped></style>
