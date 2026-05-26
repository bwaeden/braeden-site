/**
 * SEO-01: Each route has a non-empty <title>, a meta description ≤160 chars,
 * and the 3 route titles are mutually distinct.
 *
 * Parameterized over ['/', '/about', '/work'] for the per-route title +
 * description assertions, plus a 4th test asserting cross-route title
 * uniqueness.
 *
 * Analog: tests/footer-socials-render.spec.ts (per-route iteration + DOM
 * assertions). RED until Plan 06-02 W1 lands per-route metadata.
 */
import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/about', '/work'];

for (const path of ROUTES) {
  test(`SEO-01: ${path} has a non-empty title + description ≤160 chars`, async ({
    page,
  }) => {
    await page.goto(path);

    const title = await page.title();
    expect(title.trim(), `${path} should have a non-empty <title>`).not.toBe('');

    const description = await page
      .locator('meta[name="description"]')
      .first()
      .getAttribute('content');
    expect(
      description,
      `${path} should declare a <meta name="description">`
    ).toBeTruthy();
    expect(
      (description as string).length,
      `${path} meta description should be ≤160 chars (got ${
        (description as string).length
      })`
    ).toBeLessThanOrEqual(160);
  });
}

test('SEO-01: the 3 route titles are mutually distinct', async ({ page }) => {
  const titles: string[] = [];
  for (const path of ROUTES) {
    await page.goto(path);
    titles.push(await page.title());
  }
  const unique = new Set(titles);
  expect(
    unique.size,
    `expected 3 distinct route titles (got ${JSON.stringify(titles)})`
  ).toBe(ROUTES.length);
});
