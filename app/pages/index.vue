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
      <ul columns-3 class="<lg:columns-2 <md:columns-1" gap-x-4>
        <li
          @click="goToBlogInfo(blobItem)"
          v-for="blobItem in blobs ?? []"
          :key="blobItem.id"
          mb-4
          cursor-pointer
          class="group border border-common transition-all hover:shadow-lg bg-common bg-op60 rounded-lg overflow-hidden"
        >
          <NuxtImg
            v-if="blobItem.image"
            :quality="70"
            class="border-1 group-hover:scale-101 transition-all duration-300 border-common rounded-t-lg h-46 w-full object-cover"
            :src="`/blog/${blobItem?.image}`"
          />
          <div p-3>
            <h2 mt2 class="text-14px font-bold text-gray-900 dark:text-gray-100">
              {{ blobItem.title }}
            </h2>
            <!-- 标签 -->
            <div class="flex flex-wrap mt-2 gap-2">
              <div
                v-for="tag in blobItem.tags ?? []"
                :key="tag"
                class="text-12px text-nowrap bg-gray-200/50 dark:bg-dark-200/80 rounded-full px-2 py-1 text-gray-800/70 dark:text-gray-100/80"
              >
                {{ tag }}
              </div>
            </div>
            <p mt2 class="text-13px text-gray-800/80 dark:text-gray-200/70">
              {{ blobItem.description }}
            </p>
            <div
              class="text-14px mt-4 text-gray-800/70 dark:text-gray-200/70 flex w-full justify-between"
            >
              <div flex-center gap-1>
                <Icon name="carbon:calendar" class="text-4" />
                <span text-3>{{ dayjs(blobItem.updateAt).format('YYYY-MM-DD') }}</span>
              </div>
              <div flex-center gap-1>
                <Icon name="mdi:clock-outline" class="text-4" />
                <span text-3>{{ blobItem.readingTime }}分钟</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
