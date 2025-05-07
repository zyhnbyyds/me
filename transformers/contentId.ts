import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
  name: 'content-id',
  extensions: ['.md'],
  transform(file) {
    return {
      ...file,
      id: file.id.replace(/^content:/, ''),
    }
  },
})
