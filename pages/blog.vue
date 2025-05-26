<script lang='ts' setup>
import { homeTabList } from '~/constants'

const limit = ref(10)
const app = useState('blobScroll', () => ({
  recommend: 0,
  newest: 0,
}))
const { y } = inject<{ x: Ref<number>, y: Ref<number> }>('scroll', { x: ref(0), y: ref(0) })

// 一次性加载所有content
const { data: blobs } = await useAsyncData('blog', () => {
  return queryCollection('blog').limit(limit.value).all()
})

useSeoMeta({
  title: '张宇行的博客',
  description: '张宇行的博客，在这里分享生活、代码、学习、工作等方面的内容',
  ogImage: '/me.png',
  ogType: 'profile',
  ogTitle: '张宇行的博客',
})

const activeTab = ref(homeTabList[0].value)

const handleFnMap: Record<string, () => void> = {
  recommend: () => {
    queryCollection('blog').limit(limit.value).all()
  },
  published: () => {
    queryCollection('blog').limit(limit.value).all()
  },
}

watchEffect(() => {
  handleFnMap[activeTab.value] && handleFnMap[activeTab.value]()
})

if (activeTab.value === 'recommend') {
  y.value = app.value.recommend
}
else if (activeTab.value === 'newest') {
  y.value = app.value.newest
}

onBeforeRouteLeave(() => {
  if (activeTab.value === 'recommend') {
    app.value.recommend = y.value
  }
  else if (activeTab.value === 'newest') {
    app.value.newest = y.value
  }
})
</script>

<template>
  <Tab v-model="activeTab" sticky top-0 w-full blur-common :list="homeTabList" />
  <ClientOnly>
    <BlogList :list="blobs" />

    <template #fallback>
      <div pt-20 text-center class="font-italic">
        Loading...
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped></style>
