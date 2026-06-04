<script lang="ts" setup>
definePageMeta({
  title: '写随笔',
  description: '记录一些随想',
})

// ─── 密码验证 ─────────────────────────────────────────────
const password = ref('')
const verified = ref(false)
const verifyError = ref('')
const verifying = ref(false)

async function handleVerify() {
  if (!password.value) return
  verifying.value = true
  verifyError.value = ''

  try {
    const res = await $fetch<Result<{ valid: boolean }>>('/api/essay/verify', {
      method: 'POST',
      body: { password: password.value },
    })

    if (res.code === 200) {
      verified.value = true
    } else {
      verifyError.value = res.message || '密码错误'
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '验证失败，请稍后再试'
    verifyError.value = msg
  } finally {
    verifying.value = false
  }
}

// ─── 编写随笔 ─────────────────────────────────────────────
const content = ref('')
const imageInputs = ref<string[]>([''])
const publishing = ref(false)
const publishError = ref('')
const publishSuccess = ref(false)

function addImageInput() {
  imageInputs.value.push('')
}

function removeImageInput(index: number) {
  imageInputs.value.splice(index, 1)
}

const canPublish = computed(
  () =>
    (content.value.trim() || imageInputs.value.some((url) => url.trim())) &&
    !publishing.value,
)

async function handlePublish() {
  if (!canPublish.value) return
  publishing.value = true
  publishError.value = ''
  publishSuccess.value = false

  const images = imageInputs.value.map((url) => url.trim()).filter(Boolean)

  try {
    await $fetch('/api/essay', {
      method: 'POST',
      body: {
        password: password.value,
        content: content.value.trim() || undefined,
        images: images.length > 0 ? images : undefined,
      },
    })

    publishSuccess.value = true
    content.value = ''
    imageInputs.value = ['']

    setTimeout(() => {
      publishSuccess.value = false
    }, 3000)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '发布失败，请稍后再试'
    publishError.value = msg
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto px-5 py-4">
    <!-- 密码验证遮罩 -->
    <div
      v-if="!verified"
      class="flex-center fixed inset-0 z-1000 bg-black/40 backdrop-blur-sm"
    >
      <div
        class="w-90 rounded-2xl bg-white p-6 shadow-2xl dark:bg-dark-600"
        @click.stop
      >
        <h2 class="mb-4 text-center text-5 font-bold">验证身份</h2>
        <p class="mb-4 text-center text-3.5 text-gray-400">
          请输入随笔密码以继续
        </p>

        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          class="mb-3 w-full rounded-lg border border-common bg-transparent px-4 py-2.5 text-3.5 outline-none transition-colors focus:border-blue"
          @keydown.enter="handleVerify"
        />

        <p v-if="verifyError" class="mb-3 text-3 text-red-500">
          {{ verifyError }}
        </p>

        <Btn
          class="w-full"
          :loading="verifying"
          :disabled="!password"
          @click="handleVerify"
        >
          验证
        </Btn>
      </div>
    </div>

    <!-- 编写区域 -->
    <div v-else class="mx-auto max-w-2xl">
      <h1 class="mb-6 text-6 font-bold">写随笔</h1>

      <!-- 文字内容 -->
      <div class="mb-5">
        <label class="mb-2 block text-3.5 font-medium text-gray-500"
          >文字内容</label
        >
        <textarea
          v-model="content"
          placeholder="记录一些随想..."
          rows="6"
          class="w-full resize-none rounded-xl border border-common bg-transparent px-4 py-3 text-3.5 leading-relaxed outline-none transition-colors focus:border-blue"
        />
      </div>

      <!-- 图片链接 -->
      <div class="mb-5">
        <label
          class="mb-2 flex items-center gap-2 text-3.5 font-medium text-gray-500"
        >
          图片链接
          <button
            class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-3 text-blue transition-colors hover:bg-blue/10"
            @click="addImageInput"
          >
            <Icon name="material-symbols:add" text-4 />
            添加
          </button>
        </label>

        <div class="space-y-2">
          <div
            v-for="(_, idx) in imageInputs"
            :key="idx"
            class="flex items-center gap-2"
          >
            <input
              v-model="imageInputs[idx]"
              type="url"
              placeholder="https://..."
              class="flex-1 rounded-lg border border-common bg-transparent px-4 py-2 text-3.5 outline-none transition-colors focus:border-blue"
            />
            <button
              v-if="imageInputs.length > 1"
              class="flex-shrink-0 rounded-lg p-2 text-red-400 transition-colors hover:bg-red/10"
              @click="removeImageInput(idx)"
            >
              <Icon name="material-symbols:close" text-4 />
            </button>
          </div>
        </div>
      </div>

      <!-- 错误/成功提示 -->
      <p v-if="publishError" class="mb-4 text-3 text-red-500">
        {{ publishError }}
      </p>
      <p v-if="publishSuccess" class="mb-4 text-3 text-green-500">发布成功！</p>

      <!-- 发布按钮 -->
      <Btn
        class="w-full"
        :loading="publishing"
        :disabled="!canPublish"
        @click="handlePublish"
      >
        发布随笔
      </Btn>
    </div>
  </div>
</template>
