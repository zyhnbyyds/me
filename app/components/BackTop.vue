<script lang='ts' setup>
defineProps<{
  show?: boolean
}>()

const y = defineModel<number>({ default: 0 })
</script>

<template>
  <Transition name="fade">
    <div v-if="y > 200 || show" rounded-full bg-hover-common flex-center h-10 w-10 @click="y = 0">
      <Icon name="carbon:arrow-up" text-6 />
    </div>
  </Transition>
</template>

<style scoped></style>
