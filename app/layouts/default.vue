<script lang="ts" setup>
import { menuList } from '~/constants'
</script>

<template>
  <div class="text-common flex hw-full overflow-hidden">
    <header
      class="border-r-0.5px border-common flex h-full w-20% <lg:w-auto z-9997"
    >
      <div flex-1 />
      <div class="px-3 w-50 transition-all <md:p-0 <lg:w-19 <md:w-0">
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

        <div class="pt-4px h-[calc(100%-52px)]">
          <MenuBar :list="menuList" />
        </div>
      </div>
    </header>

    <div class="flex h-full flex-1 relative z-10">
      <div class="page-container relative w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
