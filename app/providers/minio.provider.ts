import type { ProviderGetImage } from '@nuxt/image'
import { createOperationsGenerator } from '#image'
import { joinURL } from 'ufo'

const operationsGenerator = createOperationsGenerator()

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseUrl } = {},
) => {
  if (!baseUrl) {
    baseUrl = import.meta.env.OSS_MINIO_BASE_URL || 'https://bilisleep.online/me-photos'
  }

  const operations = operationsGenerator(modifiers)

  return {
    url: joinURL(baseUrl, src + (operations ? `?${operations}` : '')),
  }
}
