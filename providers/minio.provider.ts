import type { ProviderGetImage } from '@nuxt/image'
import { createOperationsGenerator } from '#image'
import { joinURL } from 'ufo'

const operationsGenerator = createOperationsGenerator()

export const getImage: ProviderGetImage = (src, { modifiers, baseURL }) => {
  if (!baseURL) {
    baseURL = 'http://8.155.33.112:9000/me-oss'
  }

  const operations = operationsGenerator(modifiers)

  return {
    url: joinURL(baseURL, src + (operations ? `?${operations}` : '')),
  }
}
