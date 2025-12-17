<script lang='ts' setup>
import type { SearchResItem } from '~/pages/explore.vue'

export interface SearchIptProps {
  placeholder?: string
  list: SearchResItem[]
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

function clickIptItem(e: SearchResItem) {
  useRouter().push(e.path)
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
      <Icon name="material-symbols:search" text-5 />
    </div>

    <!-- 搜索内容 -->
    <Transition name="fade" class="origin-t">
      <div
        v-show="focused"
        class="rounded-lg bg-white/60 w-full shadow-lg left-0 top-11 absolute z-10 overflow-hidden backdrop-blur-lg dark:bg-dark-500/60"
      >
        <div
          class="max-h-150 min-h-40 transition-height overflow-auto"
          :style="{ height: `${list.length * 60}px` }"
        >
          <div
            v-for="item in list"
            v-show="list.length !== 0" :key="item.id"
            text-3.5 lh-40px px-4 border-b border-common bg-hover-common-trans rounded-0 border-dashed h-40px w-full cursor-pointer text-nowrap text-ellipsis overflow-hidden hover:text-black hover:bg-light-200 @click="clickIptItem(item)"
          >
            {{ item.keyword }}
          </div>
          <div v-show="list.length === 0" pb-20 pt-10 text-center class="text-[rgb(83,100,113)]">
            尝试输入关键词搜索
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
