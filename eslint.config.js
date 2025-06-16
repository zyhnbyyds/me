import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: {
      css: true,
      html: true,
      markdown: 'dprint',
    },
    unocss: true,
    ignores: ['./server/data'],
  },
)
