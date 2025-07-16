<script lang='ts' setup>
withDefaults(defineProps<{
  label?: string
  height?: number
}>(), {
  label: '',
  height: 0.5,
})
</script>

<template>
  <div flex="~ row" class="items-center justify-center">
    <div flex-1 bg-gray-200 dark:bg-dark-500 :style="{ height: `${height}px` }" />
    <slot name="content">
      <span v-if="label" mx-3 text-3.5 text-dark-100>{{ label }}</span>
    </slot>
    <div flex-1 bg-gray-200 dark:bg-dark-500 :style="{ height: `${height}px` }" />
  </div>
</template>

<style scoped></style>
