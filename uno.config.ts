import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['hw-full', 'h-full w-full'],
    ['hw-screen', 'h-screen w-screen'],
    ['flex-center', 'flex items-center justify-center'],
    ['bg-hover-common', 'transition-all hover:bg-[rgba(15,20,25,0.1)] rounded-full hover:dark:bg-[rgba(231,234,235,0.1)]'],
    ['text-common', 'text-[rgb(15,20,25)] dark:text-[rgb(231,234,235)]'],
    ['flex-col-center', 'flex items-center'],
    ['flex-row-center', 'flex justify-center'],
    ['blur-common', 'backdrop-blur-md bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(0,0,0,0.8)]'],
    ['border-common', 'border-light-700 dark:border-dark-500'],
  ],
  presets: [
    presetWind3(),
    presetAttributify(),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
