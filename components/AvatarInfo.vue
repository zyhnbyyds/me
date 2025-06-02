<script lang='ts' setup>
import { me } from '~/constants'
</script>

<template>
  <div class="cursor-pointer p-3 bg-hover-common-trans">
    <div class="flex items-center gap-2">
      <div class="h-10 w-10 overflow-hidden rounded-full">
        <img
          class="hw-full"
          src="/public/me.png"
          alt="User Avatar"
        >
      </div>
      <div class="flex flex-col">
        <span class="text-sm font-semibold">{{ me.name }}</span>
        <span class="text-xs text-gray-500">
          {{ `@${me.name}` }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
