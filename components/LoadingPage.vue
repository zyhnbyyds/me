<script lang='ts' setup>
defineProps<{
  percent?: number
  isAutoLoading?: boolean
}>()

const loading = defineModel<boolean>({
  default: false,
})
</script>

<template>
  <Transition name="fade">
    <div v-if="loading" class="fixed left-0 top-0 z-9999 h-screen w-screen flex-center bg-light-8 bg-op40 backdrop-blur-md">
      <div class="loader" :class="{ 'auto-loading': isAutoLoading }">
        <div v-if="!isAutoLoading" class="progress" :style="{ width: `${percent ?? 0}%` }" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loader {
  width: 120px;
  height: 22px;
  border-radius: 20px;
  color: #514b82;
  border: 2px solid;
  position: relative;
  overflow: hidden;
}

.loader.auto-loading::before {
  content: '';
  position: absolute;
  margin: 2px;
  inset: 0 100% 0 0;
  border-radius: inherit;
  background: currentColor;
  animation: l6 1.5s infinite;
}

.progress {
  height: 100%;
  background: currentColor;
  border-radius: inherit;
  transition: width 0.1s;
}

.loader::after {
  content: 'Loading...';
  background: linear-gradient(45deg, #34b3d5, #4853d3);
  -webkit-background-clip: text;
  background-clip: text;
  font-weight: bold;
  color: transparent;
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  animation: fade 1.5s infinite;
}

@keyframes l6 {
  100% {
    inset: 0;
  }
}

@keyframes fade {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
</style>
