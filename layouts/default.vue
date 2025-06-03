<script lang='ts' setup>
import { menuList } from '~/constants'

const activeMenu = ref(menuList[0].key)
const scrollRef = ref<HTMLElement | null>(null)

const { y, x } = useScroll(scrollRef)

provide('scroll', {
  y,
  x,
})
</script>

<template>
  <div class="hw-screen flex overflow-hidden text-common">
    <header class="h-full w-37% flex border-r-0.5px <lg:w-auto border-common">
      <div flex-1 />
      <div class="w-50 overflow-hidden px-3 transition-all <lg:w-19">
        <div class="h-14 w-14 flex-center inline-flex rounded-full transition-all" hover="bg-hover-common-trans">
          <img h-10 w-10 src="/me.png" rounded-full alt="" srcset="">
        </div>

        <div class="h-[calc(100%-52px)] pt-4px">
          <MenuBar v-model:active="activeMenu" :list="menuList" />
        </div>
      </div>
    </header>

    <div ref="scrollRef" class="scroll-container h-full w-63% flex overflow-auto <lg:flex-1">
      <div class="relative h-full w-38rem border-r-0.5px border-common">
        <slot />
      </div>
      <div flex-1 />
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  scrollbar-color: gray transparent;
}
</style>
