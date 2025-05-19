<script lang='ts' setup></script>

<template>
  <!--
    TODO: 完善相册
    1. 添加图片预览
    2. 瀑布流
    3. 视频播放
    4. 无缝展示
    5. 远程存储
    -->
  <div>
    <CHead title="相册" />
    <div grid grid-cols-3 gap-4 p-4>
      <div v-for="i in 30" :key="i" h50 cursor-pointer overflow-hidden rounded-md bg-light-9 shadow-md transition-all hover:scale-111>
        <img src="https://images.pexels.com/photos/31449901/pexels-photo-31449901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
      </div>
    </div>
  </div>
</template>

<style scoped></style>
