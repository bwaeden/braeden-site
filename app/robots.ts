// app/robots.ts
// Source: 06-RESEARCH Pattern 4; 06-PATTERNS § app/robots.ts; CONTEXT D-04.
//
// MetadataRoute.Robots (SEO-04b). Allows all crawlers + references the
// sitemap. Next.js serves this at /robots.txt. Static at build time.
//
// Note: this allow-all robots config applies to production. Preview deploys
// are kept out of search indexes via proxy.ts (X-Robots-Tag: noindex when
// VERCEL_ENV === 'preview', SEO-09) — robots.txt itself is environment-agnostic.

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://braehods.com/sitemap.xml',
  };
}
