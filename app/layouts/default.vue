<script lang="ts" setup>
import { menuList } from '~/constants'
</script>

<template>
  <div class="text-common flex hw-full overflow-hidden">
    <!-- 左侧边栏 -->
    <header
      class="border-r-0.5px border-common flex h-full w-20% <lg:w-auto <md:z-999"
    >
      <div flex-1 />
      <div
        class="flex flex-col px-3 w-50 transition-all <md:p-0 <lg:w-19 <md:w-0"
      >
        <!-- 头像 -->
        <div class="rounded-full flex-center inline-flex h-14 w-14 <md:hidden">
          <ClientOnly>
            <NuxtImg
              src="/me.png"
              :quality="30"
              rounded-full
              h-10
              w-10
              alt="me-face"
            />
          </ClientOnly>
        </div>

        <!-- 导航菜单 -->
        <div class="pt-4px flex-1">
          <MenuBar :list="menuList" />
        </div>

        <!-- 底部：暗色切换 -->
        <div class="flex flex-col items-center gap-4 pb-6">
          <div class="mx-auto w-6 border-t border-common" />
          <DarkToggle />
        </div>
      </div>
    </header>

    <!-- 内容区 -->
    <div class="relative flex-1 flex overflow-hidden">
      <div class="h-full w-80% <md:w-full">
        <slot />
      </div>
      <div class="flex h-full flex-1 p-5 pt14 pl10 <md:hidden">
        <Contact />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
