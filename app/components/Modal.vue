<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
  closeOnClickOverlay?: boolean
  title?: string
  width?: string | number
  isTransition?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const visible = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  visible.value = val
})

function close() {
  visible.value = false
  emits('update:modelValue', false)
  emits('close')
}

function onOverlayClick() {
  if (props.closeOnClickOverlay !== false)
    close()
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value)
    close()
}

onMounted(() => {
  window.addEventListener('keydown', onEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onEsc)
})
</script>

<template>
  <Teleport to="body">
    <transition :name="isTransition ? 'fade' : 'none'">
      <div v-if="visible" inset-0 fixed z-1000>
        <div
          class="bg-black/40 flex-center hw-full left-0 top-0 absolute z-60"
          @click="onOverlayClick"
        >
          <div @click.stop>
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
</style>
