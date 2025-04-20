<script lang='ts' setup>
import { menuList } from '~/constants'

const activeMenu = ref(menuList[0].key)
</script>

<template>
  <div class="text-common mx-a hw-screen max-w-860px min-h-xl min-w-100 flex overflow-hidden">
    <header class="h-full w-50 border-r-0.5px border-gray-300 pr-3 <lg:w-16 dark:border-dark-500">
      <div class="h-52px w-52px flex-center inline-flex rounded-full transition-all" hover="bg-hover-common">
        <img h-40px w-40px src="/public/favicon.ico" rounded-full alt="" srcset="">
      </div>

      <div class="h-[calc(100%-118px)] pt-4px">
        <MenuBar v-model:active="activeMenu" :list="menuList" />
      </div>

      <div class="h-66px">
        <AvatarInfo />
      </div>
    </header>
    <div class="h-full w-70% overflow-auto">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
