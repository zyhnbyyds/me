<script lang='ts' setup>
definePageMeta({
  title: 'QQ空间',
  description: 'QQ空间说说列表， 数据来自我的QQ空间',
})

const { y, scrollHeight, scrollTop } = inject<{ y: Ref<number>, x: Ref<number>, scrollHeight: Ref<number>, scrollTop: Ref<number> }>('scroll', { y: ref(0), x: ref(0), scrollHeight: ref(0), scrollTop: ref(0) })
const page = ref({
  current: 1,
  size: 20,
})

watch(scrollTop, () => {
  console.log('y changed:', y.value, scrollHeight.value - y.value)
  if (scrollHeight.value - scrollTop.value < 1000) {
    page.value.current += 1
    console.log(1)
  }
})

const { data, status } = useAsyncData('qqList', () => {
  return $fetch('/api/qq/list', {
    method: 'GET',
    params: {
      current: page.value.current,
      size: page.value.size,
    },
  })
})
</script>

<template>
  <div>
    <!-- TODO: 优化数据请求，分页处理，存储数据库。 -->
    <CHead title="QQ空间" />
    <QQContentList :list="data?.data ?? []" />
    <div class="mt-4 flex justify-center">
      <div
        v-if="status === 'pending'"
        class="py-5 text-center text-lg text-gray-500"
      >
        加载中...
      </div>
    </div>
  </div>
</template>

<style scoped></style>
