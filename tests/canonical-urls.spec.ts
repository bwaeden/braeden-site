/**
 * SEO-06: Each route declares a <link rel="canonical"> matching its
 * expected absolute braehods.com URL.
 *
 * Parameterized over ['/', '/about', '/work']:
 *  - page.goto(path)
 *  - read link[rel="canonical"] href
 *  - assert it equals the expected absolute URL
 *
 * Canonical resolution depends on metadataBase (root layout) + per-route
 * alternates.canonical. Analog: tests/footer-socials-render.spec.ts (per-route
 * iteration + DOM attribute assertion).
 *
 * Root-canonical normalization: Next.js resolves a root canonical ('/') against
 * metadataBase to the bare origin `https://braehods.com` (no trailing slash) —
 * this is Next's deliberate, SEO-valid normalization and cannot be coerced to a
 * trailing-slash form via metadata config. The `/` expectation therefore accepts
 * both the bare-origin and trailing-slash forms; `/about` + `/work` stay exact.
 *
 * RED until Plan 06-02 W1 lands metadataBase + per-route canonicals.
 */
import { test, expect } from '@playwright/test';

const ROUTES = [
  {
    path: '/',
    accepted: ['https://braehods.com', 'https://braehods.com/'],
  },
  { path: '/about', accepted: ['https://braehods.com/about'] },
  { path: '/work', accepted: ['https://braehods.com/work'] },
];

for (const { path, accepted } of ROUTES) {
  test(`SEO-06: ${path} has <link rel="canonical"> = ${accepted[0]}`, async ({
    page,
  }) => {
    await page.goto(path);
    const href = await page
      .locator('link[rel="canonical"]')
      .first()
      .getAttribute('href');
    expect(
      accepted,
      `${path} canonical href should be one of ${JSON.stringify(
        accepted
      )} (got ${href})`
    ).toContain(href);
  });
}
