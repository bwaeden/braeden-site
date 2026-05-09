import { z } from 'zod';

export const ProjectStatus = z.enum(['shipped', 'paper-trading', 'in-dev', 'archived']);
export const ProjectTag = z.enum(['trading', 'content', 'tools', 'archived']);

export const Project = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().max(140),
  tags: z.array(ProjectTag),
  status: ProjectStatus,
  href: z.string().url(),
});
export type Project = z.infer<typeof Project>;

export const projects: Project[] = [];
