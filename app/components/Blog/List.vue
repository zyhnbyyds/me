<script lang='ts' setup>
import type { BlogCollectionItem } from '@nuxt/content'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

defineOptions({
  name: 'NContentList',
})
defineProps<Props>()
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

export interface Props {
  list: BlogCollectionItem[] | null
}

const { push } = useRouter()

async function goToBlogInfo(blobItem: BlogCollectionItem) {
  push(blobItem.path)
  await $fetch('/api/blog/look', { method: 'post', body: blobItem })
}
</script>

<template>
  <div class="p-4 min-h-[calc(100vh-50px)]">
    <ul gap-4 grid grid-cols-3 class="<lg:grid-cols-2 <md:grid-cols-1">
      <li v-for="blobItem in (list ?? [])" :key="blobItem.id" cursor-pointer>
        <div @click="goToBlogInfo(blobItem)">
          <div class="p-2 border border-common rounded-lg bg-common bg-op30 flex flex-col h-60 w-full">
            <NuxtImg v-if="blobItem.image" :quality="60" rounded-lg h-40 w-full object-cover class="border-1 border-common" :src="`/blog/${blobItem?.image}`" />
            <div flex-1 relative style="font-family: kaiti;">
              <p mt2 class="text-14px">
                <span>{{ blobItem.title }}</span>
              </p>
              <div class="text-14px text-gray flex w-full bottom-0 left-0 justify-between absolute z-1">
                <span>{{ dayjs(blobItem.publishAt).fromNow() }}</span>

                <span>阅读需要{{ blobItem.readingTime }}分钟</span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
