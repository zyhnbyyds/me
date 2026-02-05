<script lang="ts" setup>
const props = defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="p-2 rounded-lg bg-white shadow-md dark:bg-dark-700">
    <slot name="header">
      <h1 text-5 font-bold py-2>
        {{ props.title }}
      </h1>
    </slot>
    <Separator mb-2 />

    <slot />

    <Separator mt-2 />

    <slot name="footer" />
  </div>
</template>

<style scoped></style>
