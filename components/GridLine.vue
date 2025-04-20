<script lang='ts' setup>
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext('2d')
    if (ctx.value) {
      const ctxc = ctx.value
      ctx.value.fillStyle = 'red'
      ctx.value.fillRect(0, 0, 150, 150)
      ctx.value.fillStyle = 'white'
      ctx.value.font = '20px Arial'

      ctx.value.fillStyle = 'green'
      ctx.value.fillRect(100, 20, 100, 100)
      ctx.value.fillStyle = 'white'
      ctx.value.font = '20px Arial'

      ctxc.strokeStyle = 'blue'
      ctxc.beginPath()
      ctxc.arc(45, 33, 30, 0, 2 * Math.PI)
      ctxc.stroke()
    }
  }
})
</script>

<template>
  <div>
    <canvas ref="canvasRef" width="150" height="150" />
  </div>
</template>

<style scoped></style>
