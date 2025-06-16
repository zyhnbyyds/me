<script lang='ts' setup>
import type { QQContentItem } from '~/types/qq'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

defineProps<
  {
    list: QQContentItem[]
  }
>()

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
</script>

<template>
  <ul>
    <li v-for="item in (list ?? [])" :key="item.tid" class="border-b-0.5px border-common">
      <div class="w-full flex gap-2 p-4">
        <NuxtImg
          src="/me.png"
          alt="Avatar"
          :quality="10"
          class="h-8 w-8 rounded-full"
        />
        <div flex-1>
          <p class="flex items-center gap-2 text-sm font-semibold">
            <span>{{ item.name }}</span>
            <span class="text-12px text-gray">{{ '@Yuhang_zhang' }} · {{ dayjs(item.created_time * 1000).fromNow() }}</span>
          </p>

          <p class="mt-2 text-sm">
            {{ item?.content }}
          </p>

          <div v-if="item.pic" mt-5>
            <div
              v-for="_itm, idx in item.pic"
              :key="idx"
              mb-2 mr-2 inline-block h-50 w-50 overflow-hidden rounded-2px
            >
              <NuxtImg
                :quality="70"
                hw-full object-cover object-center
                :src="`/qq/image_${item.tid}_${idx}.jpg`"
              />
            </div>
          </div>

          <div mt-2 text-2.5 text-gray>
            {{ item.source_name }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
