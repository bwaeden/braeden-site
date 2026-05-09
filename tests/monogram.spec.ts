/**
 * DSGN-05: MonogramMark renders in nav, footer, and `/_tokens` at expected sizes.
 *
 * On `/`:
 *  - exactly one SVG inside <header> with width="24" height="24" (nav)
 *  - exactly one SVG inside <footer> with width="16" height="16" (footer)
 *
 * On `/_tokens`:
 *  - SVGs at sizes 16, 24, 48, 96, 120 are all present (showcase)
 *
 * RED until W3 lands `components/ui/MonogramMark.tsx` and W2-T5 / W3 hooks
 * it into nav, footer, and the `/_tokens` route.
 */
import { test, expect } from '@playwright/test';

test('DSGN-05: monogram renders in nav (24) and footer (16) on /', async ({ page }) => {
  await page.goto('/');

  const navSvgs = page.locator('header svg[width="24"][height="24"]');
  await expect(navSvgs, 'expected exactly one 24x24 SVG in <header>').toHaveCount(1);

  const footerSvgs = page.locator('footer svg[width="16"][height="16"]');
  await expect(footerSvgs, 'expected exactly one 16x16 SVG in <footer>').toHaveCount(1);
});

test('DSGN-05: /_tokens showcases monogram at 16, 24, 48, 96, 120', async ({ page }) => {
  await page.goto('/_tokens');

  for (const size of [16, 24, 48, 96, 120]) {
    const matches = page.locator(`svg[width="${size}"][height="${size}"]`);
    await expect(
      matches,
      `expected at least one ${size}x${size} SVG on /_tokens`
    ).not.toHaveCount(0);
  }
});
