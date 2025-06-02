<script setup lang="ts">
</script>

<template>
  <div dark:bg-black>
    <NuxtLoadingIndicator :height="2" color="lightblue" />
    <NuxtLayout>
      <PreviewContainer>
        <NuxtPage :transition="{ name: 'fade-scale', mode: 'out-in' }" />
      </PreviewContainer>
    </NuxtLayout>
  </div>
</template>

<style>
</style>
