<script lang='ts' setup></script>

<template>
  <header sticky top-0 h-50px w-full flex-col-center justify-between px-4 text-5 blur-common>
    <div flex-col-center gap-4>
      <div class="h-9 w-9 flex-center inline-flex cursor-pointer bg-hover-common" @click="$router.back()">
        <Icon name="material-symbols:arrow-back" />
      </div>
      <p font-bold>
        相册
      </p>
    </div>
  </header>
  <div grid grid-cols-3 gap-4 p-4>
    <div v-for="i in 30" :key="i" h50 cursor-pointer overflow-hidden rounded-md bg-light-9 shadow-md transition-all hover:scale-111>
      <img src="https://images.pexels.com/photos/31449901/pexels-photo-31449901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
    </div>
  </div>
</template>

<style scoped></style>
