<script lang='ts' setup>
const textarea = defineModel<string>({ default: '' })
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const commentRef = ref<HTMLDivElement | null>(null)
const emojiBtnRef = ref<HTMLButtonElement | null>(null)
const { isOutside } = useMouseInElement(emojiBtnRef)

const { focused } = useFocusWithin(commentRef)
</script>

<template>
  <div
    ref="commentRef"
    class="w-full border-2 border-transparent rounded-md bg-light-5 text-3.5 outline-none transition-all duration-300 focus:border-2 focus:border-light-blue-3 hover:bg-dark-3 hover:bg-op8"
    :class="[focused ? 'border-light-blue-3! bg-transparent!' : '']"
  >
    <textarea
      ref="textareaRef"
      v-model="textarea"
      placeholder="说点什么再走~"
      autocorrect="on"
      :class="[focused ? 'h-30' : 'h-15']"
      class="transition-all duration-300"
      w-full resize-none px-3 py-2 text-3.5 outline-none
    />
    <footer class="flex justify-between px-3 py-2">
      <div class="flex items-center">
        <button ref="emojiBtnRef" class="relative mr-3 h-5 w-5 rounded-md">
          <Transition name="fade" mode="in-out">
            <span v-if="isOutside" absolute left-0 top-0 h-5 w-5 flex-center cursor-pointer>
              <Icon name="streamline-emojis:worried-face" text-5 />
            </span>
            <span v-else absolute left-0 top-0 h-5 w-5 flex-center>
              <Icon name="streamline-emojis:grimacing-face" text-5 />
            </span>
          </Transition>
        </button>
        <button class="">
          <Icon name="streamline-emojis:tent" text-5 class="mr-1" />
        </button>
      </div>

      <div class="flex items-center text-4 text-dark-3">
        <span mr-4 text-3>
          <span>{{ textarea.length }}</span> / 300
        </span>
        <button class="rounded-1.3 bg-blue px-2.5 py-1 text-white">
          发送
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
