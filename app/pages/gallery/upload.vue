<script lang="ts" setup>
definePageMeta({
  middleware: 'auth-middleware',
})

const { open, onChange, onCancel } = useFileDialog()
const files = ref<File[]>([])
const [loading, load] = useToggle(false)
const uploadPercent = ref(0)
const controller = ref<AbortController | null>(null)

function showFileTypeIcon(fileName: string): string {
  const fileTypeMap = {
    pdf: 'hugeicons:pdf-02',
    doc: 'hugeicons:doc-02',
    docx: 'hugeicons:doc-02',
    xls: 'hugeicons:xls-02',
    xlsx: 'hugeicons:xls-02',
    ppt: 'hugeicons:ppt-02',
    pptx: 'hugeicons:ppt-02',
    jpg: 'hugeicons:jpg-02',
    jpeg: 'hugeicons:jpg-02',
    png: 'hugeicons:png-02',
    gif: 'hugeicons:gif-02',
    mp3: 'hugeicons:file-audio',
    mp4: 'hugeicons:file-video',
    avi: 'hugeicons:file-video',
    mkv: 'hugeicons:file-video',
    wav: 'hugeicons:file-audio',
    xml: 'hugeicons:xml-02',
  }
  const ext = fileName.split('.').pop()?.toLowerCase()
  const fileTypes = Object.keys(fileTypeMap)
  if (!ext || !fileTypes.includes(ext)) {
    return 'hugeicons:align-box-middle-right'
  }
  if (fileTypes.includes(ext)) {
    return fileTypeMap[ext as keyof typeof fileTypeMap] || 'hugeicons:align-box-middle-right'
  }
  return 'hugeicons:align-box-middle-right'
}

onChange(async (fileList) => {
  if (!fileList) return

  files.value = files.value.concat(Array.from(fileList))
  const formData = new FormData()
  files.value.forEach((file) => {
    formData.append('files', file)
  })
})

onCancel(() => {})

onKeyStroke('Escape', () => {
  if (loading.value) {
    loading.value = false
    controller.value?.abort()
    controller.value = null
  }
})

async function hdConfirmUpload() {
  controller.value = new AbortController()
  if (files.value.length === 0) {
    return
  }
  load(true)

  const formData = new FormData()
  files.value.forEach((file) => {
    formData.append('files', file)
  })

  load(true)
  await $fetch('/api/gallery/upload', {
    method: 'POST',
    body: formData,
  })
  load(false)
}
</script>

<template>
  <div>
    <CHead title="上传" />
    <div
      class="m-4 p-4 rounded-lg bg-hover-common flex flex-col cursor-pointer select-none transition-colors items-center justify-center"
      @click="open()"
    >
      <div class="text-2xl font-bold mb-4">上传文件</div>
      <div class="text-sm mt-2">支持(图片或者视频) 上传，支持批量上传，最大支持 50MB 的文件。</div>
    </div>

    <div mx-5>
      <TransitionGroup name="fade" tag="div">
        <div v-for="(item, i) in files" :key="item.name" class="group mb-1">
          <div class="p-2 rounded-lg bg-hover-common flex items-center justify-between">
            <span flex-center gap-1>
              <Icon text-4 :name="`${showFileTypeIcon(item.name)}`" class="mr-2" />
              <div class="text-sm text-op7">
                {{ item.name }}
              </div>
            </span>
            <div class="hidden transition-all group-hover:inline-flex">
              <span
                class="text-3 text-red-500 cursor-pointer hover:text-red-700"
                @click="files ? files.splice(i, 1) : null"
              >
                删除
              </span>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <LoadingPage
      v-model="loading"
      text="Uploading..."
      :percent="uploadPercent"
      :is-auto-loading="false"
    />

    <div v-if="files.length > 0" mt-5 text-center>
      <Btn @click="hdConfirmUpload"> 确认上传 </Btn>
    </div>
  </div>
</template>

<style scoped></style>
