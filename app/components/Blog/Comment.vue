<script lang='ts' setup>
import Ipt from '../Ipt.vue'

type IptType = InstanceType<typeof Ipt>

const props = defineProps<{
  loading: boolean
  placeholder?: string
}>()

const emits = defineEmits<{
  (e: 'send', val: EmojiInfo[]): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

const textarea = defineModel<string>({ default: '' })
const textareaRef = useTemplateRef<IptType>('textareaRef')
const commentRef = ref<HTMLDivElement>()
const emojiBtnRef = ref<HTMLButtonElement>()
const { isOutside } = useMouseInElement(emojiBtnRef)

const pickerVisible = ref(false)

const focused = ref(false)

const iptLength = computed(() => {
  return textareaRef.value?.len ?? 0
})

onClickOutside(commentRef, () => {
  focused.value = false
  pickerVisible.value = false
})

onKeyStroke(
  'Enter',
  (e) => {
    e.preventDefault()
    if (iptLength.value !== 0) {
      hdSendComment()
    }
  },
  { target: commentRef },
)

watch(() => focused.value, (val) => {
  if (!val) {
    emits('blur')
  }
  else {
    emits('focus')
  }
})

defineExpose({
  focus: () => {
    focused.value = true
    textareaRef.value?.focus()
  },
  blur: () => {
    focused.value = false
    pickerVisible.value = false
  },
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
  if (!textarea.value || !useUserSession().loggedIn.value || props.loading) {
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
    class="text-3.5 outline-none border-2 border-transparent rounded-md bg-light-500 w-full transition-all duration-300 focus:border-2 focus:border-blue-300 dark:bg-dark-500 hover:bg-dark-300 hover:bg-op8 dark:hover:bg-op100"
    :class="[focused ? 'border-blue-300! dark:border-dark-300! bg-transparent!' : '']"
    @click="() => {
      focused = true;
      textareaRef?.focus();
    }"
  >
    <Ipt
      ref="textareaRef"
      v-model="textarea"
      :placeholder="placeholder ?? '发表评论'"
      :class="[focused ? 'h-30' : 'h-15 text-[#536471]']"
      class="max-h-50 transition-all duration-300"
      w-full
      resize-none
      @focus="focused = true"
    />

    <footer class="px-3 pb-2 pt-1 flex justify-between">
      <div class="flex items-center">
        <EmojiPicker v-model="pickerVisible" @select="hdSelectEmoji">
          <div ref="emojiBtnRef" class="mr-3 h-7 w-7 cursor-pointer relative" @click="hdOpenEmojiPicker">
            <Transition name="fade" mode="in-out">
              <span v-if="isOutside" flex-center h-7 w-7 cursor-pointer left-0 top-0 absolute>
                <span class="i-streamline-emojis:worried-face" text-6 />
              </span>
              <span v-else flex-center h-7 w-7 left-0 top-0 absolute>
                <span class="i-streamline-emojis:grimacing-face" text-6 />
              </span>
            </Transition>
          </div>
        </EmojiPicker>
      </div>

      <div class="text-dark-3 text-4 flex items-center">
        <span text-3 mr-4>
          <span>{{ iptLength }}</span> / 300
        </span>
        <div :loading="loading" :class="focused ? 'dark:text-gray-1' : ''" text-3.3 px-3 py-1 rounded-md cursor-pointer select-none transition-colors hover:border-common hover:bg-gray200 hover:dark:text-gray-200 dark:hover:bg-dark-100 @click.stop="hdSendComment">
          发送
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>

</style>
