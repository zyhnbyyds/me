<script setup lang="tsx">
const isDark = useDark()
</script>

<template>
  <div hw-full>
    <NuxtLoadingIndicator :height="3" :color="isDark ? '#2dd4bf' : '#0d9488'" />
    <PreviewContainer :duration="400">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </PreviewContainer>
  </div>
</template>

<style scoped></style>
