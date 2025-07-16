import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
  name: 'content-id',
  extensions: ['.md'],
  transform(file) {
    file.path = `/${file.id.split('/').join('/')}`

    return {
      ...file,
    }
  },
})
