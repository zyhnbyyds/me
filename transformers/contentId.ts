import { defineTransformer } from '@nuxt/content'
import { ulid } from 'ulid'

export default defineTransformer({
  name: 'content-id',
  extensions: ['.md'],
  transform(file) {
    file.path = `/${file.id.split('/').slice(1, 3).join('/')}/${ulid()}`

    return {
      ...file,
    }
  },
})
