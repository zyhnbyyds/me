<script lang='ts' setup>
// import videojs from 'video.js'
import 'video.js/dist/video-js.css'

defineOptions({
  name: 'QQVideo',
})

const props = defineProps<{
  videoId: string
  src?: string
  poster?: string
}>()

// let player: ReturnType<typeof videojs> | null = null

// onMounted(() => {
//   console.log(2)

//   player = videojs(props.videoId, {
//     controls: true,
//     height: '200px',
//     width: '200px',
//     autoplay: false,
//     loop: false,
//     muted: true,
//     playsinline: true,
//     sources: props.src ? [{ src: props.src }] : [],
//     enableSmoothSeeking: true,
//     preload: 'metadata',
//   })
// })

// onUnmounted(() => {
//   if (player) {
//     player.dispose()
//     player = null
//   }
// })
</script>

<template>
  <div relative h-full w-full select-none>
    <NuxtImg
      :src="props.poster"
      class="inset-0 h-full w-full object-cover"
    />
    <div class="left-50% top-50% transition-all -translate-x-50% -translate-y-50% hover:bg-dark-3 hover:bg-opacity-20" absolute flex cursor-pointer items-center justify-center border-2 border-gray-1 rounded-full p-6>
      <Icon name="carbon:play-filled-alt" absolute text-5 text-gray-1 />
    </div>
    <!-- <video
      v-show="false"
      :id="videoId"
      class="video-js vjs-default-skin"
    /> -->
  </div>
</template>

<style scoped></style>
