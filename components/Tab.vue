<script lang='ts' setup>
export interface TabItem {
  label: string
  value: string
}

interface Props {
  list: TabItem[]
}

defineProps<Props>()

const active = defineModel<string>()
</script>

<template>
  <div class="flex">
    <div
      v-for="item in list" :key="item.value"
      class="flex-1"
      :class="active === item.value
        ? '' : ''"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<style scoped></style>
