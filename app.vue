<script setup lang="ts">
</script>

<template>
  <UApp>
    <div class="bg-white dark:bg-dark-900">
      <NuxtLayout :key="$route.path">
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<style>
</style>
