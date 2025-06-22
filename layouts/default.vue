<script lang='ts' setup>
import { menuList } from '~/constants'

const scrollRef = ref<HTMLElement | null>(null)

const { y, x } = useScroll(scrollRef, {
  behavior: 'smooth',
})

const scrollHeight = computed(() => scrollRef.value?.scrollHeight ?? 0)
const scrollTop = computed(() => scrollRef.value?.scrollTop ?? 0)

provide('scroll', {
  y,
  x,
  scrollHeight,
  scrollTop,
})
</script>

<template>
  <div class="hw-full flex overflow-hidden text-common">
    <header class="h-full w-37% flex border-r-0.5px <lg:w-auto border-common">
      <div flex-1 />
      <div class="w-50 overflow-hidden px-3 transition-all <lg:w-19">
        <div class="h-14 w-14 flex-center inline-flex rounded-full transition-all" hover="bg-hover-common-trans">
          <NuxtImg h-10 w-10 src="/me.png" :quality="30" rounded-full alt="me-face" />
        </div>

        <div class="h-[calc(100%-52px)] pt-4px">
          <MenuBar :list="menuList" />
        </div>
      </div>
    </header>

    <div ref="scrollRef" class="scroll-container h-full w-63% flex overflow-auto <lg:flex-1">
      <div class="page-container relative w-38rem">
        <slot />
      </div>
      <div flex-1 />

      <BackTop v-model="y" />
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  scrollbar-color: gray transparent;
}
</style>
