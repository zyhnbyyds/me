<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})
</script>

<template>
  <div h-screen w-screen flex-center flex-col dark:bg-dark dark:text-white>
    <h1 mb-4 text-10 font-bold>
      {{ error?.statusCode }}
    </h1>
    <div text-gary-700 mb-4 max-w-lg text-sm dark:text-gray-3>
      {{ error?.message }}
    </div>
    <NuxtLink to="/">
      <Btn label="Go back home" />
    </NuxtLink>
  </div>
</template>

<style scoped></style>
