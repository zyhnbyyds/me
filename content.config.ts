import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: '**/*.md',

      schema: z.object({
        readingTime: z.number().optional(),
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        updateAt: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    }),
  },
})
