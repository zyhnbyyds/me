<script lang="ts" setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

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
const activePreview = ref('')
const modalVisible = ref(false)
const modalVideoVisible = ref(false)
const route = useRoute()

console.log(1);

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

function handlePlay(src: string) {
  activePreview.value = src
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
                v-for="(itm, idx) in item.pic"
                :key="idx"
                :class="
                  item.pic.length === 1
                    ? calculateImageSize(itm.height, itm.width)
                    : 'h-50 w-50'
                "
                inline-block
                overflow-hidden
              >
                <!-- @vue-expect-error -->
                <PreviewImg
                  v-if="
                    !(itm.is_video && itm.is_video === 1) &&
                    item.pic.length === 1
                  "
                  :active="
                    activePreview === `/qq/images/image_${item.tid}_${idx}.jpg`
                  "
                  :src="`/qq/images/image_${item.tid}_${idx}.jpg`"
                  provider="ipx"
                  @select="(src) => (activePreview = src)"
                />
                <!-- @vue-expect-error -->
                <CImg
                  v-if="
                    !(itm.is_video && itm.is_video === 1) && item.pic.length > 1
                  "
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
                <QQMv
                  v-if="itm.is_video && itm.is_video === 1"
                  :poster="`/qq/images/image_${item.tid}_${idx}.jpg`"
                  :video-id="`video_${item.tid}_${idx}`"
                  :src="`/qq/videos/video_${item.tid}_${idx}.mp4`"
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
        v-model="modalVisible"
        :is-transition="true"
        :close-on-click-overlay="true"
      >
        <div h-screen w-screen>
          <CImg
            :quality="70"
            c-class="object-contain"
            :url="activePreview"
            @click="modalVisible = false"
          />
        </div>
      </Modal>

      <Modal
        v-model="modalVideoVisible"
        :close-on-click-overlay="true"
        is-transition
      >
        <CVideo
          :video-id="
            activePreview.replace('/qq/videos/', '').replace('.mp4', '')
          "
          :src="activePreview"
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
