<script lang="ts" setup>
export interface MenuBarItem {
  title: string
  /** 未激活图标 — Iconify 名称 或 SVG 图标 key */
  icon: string
  /** 激活图标 — Iconify 名称 或 SVG 图标 key */
  aIcon: string
  path: string
  isLink?: boolean
  key: string
  /** 为 true 时使用自定义 SVG 图标（AppIcon），否则使用 Iconify */
  isSvg?: boolean
}

interface Props {
  list: MenuBarItem[]
  isFold?: boolean
}
const { isFold = false } = defineProps<Props>()
const route = useRoute()

const { y } = inject<{
  y: Ref<number>
}>('scroll', { y: ref(0) })

const active = computed(() => {
  const splits = route.path.split('/')
  if (splits[1] === 'blog') {
    return '/'
  }
  return splits[1] ? `/${splits[1]}` : '/'
})

function handleMenuChange(path: string) {
  useRouter().push(path)
}
</script>

<template>
  <ul
    class="left-1/2 z-10 <md:px-3 <md:py-1 <md:rounded-full <md:bg-white/60 <md:flex <md:shadow-lg <md:bottom-2 <md:absolute <md:backdrop-blur-lg <md:dark:bg-dark/60 <md:-translate-x-1/2"
  >
    <li
      v-for="item in list"
      :key="item.path"
      class="w-a"
      @click="handleMenuChange(item.path)"
    >
      <div
        :to="item.path"
        class="mb-3 p-2 bg-hover-common-trans inline-flex w-a cursor-pointer items-center <md:mb-0"
        :class="item.path === active ? 'font-bold' : ''"
      >
        <div class="text-7 font-bold flex-center h-8 w-8">
          <!-- 自定义 SVG 图标 -->
          <AppIcon
            v-if="item.isSvg"
            :name="item.icon"
            :active="item.path === active"
            size="26"
          />
          <!-- Iconify 回退 -->
          <template v-else>
            <Icon v-show="item.path === active" :name="item.aIcon" />
            <Icon v-show="item.path !== active" :name="item.icon" />
          </template>
        </div>
        <span
          :class="{ hidden: isFold }"
          class="ml-3 mr-4 w-a inline-block text-nowrap text-ellipsis overflow-hidden <lg:hidden"
        >
          {{ item.title }}
        </span>
      </div>
    </li>
    <li class="flex-center w-12 md:hidden">
      <Transition name="slide-fade">
        <DarkToggle v-if="y <= 60" />
        <BackTop v-else v-model="y" show />
      </Transition>
    </li>
  </ul>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  position: absolute;
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
