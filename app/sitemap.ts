// app/sitemap.ts
// Source: 06-RESEARCH Pattern 3; 06-PATTERNS § app/sitemap.ts; CONTEXT D-04.
//
// Dynamic MetadataRoute.Sitemap (SEO-04a). Combines the v1 static route list
// (/, /about, /work) with a build-time glob of content/*.mdx so a v2 /writing
// route extends the sitemap for free. Next.js serves this at /sitemap.xml.
//
// Server-only, cached by default (no Request-time API used). readdir is a
// build-time op; wrapped in try/catch because content/ may not exist in v1
// (Pitfall 7) — on error we return only the static routes.

import type { MetadataRoute } from 'next';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const BASE_URL = 'https://braehods.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  let mdxRoutes: MetadataRoute.Sitemap = [];
  try {
    const contentDir = join(process.cwd(), 'content');
    const entries = await readdir(contentDir);
    const mdxFiles = entries.filter((f) => f.endsWith('.mdx'));
    mdxRoutes = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace(/\.mdx$/, '');
        const stats = await stat(join(contentDir, file));
        return {
          url: `${BASE_URL}/writing/${slug}`,
          lastModified: stats.mtime,
          changeFrequency: 'yearly' as const,
          priority: 0.5,
        };
      })
    );
  } catch {
    // content/ does not exist yet in v1 — quietly skip the dynamic routes.
  }

  return [...staticRoutes, ...mdxRoutes];
}
