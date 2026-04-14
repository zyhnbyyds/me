<script setup lang="ts">
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement>()
const isDark = useDark()

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let particles: THREE.Points | null = null
let animationId: number | null = null
let mouse = { x: 0, y: 0 }

function initThree() {
  if (!canvasRef.value || !import.meta.client) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  createParticles()
  animate()
}

function createParticles() {
  if (!scene) return

  const count = 180
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10

    velocities[i * 3] = (Math.random() - 0.5) * 0.005
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005
    velocities[i * 3 + 2] = 0
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))

  // 创建圆形粒子纹理
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 32, 32)

  const texture = new THREE.CanvasTexture(canvas)

  const material = new THREE.PointsMaterial({
    size: 0.06,
    map: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: isDark.value ? 0x8899ff : 0x4466dd,
    opacity: isDark.value ? 0.5 : 0.35,
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

function updateParticleColor() {
  if (!particles) return
  const mat = particles.material as THREE.PointsMaterial
  mat.color.setHex(isDark.value ? 0x8899ff : 0x4466dd)
  mat.opacity = isDark.value ? 0.5 : 0.35
  mat.needsUpdate = true
}

function animate() {
  animationId = requestAnimationFrame(animate)
  if (!particles || !renderer || !scene || !camera) return

  const posAttr = particles.geometry.attributes['position'] as
    | THREE.BufferAttribute
    | undefined
  const velAttr = particles.geometry.attributes['velocity'] as
    | THREE.BufferAttribute
    | undefined
  if (!posAttr || !velAttr) return

  const positions = posAttr.array as Float32Array
  const velocities = velAttr.array as Float32Array

  for (let i = 0; i < positions.length / 3; i++) {
    const px = positions[i * 3]
    const py = positions[i * 3 + 1]
    const vx = velocities[i * 3]
    const vy = velocities[i * 3 + 1]
    if (
      px === undefined ||
      py === undefined ||
      vx === undefined ||
      vy === undefined
    )
      continue

    positions[i * 3] = px + vx + mouse.x * 0.0008
    positions[i * 3 + 1] = py + vy + mouse.y * 0.0008

    // 边界回绕
    if ((positions[i * 3] ?? 0) > 10) positions[i * 3] = -10
    if ((positions[i * 3] ?? 0) < -10) positions[i * 3] = 10
    if ((positions[i * 3 + 1] ?? 0) > 10) positions[i * 3 + 1] = -10
    if ((positions[i * 3 + 1] ?? 0) < -10) positions[i * 3 + 1] = 10
  }

  posAttr.needsUpdate = true
  particles.rotation.z += 0.0003

  renderer.render(scene, camera)
}

function onResize() {
  if (!renderer || !camera) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onMouseMove(e: MouseEvent) {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
}

function dispose() {
  if (animationId) cancelAnimationFrame(animationId)
  if (particles) {
    particles.geometry.dispose()
    ;(particles.material as THREE.Material).dispose()
    scene?.remove(particles)
  }
  renderer?.dispose()
}

watch(isDark, updateParticleColor)

onMounted(() => {
  initThree()
  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
})

onBeforeUnmount(() => {
  dispose()
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-canvas" aria-hidden="true" />
</template>

<style scoped>
.particle-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
