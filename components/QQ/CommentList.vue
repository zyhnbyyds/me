<script lang='tsx' setup>
import type { QQContentComment } from '~/types/qq'
import { QQContentRender } from '#components'

defineProps<{
  list: QQContentComment[]
}>()
function CommentName(props: { name: string, content: string }) {
  if (props.content.match(/@\{[^}]*\}/g)) {
    const replyName = props.content.match(/nick:([^,}]*)/)
    const nick = replyName ? replyName[1] : null
    return (
      <span class="mr-1 text-dark font-600">
        {props.name}
        <span class="text-gray"> 回复 </span>
        {nick}
        :
      </span>
    )
  }
  return (
    <span class="mr-1 text-dark font-600">
      {props.name}
      :
    </span>
  )
}

function CommentItem(props: { content: string, name: string }) {
  const transCon = props.content.replace(/@\{([^}]*)\}/g, '')
  return (
    <div class="flex text-3">
      <div class="w-full flex flex-wrap items-center gap-2">
        <CommentName name={props.name} content={props.content} />
        <QQContentRender emoji-size="small" custom-class="text-3! mt0! leading-normal! text-dark-1! text-op40 dark:text-light6!" content={transCon} />
      </div>
    </div>
  )
}
</script>

<template>
  <div class="mt-2">
    <div v-for="(comment, i) in list" :key="i" class="group mb-0.5">
      <CommentItem :name="comment.name" :content="comment.content" />
      <div v-if="comment.list_3 && comment.list_3.length > 0" class="mt-1">
        <div v-for="(subComment, j) in comment.list_3" :key="j" class="mb-1">
          <CommentItem :name="subComment.name" :content="subComment.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
