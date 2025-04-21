<script lang="ts" setup>
import type { BlogMeta } from '~/types/blog'

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})

const meta = computed(() => {
  return page.value?.meta as unknown as BlogMeta
})

useSeoMeta({
  title: page.value?.title,
  description: meta.value?.description,
  ogImage: meta.value?.image,
})
</script>

<template>
  <div w-full>
    <header sticky top-0 h-50px w-full flex-col-center gap-4 px-4 text-5 blur-common>
      <div class="h-9 w-9 flex-center inline-flex cursor-pointer bg-hover-common" @click="$router.back()">
        <Icon name="material-symbols:arrow-back" />
      </div>
      <p font-bold>
        帖子
      </p>
    </header>
    <div class="markdown-body">
      <ContentRenderer v-if="page" :value="page" />
    </div>
  </div>
</template>
