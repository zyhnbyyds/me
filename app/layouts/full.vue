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
    <!-- 左侧折叠边栏 -->
    <header class="border-r-0.5px border-common flex h-full w-auto">
      <div class="flex flex-col px-3 w-19 transition-all overflow-hidden">
        <!-- 头像 -->
        <div
          class="rounded-full flex-center inline-flex h-14 w-14 transition-all"
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

        <!-- 折叠菜单 -->
        <div class="pt-4px flex-1">
          <MenuBar :list="menuList" :is-fold="true" />
        </div>

        <!-- 底部 -->
        <div class="flex flex-col items-center gap-4 pb-6">
          <div class="mx-auto w-6 border-t border-common" />
          <DarkToggle />
        </div>
      </div>
    </header>

    <div ref="scrollRef" class="scroll-container flex flex-1 overflow-auto">
      <div class="h-full w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
