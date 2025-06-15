<script lang='ts' setup>
import type { CSSProperties, Reactive } from 'vue'
import { inject, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'

const { src, active = false } = defineProps<{
  src: string
  active?: boolean
}>()

const emits = defineEmits<{
  select: [name: string]
}>()

const imgRef = ref<HTMLImageElement | null>(null)
const boxRef = ref<HTMLDivElement | null>(null)

const { height: wHeight, width: wWidth } = useWindowSize()
const previewRefStyle = ref<CSSProperties | null>(null)
const previewInfo = inject<Reactive<any>>('previewInfo', reactive<any>({}))
const { x, y, height, width } = useElementBounding(imgRef)
const { x: boxX, y: boxY, height: boxHeight, width: boxWidth } = useElementBounding(boxRef)
const loading = ref(true)

const bHeight = ref(0)

onClickOutside(imgRef, async () => {
  if (!previewInfo.visible || previewInfo.floating)

    return
  previewInfo.visible = false
})

watch(() => previewInfo.visible, (val) => {
  if (!val) {
    calculatePosition(true)
  }
  else {
    calculatePosition()
  }
})

function handleImgLoad() {
  loading.value = false
}

async function calculatePosition(back = false) {
  if (!imgRef.value)
    return
  const centerX = wWidth.value / 2
  const centerY = wHeight.value / 2
  const left = back ? boxX.value : x.value
  const top = back ? boxY.value : y.value
  const h = back ? boxHeight.value : height.value
  const w = back ? boxWidth.value : width.value
  let scale = 1

  function calculateStart() {
    if (!back) {
      bHeight.value = h
    }
    previewRefStyle.value = {
      transform: `translate(${left}px, ${top}px) scale(${scale})`,
      height: `${h}px`,
      width: `${w}px`,
    }
  }

  function calculateEnd() {
    scale = Math.min(wWidth.value * 0.8 / w, wHeight.value * 0.8 / h)
    const translateX = centerX - w / 2
    const translateY = centerY - h / 2

    previewRefStyle.value = {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      height: `${h}px`,
      width: `${w}px`,
      borderRadius: '0',
    }
  }

  if (!back) {
    calculateStart()
    await nextTick()
    calculateEnd()
  }
  else {
    calculateStart()
  }
}

function hdClickPreview() {
  if (previewInfo.floating || loading.value) {
    return
  }
  emits('select', src)
  previewInfo.visible = true
}

onBeforeUnmount(() => {
  previewInfo.visible = false
})
</script>

<template>
  <div :style="{ height: (active && previewInfo.floating) ? `${bHeight}px` : '' }" relative :class="loading ? 'loading-mask' : ''">
    <Teleport to="#previewImg" :disabled="!previewInfo.floating || !active">
      <NuxtImg
        ref="imgRef"
        :style="{ ...(active && previewInfo.floating) ? previewRefStyle : {}, ...{ transitionDuration: `${previewInfo.duration}ms` } }"
        :src="src ?? ''"
        :alt="src ?? ''"
        :class="[(active && previewInfo.floating) ? 'absolute' : '']"
        w-full cursor-pointer rounded-md transition-all provider="minio" @load="handleImgLoad" @click="hdClickPreview"
      />
    </Teleport>
    <div v-show="(active && previewInfo.floating)" ref="boxRef" :style="{ height: `${bHeight}px` }" invisible w-full inline-flex />
  </div>
</template>

<style scoped>
.loading-mask::after {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: inline-block;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 37%, #e0e0e0 63%);
  background-size: 200% 100%;
  border-radius: 5px;
  animation: skeleton-loading 2s infinite;
  content: '';
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
