<script lang='ts' setup>
const { data } = await $fetch('/api/qq/list')
</script>

<template>
  <div>
    <!-- TODO: 优化数据请求，分页处理，存储数据库，接入现有评论、喜欢。图片预览完善， 表情处理完善 -->
    <CHead title="说说" />
    <QQContentList :list="data ?? []" />
  </div>
</template>

<style scoped></style>
