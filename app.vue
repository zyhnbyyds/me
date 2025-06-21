<script setup lang="tsx">
</script>

<template>
  <div hw-full dark:bg-black>
    <NuxtLoadingIndicator :height="2" color="lightblue" />
    <PreviewContainer :duration="500">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </PreviewContainer>
  </div>
</template>

<style scoped>

</style>
