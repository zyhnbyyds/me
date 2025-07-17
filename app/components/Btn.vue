<script lang='ts' setup>
defineProps<{
  label?: string
}>()
</script>

<template>
  <button class="text-3.5 text-white px-4 py-2 rounded-lg bg-blue-500 cursor-pointer select-none transition-colors active:bg-blue-700 hover:bg-blue-600">
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<style scoped></style>
