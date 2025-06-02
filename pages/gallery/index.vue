<script lang='ts' setup>
import type { BucketItem } from 'minio'

const { $api } = useNuxtApp()

const { data, status } = useAsyncData('gallery', async () => {
  return await $api<BucketItem[]>('/api/gallery/list')
}, { default: () => [] })

const isPreviewing = inject<Ref<boolean>>('previewVisible', ref(false))
const activeName = ref<string | null>(null)

function hdPreviewImg(name?: string) {
  if (!name) {
    isPreviewing.value = false
    activeName.value = null
    return
  }

  isPreviewing.value = true
  activeName.value = name
}
</script>

<template>
  <div>
    <CHead title="图库">
      <template #right>
        <div
          class="h-9 w-9 flex-center inline-flex cursor-pointer border-1 text-dark-1 text-op70 border-common hover:text-op100 bg-hover-common-trans"
          @click="$router.push('/gallery/upload')"
        >
          <div text-6 class="i-line-md:cloud-alt-upload-filled-loop" />
        </div>
      </template>
    </CHead>
    <div v-if="status === 'success'" columns-2 gap-x-2>
      <PreviewImg
        v-for="(item, index) in data"
        :key="index"
        :name="item.name"
        :active="activeName === item.name"
        @click="hdPreviewImg(item.name)"
      />
    </div>
    <div v-if="status === 'pending'" pt-20 text-center class="font-italic">
      Loading...
    </div>

    <!-- <template #fallback>
        <div pt-20 text-center class="font-italic">
          Loading...
        </div>
      </template> -->
  </div>
</template>

<style scoped></style>
