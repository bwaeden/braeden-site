/**
 * DSGN-09: All shipped token+gradient pairs clear WCAG AA contrast.
 *
 * Loads `/` (which renders the full color-token palette through the Hero,
 * CurrentlyLine, ChannelButton row, CTAArrowLink CTAs, and the page background
 * gradient) and runs `@axe-core/playwright` with the `wcag2aa` tag. Asserts
 * zero `color-contrast` violations.
 *
 * History — Phase 1 D-11 originally loaded a hidden tokens-showcase route
 * for this audit. Phase 6 06-01 deletes that route (carry-fwd #14 / D-01)
 * and points this spec at the home route instead. The 6 locked color tokens
 * (DSGN-03) render on `/` via the live components above, so contrast coverage
 * is preserved.
 *
 * Plan 06-02 extends this spec to also walk `/about` and `/work` for the full
 * WCAG 2 AA audit (see 06-VALIDATION 06-02-14/15).
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('DSGN-09: / has zero color-contrast WCAG AA violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
  const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast');

  expect(
    contrastViolations,
    `axe color-contrast violations: ${JSON.stringify(contrastViolations, null, 2)}`,
  ).toEqual([]);
});
