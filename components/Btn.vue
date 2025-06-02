<script lang='ts' setup>
defineProps<{
  label?: string
}>()
</script>

<template>
  <button class="m-2 cursor-pointer select-none rounded-lg bg-blue-500 px-4 py-2 text-3.5 text-white transition-colors active:bg-blue-700 hover:bg-blue-600">
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<style scoped></style>
