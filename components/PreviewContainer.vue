<script lang='ts' setup>
const visible = ref(false)
const isFloating = ref(false)

watch(visible, async (val) => {
  if (!val) {
    setTimeout(() => {
      isFloating.value = false
    }, 700)
  }
  else {
    isFloating.value = true
  }
})

provide('previewVisible', visible)
provide('isFloating', isFloating)
</script>

<template>
  <div class="hw-full">
    <slot />
    <div id="previewImg" class="preview-img" :class="isFloating ? 'fixed transition-all left-0 top-0 z-50 hw-full' : ''" @click="visible = false" />
    <Transition name="fade" :duration="700">
      <div v-if="visible" fixed left-0 top-0 z-45 hw-full overflow-hidden bg-black bg-op70 transition-all />
    </Transition>
  </div>
</template>

<style scoped>

</style>
