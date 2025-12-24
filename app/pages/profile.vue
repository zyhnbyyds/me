<script lang='ts' setup>
const { data: count } = useAsyncData(() => {
  return queryCollection('blog').count()
})
</script>

<template>
  <div of-x-hidden>
    <header text-5 px-4 blur-common flex-col-center gap-4 h-50px w-full top-0 sticky>
      <div class="bg-hover-common-trans flex-center inline-flex h-9 w-9 cursor-pointer" @click="$router.back()">
        <Icon name="material-symbols:arrow-back" />
      </div>
      <p text-4.1 font-bold>
        关于我
      </p>
      <p text-3 text-gray-200>
        {{ count }} 帖子
      </p>
    </header>
    <div class="indent-lg lh-8 px-7 pt-5">
      大家好我是张宇解，欢迎来到我的频道
    </div>
  </div>
</template>

<style scoped>
</style>
