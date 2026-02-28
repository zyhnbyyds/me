<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  title: 'Login',
  description: 'Login page',
})

const router = useRouter()

function signInWithGithub() {
  router.push('/auth/github')
}
</script>

<template>
  <div bg-light-300 flex-center h-screen hw-full min-w-sm>
    <Card text-center w-sm title="Login">
      <div class="mb-4 text-sm text-gray-600">当前仅支持使用 GitHub 登录。</div>

      <template #footer>
        <Btn m-2 inline-block @click="signInWithGithub"> 使用 GitHub 登录 </Btn>
      </template>
    </Card>
  </div>
</template>
