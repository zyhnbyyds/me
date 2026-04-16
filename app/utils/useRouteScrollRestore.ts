export interface RouteScrollRestoreOptions {
  key?: string
  throttle?: number
}

export function useRouteScrollRestore(
  target: Ref<HTMLElement | null | undefined>,
  options: RouteScrollRestoreOptions = {},
) {
  const route = useRoute()
  const positions = useState<Record<string, number>>(
    'route-scroll-positions',
    () => ({}),
  )
  const { y } = useScroll(target)

  const routeKey = computed(() => options.key ?? route.fullPath)

  function saveScrollPosition() {
    positions.value[routeKey.value] = y.value
  }

  function restoreScrollPosition() {
    if (!import.meta.client) return

    const top = positions.value[routeKey.value] ?? 0
    let attempts = 0

    const applyScroll = () => {
      const element = target.value
      if (!element) return

      element.scrollTo({ top, behavior: 'auto' })

      const canReachTop = element.scrollHeight - element.clientHeight >= top
      if (!canReachTop && attempts < 8) {
        attempts += 1
        window.requestAnimationFrame(applyScroll)
      }
    }

    nextTick(() => {
      window.requestAnimationFrame(applyScroll)
    })
  }

  watchThrottled(
    y,
    () => {
      saveScrollPosition()
    },
    {
      throttle: options.throttle ?? 120,
      leading: false,
      trailing: true,
    },
  )

  onBeforeRouteLeave(() => {
    saveScrollPosition()
  })

  onMounted(() => {
    restoreScrollPosition()
  })

  onActivated(() => {
    restoreScrollPosition()
  })

  onDeactivated(() => {
    saveScrollPosition()
  })

  onBeforeUnmount(() => {
    saveScrollPosition()
  })

  return {
    y,
    restoreScrollPosition,
    saveScrollPosition,
  }
}
