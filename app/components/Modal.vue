<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
  closeOnClickOverlay?: boolean
  title?: string
  width?: string | number
  isTransition?: boolean
  showMask?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  },
)

function close() {
  visible.value = false
  emits('update:modelValue', false)
  emits('close')
}

function onOverlayClick() {
  if (props.closeOnClickOverlay !== false) close()
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) close()
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', onEsc)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onEsc)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div v-if="visible" inset-0 fixed z-1000>
        <div
          class="flex-center hw-full left-0 top-0 absolute z-60"
          :class="showMask ? 'modal-mask' : ''"
          @click="onOverlayClick"
        >
          <Transition name="modal-content">
            <div v-if="visible" @click.stop class="modal-inner">
              <slot />
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-mask {
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* 遮罩层淡入淡出 */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

/* 内容弹出动效：从下方弹起 + 缩放 */
.modal-content-enter-active {
  transition:
    opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-content-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.modal-content-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.95);
}
.modal-content-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
.modal-content-enter-to,
.modal-content-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.modal-inner {
  will-change: transform, opacity;
}
</style>
