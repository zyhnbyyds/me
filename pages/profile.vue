<script lang='ts' setup>
const { data: count } = await useAsyncData(() => {
  return queryCollection('content').count()
})
</script>

<template>
  <div of-x-hidden>
    <!-- TODO: 完善样式 -->
    <header sticky top-0 h-50px w-full flex-col-center gap-4 px-4 text-5 blur-common>
      <div class="h-9 w-9 flex-center inline-flex cursor-pointer bg-hover-common" @click="$router.back()">
        <Icon name="material-symbols:arrow-back" />
      </div>
      <div>
        <p text-4.1 font-bold>
          YuhangZhang
        </p>
        <p text-3 text-blueGray>
          {{ count }} 帖子
        </p>
      </div>
    </header>

    <div class="h-50" relative bg-blue-1>
      <img hw-full src="/public/profile_bg.png" object-cover alt="背景" >
      <div class="absolute  left-5 h-150px w-150px overflow-hidden rounded-full bg-white p1.2 -bottom-75px">
        <img src="/public/me.png" hw-full rounded-full alt="海绵宝宝">
      </div>
    </div>
    
    <!-- TODO: 添加自己的个人介绍 -->
    <div class="pt-20 animate-fade-in-left animate-duration-500 lh-12 px-7 indent-lg underline underline-light-5 underline-wavy underline-offset-10">
      嗨～你好呀！我叫林语，一个热爱代码也热爱生活的小猫咪～
      现在是一名全栈开发工程师，擅长 Vue3、TypeScript、NestJS 和 Java 哦～
      白天写代码，晚上研究开源项目，周末偶尔会泡一杯奶茶窝在沙发上敲点有趣的小玩意儿。

      我喜欢把技术写得像写情书一样温柔，不止是为了把功能堆上去，更希望每一行代码都能优雅又高效地“跳舞”。
      最近在尝试做一些开源项目，希望能让更多人感受到技术的浪漫与力量 ✨

      如果你也喜欢编程、热爱创造、追求理想中的“技术与艺术结合的世界”，那我们绝对聊得来哟～
      期待与你的相遇，嘻嘻～
    </div>

    <div flex animate-bounce-in-left justify-end mt-10>
      <img src="/public/sign.png">
    </div>
  </div>
</template>

<style scoped>
</style>
