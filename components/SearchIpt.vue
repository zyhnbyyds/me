<script lang='ts' setup>
import type { ContentExclude } from '~/pages/explore.vue'

export interface SearchIptProps {
  placeholder?: string
  list: ContentExclude[]
}

const props = withDefaults(defineProps<SearchIptProps>(), {
  placeholder: '搜索',
  labelFiled: 'title',
})
const iptRef = useTemplateRef<HTMLElement>('iptRef')
const focused = ref(false)

onClickOutside(iptRef, () => {
  focused.value = false
})

const value = defineModel<string>({ default: '' })

function clickIptItem(e: ContentExclude) {
  const item = props.list.find(i => i.id === e.id)
  if (item) {
    focused.value = false
    useRouter().push(item.path)
  }
}
</script>

<template>
  <div ref="iptRef" relative h-10 @click="focused = true">
    <input
      v-model="value"
      h-10 w-full rounded-full px-5 pl-10
      dark:bg-dark-500 dark:text-white
      class="outline-1 outline-light-9 outline-solid transition-colors focus:outline-2 dark:outline-dark-500 focus:outline-blue"
      :placeholder="props.placeholder"
    >
    <div absolute left-3 h-5 w-5 flex-center class="top-1/2 -translate-y-50%">
      <span class="i-material-symbols:search" text-5 />
    </div>

    <!-- 搜索内容 -->
    <Transition name="fade" class="origin-t">
      <div
        v-show="focused"
        class="absolute left-0 top-11 z-10 w-full overflow-hidden rounded-lg bg-white shadow-lg dark:bg-dark-500"
      >
        <div
          class="max-h-150 min-h-40 overflow-auto transition-height"
          :style="{ height: `${list.length * 60}px` }"
        >
          <div
            v-for="item in list"
            v-show="list.length !== 0" :key="item.id"
            h-60px
            w-full cursor-pointer rounded-0 px-4 text-4 font-bold lh-60px hover:bg-op4 bg-hover-common @click="clickIptItem(item)"
          >
            {{ item.title }}
          </div>
          <div v-show="list.length === 0" pb-20 pt-10 text-center class="text-[rgb(83,100,113)]">
            尝试搜索人物、列表或关键词
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: all 0.2s ease;
  transform: scaleY(1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>
