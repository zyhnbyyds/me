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
  <div ref="pickerRef" relative flex-col-center>
    <slot />
    <Transition name="fade">
      <div v-if="pickerVisible" class="top-100%" absolute left-0 mt5 bg-light-3 p-2 shadow-md>
        <div max-h-60 w-84 overflow-auto>
          <button v-for="item in emojiList" :key="item" cursor-pointer rounded-1.5 transition-all hover:bg-light7 class="h-10 w-10 flex-center inline-flex" @click="emits('select', hdImgUrl(item))">
            <img :src="hdImgUrl(item)" h-6.5 w-6.5 :alt="item">
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
