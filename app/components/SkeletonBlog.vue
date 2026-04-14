<script setup lang="ts">
defineProps<{
  lines?: number
  showImage?: boolean
  showTitle?: boolean
}>()
</script>

<template>
  <div class="skeleton-blog px-4 py-6 max-w-3xl mx-auto">
    <!-- 标题骨架 -->
    <div v-if="showTitle !== false" class="mb-6">
      <div class="skeleton-line h-8 w-3/4 mb-3 rounded-lg" />
      <div class="skeleton-line h-4 w-1/2 rounded" />
    </div>

    <!-- 图片骨架 -->
    <div v-if="showImage" class="skeleton-line h-48 w-full rounded-xl mb-6" />

    <!-- 正文骨架行 -->
    <div class="space-y-3">
      <div
        v-for="i in lines ?? 8"
        :key="i"
        class="skeleton-line rounded"
        :class="[
          i % 5 === 0 ? 'h-3 w-3/5' : i % 3 === 0 ? 'h-3 w-4/5' : 'h-3 w-full',
        ]"
      />
    </div>

    <!-- 代码块骨架 -->
    <div class="mt-6 skeleton-line h-32 w-full rounded-xl" />

    <div class="space-y-3 mt-6">
      <div
        v-for="i in 4"
        :key="`b-${i}`"
        class="skeleton-line rounded h-3"
        :class="i === 4 ? 'w-2/5' : 'w-full'"
      />
    </div>
  </div>
</template>

<style scoped>
.skeleton-line {
  background: linear-gradient(
    90deg,
    rgba(200, 200, 200, 0.3) 25%,
    rgba(220, 220, 220, 0.5) 37%,
    rgba(200, 200, 200, 0.3) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.6s ease infinite;
}

.dark .skeleton-line {
  background: linear-gradient(
    90deg,
    rgba(50, 50, 65, 0.6) 25%,
    rgba(70, 70, 90, 0.8) 37%,
    rgba(50, 50, 65, 0.6) 63%
  );
  background-size: 400% 100%;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: -100% 50%;
  }
}
</style>
