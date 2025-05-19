<script lang='ts' setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <header sticky top-0 z-9999 h-50px w-full flex-col-center justify-between px-4 text-5 blur-common>
    <div flex-col-center gap-4>
      <div class="h-9 w-9 flex-center inline-flex cursor-pointer bg-hover-common" @click="$router.back()">
        <Icon name="material-symbols:arrow-back" />
      </div>
      <p font-bold>
        {{ title }}
      </p>
    </div>
  </header>
</template>

<style scoped></style>
