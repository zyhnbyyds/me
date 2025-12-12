<script lang='ts' setup>
defineProps<{
  url: string
  quality?: number
  cClass?: string
}>()

defineEmits<{
  load: []
  click: [url: string]
}>()
</script>

<template>
  <NuxtImg
    v-slot="{ isLoaded, imgAttrs, src }"
    :quality="quality"
    :src="url"
    preload
    :custom="true"
  >
    <div v-if="!isLoaded" class="animate-bg rounded-md hw-full" />
    <img v-else :src="src" v-bind="imgAttrs" :class="cClass" class="rounded-md hw-full object-cover object-center" @click="$emit('click', url)" @load="$emit('load')">
  </NuxtImg>
</template>

<style scoped></style>
