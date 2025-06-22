<script lang="ts" setup>
import { getUrl } from 'qface'
import { computed } from 'vue'
import { qqEmojiKeyToQFaceEmojiKeyMap } from '~/config/qqEmojiToQFaceImage'

const props = withDefaults(defineProps<{
  content: string
  customClass?: string
  emojiSize?: 'small' | 'medium' | 'large'
}>(), { emojiSize: 'medium', customClass: '' })

function parseContent(content: string) {
  const result: Array<{ type: 'text' | 'emoji', value: string }> = []
  let lastIndex = 0
  const regex = /\[em\](.*?)\[\/em\]/g
  let match: RegExpExecArray | null

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      result.push({ type: 'text', value: content.slice(lastIndex, match.index) })
    }
    result.push({ type: 'emoji', value: match[1] })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < content.length) {
    result.push({ type: 'text', value: content.slice(lastIndex) })
  }
  return result
}

const parsedContent = computed(() => parseContent(props.content))
</script>

<template>
  <p class="mt-2 inline whitespace-pre-wrap text-sm leading-25px" :class="props.customClass">
    <template v-for="(item, idx) in parsedContent" :key="idx">
      <template v-if="item.type === 'text'">
        {{ item.value }}
      </template>
      <template v-else>
        <NuxtImg
          v-if="qqEmojiKeyToQFaceEmojiKeyMap[item.value]"
          :src="getUrl(qqEmojiKeyToQFaceEmojiKeyMap[item.value])"
          :class="`inline-block ${props.emojiSize === 'small' ? 'h-4 w-4' : props.emojiSize === 'medium' ? 'h-6 w-6' : 'h-8 w-8'} align-mid`"
        />
        <span v-else>{{ item.value }}</span>
      </template>
    </template>
  </p>
</template>
