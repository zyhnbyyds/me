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
  <div relative h-full w-full select-none>
    <NuxtImg
      :src="props.poster"
      class="inset-0 h-full w-full object-cover"
    />
    <div class="left-50% top-50% transition-all -translate-x-50% -translate-y-50% hover:bg-dark-3 hover:bg-opacity-20" absolute flex cursor-pointer items-center justify-center border-2 border-gray-1 rounded-full p-6 @click="$emit('play', props.src, props.videoId)">
      <Icon name="carbon:play-filled-alt" absolute text-5 text-gray-1 />
    </div>
  </div>
</template>

<style scoped></style>
