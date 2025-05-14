<script lang='ts' setup>
const textarea = defineModel<string>({ default: '' })
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const { focused } = useFocus(textareaRef)
</script>

<template>
  <textarea
    ref="textareaRef"
    v-model="textarea"
    autocorrect="on"
    :class="[focused ? 'h-35' : 'h-20']"
    class="transition-all duration-300"
    w-full resize-none border-2 border-transparent rounded-md bg-light-3 px-3 py-2 text-3.5 outline-light-blue-3 outline-none focus:border-2 focus:border-light-blue-3 focus:bg-light-1
  />
</template>

<style scoped></style>
