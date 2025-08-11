import { createOperationsGenerator, defineProvider } from '@nuxt/image/runtime'
import { joinURL } from 'ufo'

const operationsGenerator = createOperationsGenerator()

export default defineProvider<{ baseURL?: string }>({
  getImage: (src, { modifiers, baseURL }) => {
    if (!baseURL) {
      baseURL = import.meta.env.OSS_MINIO_BASE_URL || 'https://bilisleep.online/me-photos'
    }

    const operations = operationsGenerator(modifiers)

    return {
      url: joinURL(baseURL, src + (operations ? `?${operations}` : '')),
    }
  },
})
