<script lang='ts' setup>
const mode = useColorMode()
</script>

<template>
  <div text-6 px-2 @click="mode.preference = mode.preference === 'dark' ? 'light' : 'dark'">
    <Icon name="i-streamline-emojis:first-quarter-moon" />
  </div>
</template>

<style scoped></style>
