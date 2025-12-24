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
  <div ref="pickerRef" flex-col-center select-none relative>
    <slot />
    <Transition name="fade-scale">
      <div v-if="pickerVisible" class="bg-light/40 top-100% backdrop-blur-md dark:bg-dark/40" mt5 p-2 rounded-md left-0 absolute z-100>
        <div max-h-60 w-84 overflow-auto>
          <div v-for="item in emojiList" :key="item" rounded-1.5 cursor-pointer transition-all hover:bg-light700 hover:backdrop-blur-md dark:hover:bg-dark-900 class="flex-center inline-flex h-10 w-10" @click="emits('select', hdImgUrl(item))">
            <img :src="hdImgUrl(item)" h-6.5 w-6.5 :alt="item">
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
