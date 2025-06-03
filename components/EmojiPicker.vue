<script lang='ts' setup>
import { emojiList } from '~/config/emoji'

const emits = defineEmits<{
  (event: 'select', url: string): void
}>()

const pickerVisible = defineModel<boolean>({ default: false })
const pickerRef = ref<HTMLElement>()

onClickOutside(pickerRef, () => {
  pickerVisible.value = false
})
function hdImgUrl(name: string) {
  return `/emojis/${name}`
}
</script>

<template>
  <div ref="pickerRef" relative flex-col-center select-none>
    <slot />
    <Transition name="fade">
      <div v-if="pickerVisible" class="top-100%" absolute left-0 z-100 mt5 rounded-md bg-light-2 p-2 shadow-md dark:bg-dark-5>
        <div max-h-60 w-84 overflow-auto>
          <div v-for="item in emojiList" :key="item" cursor-pointer rounded-1.5 transition-all hover:bg-light7 dark:hover:bg-dark-9 class="h-10 w-10 flex-center inline-flex" @click="emits('select', hdImgUrl(item))">
            <img :src="hdImgUrl(item)" h-6.5 w-6.5 :alt="item">
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
