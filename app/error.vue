<script setup lang="ts">
import type { NuxtError } from '#app'
import consola from 'consola'

const props = defineProps({
  error: Object as () => NuxtError,
})

consola.log(props.error)
</script>

<template>
  <div class="flex-center flex-col h-screen w-screen dark:text-white dark:bg-dark">
    <h1 text-10 font-bold mb-4>
      {{ error?.status }}
    </h1>
    <div text-gary-700 dark:text-gray-3 text-sm mb-4 max-w-lg>
      {{ error }}
    </div>
    <NuxtLink to="/">
      <Btn label="Go back home" />
    </NuxtLink>
  </div>
</template>

<style scoped></style>
