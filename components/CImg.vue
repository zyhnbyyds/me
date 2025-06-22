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
    :custom="true"
  >
    <div v-if="!isLoaded" class="animate-bg hw-full rounded-md" />
    <img v-else :src="src" v-bind="imgAttrs" :class="cClass" class="hw-full rounded-md object-cover object-center" @click="$emit('click', url)" @load="$emit('load')">
  </NuxtImg>
</template>

<style scoped></style>
