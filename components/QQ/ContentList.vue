<script lang='tsx' setup>
import type { JSX } from 'vue/jsx-runtime'
import type { QQContentItem } from '~/types/qq'
import { NuxtImg } from '#components'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getUrl } from 'qface'
import { qqEmojiKeyToQFaceEmojiKeyMap } from '~/config/qqEmojiToQFaceImage'
import 'dayjs/locale/zh-cn'

defineProps<
  {
    list: QQContentItem[]
  }
>()

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

function EmojiImg(props: { qqKey: string }) {
  const qfaceKey = qqEmojiKeyToQFaceEmojiKeyMap[props.qqKey]

  return qqEmojiKeyToQFaceEmojiKeyMap[props.qqKey] ? <NuxtImg src={getUrl(qfaceKey)} class="inline-block h-6 w-6 align-mid" /> : <span>{props.qqKey}</span>
}

/**
 * From gpt4.1
 */
function replaceEmojis(content: string) {
  const result: (string | JSX.Element)[] = []
  let lastIndex = 0
  const regex = /\[em\](.*?)\[\/em\]/g
  let match: RegExpExecArray | null

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(content)) !== null) {
    // 添加前面的普通文本
    if (match.index > lastIndex) {
      result.push(content.slice(lastIndex, match.index))
    }
    // 添加 EmojiImg 组件
    result.push(<EmojiImg key={match.index} qqKey={match[1]} />)
    lastIndex = regex.lastIndex
  }
  // 添加最后的普通文本
  if (lastIndex < content.length) {
    result.push(content.slice(lastIndex))
  }
  return result
}

function QQContentRender(props: { content: string }) {
  return (
    <p class="mt-2 inline whitespace-pre-wrap text-sm leading-25px">
      {replaceEmojis(props.content)}
    </p>
  )
}
</script>

<template>
  <ul>
    <li v-for="item in (list ?? [])" v-show="!(item.video && item.video.length > 0)" :key="item.tid" class="border-b-0.5px border-common">
      <div class="w-full flex gap-2 p-4">
        <NuxtImg
          src="/me.png"
          alt="Avatar"
          :quality="10"
          class="h-8 w-8 rounded-full"
        />
        <div flex-1>
          <p class="flex items-center gap-2 text-sm font-semibold">
            <span>{{ item.name }}</span>
            <span class="text-12px text-gray">· {{ dayjs(item.created_time * 1000).fromNow() }}</span>
          </p>

          <QQContentRender :content="item.content ?? ''" />

          <div v-if="item.pic" mt-5>
            <div
              v-for="itm, idx in item.pic"
              :key="idx"
              mb-2 mr-2 inline-block h-50 w-50 overflow-hidden rounded-2px
            >
              <!-- @vue-expect-error -->
              <NuxtImg
                v-if="!(itm.is_video && itm.is_video === 1)"
                :quality="70"
                hw-full object-cover object-center
                :src="`/qq/images/image_${item.tid}_${idx}.jpg`"
              />

              <video
                v-else
                :poster="`/qq/images/image_${item.tid}_${idx}.jpg`"
                type="video/mp4"
                controls autoplay hw-full object-cover object-center
                :src="`/qq/videos/video_${item.tid}_${idx}.mp4`"
              />
            </div>
          </div>

          <div mt-2 text-2.5 text-gray>
            {{ item.source_name }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
