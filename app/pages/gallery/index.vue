<script lang='ts' setup>
import type { BucketItem } from 'minio'

definePageMeta({
  layout: 'full',
  title: '图库',
  description: '图库',
  scrollToTop: true,
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
          class="text-dark-1 text-op70 border-1 border-common bg-hover-common-trans flex-center inline-flex h-9 w-9 cursor-pointer hover:text-op100"
          @click="$router.push('/gallery/upload')"
        >
          <Icon text-6 name="line-md:cloud-alt-upload-filled-loop" />
        </div>
      </template>
    </CHead>
    <ClientOnly>
      <div v-if="status === 'success'" class="<lg:columns-3 <md:columns-2 <sm:columns-1" p-4 columns-4>
        <div v-for="(item, index) in data" :key="index" mb3>
          <PreviewImg
            provider="minio"
            :src="item.name ?? ''"
            :active="activeName === item.name"
            @select="hdPreviewImg"
          />
        </div>
      </div>

      <Loading v-if="status === 'pending'" mt20 :loading="true" />

      <template #fallback>
        <Loading mt20 :loading="true" />
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped></style>
