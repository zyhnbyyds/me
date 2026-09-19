<script lang="ts" setup>
import type { EssayMarkdownBody, EssayMedia } from '~~/shared/types/essay'

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
const mediaList = ref<EssayMedia[]>([])
const publishing = ref(false)
const publishError = ref('')
const publishSuccess = ref(false)

// ─── Markdown 预览 ────────────────────────────────────────
/** 编辑 / 预览 两种模式 */
const viewMode = ref<'edit' | 'preview'>('edit')
const viewTabs = [
  { label: '编辑', value: 'edit', icon: 'material-symbols:edit-outline' },
  {
    label: '预览',
    value: 'preview',
    icon: 'material-symbols:visibility-outline',
  },
] as const
const previewBody = ref<EssayMarkdownBody | null>(null)
const parsing = ref(false)

/** 交由服务端解析（与列表页共用同一套解析逻辑），保证预览与最终展示一致 */
let previewSeq = 0

async function refreshPreview() {
  const source = content.value.trim()
  if (!source) {
    previewBody.value = null
    return
  }

  const seq = ++previewSeq
  parsing.value = true

  try {
    const res = await $fetch<Result<EssayMarkdownBody | null>>(
      '/api/essay/preview',
      { method: 'POST', body: { content: source } },
    )
    // 丢弃过期响应，避免快速输入时旧结果覆盖新结果
    if (seq === previewSeq) previewBody.value = res.data ?? null
  } catch {
    if (seq === previewSeq) previewBody.value = null
  } finally {
    if (seq === previewSeq) parsing.value = false
  }
}

const refreshPreviewDebounced = useDebounceFn(refreshPreview, 450)

watch([viewMode, content], () => {
  if (viewMode.value === 'preview') refreshPreviewDebounced()
})

// 手动输入的图片 URL（兼容旧方式）
const manualUrl = ref('')

// 文件上传
const uploadRef = ref<HTMLInputElement>()
const uploading = ref(false)
const uploadProgress = ref('')

function addManualUrl() {
  const url = manualUrl.value.trim()
  if (!url) return
  mediaList.value.push({ type: 'image', image: url })
  manualUrl.value = ''
}

