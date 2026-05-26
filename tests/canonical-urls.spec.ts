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
 * RED until Plan 06-02 W1 lands metadataBase + per-route canonicals.
 */
import { test, expect } from '@playwright/test';

const ROUTES = [
  { path: '/', expected: 'https://braehods.com/' },
  { path: '/about', expected: 'https://braehods.com/about' },
  { path: '/work', expected: 'https://braehods.com/work' },
];

for (const { path, expected } of ROUTES) {
  test(`SEO-06: ${path} has <link rel="canonical"> = ${expected}`, async ({
    page,
  }) => {
    await page.goto(path);
    const href = await page
      .locator('link[rel="canonical"]')
      .first()
      .getAttribute('href');
    expect(
      href,
      `${path} canonical href should be ${expected} (got ${href})`
    ).toBe(expected);
  });
}
