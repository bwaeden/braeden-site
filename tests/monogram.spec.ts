/**
 * DSGN-05: MonogramMark renders in nav and footer at expected sizes.
 *
 * On `/`:
 *  - exactly one SVG inside <header> with width="24" height="24" (nav)
 *  - exactly one SVG inside <footer> with width="16" height="16" (footer)
 *
 * History — Phase 1 W3 originally also showcased the monogram on a hidden
 * tokens route at sizes 16, 24, 48, 96, 120. Phase 6 06-01 deletes that route
 * (carry-fwd #14 / D-01) and drops the showcase test alongside it. The nav +
 * footer coverage here is the production contract.
 */
import { test, expect } from '@playwright/test';

test('DSGN-05: monogram renders in nav (24) and footer (16) on /', async ({ page }) => {
  await page.goto('/');

  const navSvgs = page.locator('header svg[width="24"][height="24"]');
  await expect(navSvgs, 'expected exactly one 24x24 SVG in <header>').toHaveCount(1);

  const footerSvgs = page.locator('footer svg[width="16"][height="16"]');
  await expect(footerSvgs, 'expected exactly one 16x16 SVG in <footer>').toHaveCount(1);
});
