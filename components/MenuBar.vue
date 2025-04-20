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

const active = defineModel('active', {
  type: String,
  default: 'home',
})
</script>

<template>
  <ul class="font-twiter">
    <li v-for="item in list" :key="item.key" class="w-a" @click="active = item.key">
      <NuxtLink
        :to="item.path" class="w-a inline-flex cursor-pointer items-center rounded-full p-3 text-5 transition-all"
        :class="item.key === active ? 'font-bold' : ''"
        hover="bg-[rgba(15,20,25,0.1)]"
      >
        <div class="h-6 w-6 flex-center">
          <Icon :name="item.key === active ? item.aIcon : item.icon" style="font-size: 25px;" />
        </div>
        <span class="ml-5 mr-4 w-a">
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
