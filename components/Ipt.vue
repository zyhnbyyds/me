<script lang='ts' setup>
const emits = defineEmits<{
  (e: 'blur', val: Event): void
  (e: 'focus', val: Event): void
}>()
const iptVal = defineModel<string>({ default: '' })
const editableRef = ref<HTMLElement | null>(null)
const { focused } = useFocus(editableRef)
const len = ref<number>(0)

onMounted(() => {
  if (editableRef.value)
    editableRef.value.innerHTML = iptVal.value
})

watch(() => iptVal.value, (val) => {
  caculateLength()
  if (!val && editableRef.value) {
    editableRef.value.innerHTML = ''
  }
})

async function update(e: Event) {
  if (e.target) {
    // 将输入框内容同步到 iptVal
    iptVal.value = (e.target as HTMLElement).innerHTML
  }
}

async function caculateLength() {
  await nextTick() // 等待 DOM 更新完成

  if (editableRef.value) {
    len.value = 0 // 重置长度计数器

    // 遍历子节点计算长度
    editableRef.value.childNodes.forEach((node) => {
      if (node.nodeName === 'IMG') {
        len.value += 1 // 每个图片算作一个单位
      }
      else if (node.nodeName === '#text') {
        len.value += (node.textContent || '').length // 文本节点按字符长度累加
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
  range.deleteContents() // 插入前删掉选区内容

  range.insertNode(img)

  // 🧠 插入完后，光标移动到图片后面
  const newRange = document.createRange()
  newRange.setStartAfter(img)
  newRange.setEndAfter(img)

  selection.removeAllRanges()
  selection.addRange(newRange)

  // ✨ 更新绑定的内容
  iptVal.value = editableRef.value.innerHTML
}

function hadndleBlur(event: FocusEvent) {
  emits('blur', event)
}
</script>

<template>
  <div
    ref="editableRef"
    class="chat-ipt w-full break-all px-3 py-2 text-3.5 outline-none"
    contenteditable="true"
    @blur="hadndleBlur"
    @focus="emits('focus', $event)"
    @input="update"
  >
    请输入
  </div>
</template>

<style scoped>
:v-deep(.chat-ipt .emoji-sm) {
  height: 20px !important;
  width: 20px !important;
}
</style>
