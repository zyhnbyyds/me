import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',

      schema: z.object({
        readingTime: z.number().optional(),
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        publishAt: z.string().datetime(),
        updateAt: z.string().datetime().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  },
})
