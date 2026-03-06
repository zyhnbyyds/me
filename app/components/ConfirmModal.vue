<template>
  <Transition name="modal-fade">
    <div v-if="visible" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h3 class="modal-title">{{ title }}</h3>
          <div class="modal-body">
            <slot>{{ message }}</slot>
          </div>
          <div class="modal-footer">
            <button class="modal-btn confirm" @click="onConfirm">确定</button>
            <button class="modal-btn cancel" @click="onCancel">取消</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  title?: string
  message?: string
}>()
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
function onConfirm() {
  emit('confirm')
}
function onCancel() {
  emit('cancel')
}
</script>

<style scoped>
/* 过渡动画样式 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.modal-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px 20px;
  min-width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.modal-body {
  margin-bottom: 20px;
  font-size: 15px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-btn {
  padding: 6px 18px;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
}

.confirm {
  background: #e53e3e;
  color: #fff;
}

.cancel {
  background: #f1f1f1;
  color: #333;
}
</style>
