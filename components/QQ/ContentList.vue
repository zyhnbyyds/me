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

const activePreview = ref('')
const modalVisible = ref(false)
const modalVideoVisible = ref(false)

function EmojiImg(props: { qqKey: string }) {
  const qfaceKey = qqEmojiKeyToQFaceEmojiKeyMap[props.qqKey]

  return <NuxtImg src={getUrl(qfaceKey)} class="inline-block h-6 w-6 align-mid" />
}

function calculateImageSize(height: number, width: number) {
  const ratio = height / width
  if (ratio > 1.5) {
    return 'h-auto w-50%'
  }
  else if (ratio < 1.5 && ratio > 1) {
    return 'h-auto w-70%'
  }
  else {
    return 'h-auto w-full'
  }
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
    result.push(qqEmojiKeyToQFaceEmojiKeyMap[match[1]] ? <EmojiImg key={match.index} qqKey={match[1]} /> : match[1])
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

function handlePlay(src: string) {
  activePreview.value = src
  modalVideoVisible.value = true
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

          <div v-if="item.pic" mt-3 flex flex-wrap gap-2>
            <div
              v-for="itm, idx in item.pic"
              :key="idx"
              :class="
                item.pic.length === 1
                  ? calculateImageSize(itm.height, itm.width)
                  : 'h-50 w-50'"
              inline-block overflow-hidden
            >
              <!-- @vue-expect-error -->
              <PreviewImg v-if="!(itm.is_video && itm.is_video === 1) && item.pic.length === 1" :active="activePreview === `/qq/images/image_${item.tid}_${idx}.jpg`" :src="`/qq/images/image_${item.tid}_${idx}.jpg`" provider="ipx" @select="(src) => activePreview = src" />
              <!-- @vue-expect-error -->
              <CImg
                v-if="!(itm.is_video && itm.is_video === 1) && item.pic.length > 1"
                :quality="70"
                :url="`/qq/images/image_${item.tid}_${idx}.jpg`"
                @click="
                  () => {
                    activePreview = `/qq/images/image_${item.tid}_${idx}.jpg`
                    modalVisible = true
                  }
                "
              />
              <!-- @vue-expect-error -->
              <QQMv v-if="(itm.is_video && itm.is_video === 1)" :poster="`/qq/images/image_${item.tid}_${idx}.jpg`" :video-id="`video_${item.tid}_${idx}`" :src="`/qq/videos/video_${item.tid}_${idx}.mp4`" @play="handlePlay" />
            </div>
          </div>

          <div mt-2 text-2.5 text-gray>
            {{ item.source_name }}
          </div>
        </div>
      </div>
    </li>

    <Modal v-model="modalVisible" :close-on-click-overlay="true">
      <div hw-full>
        <CImg
          :quality="70"
          c-class="object-contain"
          :url="activePreview"
        />
      </div>
    </Modal>

    <Modal v-model="modalVideoVisible" :close-on-click-overlay="true" is-transition>
      <CVideo :video-id="activePreview.replace('/qq/videos/', '').replace('.mp4', '')" :src="activePreview" />
    </Modal>
  </ul>
</template>

<style scoped></style>
