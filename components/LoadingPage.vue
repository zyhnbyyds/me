<script lang='ts' setup>

</script>

<template>
  <Teleport to="body">
    <div class="fixed left-0 top-0 h-screen w-screen flex-center bg-light-8 bg-op40 backdrop-blur-md">
      <div class="loader" />
    </div>
  </Teleport>
</template>

<style scoped>
.loader {
  width: 120px;
  height: 22px;
  border-radius: 20px;
  color: #514b82;
  border: 2px solid;
  position: relative;
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

.loader::before {
  content: '';
  position: absolute;
  margin: 2px;
  inset: 0 100% 0 0;
  border-radius: inherit;
  background: currentColor;
  animation: l6 1.5s infinite;
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
