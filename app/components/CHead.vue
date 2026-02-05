<script lang="ts" setup>
defineProps<{
  title?: string
}>()
</script>

<template>
  <header text-5 px-4 blur-common flex-col-center h-50px w-full top-0 justify-between sticky z-20>
    <div flex-col-center w-full justify-between>
      <div flex-col-center gap-4 w-full relative>
        <div
          class="bg-hover-common-trans flex-center inline-flex h-9 w-9 cursor-pointer"
          @click="$router.back()"
        >
          <Icon name="material-symbols:arrow-back" />
        </div>
        <p
          v-if="title"
          text-16px
          font-bold
          flex-1
          text-nowrap
          text-ellipsis
          absolute
          overflow-hidden
          class="max-w-70% left-1/2 -translate-x-1/2"
        >
          {{ title }}
        </p>
      </div>

      <slot name="right" />
    </div>
  </header>
</template>

<style scoped></style>
