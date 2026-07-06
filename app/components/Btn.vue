<script lang="ts" setup>
defineProps<{
  label?: string
}>()
</script>

<template>
  <button
    class="text-3.5 text-white px-4 py-2 rounded-lg bg-c-accent cursor-pointer select-none transition-colors active:bg-c-accent-hover hover:bg-c-accent-hover"
  >
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<style scoped></style>
