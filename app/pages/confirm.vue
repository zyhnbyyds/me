<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  title: 'Confirm',
})

onMounted(() => {
  // 兼容旧的邮箱登录回调：统一跳转到首页或登录页
  navigateTo('/')
})
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center text-gray-700">
    正在跳转...
  </div>
</template>
