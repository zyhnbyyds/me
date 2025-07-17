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
    <div bg-gray-200 flex-1 dark:bg-dark-500 :style="{ height: `${height}px` }" />
    <slot name="content">
      <span v-if="label" text-3.5 text-dark-100 mx-3>{{ label }}</span>
    </slot>
    <div bg-gray-200 flex-1 dark:bg-dark-500 :style="{ height: `${height}px` }" />
  </div>
</template>

<style scoped></style>
