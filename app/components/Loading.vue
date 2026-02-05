<script lang="ts" setup>
const { text = 'Loading...' } = defineProps<{
  text?: string
  loading: boolean
}>()
</script>

<template>
  <div relative>
    <slot />
    <Transition name="fade" :duration="300">
      <div v-if="loading" flex h-full min-h-20 w-full items-center inset-0 justify-center absolute>
        <div
          class="text-5 text-transparent font-bold font-italic animate-pulse from-purple-500 to-pink-500 bg-linear-to-r bg-clip-text"
        >
          {{ text }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
