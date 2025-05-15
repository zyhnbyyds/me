<script lang='ts' setup>
import Ipt from '../Ipt.vue'

type IptType = InstanceType<typeof Ipt>

const emits = defineEmits<{
  (e: 'send', val: EmojiInfo[]): void
}>()

const textarea = defineModel<string>({ default: '' })
const textareaRef = useTemplateRef<IptType>('textareaRef')
const commentRef = ref<HTMLDivElement | null>(null)
const emojiBtnRef = ref<HTMLButtonElement | null>(null)
const { isOutside } = useMouseInElement(emojiBtnRef)

const pickerVisible = ref(false)

const focused = ref(false)

onClickOutside(commentRef, () => {
  focused.value = false
  pickerVisible.value = false
})
function hdSelectEmoji(url: string) {
  textareaRef.value?.insertImage(url)
}

function hdOpenEmojiPicker() {
  if (focused.value) {
    pickerVisible.value = !pickerVisible.value
  }
  else {
    focused.value = true
    pickerVisible.value = !pickerVisible.value
  }
}

function hdSendComment() {
  if (!textarea.value) {
    return
  }
  emits('send', parseEmojiContent(textarea.value))
  textarea.value = ''
  focused.value = false
  textareaRef.value?.blur()
}
</script>

<template>
  <div
    ref="commentRef"
    class="w-full border-2 border-transparent rounded-md bg-light-5 text-3.5 outline-none transition-all duration-300 focus:border-2 focus:border-light-blue-3 dark:bg-dark-5 hover:bg-dark-3 hover:bg-op8 dark:hover:bg-op100"
    :class="[focused ? 'border-light-blue-3! dark:border-dark-3! bg-transparent!' : '']"
    @click="() => {
      focused = true;
      textareaRef?.focus();
    }"
  >
    <Ipt
      ref="textareaRef"
      v-model="textarea"
      placeholder="说点什么再走~"
      autocorrect="on"
      contenteditable="true"
      :class="[focused ? 'h-30' : 'h-15']"
      class="transition-all duration-300"
      w-full
      resize-none
      px-3 py-2 text-3.5 outline-none @focus="focused = true"
    />

    <footer class="flex justify-between px-3 pb-2 pt-1">
      <div class="flex items-center">
        <EmojiPicker v-model="pickerVisible" @select="hdSelectEmoji">
          <button ref="emojiBtnRef" class="relative mr-3 h-7 w-7 cursor-pointer" @click="hdOpenEmojiPicker">
            <Transition name="fade" mode="in-out">
              <span v-if="isOutside" absolute left-0 top-0 h-7 w-7 flex-center cursor-pointer>
                <Icon name="streamline-emojis:worried-face" text-6 />
              </span>
              <span v-else absolute left-0 top-0 h-7 w-7 flex-center>
                <Icon name="streamline-emojis:grimacing-face" text-6 />
              </span>
            </Transition>
          </button>
        </EmojiPicker>

        <button class="">
          <Icon name="streamline-emojis:tent" cursor-pointer text-5 transition-all hover:scale-105 class="mr-1" />
        </button>
      </div>

      <div class="flex items-center text-4 text-dark-3">
        <span mr-4 text-3>
          <span>{{ textarea.length }}</span> / 300
        </span>
        <button class="cursor-pointer rounded-1.3 bg-blue px-2.5 py-1 text-3.5 text-white" @click.stop="hdSendComment">
          发送
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>

</style>
