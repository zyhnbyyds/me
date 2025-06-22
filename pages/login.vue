<script setup lang="ts">
definePageMeta({
  layout: 'empty',
  title: 'Login',
  description: 'Login page',
})

const supabase = useSupabaseClient()
const email = ref('')

async function signInWithOtp() {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: 'http://localhost:3100/confirm',
    },
  })
  if (error)
    useRouter().push('/error')
}
</script>

<template>
  <div h-screen hw-full min-w-sm flex-center bg-light-3>
    <Card w-sm text-center title="Login">
      <div>
        <input
          v-model="email"
          border-1
          border-red
          type="email"
        >
      </div>

      <template #footer>
        <Btn m-2 inline-block @click="signInWithOtp">
          Sign In with E-Mail
        </Btn>
      </template>
    </Card>
  </div>
</template>
