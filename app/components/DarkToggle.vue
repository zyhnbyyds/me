<script lang="ts" setup>
const mode = useColorMode()
</script>

<template>
  <div
    text-6
    flex-center
    px-2
    @click="mode.preference = mode.preference === 'dark' ? 'light' : 'dark'"
  >
    <Icon name="streamline-emojis:first-quarter-moon" />
  </div>
</template>

<style scoped></style>
