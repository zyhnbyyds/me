<script lang="ts" setup>
interface CalendarEvent {
  id: string
  source: 'blog' | 'qq'
  date: string
  timestamp: number
  title?: string
  description?: string
  content?: string
  path?: string
  image?: string
  tags?: string[]
  name?: string
  tid?: string
  [key: string]: unknown
}
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const year = ref(dayjs().year())
const month = ref(dayjs().month() + 1)
const eventsMap = ref<Record<string, CalendarEvent[]>>({})
const modalVisible = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

const { data: eventsData, refresh } = await useFetch<{
  events: CalendarEvent[]
}>(() => `/api/calendar?year=${year.value}&month=${month.value}`, {
  watch: [year, month],
})

watch(
  eventsData,
  (data) => {
    if (!data?.events) return
    const map: Record<string, CalendarEvent[]> = {}
    for (const ev of data.events) {
      const key = ev.date
      if (!map[key]) map[key] = []
      map[key].push(ev)
    }
    eventsMap.value = map
  },
  { immediate: true },
)

const days = computed(() => {
  const start = dayjs(`${year.value}-${month.value}-1`)
  const weekIdx = start.day() || 7
  const daysInMonth = start.daysInMonth()
  const now = dayjs()

  const prevMonth = month.value === 1 ? 12 : month.value - 1
  const prevYear = month.value === 1 ? year.value - 1 : year.value
  const prevDaysInMonth = dayjs(`${prevYear}-${prevMonth}-1`).daysInMonth()

  const result: Array<{
    day: number
    date: string
    isPrevMonth: boolean
    isNextMonth: boolean
    isToday: boolean
    events: CalendarEvent[]
  }> = []

  for (let i = 1; i < weekIdx; i++) {
    const d = prevDaysInMonth - weekIdx + i + 1
    const date = `${prevYear}-${prevMonth}-${d}`
    result.push({
      day: d,
      date,
      isPrevMonth: true,
      isNextMonth: false,
      isToday: false,
      events: eventsMap.value[date] ?? [],
    })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year.value}-${month.value}-${d}`
    result.push({
      day: d,
      date,
      isPrevMonth: false,
      isNextMonth: false,
      isToday: now.format('YYYY-M-D') === date,
      events: eventsMap.value[date] ?? [],
    })
  }

  const remain = 42 - result.length
  const nextMonth = month.value === 12 ? 1 : month.value + 1
  const nextYear = month.value === 12 ? year.value + 1 : year.value
  for (let i = 1; i <= remain; i++) {
    const date = `${nextYear}-${nextMonth}-${i}`
    result.push({
      day: i,
      date,
      isPrevMonth: false,
      isNextMonth: true,
      isToday: false,
      events: eventsMap.value[date] ?? [],
    })
  }

  return result
})

function addMonth() {
  if (month.value === 12) {
    month.value = 1
    year.value += 1
  } else {
    month.value += 1
  }
}

function decreaseMonth() {
  if (month.value === 1) {
    month.value = 12
    year.value -= 1
  } else {
    month.value -= 1
  }
}

function openEventDetail(ev: CalendarEvent) {
  selectedEvent.value = ev
  modalVisible.value = true
}

function goToDetail(ev: CalendarEvent) {
  if (ev.source === 'blog' && ev.path) {
    navigateTo(ev.path)
  } else if (ev.source === 'qq' && ev.tid) {
    navigateTo(`/qq?tid=${ev.tid}`)
  }
  modalVisible.value = false
}

const weekLabels = ['一', '二', '三', '四', '五', '六', '日']
</script>

<template>
  <div class="<md:p-2 hw-full flex flex-col">
    <CHead title="日历">
      <template #right>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1 <md:gap-2">
            <button
              type="button"
              class="rounded p-2 cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-dark-300 <md:min-h-11 <md:min-w-11"
              @click="decreaseMonth"
            >
              <Icon name="carbon:chevron-left" class="text-4" />
            </button>
            <span
              class="text-center text-nowrap text-3.5 <md:text-15px min-w-20 <md:min-w-24"
            >
              {{ year }} 年 {{ String(month).padStart(2, '0') }} 月
            </span>
            <button
              type="button"
              class="rounded p-2 cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-dark-300 <md:min-h-11 <md:min-w-11"
              @click="addMonth"
            >
              <Icon name="carbon:chevron-right" class="text-4" />
            </button>
          </div>
        </div>
      </template>
    </CHead>
    <div class="p-4 <md:p-2">
      <div class="grid grid-cols-7 gap-1 <md:gap-0.5 text-center">
        <div
          v-for="w in weekLabels"
          :key="w"
          class="rounded py-2 <md:py-1 text-13px <md:text-12px font-medium text-gray-600 dark:text-gray-400"
        >
          {{ w }}
        </div>
      </div>
    </div>
    <div
      class="grid grid-cols-7 gap-1 <md:gap-0.5 flex-1 min-h-0"
      :class="days.length > 35 ? 'grid-rows-6' : 'grid-rows-5'"
    >
      <div
        v-for="item in days"
        :key="item.date"
        class="min-h-24 <md:min-h-14 rounded-md border border-light-700 p-2 <md:p-1 transition-colors dark:border-dark-300"
        :class="[
          item.isToday
            ? 'bg-linear-to-rb from-blue-300 to-blue-400 text-white dark:from-blue-600 dark:to-blue-300'
            : item.isNextMonth || item.isPrevMonth
              ? 'opacity-40 bg-gray-200 dark:bg-dark-500 dark:text-gray-500'
              : 'hover:bg-light-400 dark:hover:bg-dark-200 cursor-pointer bg-opacity-40 dark:bg-dark-400 dark:text-gray-100',
        ]"
      >
        <div class="mb-1 <md:mb-0.5 flex items-center justify-between">
          <span class="text-14px <md:text-12px font-medium">{{
            item.day
          }}</span>
          <span
            v-if="item.isPrevMonth || item.isNextMonth"
            class="text-12px <md:text-11px opacity-70"
          >
            {{ dayjs(item.date).format('M') }}月
          </span>
        </div>
        <div class="space-y-1 <md:space-y-0.5 overflow-hidden">
          <div
            v-for="ev in item.events.slice(0, 3)"
            :key="ev.id"
            class="cursor-pointer truncate rounded px-1.5 <md:px-1 py-0.5 text-left text-12px <md:text-11px transition-colors"
            :class="
              ev.source === 'blog'
                ? 'bg-blue-500/30 dark:bg-blue-400/30 hover:bg-blue-500/40 dark:hover:bg-blue-400/40 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                : 'bg-green-500/30 dark:bg-green-400/30 hover:bg-green-500/40 dark:hover:bg-green-400/40 hover:bg-green-100 dark:hover:bg-green-900/20'
            "
            @click.stop="openEventDetail(ev)"
          >
            {{
              ev.source === 'blog'
                ? ev.title
                : (ev.content ?? ev.name ?? '说说')?.slice(0, 12)
            }}
          </div>
          <div
            v-if="item.events.length > 3"
            class="text-11px <md:text-10px opacity-70"
          >
            +{{ item.events.length - 3 }} 更多
          </div>
        </div>
      </div>
    </div>

    <Modal
      v-model="modalVisible"
      :show-mask="true"
      :close-on-click-overlay="true"
      is-transition
    >
      <div
        v-if="selectedEvent"
        class="overflow-auto absolute max-h-80% top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-w-50% <md:max-w-95% <md:w-95% bg-white p-6 pt-4 <md:p-4 shadow-xl dark:bg-dark-900 dark:text-gray-100 transition-colors"
      >
        <div
          class="mb-4 flex items-center justify-between border-b border-common dark:border-dark-300 pb-2"
        >
          <span class="flex items-center gap-2">
            <span
              class="rounded px-2 py-0.5 text-12px"
              :class="
                selectedEvent.source === 'blog'
                  ? 'bg-blue-500/30 dark:bg-blue-500/40 text-blue-900 dark:text-blue-100'
                  : 'bg-green-500/30 dark:bg-green-500/40 text-green-900 dark:text-green-100'
              "
            >
              {{ selectedEvent.source === 'blog' ? '文章' : 'QQ空间' }}
            </span>
            <span class="text-13px text-gray-500 dark:text-gray-400">
              {{ dayjs(selectedEvent.timestamp).format('YYYY-MM-DD HH:mm') }}
            </span>
          </span>
          <!-- 关闭按钮 -->
          <button
            type="button"
            class="cursor-pointer hover:bg-common dark:hover:bg-dark-500 h-8 w-8 <md:h-10 <md:w-10 rounded-full flex-center transition-colors touch-manipulation"
            @click="modalVisible = false"
          >
            <Icon name="carbon:close" class="text-6" />
          </button>
        </div>

        <template v-if="selectedEvent.source === 'blog'">
          <h2 class="text-16px font-bold">{{ selectedEvent.title }}</h2>
          <div
            v-if="selectedEvent.tags?.length"
            class="mt-2 flex flex-wrap gap-2"
          >
            <span
              v-for="tag in selectedEvent.tags"
              :key="tag"
              class="rounded-full bg-gray-200 px-2 py-0.5 text-12px dark:bg-dark-500 dark:text-gray-200"
            >
              {{ tag }}
            </span>
          </div>
          <p
            v-if="selectedEvent.description"
            class="mt-2 text-14px text-gray-600 dark:text-gray-300"
          >
            {{ selectedEvent.description }}
          </p>
          <NuxtImg
            v-if="selectedEvent.image"
            :src="`/blog/${selectedEvent.image}`"
            class="mt-3 rounded-lg max-w-80% border border-gray-200 dark:border-dark-400"
          />
          <div>
            <button
              type="button"
              class="mt-4 rounded bg-blue-500 px-4 py-2 <md:py-3 text-14px text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors touch-manipulation"
              @click="goToDetail(selectedEvent)"
            >
              查看全文
            </button>
          </div>
        </template>

        <template v-else>
          <p class="text-14px text-gray-700 dark:text-gray-200">
            {{ selectedEvent.content || '暂无内容' }}
          </p>
          <button
            type="button"
            class="mt-4 rounded bg-green-500 px-4 py-2 <md:py-3 text-14px text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition-colors touch-manipulation"
            @click="goToDetail(selectedEvent)"
          >
            查看详情
          </button>
        </template>
      </div>
    </Modal>
  </div>
</template>
