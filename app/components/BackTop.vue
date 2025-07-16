<script lang='ts' setup>
const y = defineModel<number>({ default: 0 })
</script>

<template>
  <Transition name="fade">
    <div v-if="y > 200" fixed bottom-2 right-2 rounded-full bg-hover-common p-2 @click="y = 0">
      <Icon name="carbon:arrow-up" text-8 />
    </div>
  </Transition>
</template>

<style scoped></style>
