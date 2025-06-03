<script lang='ts' setup>
const { open, onChange, onCancel, reset } = useFileDialog()
const files = ref<File[]>([])
const [loading, load] = useToggle(false)
const uploadPercent = ref(0)

const { $axios } = useNuxtApp()

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
  if (!fileList)
    return

  files.value = files.value.concat(Array.from(fileList))
  const formData = new FormData()
  files.value.forEach((file) => {
    formData.append('files', file)
  })
})

onCancel(() => {
})

function hdConfirmUpload() {
  if (files.value.length === 0) {
    return
  }
  load(true)

  const formData = new FormData()
  files.value.forEach((file) => {
    formData.append('files', file)
  })

  $axios.post('/api/gallery/upload', formData, {
    timeout: 0,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    maxBodyLength: Infinity,
    onUploadProgress: (progressEvent) => {
      uploadPercent.value = Number.parseFloat(((progressEvent.progress ?? 0) * 100).toFixed(2))
    },
  })
    .then(() => {
      reset()
      files.value = []
      load(false)
    })
    .catch((_error) => {
      load(false)
    })
}
</script>

<template>
  <div>
    <CHead title="上传" />
    <div class="m-4 flex flex-col cursor-pointer select-none items-center justify-center rounded-lg p-4 transition-colors bg-hover-common" @click="open">
      <div class="mb-4 text-2xl font-bold">
        上传文件
      </div>
      <div class="mt-2 text-sm">
        支持(图片或者视频) 上传，支持批量上传，最大支持 50MB 的文件。
      </div>
    </div>

    <div mx-5>
      <TransitionGroup name="fade" tag="div">
        <div v-for="item, i in files" :key="item.name" class="group mb-1">
          <div class="flex items-center justify-between rounded-lg p-2 bg-hover-common">
            <span flex-center gap-1>
              <Icon text-4 :name="`${showFileTypeIcon(item.name)}`" class="mr-2" />
              <div class="text-sm text-op7">
                {{ item.name }}
              </div>
            </span>
            <div class="hidden transition-all group-hover:inline-flex">
              <span class="cursor-pointer text-3 text-red-500 hover:text-red-700" @click="files ? files.splice(i, 1) : null">
                删除
              </span>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <LoadingPage
      v-model="loading"
      :percent="uploadPercent"
      :is-auto-loading="false"
    />

    <div v-if="files.length > 0" mt-5 text-center>
      <Btn
        @click="hdConfirmUpload"
      >
        确认上传
      </Btn>
    </div>
  </div>
</template>

<style scoped></style>
