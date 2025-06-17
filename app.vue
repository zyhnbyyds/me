<script setup lang="tsx">
</script>

<template>
  <div dark:bg-black>
    <NuxtLoadingIndicator :height="2" color="lightblue" />
    <NuxtLayout>
      <PreviewContainer :duration="500">
        <NuxtPage />
      </PreviewContainer>
    </NuxtLayout>
  </div>
</template>

<style scoped>
</style>
