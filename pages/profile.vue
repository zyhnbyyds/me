<script lang='ts' setup>
const { data: count } = await useAsyncData(() => {
  return queryCollection('blog').count()
})
</script>

<template>
  <div of-x-hidden>
    <header sticky top-0 h-50px w-full flex-col-center gap-4 px-4 text-5 blur-common>
      <div class="h-9 w-9 flex-center inline-flex cursor-pointer bg-hover-common" @click="$router.back()">
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
      大家好我是张宇解，一个工作三年的程序员，25 岁，目前在一家金融外包公司就职，我就读于一个三线城市的二本院校，在学校中学习的感觉还是太少，很多东西是在工作了之后才明白的，尤其感谢我的第一份工作，真的是从无到有学习的技术（虽然目前还有一部分工资没有结清，倒闭了🙁），非常感谢，当时刚毕业，感觉找到一份工作就非常幸运了😊工作了有将近一年。后来就来了上海，这里的确工作机会很多，我就面试了一个就找到了目前的工作，还是非常幸运的，工作之余我有做一些自己感兴趣的东西，比如尝试最新的技术，因为工作所属是金融行业，所以其对于技术创新的要求比较低，目前还在用 vue2，我个人是非常喜欢 vue3 的，平时也有在用 vue3 和 nuxt3。我对于做全栈还是比较感兴趣的，但是在尝试了 java、go 之后，感觉还是呆在 js 的舒适区比较舒服😂。目前使用过 nestjs 搭配 vue 尝试做过全栈的应用，但是由于没有应用场景，所以做的东西感觉都不是特别炫酷，感觉自己对于实际后端业务这块可能还是比较欠缺的。
    </div>
  </div>
</template>

<style scoped>
</style>
