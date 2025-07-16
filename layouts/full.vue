<script lang='ts' setup>
import { menuList } from '~/constants'

const scrollRef = ref<HTMLElement | null>(null)

const { y, x } = useScroll(scrollRef)

provide('scroll', {
  y,
  x,
})
</script>

<template>
  <div class="hw-screen flex overflow-hidden text-common">
    <header class="h-full w-auto flex border-r-0.5px border-common">
      <div class="w-19 overflow-hidden px-3 transition-all">
        <div class="h-14 w-14 flex-center inline-flex rounded-full transition-all" hover="bg-hover-common-trans">
          <NuxtImg h-10 w-10 src="/me.png" :quality="30" rounded-full alt="me-face" />
        </div>

        <div class="h-[calc(100%-52px)] pt-4px">
          <MenuBar :list="menuList" :is-fold="true" />
        </div>
      </div>
    </header>
    <div ref="scrollRef" class="scroll-container h-full flex flex-1 overflow-auto">
      <div class="relative h-full w-full border-r-0.5px border-common">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
