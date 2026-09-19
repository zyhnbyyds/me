<script lang="ts" setup>
const { count = 3 } = defineProps<{
  count?: number
}>()
</script>

<template>
  <div class="space-y-8" aria-hidden="true">
    <div v-for="i in count" :key="i">
      <div class="flex items-baseline justify-between">
        <div class="essay-skeleton-line h-2.5 w-16 rounded-full" />
        <div class="essay-skeleton-line h-2.5 w-26 rounded-full" />
      </div>
      <div
        class="essay-skeleton-line mt-3 aspect-[3/2] max-h-85 w-full rounded-xl"
      />
      <div class="mt-3.5 space-y-2">
        <div class="essay-skeleton-line h-3 w-full rounded-full" />
        <div class="essay-skeleton-line h-3 w-3/5 rounded-full" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.essay-skeleton-line {
  background: linear-gradient(
    90deg,
    var(--c-border) 25%,
    var(--c-hover) 37%,
    var(--c-border) 63%
  );
  background-size: 400% 100%;
  animation: essay-skeleton-shimmer 1.6s ease infinite;
}

@keyframes essay-skeleton-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
