<script lang="ts" setup>
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
    class="outline-light-blue-300 focus:border-light-blue-300 transition-all duration-300"
    text-3.5
    px-3
    py-2
    outline-none
    border-2
    border-transparent
    rounded-md
    bg-light-300
    w-full
    resize-none
    focus:border-2
    focus:bg-light-100
  />
</template>

<style scoped></style>
