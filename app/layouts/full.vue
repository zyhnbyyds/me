<script lang="ts" setup>
import { menuList } from '~/constants'

const scrollRef = ref<HTMLElement>()

const { y, x } = useScroll(scrollRef)

provide('scroll', {
  y,
  x,
})
</script>

<template>
  <div class="text-common flex hw-screen overflow-hidden">
    <header class="border-r-0.5px border-common flex h-full w-auto">
      <div class="px-3 w-19 transition-all overflow-hidden">
        <div
          class="rounded-full flex-center inline-flex h-14 w-14 transition-all"
          hover="bg-hover-common-trans"
        >
          <NuxtImg
            src="/me.png"
            :quality="30"
            rounded-full
            h-10
            w-10
            alt="me-face"
          />
        </div>

        <div class="pt-4px h-[calc(100%-52px)]">
          <MenuBar :list="menuList" :is-fold="true" />
        </div>
      </div>
    </header>
    <div
      ref="scrollRef"
      class="scroll-container flex flex-1 h-full overflow-auto"
    >
      <div class="border-r-0.5px border-common h-full w-full relative">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
