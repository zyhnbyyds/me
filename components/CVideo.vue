<script lang='ts' setup>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

defineOptions({
  name: 'QQVideo',
})

const props = defineProps<{
  videoId: string
  src?: string
  poster?: string
}>()

let player: ReturnType<typeof videojs> | null = null

onMounted(() => {
  player = videojs(props.videoId, {
    controls: true,
    autoplay: true,
    poster: props.poster,
    loop: false,
    muted: false,
    playsinline: true,
    sources: props.src ? [{ src: props.src }] : [],
    enableSmoothSeeking: true,
    preload: 'metadata',
  })
})

onUnmounted(() => {
  if (player) {
    player.dispose()
    player = null
  }
})
</script>

<template>
  <video
    :id="videoId"
    class="video-js vjs-default-skin max-h-90% max-w-90%"
  />
</template>

<style scoped></style>
