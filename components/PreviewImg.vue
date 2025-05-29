<script lang='ts' setup>
import type { CSSProperties } from 'vue'

const props = defineProps<{
  name?: string
  active: boolean
}>()

const imgRef = ref<HTMLImageElement | null>(null)
const boxRef = ref<HTMLDivElement | null>(null)

const { height: wHeight, width: wWidth } = useWindowSize()
const previewRefStyle = ref<CSSProperties | null>(null)
const isPreviewing = inject<Ref<boolean>>('previewVisible', ref(false))
const isFloating = inject<Ref<boolean>>('isFloating', ref(false))
const { x, y, height, width } = useElementBounding(imgRef)
const { x: boxX, y: boxY, height: boxHeight, width: boxWidth } = useElementBounding(boxRef)
const bHeight = ref(0)

onClickOutside(imgRef, async () => {
  if (!isPreviewing.value)
    return
  isPreviewing.value = false
})

watch(isPreviewing, async (val) => {
  if (!val) {
    await calculatePosition(true)
  }
  else {
    await calculatePosition()
  }
})

async function calculatePosition(back = false) {
  if (!imgRef.value || !props.active)
    return
  const centerX = wWidth.value / 2
  const centerY = wHeight.value / 2
  const left = back ? boxX.value : x.value
  const top = back ? boxY.value : y.value
  const h = back ? boxHeight.value : height.value
  const w = back ? boxWidth.value : width.value

  function calculateStart() {
    if (!back) {
      bHeight.value = h
    }
    previewRefStyle.value = {
      left: `${left}px`,
      top: `${top}px`,
      height: `${h}px`,
      width: `${w}px`,
    }
  }

  function calculateEnd() {
    previewRefStyle.value = {
      left: `${centerX - w}px`,
      top: `${centerY - h}px`,
      height: `${h * 2}px`,
      width: `${w * 2}px`,
    }
  }

  if (!back) {
    calculateStart()
    await nextTick()
    setTimeout(() => {
      calculateEnd()
    }, 0)
  }
  else {
    calculateStart()
  }
}

onBeforeUnmount(() => {
  isPreviewing.value = false
})
</script>

<template>
  <div :style="{ height: (active && isFloating) ? `${bHeight + 8}px` : 'auto' }" pb-8px>
    <Teleport to="#previewImg" :disabled="!isFloating || !active">
      <NuxtImg
        ref="imgRef"
        format="webp"
        :style="(active && isFloating) ? previewRefStyle : null"
        :quality="20"
        :src="name ?? ''"
        w-full
        loading="lazy"
        :class="(active && isFloating) ? 'fixed' : ''"
        cursor-pointer rounded-md transition-all duration-500 provider="minio"
      />
    </Teleport>
    <div v-if="(active && isFloating)" ref="boxRef" :style="{ height: `${bHeight}px` }" invisible w-full inline-flex />
  </div>
</template>

<style scoped></style>
