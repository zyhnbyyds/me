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
  <div ref="iptRef" h-10 relative @click="focused = true">
    <input
      v-model="value"
      px-5 pl-10 rounded-full h-10 w-full dark:text-white dark:bg-dark-500
      class="outline-1 outline-light-900 outline-solid transition-colors focus:outline-2 dark:outline-dark-500 focus:outline-blue"
      :placeholder="props.placeholder"
    >
    <div flex-center h-5 w-5 left-3 absolute class="top-1/2 -translate-y-50%">
      <span class="i-material-symbols:search" text-5 />
    </div>

    <!-- 搜索内容 -->
    <Transition name="fade" class="origin-t">
      <div
        v-show="focused"
        class="rounded-lg bg-white w-full shadow-lg left-0 top-11 absolute z-10 overflow-hidden dark:bg-dark-500"
      >
        <div
          class="max-h-150 min-h-40 transition-height overflow-auto"
          :style="{ height: `${list.length * 60}px` }"
        >
          <div
            v-for="item in list"
            v-show="list.length !== 0" :key="item.id"

            text-4 lh-60px font-bold px-4 bg-hover-common-trans rounded-0 h-60px w-full cursor-pointer hover:bg-op4 @click="clickIptItem(item)"
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
