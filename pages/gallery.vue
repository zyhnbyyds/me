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
    <CHead title="图库" />
    <ClientOnly>
      <div v-if="status === 'success'" columns-3 gap-x-2>
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

      <template #fallback>
        <div pt-20 text-center class="font-italic">
          Loading...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped></style>
