<script setup lang="ts">
const props = defineProps<{
  raw: string // JSON 字符串
}>()

const content = JSON.parse(props.raw)
</script>

<template>
  <div class="content">
    <template v-for="(item, i) in content" :key="i">
      <img v-if="item.type === 'emoji'" :src="`/emojis/${item.value}`" class="emoji-sm">
      <span v-else>{{ item.value }}</span>
    </template>
  </div>
</template>

<style scoped>
.emoji-sm {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>
