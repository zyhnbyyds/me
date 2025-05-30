import { createOperationsGenerator, defineProvider } from '#image'
import { joinURL } from 'ufo'

const operationsGenerator = createOperationsGenerator()

export default defineProvider<{ baseURL: string }>({
  getImage: (src, { modifiers, baseURL }) => {
    const operations = operationsGenerator(modifiers)
    if (!baseURL) {
      baseURL = import.meta.env.OSS_MINIO_BASE_URL || 'http://8.155.33.112:9000/me-oss'
    }
    return {
      url: joinURL(baseURL, src + (operations ? `?${operations}` : '')),
    }
  },
})
