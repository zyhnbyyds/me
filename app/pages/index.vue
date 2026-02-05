<script lang="ts" setup>
import type { BlogCollectionItem } from '@nuxt/content'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { homeTabList } from '~/constants'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
const { push } = useRouter()

const activeTab = ref(homeTabList[0]?.value)

// 一次性加载所有content
const { data: blobs, refresh } = useAsyncData(
  'blog',
  () => {
    // TODO: 优化查询，避免一次性加载所有数据, 目前数据不多
    if (activeTab.value === 'recommend') {
      return queryCollection('blog').all()
    }

    return queryCollection('blog').order('updateAt', 'DESC').all()
  },
  { default: () => [] },
)

watch(
  () => activeTab.value,
  () => {
    refresh()
  },
)

async function goToBlogInfo(blobItem: BlogCollectionItem) {
  push(blobItem.path)
  await $fetch('/api/blog/look', { method: 'post', body: blobItem })
}
</script>

<template>
  <div>
    <Tab v-model="activeTab" blur-common w-full top-0 sticky z-9999 :list="homeTabList" />
    <div class="p-4 pb-30 min-h-[calc(100vh-50px)]">
      <ul gap-4 grid grid-cols-3 class="<lg:grid-cols-2 <md:grid-cols-1">
        <li v-for="blobItem in blobs ?? []" :key="blobItem.id" cursor-pointer>
          <div @click="goToBlogInfo(blobItem)">
            <div
              class="p-2 border border-common rounded-lg bg-common bg-op30 flex flex-col h-60 w-full"
            >
              <NuxtImg
                v-if="blobItem.image"
                :quality="70"
                class="border-1 border-common rounded-lg h-40 w-full object-cover"
                :src="`/blog/${blobItem?.image}`"
              />
              <div flex-1 relative style="font-family: kaiti">
                <p mt2 class="text-14px text-nowrap text-ellipsis overflow-hidden">
                  {{ blobItem.title }}
                </p>
                <div
                  class="text-14px text-gray flex w-full bottom-0 left-0 justify-between absolute z-1"
                >
                  <span>{{ dayjs(blobItem.publishAt).fromNow() }}</span>

                  <span>阅读需要{{ blobItem.readingTime }}分钟</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
