<script lang='ts' setup>
const { text = 'Loading...' } = defineProps<{
  text?: string
  loading: boolean
}>()
</script>

<template>
  <div relative>
    <slot />
    <Transition name="fade" :duration="300">
      <div v-if="loading" absolute inset-0 h-full min-h-20 w-full flex items-center justify-center>
        <div class="animate-pulse from-purple-500 to-pink-500 bg-gradient-to-r bg-clip-text text-5 text-transparent font-bold font-italic">
          {{ text }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
</style>
