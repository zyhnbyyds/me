<script lang='ts' setup>
definePageMeta({
  title: '关于我',
  description: '关于我页面',
})

const { data: count } = await useAsyncData(() => {
  return queryCollection('blog').count()
})
</script>

<template>
  <div of-x-hidden>
    <header sticky top-0 h-50px w-full flex-col-center gap-4 px-4 text-5 blur-common>
      <div class="h-9 w-9 flex-center inline-flex cursor-pointer bg-hover-common-trans" @click="$router.back()">
        <span class="i-material-symbols:arrow-back" />
      </div>
      <p text-4.1 font-bold>
        关于我
      </p>
      <p text-3 text-blueGray>
        {{ count }} 帖子
      </p>
    </header>
    <div class="px-7 pt-5 indent-lg lh-8">
      大家好我是张宇解，欢迎来到我的频道
    </div>
  </div>
</template>

<style scoped>
</style>
