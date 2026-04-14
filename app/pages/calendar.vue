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
const selectedDateEvents = ref<CalendarEvent[]>([])
const showDayEvents = ref(false)
const selectedDate = ref('')

const { data: eventsData } = await useFetch<{
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

function goToday() {
  year.value = dayjs().year()
  month.value = dayjs().month() + 1
}

function openEventDetail(ev: CalendarEvent) {
  selectedEvent.value = ev
  modalVisible.value = true
  showDayEvents.value = false
}

function openDayEvents(date: string, events: CalendarEvent[]) {
  if (events.length === 0) return
  if (events.length === 1 && events[0]) {
    openEventDetail(events[0])
    return
  }
  selectedDate.value = date
  selectedDateEvents.value = events
  showDayEvents.value = true
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

// 事件颜色映射
const eventColors: Record<string, { bg: string; text: string; dot: string }> = {
  blog: {
    bg: 'bg-blue-500/15 dark:bg-blue-400/20 hover:bg-blue-500/25',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  qq: {
    bg: 'bg-emerald-500/15 dark:bg-emerald-400/20 hover:bg-emerald-500/25',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
}

// 统计事件数
const totalEvents = computed(() =>
  Object.values(eventsMap.value).reduce((sum, arr) => sum + arr.length, 0),
)
</script>

<template>
  <div class="hw-full flex flex-col overflow-hidden">
    <!-- 顶部导航栏 -->
    <CHead title="">
      <template #right>
        <div class="flex items-center gap-2">
          <!-- 月份导航 -->
          <div class="flex items-center gap-0.5">
            <button type="button" class="cal-nav-btn" @click="decreaseMonth">
              <Icon name="carbon:chevron-left" class="text-4" />
            </button>
            <button type="button" class="cal-nav-btn" @click="addMonth">
              <Icon name="carbon:chevron-right" class="text-4" />
            </button>
          </div>
          <h2 class="text-15px font-semibold min-w-24 text-center select-none">
            {{ year }}年 {{ String(month).padStart(2, '0') }}月
          </h2>
        </div>
      </template>
    </CHead>

    <!-- 日历主体 -->
    <div class="flex-1 min-h-0 flex flex-col px-3 pb-3 <md:px-1.5 <md:pb-1.5">
      <!-- 星期行 -->
      <div class="grid grid-cols-7 mb-1">
        <div
          v-for="w in weekLabels"
          :key="w"
          class="py-2 text-center text-12px font-semibold text-gray-400 dark:text-gray-500 tracking-wide select-none"
        >
          {{ w }}
        </div>
      </div>

      <!-- 日期网格 -->
      <div
        class="grid grid-cols-7 flex-1 min-h-0 gap-px bg-gray-200 dark:bg-dark-400 rounded-xl overflow-hidden"
        :class="days.length > 35 ? 'grid-rows-6' : 'grid-rows-5'"
      >
        <div
          v-for="item in days"
          :key="item.date"
          class="cal-day-cell"
          :class="[
            item.isToday
              ? 'cal-day-today'
              : item.isPrevMonth || item.isNextMonth
                ? 'cal-day-other'
                : 'cal-day-current',
          ]"
          @click="openDayEvents(item.date, item.events)"
        >
          <!-- 日期数字 -->
          <div class="flex items-start justify-between mb-1 <md:mb-0.5">
            <span
              class="cal-day-num"
              :class="[
                item.isToday
                  ? 'cal-day-num-today'
                  : item.isPrevMonth || item.isNextMonth
                    ? 'opacity-30'
                    : '',
              ]"
            >
              {{ item.day }}
            </span>
            <span
              v-if="(item.isPrevMonth || item.isNextMonth) && !item.isToday"
              class="text-10px opacity-25 <md:hidden"
            >
              {{ dayjs(item.date).format('M') }}月
            </span>
          </div>

          <!-- 事件列表 -->
          <div class="space-y-0.5 overflow-hidden">
            <TransitionGroup name="event-list">
              <div
                v-for="ev in item.events.slice(0, 3)"
                :key="ev.id"
                class="cal-event-pill"
                :class="[
                  eventColors[ev.source]?.bg,
                  eventColors[ev.source]?.text,
                  item.isPrevMonth || item.isNextMonth ? 'opacity-50' : '',
                ]"
                @click.stop="openEventDetail(ev)"
              >
                <span
                  class="cal-event-dot"
                  :class="eventColors[ev.source]?.dot"
                />
                <span class="truncate <md:hidden">
                  {{
                    ev.source === 'blog'
                      ? ev.title
                      : (ev.content ?? ev.name ?? '说说')?.slice(0, 10)
                  }}
                </span>
              </div>
            </TransitionGroup>
            <div
              v-if="item.events.length > 3"
              class="text-10px <md:text-9px text-gray-400 dark:text-gray-500 px-1 cursor-pointer hover:text-gray-600"
              @click.stop="openDayEvents(item.date, item.events)"
            >
              +{{ item.events.length - 3 }} 更多
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 多事件弹窗（某天多条记录） -->
    <Modal
      v-model="showDayEvents"
      :show-mask="true"
      :close-on-click-overlay="true"
    >
      <div class="cal-modal-card w-80 <md:w-72">
        <div class="cal-modal-header">
          <div>
            <div class="text-16px font-bold">
              {{ dayjs(selectedDate).format('M月D日') }}
            </div>
            <div class="text-12px text-gray-400 mt-0.5">
              共 {{ selectedDateEvents.length }} 条记录
            </div>
          </div>
          <button
            type="button"
            class="cal-close-btn"
            @click="showDayEvents = false"
          >
            <Icon name="carbon:close" class="text-5" />
          </button>
        </div>
        <div class="space-y-2 max-h-64 overflow-auto pr-1">
          <button
            v-for="ev in selectedDateEvents"
            :key="ev.id"
            type="button"
            class="w-full text-left cal-day-event-item"
            :class="[eventColors[ev.source]?.bg, eventColors[ev.source]?.text]"
            @click="openEventDetail(ev)"
          >
            <span
              class="cal-event-dot mt-1 shrink-0"
              :class="eventColors[ev.source]?.dot"
            />
            <div class="flex-1 min-w-0">
              <div class="text-13px font-medium truncate">
                {{
                  ev.source === 'blog'
                    ? ev.title
                    : (ev.content ?? ev.name ?? '说说')?.slice(0, 20)
                }}
              </div>
              <div class="text-11px opacity-60 mt-0.5">
                {{ dayjs(ev.timestamp).format('HH:mm') }} ·
                {{ ev.source === 'blog' ? '文章' : 'QQ' }}
              </div>
            </div>
            <Icon
              name="carbon:chevron-right"
              class="text-3.5 opacity-40 shrink-0"
            />
          </button>
        </div>
      </div>
    </Modal>

    <!-- 事件详情弹窗 -->
    <Modal
      v-model="modalVisible"
      :show-mask="true"
      :close-on-click-overlay="true"
    >
      <div
        v-if="selectedEvent"
        class="cal-modal-card w-96 max-w-[90vw] <md:w-[90vw]"
      >
        <!-- 弹窗头 -->
        <div class="cal-modal-header">
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="shrink-0 rounded-full w-2.5 h-2.5"
              :class="eventColors[selectedEvent.source]?.dot"
            />
            <span class="text-12px font-medium opacity-60">
              {{ selectedEvent.source === 'blog' ? '文章' : 'QQ空间' }}
            </span>
            <span class="text-12px opacity-50">·</span>
            <span class="text-12px opacity-50">
              {{ dayjs(selectedEvent.timestamp).format('YYYY-MM-DD HH:mm') }}
            </span>
          </div>
          <button
            type="button"
            class="cal-close-btn"
            @click="modalVisible = false"
          >
            <Icon name="carbon:close" class="text-5" />
          </button>
        </div>

        <!-- Blog 事件详情 -->
        <template v-if="selectedEvent.source === 'blog'">
          <h2 class="text-17px font-bold leading-snug mb-3">
            {{ selectedEvent.title }}
          </h2>
          <div
            v-if="selectedEvent.tags?.length"
            class="flex flex-wrap gap-1.5 mb-3"
          >
            <span
              v-for="tag in selectedEvent.tags"
              :key="tag"
              class="rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 text-11px"
            >
              {{ tag }}
            </span>
          </div>
          <p
            v-if="selectedEvent.description"
            class="text-14px text-gray-600 dark:text-gray-300 leading-relaxed mb-4"
          >
            {{ selectedEvent.description }}
          </p>
          <NuxtImg
            v-if="selectedEvent.image"
            :src="`/blog/${selectedEvent.image}`"
            class="rounded-lg w-full max-h-40 object-cover mb-4 border border-gray-100 dark:border-dark-500"
          />
          <button
            type="button"
            class="cal-action-btn bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
            @click="goToDetail(selectedEvent)"
          >
            <Icon name="carbon:document" class="mr-1.5" />
            查看全文
          </button>
        </template>

        <!-- QQ 事件详情 -->
        <template v-else>
          <p
            class="text-14px text-gray-700 dark:text-gray-200 leading-relaxed mb-4 whitespace-pre-wrap"
          >
            {{ selectedEvent.content || '暂无内容' }}
          </p>
          <button
            type="button"
            class="cal-action-btn bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            @click="goToDetail(selectedEvent)"
          >
            <Icon name="carbon:user-avatar" class="mr-1.5" />
            查看详情
          </button>
        </template>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
/* 日历单元格 */
.cal-day-cell {
  @apply flex flex-col p-2 <md:p-1 overflow-hidden cursor-pointer transition-colors duration-150 select-none;
}
.cal-day-today {
  @apply bg-blue-50 dark:bg-blue-950/40;
}
.cal-day-other {
  @apply bg-gray-50 dark:bg-dark-600 cursor-default;
}
.cal-day-current {
  @apply bg-white dark:bg-dark-500 hover:bg-gray-50 dark:hover:bg-dark-400;
}

/* 日期数字 */
.cal-day-num {
  @apply text-13px <md:text-11px font-medium leading-none;
}
.cal-day-num-today {
  @apply inline-flex items-center justify-center w-6 h-6 <md:w-5 <md:h-5 rounded-full bg-blue-500 text-white text-12px <md:text-11px;
}

/* 事件药丸 */
.cal-event-pill {
  @apply flex items-center gap-1 rounded-md px-1.5 py-0.5 text-12px <md:text-0 cursor-pointer transition-all duration-150;
  @apply <md:justify-center <md:px-0.5;
}

/* 事件点 */
.cal-event-dot {
  @apply shrink-0 w-1.5 h-1.5 rounded-full;
}

/* 今天按钮 */
.cal-btn-today {
  @apply px-3 py-1.5 rounded-lg text-13px font-medium border border-gray-300 dark:border-dark-300 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors select-none;
}

/* 导航按钮 */
.cal-nav-btn {
  @apply p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors cursor-pointer;
}

/* 弹窗卡片 */
.cal-modal-card {
  @apply bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-5 <md:p-4;
  @apply border border-gray-100 dark:border-dark-600;
}

/* 弹窗头 */
.cal-modal-header {
  @apply flex items-start justify-between gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-dark-600;
}

/* 关闭按钮 */
.cal-close-btn {
  @apply shrink-0 w-8 h-8 flex-center rounded-full hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors cursor-pointer;
}

/* 日期事件列表项 */
.cal-day-event-item {
  @apply flex items-start gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-150 cursor-pointer;
}

/* 操作按钮 */
.cal-action-btn {
  @apply inline-flex items-center px-4 py-2 rounded-xl text-14px text-white transition-colors cursor-pointer font-medium;
}

/* 事件列表动效 */
.event-list-enter-active,
.event-list-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.event-list-enter-from,
.event-list-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
