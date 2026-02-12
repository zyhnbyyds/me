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
              class="p-2 border border-common transition-all hover:shadow-lg rounded-lg bg-common bg-op30 flex flex-col w-full"
            >
              <NuxtImg
                v-if="blobItem.image"
                :quality="70"
                class="border-1 border-common rounded-lg h-50 w-full object-cover"
                :src="`/blog/${blobItem?.image}`"
              />
              <!-- 标签 -->
              <div class="flex-col-center mt-2 gap-2">
                <div
                  v-for="tag in blobItem.tags ?? []"
                  :key="tag"
                  class="text-12px bg-gray-200/50 dark:bg-dark-400/50 rounded-full px-2 py-1 text-gray-800/70 dark:text-gray-100/80"
                >
                  {{ tag }}
                </div>
              </div>
              <div flex-1 relative>
                <h2 mt2 class="text-14px font-bold text-gray-900 dark:text-gray-100">
                  {{ blobItem.title }}
                </h2>
                <p mt2 class="text-13px text-gray-800/80 dark:text-gray-200/70">
                  {{ blobItem.description }}
                </p>
                <div
                  class="text-14px mt-4 text-gray-800/70 dark:text-gray-200/70 flex w-full justify-between"
                >
                  <div flex-center gap-1>
                    <Icon name="carbon:calendar" class="text-4" />
                    <span text-3>{{ dayjs(blobItem.updateAt).fromNow() }}</span>
                  </div>
                  <div flex-center gap-1>
                    <Icon name="mdi:clock-outline" class="text-4" />
                    <span text-3>{{ blobItem.readingTime }}分钟</span>
                  </div>
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
