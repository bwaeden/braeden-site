/**
 * DSGN-04: Three fonts load via `next/font` with zero CLS.
 *
 * Runs a Lighthouse audit on `/` via `playwright-lighthouse` and asserts:
 *  - `audits['cumulative-layout-shift'].numericValue === 0`
 *  - `body` computed font-family includes `Geist`
 *  - hero element (selected via `[data-test="hero-display"]`, wired in W2-T4)
 *    computed font-family includes `Fraunces`
 *  - any `font-mono` element computed font-family includes `Geist Mono`
 *
 * Note: `playwright-lighthouse` requires a Chromium debug port; we rely on
 * Playwright's built-in browser launch + the helper's `port` arg. This
 * spec ships RED in W0 — it cannot connect to a server because none exists
 * yet. W2-T4 wires the hero data-attr; W2-T2 loads the fonts.
 */
import { test, expect } from '@playwright/test';
// playwright-lighthouse exposes `playAudit` for assertions inside Playwright.
// We import lazily so the test fails with a useful error if the helper API
// changes between minor versions.
import { playAudit } from 'playwright-lighthouse';

test('Lighthouse: zero CLS on / and three font families load via next/font', async ({
  page,
  browserName,
}, testInfo) => {
  test.skip(browserName !== 'chromium', 'Lighthouse requires Chromium DevTools Protocol');

  await page.goto('/');

  // playAudit needs the same Chromium port Playwright is driving. We pass
  // page so the helper can extract the connected port + URL.
  const lhResult = await playAudit({
    page,
    thresholds: {
      performance: 0,
      accessibility: 0,
      'best-practices': 0,
      seo: 0,
    },
    reports: { formats: { json: false, html: false } },
  });

  const cls = lhResult.lhr.audits['cumulative-layout-shift']!.numericValue;
  expect(cls, 'cumulative-layout-shift must be 0').toBe(0);

  // Computed font-family checks (run in-page, independent of Lighthouse).
  const bodyFont = await page.evaluate(
    () => getComputedStyle(document.body).fontFamily
  );
  expect(bodyFont, 'body should use Geist Sans').toMatch(/Geist/i);

  const heroFont = await page.evaluate(() => {
    const el = document.querySelector('[data-test="hero-display"]');
    return el ? getComputedStyle(el as Element).fontFamily : '';
  });
  expect(heroFont, 'hero (data-test="hero-display") should use Fraunces').toMatch(
    /Fraunces/i
  );

  const monoFont = await page.evaluate(() => {
    const el = document.querySelector('.font-mono, [data-test="mono"], code');
    return el ? getComputedStyle(el as Element).fontFamily : '';
  });
  expect(monoFont, 'mono surface should use Geist Mono').toMatch(/Geist Mono/i);
});