function removeMedia(index: number) {
  mediaList.value.splice(index, 1)
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
      // 鉴权已通过 cookie 中的 essay_token 完成，不再传输密码明文

      const res = await $fetch<Result<{ urls: string[]; media: EssayMedia[] }>>(
        '/api/essay/upload',
        { method: 'POST', body: formData },
      )

      if (res.data?.media?.length) {
        mediaList.value.push(...res.data.media)
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
    (content.value.trim() || mediaList.value.length > 0) &&
    !publishing.value &&
    !uploading.value,
)

function mediaToImages(media: EssayMedia[]): EssayMedia[] {
  return media.map((m) => {
    if (typeof m === 'string') {
      return { type: 'image' as const, image: m }
    }
    return m
  })
}

async function handlePublish() {
  if (!canPublish.value) return
  publishing.value = true
  publishError.value = ''
  publishSuccess.value = false

  const images = mediaToImages(mediaList.value)

  try {
    await $fetch('/api/essay', {
      method: 'POST',
      body: {
        content: content.value.trim() || undefined,
        images: images.length > 0 ? images : undefined,
      },
    })

    publishSuccess.value = true
    content.value = ''
    mediaList.value = []

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

// 获取 media 的封面图 URL
function getMediaImage(m: EssayMedia): string {
  if (typeof m === 'string') return m
  return m.image
}

function isLive(m: EssayMedia): boolean {
  return typeof m === 'object' && m.type === 'live'
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
        class="w-90 rounded-2xl bg-c-surface p-6 shadow-2xl dark:bg-c-bg"
        @click.stop
      >
        <h2 class="mb-4 text-center text-5 font-bold">验证身份</h2>
        <p class="mb-4 text-center text-3.5 text-c-text-weak">
          请输入随笔密码以继续
        </p>

        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          class="mb-3 w-full rounded-lg border border-common bg-transparent px-4 py-2.5 text-3.5 outline-none transition-colors focus:border-c-accent"
          @keydown.enter="handleVerify"
        />

        <p
          v-if="verifyError"
          class="mb-3 flex items-center gap-1.5 text-3 text-c-accent"
        >
          <Icon name="material-symbols:error-outline" text-4 />
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
        <div class="mb-2 flex items-center justify-between gap-3">
          <label class="text-3.5 font-medium text-c-text-alt">文字内容</label>

          <div class="flex items-center gap-2">
            <span class="hidden text-2.5 text-c-text-weak sm:inline">
              支持 Markdown 语法
            </span>

            <!-- 编辑 / 预览 切换 -->
            <div class="flex rounded-full border border-common p-0.5">
              <button
                v-for="tab in viewTabs"
                :key="tab.value"
                type="button"
                class="flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-2.5 transition-colors"
                :class="
                  viewMode === tab.value
                    ? 'bg-c-hover text-c-accent'
                    : 'text-c-text-weak hover:text-c-text-alt'
                "
                @click="viewMode = tab.value"
              >
                <Icon :name="tab.icon" text-3.5 />
                {{ tab.label }}
              </button>
            </div>
          </div>
        </div>

        <textarea
          v-if="viewMode === 'edit'"
          v-model="content"
          placeholder="记录一些随想，支持 Markdown 语法..."
          rows="8"
          class="w-full resize-y rounded-xl border border-common bg-transparent px-4 py-3 text-3.5 leading-relaxed outline-none transition-colors focus:border-c-accent focus:ring-1 focus:ring-c-accent"
        />

        <!-- Markdown 预览 -->
        <div
          v-else
          class="min-h-40 rounded-xl border border-dashed border-common bg-c-bg/40 px-4 py-3"
        >
          <EssayMarkdown
            v-if="previewBody"
            :body="previewBody"
            :clamp="false"
          />
          <p v-else-if="parsing" class="text-3 text-c-text-weak">渲染中…</p>
          <p v-else class="text-3 text-c-text-weak">还没有内容～</p>
        </div>
      </div>

      <!-- 图片 -->
      <div class="mb-5">
        <label
          class="mb-2 flex items-center gap-2 text-3.5 font-medium text-c-text-alt"
        >
          图片
          <button
            class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-3 text-blue transition-colors hover:bg-c-hover"
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
          <span v-if="uploadProgress" class="text-3 text-blue">{{
            uploadProgress
          }}</span>
        </label>

        <input
          ref="uploadRef"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,video/*"
          multiple
          class="hidden"
          @change="handleFileChange"
        />

        <!-- 已上传的 media 预览 -->
        <div v-if="mediaList.length > 0" class="space-y-2">
          <div
            v-for="(m, idx) in mediaList"
            :key="idx"
            class="relative overflow-hidden rounded-lg border border-common"
          >
            <img
              :src="getMediaImage(m)"
              alt=""
              class="h-40 w-full object-cover"
            />
            <!-- Live 标记 -->
            <div
              v-if="isLive(m)"
              class="flex items-center gap-1 absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-2.5 text-white backdrop-blur-sm"
            >
              <Icon name="material-symbols:live-tv" text-3 />
              LIVE
            </div>
            <button
              class="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white backdrop-blur-sm"
              @click="removeMedia(idx)"
            >
              <Icon name="material-symbols:close" text-4 />
            </button>
          </div>
        </div>
      </div>

      <!-- 发布结果提示 -->
      <div
        v-if="publishError"
        class="mb-4 flex items-center gap-2 rounded-xl border border-c-accent/30 bg-c-accent/8 px-3 py-2 text-3 text-c-accent"
      >
        <Icon name="material-symbols:error-outline" text-4 />
        {{ publishError }}
      </div>
      <div
        v-if="publishSuccess"
        class="mb-4 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-3 text-green-600 dark:text-green-400"
      >
        <Icon name="material-symbols:check-circle-outline" text-4 />
        发布成功，已经展示在随笔列表里了
      </div>

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
