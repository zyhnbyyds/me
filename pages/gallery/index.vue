<script lang='ts' setup>
import type { BucketItem } from 'minio'

definePageMeta({
  layout: 'gallery',
  title: '图库',
  description: '图库',
})

const { $api } = useNuxtApp()

const { data, status } = useAsyncData('gallery', async () => {
  return await $api<BucketItem[]>('/api/gallery/list')
}, { default: () => [] })

const activeName = ref<string | null>(null)

function hdPreviewImg(name?: string) {
  if (!name) {
    activeName.value = null
    return
  }

  activeName.value = name
}
</script>

<template>
  <div>
    <CHead title="图库">
      <template #right>
        <div
          v-if="isShowMinioUploadBtn()"
          class="h-9 w-9 flex-center inline-flex cursor-pointer border-1 text-dark-1 text-op70 border-common hover:text-op100 bg-hover-common-trans"
          @click="$router.push('/gallery/upload')"
        >
          <div text-6 class="i-line-md:cloud-alt-upload-filled-loop" />
        </div>
      </template>
    </CHead>
    <ClientOnly>
      <div v-if="status === 'success'" columns-4 class="<lg:columns-3 <md:columns-2 <sm:columns-1" p-4>
        <div v-for="(item, index) in data" :key="index" mb3>
          <PreviewImg
            provider="minio"
            :src="item.name ?? ''"
            :active="activeName === item.name"
            @select="hdPreviewImg"
          />
        </div>
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
