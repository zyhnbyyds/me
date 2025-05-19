<script lang='ts' setup>
import { menuList } from '~/constants'

const activeMenu = ref(menuList[0].key)
const scrollRef = ref<HTMLElement | null>(null)

const { y, x } = useScroll(scrollRef)
// const route = useRoute()

provide('scroll', {
  y,
  x,
})

// watchEffect(() => {
//   activeMenu.value = route.path.split('/')[1]
// })
</script>

<template>
  <div class="hw-screen flex overflow-hidden text-common">
    <header class="h-full w-40% flex border-r-0.5px <lg:w-auto border-common">
      <div flex-1 />
      <div class="w-50 overflow-hidden px-3 transition-all <lg:w-19">
        <div class="h-14 w-14 flex-center inline-flex rounded-full transition-all" hover="bg-hover-common">
          <img h-10 w-10 src="/me.png" rounded-full alt="" srcset="">
        </div>

        <div class="h-[calc(100%-52px)] pt-4px">
          <MenuBar v-model:active="activeMenu" :list="menuList" />
        </div>
      </div>
      <!-- Mark: useless show -->
      <!-- <div class="h-66px">
        <AvatarInfo />
      </div> -->
    </header>

    <div ref="scrollRef" class="w-60% <lg:flex-1" overflow-auto>
      <div class="relative min-h-screen w-xl border-r-0.5px border-common">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
