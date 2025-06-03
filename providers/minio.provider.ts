import { createOperationsGenerator, defineProvider } from '#image'
import { joinURL } from 'ufo'

const operationsGenerator = createOperationsGenerator()

export default defineProvider<{ baseURL: string }>({
  getImage: (src, { modifiers, baseURL }) => {
    const operations = operationsGenerator(modifiers)
    if (!baseURL) {
      baseURL = import.meta.env.OSS_MINIO_BASE_URL || 'https://bilisleep.online/me-photos'
    }
    return {
      url: joinURL(baseURL, src + (operations ? `?${operations}` : '')),
    }
  },
})
