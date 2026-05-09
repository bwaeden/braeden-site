/**
 * DSGN-09: All token+gradient pairs clear WCAG AA.
 *
 * Loads `/_tokens` (the showcase route per D-11 listing every color token
 * + type ramp + monogram size) and runs `@axe-core/playwright` with the
 * `wcag2aa` tag. Asserts zero `color-contrast` violations.
 *
 * RED until W2-T6 ships `/_tokens` and the underlying tokens hold AA
 * against both gradient endpoints (D-06: muted locked at #a8a8a8).
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('DSGN-09: /_tokens has zero color-contrast WCAG AA violations', async ({
  page,
}) => {
  await page.goto('/_tokens');

  const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
  const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast');

  expect(
    contrastViolations,
    `axe color-contrast violations: ${JSON.stringify(contrastViolations, null, 2)}`
  ).toEqual([]);
});
