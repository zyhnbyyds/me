<script setup lang="ts">
</script>

<template>
  <div dark:bg-black>
    <NuxtLoadingIndicator :height="2" color="lightblue" />
    <NuxtLayout>
      <PreviewContainer>
        <NuxtPage />
      </PreviewContainer>
    </NuxtLayout>
  </div>
</template>

<style>
</style>
