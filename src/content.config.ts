import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['knowledge', 'exercise', 'game']),
    summary: z.string().optional(),
    order: z.number().default(0),
    hidden: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const courseSettings = defineCollection({
  loader: glob({ pattern: '**/_course.json', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    order: z.number().default(0),
    hidden: z.boolean().default(false),
  }),
});

const chapterSettings = defineCollection({
  loader: glob({ pattern: '**/_chapter.json', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    hidden: z.boolean().default(false),
  }),
});

export const collections = { lessons, courseSettings, chapterSettings };
