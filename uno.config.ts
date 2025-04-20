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
    ['bg-hover-common', 'transition-all hover:bg-[rgba(15,20,25,0.1)] rounded-full'],
    ['text-common', 'text-[rgb(15, 20, 25)]'],
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
