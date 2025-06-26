<script lang='ts' setup>
const loading = ref(false)
</script>

<template>
  <div>
    <Btn @click="loading = !loading">
      Load
    </Btn>
    <Loading :loading="loading">
      <div h-80 bg-lightblue-2 />
    </Loading>
  </div>
</template>

<style scoped></style>
