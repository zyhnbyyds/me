<script lang='ts' setup>
import type { QQContentItem } from '~/types/qq'

definePageMeta({
  title: 'QQ空间',
  description: 'QQ空间说说列表， 数据来自我的QQ空间',
})

const scrollRef = ref<HTMLElement | null>(null)
const { height } = useElementBounding(scrollRef)
const { height: windowHeight } = useWindowSize()
const qQContentList = ref<QQContentItem[]>([])

const { y } = inject<{ y: Ref<number> }>('scroll', { y: ref(0) })
const page = ref({
  current: 1,
  size: 20,
})
const [loading, load] = useToggle()

async function getQQContentList(loadMore: boolean = false) {
  load(true)
  const data = await $fetch<QQContentItem[]>('/api/qq/list', {
    method: 'GET',
    params: {
      current: page.value.current,
      size: page.value.size,
    },
  })
  if (loadMore) {
    qQContentList.value = [...qQContentList.value, ...data]
  }
  else {
    qQContentList.value = data
  }
  load(false)
}
getQQContentList()

watch(() => y.value, async () => {
  if ((height.value - y.value) - windowHeight.value < 2000) {
    if (loading.value)
      return
    page.value.current += 1
    await getQQContentList(true)
    await nextTick()
  }
})
</script>

<template>
  <div ref="scrollRef">
    <!-- TODO: 优化数据请求，分页处理，存储数据库。 -->
    <CHead title="QQ空间" />
    <QQContentList :list="qQContentList" />
    <div class="mt-4 flex justify-center">
      <div
        v-if="loading"
        class="py-5 text-center text-lg text-gray-500"
      >
        加载中...
      </div>
    </div>
  </div>
</template>

<style scoped></style>
