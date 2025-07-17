<script lang='tsx' setup>
import { QQContentRender } from '#components'

defineProps<{
  list: QQContentComment[]
}>()
function CommentName(props: { name: string, content: string }) {
  if (props.content.match(/@\{[^}]*\}/g)) {
    const replyName = props.content.match(/nick:([^,}]*)/)
    const nick = replyName ? replyName[1] : null
    return (
      <span class="text-dark font-600 mr-1 dark:text-gray100">
        <QQContentRender customClass="mr-0.5 text-dark font-600 dark:text-gray100 leading-normal mt0 text-3!" emojiSize="small" content={`${props.name}`} />
        <span class="dark:text-gray5 text-gray"> 回复 </span>
        <QQContentRender customClass="mr-0.5 text-dark font-600 dark:text-gray100 leading-normal mt0 text-3!" emojiSize="small" content={`${nick}:`} />
      </span>
    )
  }
  return (
    <QQContentRender customClass="mr-1 text-dark font-600 dark:text-gray100 leading-normal mt0 text-3!" emojiSize="small" content={`${props.name}:`} />
  )
}

function CommentItem(props: { content: string, name: string }) {
  const transCon = props.content.replace(/@\{([^}]*)\}/g, '')
  return (
    <div class="text-3 flex">
      <div class="flex flex-wrap gap-1 w-full items-center">
        <CommentName name={props.name} content={props.content} />
        <QQContentRender emoji-size="small" custom-class="text-3! mt0! leading-normal! text-dark dark:text-light600!" content={transCon} />
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
