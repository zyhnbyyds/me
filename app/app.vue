<script setup lang="tsx">
const isDark = useDark()
</script>

<template>
  <div hw-full dark:bg-black>
    <NuxtLoadingIndicator :height="4" :color="isDark ? 'gray' : 'lightblue'" />
    <PreviewContainer :duration="500">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </PreviewContainer>
  </div>
</template>

<style scoped>

</style>
