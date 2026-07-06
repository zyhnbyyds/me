<script lang="ts" setup>
import { socialLinks } from '~/constants'
import type { SocialLink } from '~/constants'

// ─── 二维码弹窗 ───────────────────────────────────────────
const qrcodeVisible = ref(false)
const qrcodeTarget = ref<SocialLink | null>(null)

function openQrcode(link: SocialLink) {
  qrcodeTarget.value = link
  qrcodeVisible.value = true
}

// ─── 复制提示 ─────────────────────────────────────────────
const { copy, isSupported } = useClipboard()
const toastMsg = ref('')
const toastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

async function handleCopy(link: SocialLink) {
  if (!link.copyText) return
  try {
    await copy(link.copyText)
    toastMsg.value = '已复制到剪贴板'
  } catch {
    // fallback：手动复制
    toastMsg.value = link.copyText
  }
  showToast()
}

function showToast() {
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 2000)
}

// ─── 点击分发 ─────────────────────────────────────────────
function handleClick(link: SocialLink) {
  switch (link.action) {
    case 'link':
      if (link.url) window.open(link.url, '_blank', 'noopener')
      break
    case 'qrcode':
      openQrcode(link)
      break
    case 'copy':
      handleCopy(link)
      break
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <div
      v-for="link in socialLinks"
      :key="link.name"
      class="social-icon flex-center h-8 w-8 cursor-pointer rounded-full transition-all duration-200 hover:bg-light-500 hover:dark:bg-dark-500"
      @click="handleClick(link)"
    >
      <Icon :name="link.icon" class="text-4.5 transition-colors duration-200" />
    </div>
  </div>

  <!-- 二维码弹窗 -->
  <Modal v-model="qrcodeVisible" title="扫码添加" close-on-click-overlay>
    <div v-if="qrcodeTarget" class="flex flex-col items-center gap-4 p-4">
      <div class="overflow-hidden rounded-xl border border-common">
        <img
          :src="qrcodeTarget.qrcode"
          :alt="qrcodeTarget.name"
          class="h-50 w-50 object-contain"
        />
      </div>
      <p class="text-4 font-medium">{{ qrcodeTarget.name }}</p>
      <p class="text-3 text-gray-400">打开 {{ qrcodeTarget.name }} 扫一扫</p>
    </div>
  </Modal>

  <!-- 复制提示 Toast -->
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toastVisible"
        class="fixed bottom-6 left-1/2 z-999 -translate-x-1/2 rounded-lg bg-gray-800 px-4 py-2 text-3.5 text-white shadow-lg dark:bg-gray-200 dark:text-gray-800"
      >
        {{ toastMsg }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.social-icon {
  color: rgb(107, 114, 128);
}
.social-icon:hover {
  color: rgb(15, 20, 25);
}
:global(.dark) .social-icon {
  color: rgb(156, 163, 175);
}
:global(.dark) .social-icon:hover {
  color: rgb(231, 234, 235);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
