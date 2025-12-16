<script lang='ts' setup>
defineProps<{
  show?: boolean
}>()

const y = defineModel<number>({ default: 0 })
</script>

<template>
  <Transition name="fade">
    <div v-if="y > 200 || show" p-2 rounded-full bg-hover-common @click="y = 0">
      <Icon name="carbon:arrow-up" text-6 />
    </div>
  </Transition>
</template>

<style scoped></style>
