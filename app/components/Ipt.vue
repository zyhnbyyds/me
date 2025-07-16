<script lang='ts' setup>
const props = defineProps<{
  placeholder?: string
  maxLength?: number
}>()

const emits = defineEmits<{
  (e: 'blur', val: Event): void
  (e: 'focus', val: Event): void
}>()

const iptVal = defineModel<string>({ default: '' })
const editableRef = ref<HTMLElement | null>(null)
const { focused } = useFocus(editableRef)
const len = ref<number>(0)

const showPlaceholder = computed(() => {
  if (len.value > 0)
    return ''

  return props.placeholder || '请输入...'
})

onMounted(() => {
  if (editableRef.value)
    editableRef.value.innerHTML = iptVal.value
})

watch(() => iptVal.value, (val) => {
  calculateLength()
  if (!val && editableRef.value) {
    editableRef.value.innerHTML = ''
  }
})

async function update(e: Event) {
  if (e.target) {
    const target = e.target as HTMLElement
    if (target.className.includes('chat-ipt')) {
      iptVal.value = target.innerHTML
    }
  }
}

async function calculateLength() {
  await nextTick()

  if (editableRef.value) {
    len.value = 0

    editableRef.value.childNodes.forEach((node) => {
      if (node.nodeName === 'IMG') {
        len.value += 1
      }
      else if (node.nodeName === '#text') {
        len.value += (node.textContent || '').length
      }
    })
  }
}

defineExpose({
  insertImage,
  focus: () => {
    focused.value = true
  },
  blur: () => {
    focused.value = false
  },
  focused,
  len,
})

function insertImage(url: string) {
  const img = document.createElement('img')
  img.src = url
  img.className = 'emoji-sm'

  const selection = window.getSelection()
  if (!selection || !selection.rangeCount || !editableRef.value)
    return

  const range = selection.getRangeAt(0)
  range.deleteContents()

  range.insertNode(img)

  const newRange = document.createRange()
  newRange.setStartAfter(img)
  newRange.setEndAfter(img)

  selection.removeAllRanges()
  selection.addRange(newRange)

  iptVal.value = editableRef.value.innerHTML
}

function handleBlur(event: FocusEvent) {
  emits('blur', event)
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain')
  if (text) {
    // 插入纯文本，保持原光标位置
    insertTextAtCursor(text)
  }
}

function insertTextAtCursor(text: string) {
  const selection = window.getSelection()
  if (!selection?.rangeCount)
    return

  const range = selection.getRangeAt(0)
  range.deleteContents()

  const textNode = document.createTextNode(text)
  range.insertNode(textNode)

  // 光标移到插入的文本后
  range.setStartAfter(textNode)
  range.collapse(true)

  selection.removeAllRanges()
  selection.addRange(range)

  if (editableRef.value)
    iptVal.value = editableRef.value.innerHTML
}
</script>

<template>
  <div
    ref="editableRef"
    class="chat-ipt w-full overflow-auto break-all px-3 py-2 text-3.5 outline-none"
    :class="len > 0 ? 'after:hidden' : 'after:block'"
    contenteditable="true"
    :placeholder="showPlaceholder"
    @blur="handleBlur"
    @focus="emits('focus', $event)"
    @input="update"
    @paste="handlePaste"
  />
</template>

<style scoped>
:v-deep(.chat-ipt .emoji-sm) {
  height: 20px !important;
  width: 20px !important;
}

.chat-ipt::before {
  position: absolute;
  content: attr(placeholder);
  user-select: none;
  color: #8a919f;
  font-size: 13px;
}
</style>
