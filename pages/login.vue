<script setup lang="ts">
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
    useRouter().push('Error: false')
}
</script>

<template>
  <div>
    <button @click="signInWithOtp">
      Sign In with E-Mail
    </button>
    <input
      v-model="email"
      type="email"
    >
  </div>
</template>
