import { z } from 'astro/zod';

// Supplementary material is independent of the rendering template.
export const lessonSchema = z.object({
  title: z.string(),
  type: z.enum(['knowledge', 'exercise', 'game', 'interactive']),
  supplementary: z.boolean().default(false),
  summary: z.string().optional(),
  order: z.number().default(0),
  hidden: z.boolean().default(false),
  draft: z.boolean().default(false),
});
