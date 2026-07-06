import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      c: {
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        hover: 'var(--c-hover)',
        border: 'var(--c-border)',
        text: 'var(--c-text)',
        'text-alt': 'var(--c-text-alt)',
        'text-weak': 'var(--c-text-weak)',
        accent: 'var(--c-accent)',
        'accent-hover': 'var(--c-accent-hover)',
        shadow: 'var(--c-shadow)',
      },
    },
  },
  shortcuts: [
    ['hw-full', 'h-full w-full'],
    ['hw-screen', 'h-screen w-screen'],
    ['flex-center', 'flex items-center justify-center'],
    ['flex-col-center', 'flex items-center'],
    ['flex-row-center', 'flex justify-center'],
    // 语义化快捷方式
    ['text-common', 'text-c-text'],
    ['bg-common', 'bg-c-surface'],
    ['bg-hover-common', 'transition-all bg-c-surface hover:bg-c-hover'],
    ['bg-hover-common-trans', 'transition-all hover:bg-c-hover rounded-full'],
    ['border-common', 'border-c-border'],
    ['blur-common', 'backdrop-blur-md bg-c-surface/90'],
    ['page', 'hw-full overflow-auto'],
  ],
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
