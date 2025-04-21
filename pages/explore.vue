<script lang='ts' setup>
const searchIpt = ref('')
</script>

<template>
  <div>
    <header class="px-5 py-4">
      <SearchIpt v-model="searchIpt" placeholder="搜索" />
    </header>
  </div>
</template>

<style scoped></style>
