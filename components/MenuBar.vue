<script lang='ts' setup>
export interface MenuBarItem {
  title: string
  /** 未激活 */
  icon: string
  /** 激活 */
  aIcon: string
  path: string
  isLink?: boolean
  key: string
}

interface Props {
  list: MenuBarItem[]
}

defineProps<Props>()

const active = defineModel<string>('active')
</script>

<template>
  <ul class="font-twiter">
    <li v-for="item in list" :key="item.key" class="w-a">
      <NuxtLink
        :to="item.path"
        class="mb-3 w-a inline-flex cursor-pointer items-center p-2 text-5 bg-hover-common" :class="item.key === active ? 'font-bold' : ''"
        @click="active = item.key"
      >
        <div class="h-8 w-8 flex-center">
          <Icon :name="item.key === active ? item.aIcon : item.icon" text-8 />
        </div>
        <span class="ml-5 mr-4 w-a <lg:hidden">
          {{ item.title }}
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.font-twiter {
  font-family:
    TwitterChirp,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
}
</style>
