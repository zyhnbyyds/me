<script lang="ts" setup>
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
      v-for="item in list"
      :key="item.value"
      class="tab-item text-15px lh-50px text-center border-b-0.5px border-common rounded-0 flex-1 h-50px cursor-pointer transition-colors relative"
      :class="active === item.value ? 'font-bold tab-item-active' : ''"
      @click="active = item.value"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<style scoped>
.tab-item::after {
  content: '';
  position: absolute;
  display: none;
  bottom: -1px;
  width: 60px;
  transform: translateX(-50%);
  left: 50%;
  bottom: 0;
  height: 4px;
  border-radius: 2px;
  background-color: rgb(29, 155, 240);
}

.tab-item-active::after {
  display: block;
}
</style>
