/**
 * HOME-04, PERF-04, PERF-06: Hero photo LCP < 2.5s on mobile + explicit
 * width/height attributes prevent CLS.
 *
 * Runs Lighthouse on `/` and asserts:
 *  - `audits['largest-contentful-paint'].numericValue` is defined (not flake)
 *  - `audits['largest-contentful-paint'].numericValue < 2500` (PERF-06)
 *  - the rendered HTML contains `width="320"` + `height="320"` attrs on the
 *    `<img>` inside the hero photo wrapper (PERF-04: explicit dimensions)
 *
 * RED until Plan 02-02 lands `components/home/HeroPhoto.tsx` and Plan 02-06
 * wires the hero composition. The Lighthouse half is also gated on a running
 * `next start` build — local runs may need `npm run build && npm start`.
 *
 * Mirrors `tests/lighthouse.spec.ts` invocation pattern (CDP port 9222,
 * chromium-only skip).
 */
import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

const LIGHTHOUSE_PORT = 9222;

test.use({
  launchOptions: {
    args: [`--remote-debugging-port=${LIGHTHOUSE_PORT}`],
  },
});

test('HOME-04 / PERF-06: hero LCP < 2500ms via Lighthouse on /', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Lighthouse requires Chromium DevTools Protocol');

  await page.goto('/');

  const lhResult = await playAudit({
    page,
    port: LIGHTHOUSE_PORT,
    thresholds: { performance: 0 },
    reports: { formats: { json: false, html: false, csv: false } },
    disableLogs: true,
  });

  const lcpAudit = lhResult.lhr.audits['largest-contentful-paint'];
  expect(lcpAudit, 'LCP audit should exist in lhr.audits').toBeDefined();

  const lcp = lcpAudit!.numericValue;
  expect(lcp, 'PERF-06: LCP must be measured (not undefined) — RED until source ships').toBeDefined();
  expect(lcp!, `PERF-06: LCP < 2500ms on mobile (got ${lcp}ms)`).toBeLessThan(2500);
});

test('PERF-04: hero <img> has explicit width="320" + height="320" on /', async ({ page }) => {
  await page.goto('/');

  const heroImg = page.locator('[data-test="hero-photo-tile"] img').first();
  await expect(heroImg, 'hero photo <img> should resolve').toHaveCount(1);

  const widthAttr = await heroImg.getAttribute('width');
  const heightAttr = await heroImg.getAttribute('height');

  expect(widthAttr, 'PERF-04: hero img width attr must be "320"').toBe('320');
  expect(heightAttr, 'PERF-04: hero img height attr must be "320"').toBe('320');
});
