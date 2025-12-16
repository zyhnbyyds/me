<script lang='ts' setup>
import { menuList } from '~/constants'

const scrollRef = ref<HTMLElement>()

const { y, x } = useScroll(scrollRef, {
  behavior: 'auto',
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
  <div class="text-common flex hw-full overflow-hidden">
    <header class="border-r-0.5px border-common flex h-full w-20% <lg:w-auto">
      <div flex-1 />
      <div class="px-3 w-50 transition-all <md:p-0 <lg:w-19 <md:w-0">
        <div class="rounded-full flex-center inline-flex h-14 w-14 <md:hidden">
          <NuxtImg src="/me.png" :quality="30" rounded-full h-10 w-10 alt="me-face" />
        </div>

        <div class="pt-4px h-[calc(100%-52px)]">
          <MenuBar :list="menuList" />
        </div>
      </div>
    </header>

    <div ref="scrollRef" class="scroll-container flex h-full w-80% overflow-auto <lg:flex-1">
      <div class="page-container w-80% relative <lg:w-full">
        <slot />
      </div>

      <BackTop v-model="y" class="bottom-4 right-4 fixed <md:hidden" />
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  scrollbar-color: lightgray transparent;
  scrollbar-gutter: stable;
}
</style>
