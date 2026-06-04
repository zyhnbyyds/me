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

// 文件上传
const uploadRef = ref<HTMLInputElement>()
const uploading = ref(false)
const uploadProgress = ref('')

function addImageInput() {
  imageInputs.value.push('')
}

function removeImageInput(index: number) {
  imageInputs.value.splice(index, 1)
}

async function uploadFiles(files: FileList) {
  uploading.value = true
  uploadProgress.value = ''

  const fileArray = Array.from(files)
  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i]
    if (!file) continue
    uploadProgress.value = `上传中 (${i + 1}/${fileArray.length})...`

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password.value)

      const res = await $fetch<Result<{ urls: string[] }>>(
        '/api/essay/upload',
        {
          method: 'POST',
          body: formData,
        },
      )

      if (res.data?.urls?.[0]) {
        // 填入第一个空的图片输入框，或追加
        const emptyIdx = imageInputs.value.findIndex((url) => !url.trim())
        if (emptyIdx !== -1) {
          imageInputs.value[emptyIdx] = res.data.urls[0]
        } else {
          imageInputs.value.push(res.data.urls[0])
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '上传失败'
      uploadProgress.value = `上传失败: ${msg}`
      await new Promise((r) => setTimeout(r, 2000))
    }
  }

  uploadProgress.value = ''
  uploading.value = false
}

function triggerUpload() {
  uploadRef.value?.click()
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    uploadFiles(input.files)
    input.value = ''
  }
}

const canPublish = computed(
  () =>
    (content.value.trim() || imageInputs.value.some((url) => url.trim())) &&
    !publishing.value &&
    !uploading.value,
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

      <!-- 图片 -->
      <div class="mb-5">
        <label
          class="mb-2 flex items-center gap-2 text-3.5 font-medium text-gray-500"
        >
          图片
          <button
            class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-3 text-blue transition-colors hover:bg-blue/10"
            :disabled="uploading"
            @click="triggerUpload"
          >
            <Icon
              :name="
                uploading
                  ? 'material-symbols:hourglass'
                  : 'material-symbols:upload'
              "
              text-4
            />
            上传
          </button>
          <button
            class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-3 text-blue transition-colors hover:bg-blue/10"
            @click="addImageInput"
          >
            <Icon name="material-symbols:add-link" text-4 />
            链接
          </button>
          <span v-if="uploadProgress" class="text-3 text-blue">{{
            uploadProgress
          }}</span>
        </label>

        <input
          ref="uploadRef"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          class="hidden"
          @change="handleFileChange"
        />

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
