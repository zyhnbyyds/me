<script setup lang="tsx">
const isDark = useDark()
</script>

<template>
  <div hw-full dark:bg-black>
    <NuxtLoadingIndicator :height="3" :color="isDark ? '#818cf8' : '#6366f1'" />
    <PreviewContainer :duration="500">
      <NuxtLayout>
        <NuxtPage keepalive />
      </NuxtLayout>
    </PreviewContainer>
  </div>
</template>

<style scoped></style>
