<script setup lang="ts">
</script>

<template>
  <div dark:bg-black>
    <UApp>
      <NuxtLoadingIndicator :height="2" />
      <NuxtLayout>
        <PreviewContainer>
          <NuxtPage />
        </PreviewContainer>
      </NuxtLayout>
    </UApp>
  </div>
</template>

<style>
</style>
