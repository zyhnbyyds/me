import { createOperationsGenerator, defineProvider } from '@nuxt/image/runtime'
import { joinURL } from 'ufo'

interface MyServerProviderOptions {
  baseURL?: string
}

const ABSOLUTE_URL_RE = /^(?:[a-z][a-z\d+.-]*:)?\/\//i
const operationsGenerator = createOperationsGenerator()

export default defineProvider<MyServerProviderOptions>({
  getImage(src, { modifiers, baseURL = '/api/essay/file' }) {
    const operations = operationsGenerator(modifiers)
    const query = operations ? `?${operations}` : ''

    if (
      ABSOLUTE_URL_RE.test(src) ||
      src.startsWith('data:') ||
      src.startsWith('blob:')
    ) {
      return { url: `${src}${query}` }
    }

    if (src.startsWith('/')) {
      return { url: `${src}${query}` }
    }

    return {
      url: joinURL(baseURL, `${encodeURIComponent(src)}${query}`),
    }
  },
})
