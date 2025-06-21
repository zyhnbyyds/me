<script lang='ts' setup>
import { provide, reactive, watch } from 'vue'

const { duration = 500 } = defineProps<{
  duration?: number
}>()

const previewInfo = reactive<any>({
  visible: false,
  floating: false,
  duration,
})

watch(() => previewInfo.visible, async (val) => {
  if (!val) {
    setTimeout(() => {
      previewInfo.floating = false
    }, duration)
  }
  else {
    previewInfo.floating = true
  }
})

provide('previewInfo', previewInfo)

function hdStopPreview() {
  previewInfo.visible = false
}
</script>

<template>
  <div class="preview-container h-full w-full">
    <slot />
    <div id="previewImg" class="preview-img" :class="previewInfo.floating ? 'fixed left-0 top-0 z-50 h-full w-full' : ''" @click="hdStopPreview" />
    <Transition name="fade">
      <div v-if="previewInfo.visible" fixed left-0 top-0 z-45 h-full w-full overflow-hidden bg-black bg-op40 :style="{ transitionDuration: `${previewInfo.duration}ms` }" />
    </Transition>
  </div>
</template>

<style scoped>

</style>
