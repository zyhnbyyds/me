<script lang='ts' setup>
// import { menuList } from '~/constants'

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
  <div class="text-common flex hw-full overflow-hidden">
    <header class="border-r-0.5px border-common flex h-full w-37% <lg:w-auto">
      <div flex-1 />
      <div class="px-3 w-50 transition-all overflow-hidden <lg:w-19">
        <div class="rounded-full flex-center inline-flex h-14 w-14 transition-all" hover="bg-hover-common-trans">
          <!-- <NuxtImg src="/me.png" :quality="30" rounded-full h-10 w-10 alt="me-face" /> -->
          测试
        </div>

        <div class="pt-4px h-[calc(100%-52px)]">
          <!-- <MenuBar :list="menuList" /> -->
          测试
        </div>
      </div>
    </header>

    <div ref="scrollRef" class="scroll-container flex h-full w-63% overflow-auto <lg:flex-1">
      <div class="page-container w-38rem relative">
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
