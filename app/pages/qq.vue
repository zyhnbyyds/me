<script lang="ts" setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { PreviewItem } from '../types/preview'
import type { Pic, QQContentItem } from '../../shared/types/qq'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

definePageMeta({
  title: 'QQ空间',
  description: 'QQ空间说说列表， 数据来自我的QQ空间',
  keepalive: true,
})

const scrollRef = ref<HTMLElement>()
const { y, restoreScrollPosition } = useRouteScrollRestore(scrollRef, {
  key: 'qq',
})
const { arrivedState } = useScroll(scrollRef)
const qQContentList = ref<QQContentItem[]>([])
const totalNum = ref(0)

const page = ref({
  current: 1,
  size: 20,
})
const [loading, load] = useToggle()
const activeVideoSrc = ref('')
const modalVideoVisible = ref(false)
const route = useRoute()

type QQMediaPic = Pic & {
  is_video?: number | null
}

async function getQQContentList(loadMore: boolean = false) {
  load(true)
  const { data, total } = await $fetch<{
    data: QQContentItem[]
    total: number
  }>('/api/qq/list', {
    method: 'GET',
    params: {
      current: page.value.current,
      size: page.value.size,
      tid: route.query.tid || '',
    },
  })
  totalNum.value = total
  if (loadMore) {
    qQContentList.value = [...qQContentList.value, ...data]
  } else {
    qQContentList.value = data
  }
  if (route.query.tid) {
    nextTick(() => {
      const targetIndex = qQContentList.value.findIndex(
        (item) => item.tid === route.query.tid,
      )
      if (targetIndex !== -1) {
        const targetElement = scrollRef.value?.children[
          targetIndex
        ] as HTMLElement
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    })
  }
  load(false)
}

function calculateImageSize(height: number, width: number) {
  const ratio = height / width
  if (ratio > 1.5) {
    return 'h-auto w-30% '
  } else if (ratio < 1.5 && ratio > 1) {
    return 'h-auto w-50% '
  } else {
    return 'h-auto w-50%'
  }
}

function getMediaPics(item: QQContentItem): QQMediaPic[] {
  return (item.pic ?? []) as QQMediaPic[]
}

function isVideoPic(pic: QQMediaPic) {
  return Number(pic.is_video ?? 0) === 1
}

function getImageSrc(tid: string, index: number) {
  return `/qq/images/image_${tid}_${index}.jpg`
}

function getVideoSrc(tid: string, index: number) {
  return `/qq/videos/video_${tid}_${index}.mp4`
}

function getPreviewItems(item: QQContentItem): PreviewItem[] {
  return getMediaPics(item).flatMap((pic, index) => {
    if (isVideoPic(pic)) return []

    return [
      {
        src: getImageSrc(item.tid, index),
        provider: 'ipx',
        alt: `${item.name} 的第 ${index + 1} 张图片`,
      },
    ]
  })
}

function getPreviewIndex(item: QQContentItem, currentIndex: number) {
  return (
    getMediaPics(item)
      .slice(0, currentIndex + 1)
      .filter((pic) => !isVideoPic(pic)).length - 1
  )
}

function handlePlay(src: string) {
  activeVideoSrc.value = src
  modalVideoVisible.value = true
}

onActivated(() => {
  getQQContentList()
})

watch(
  qQContentList,
  async () => {
    await nextTick()
    restoreScrollPosition()
  },
  { flush: 'post' },
)

watch(
  () => y.value,
  async () => {
    if (!import.meta.client) return
    if (arrivedState.bottom) {
      if (
        loading.value ||
        page.value.current + 1 > Math.ceil(totalNum.value / page.value.size)
      )
        return
      page.value.current += 1

      await getQQContentList(true)
      await nextTick()
    }
  },
)
</script>

<template>
  <div h-full>
    <CHead title="QQ空间" />
    <ul
      ref="scrollRef"
      relative
      overflow-auto
      class="scrollbar h-[calc(100vh-60px)]"
      w-full
    >
      <li
        v-for="item in qQContentList ?? []"
        v-show="!(item.video && item.video.length > 0)"
        :key="item.tid"
        :class="[item.isSearchSingle ? 'animate-fade-in animate-count-1' : '']"
        class="border-b-0.5px border-common"
      >
        <div class="p-4 flex gap-2 w-full">
          <NuxtImg
            src="/me.png"
            alt="Avatar"
            :quality="10"
            class="rounded-full h-8 w-8"
          />
          <div flex-1>
            <p class="text-sm font-semibold flex gap-2 items-center">
              <span>{{ item.name }}</span>
              <span class="text-12px text-gray"
                >·
                {{
                  dayjs(item.created_time * 1000).format('YYYY-MM-DD HH:mm:ss')
                }}</span
              >
            </p>

            <QQContentRender :content="item.content ?? ''" />

            <div v-if="item.pic" mt-3 flex flex-wrap gap-2>
              <div
                v-for="(itm, idx) in getMediaPics(item)"
                :key="idx"
                :class="
                  getMediaPics(item).length === 1
                    ? calculateImageSize(itm.height, itm.width)
                    : 'h-50 w-50'
                "
                inline-block
                overflow-hidden
              >
                <PreviewImg
                  v-if="!isVideoPic(itm)"
                  :src="getImageSrc(item.tid, idx)"
                  :alt="`${item.name} 的第 ${getPreviewIndex(item, idx) + 1} 张图片`"
                  :preview-items="getPreviewItems(item)"
                  :preview-index="getPreviewIndex(item, idx)"
                  provider="ipx"
                  @select="() => void 0"
                />
                <QQMv
                  v-else
                  :poster="getImageSrc(item.tid, idx)"
                  :video-id="`video_${item.tid}_${idx}`"
                  :src="getVideoSrc(item.tid, idx)"
                  @play="handlePlay"
                />
              </div>
            </div>

            <div text-2.5 text-gray mt-2>
              {{ item.source_name }}
            </div>

            <QQCommentList :list="item.commentlist ?? []" />
          </div>
        </div>
      </li>

      <Modal
        v-model="modalVideoVisible"
        :close-on-click-overlay="true"
        is-transition
      >
        <CVideo
          :video-id="
            activeVideoSrc.replace('/qq/videos/', '').replace('.mp4', '')
          "
          :src="activeVideoSrc"
        />
      </Modal>
      <li>
        <Loading :loading="loading">
          <div class="h-30" />
        </Loading>
      </li>
    </ul>
    <BackTop absolute class="<md:hidden" right-6 bottom-6 v-model="y" />
  </div>
</template>

<style scoped></style>
