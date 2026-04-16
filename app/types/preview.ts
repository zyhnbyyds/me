import type { CSSProperties } from 'vue'
import type { ImageProviders } from '@nuxt/image'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface PreviewItem {
  src: string
  alt?: string
  provider?: keyof ImageProviders
}

export interface PreviewContext {
  visible: Ref<boolean>
  floating: Ref<boolean>
  duration: number
  items: Ref<PreviewItem[]>
  activeIndex: Ref<number>
  currentItem: ComputedRef<PreviewItem | null>
  hasMultiple: ComputedRef<boolean>
  hasPrev: ComputedRef<boolean>
  hasNext: ComputedRef<boolean>
  imageFit: Ref<'cover' | 'contain'>
  previewStyle: Ref<CSSProperties | null>
  open: (
    items: PreviewItem[],
    index?: number,
    triggerEl?: HTMLElement | null,
  ) => void
  close: () => void
  prev: () => void
  next: () => void
  setActive: (index: number) => void
  registerSource: (src: string, element: HTMLImageElement | null) => void
  unregisterSource: (src: string) => void
}

export const previewContextKey: InjectionKey<PreviewContext> =
  Symbol('preview-context')
