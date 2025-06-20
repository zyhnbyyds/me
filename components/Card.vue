<script lang='ts' setup>
const props = defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="rounded-lg bg-white p-2 shadow-md dark:bg-dark-7">
    <slot name="header">
      <h1 py-2 text-5 font-bold>
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
