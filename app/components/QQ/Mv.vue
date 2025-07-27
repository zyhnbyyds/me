<script lang='ts' setup>
// import videojs from 'video.js'
import 'video.js/dist/video-js.css'

defineOptions({
  name: 'QQVideo',
})

const props = defineProps<{
  videoId: string
  src: string
  poster?: string
}>()

defineEmits<{
  play: [src: string, videoId: string]
}>()
</script>

<template>
  <div h-full w-full select-none relative>
    <NuxtImg
      :src="props.poster"
      class="h-full w-full inset-0 object-cover"
    />
    <div class="transition-all left-50% top-50% hover:bg-dark-300 hover:bg-opacity-20 -translate-x-50% -translate-y-50%" p-6 border-2 border-gray-100 rounded-full flex cursor-pointer items-center justify-center absolute @click="$emit('play', props.src, props.videoId)">
      <Icon name="carbon:play-filled-alt" text-5 text-gray-100 absolute />
    </div>
  </div>
</template>

<style scoped></style>
