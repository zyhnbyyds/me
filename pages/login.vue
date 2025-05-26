<script lang='ts' setup>
definePageMeta({
  title: '登录',
  layout: 'empty',
  description: '登录页面',
})
</script>

<template>
  <div>
    <!-- 基于unocss 的炫酷吊炸天页面 -->
    <div class="h-screen w-screen flex items-center justify-center from-blue-500 to-purple-500 bg-gradient-to-r">
      <div class="max-w-md w-full rounded-lg bg-white p-8 shadow-lg">
        <h1 class="mb-6 text-center text-2xl font-bold">
          欢迎登录
        </h1>
        <form>
          <div class="mb-4">
            <label for="username" class="block text-sm text-gray-700 font-medium">用户名</label>
            <input id="username" type="text" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" placeholder="请输入用户名">
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm text-gray-700 font-medium">密码</label>
            <input id="password" type="password" class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" placeholder="请输入密码">
          </div>
          <button type="submit" class="focus:shadow-outline w-full rounded bg-blue-600 px-4 py-2 text-white font-bold hover:bg-blue-700 focus:outline-none">
            登录
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
