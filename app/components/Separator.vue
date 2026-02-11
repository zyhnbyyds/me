<script lang="ts" setup>
withDefaults(
  defineProps<{
    label?: string
    height?: number
  }>(),
  {
    label: '',
    height: 0.5,
  },
)
</script>

<template>
  <div flex="~ row" class="items-center justify-center">
    <div
      border-t
      border-gray-200
      border-dashed
      flex-1
      dark:border-dark-500
      :style="{ borderTopWidth: `${height}px` }"
    />
    <slot name="content">
      <span v-if="label" text-3 mx-5 op-60>{{ label }}</span>
    </slot>
    <div
      border-t
      border-gray-200
      border-dashed
      flex-1
      dark:border-dark-500
      :style="{ borderTopWidth: `${height}px` }"
    />
  </div>
</template>

<style scoped></style>
