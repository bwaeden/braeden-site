/**
 * CTCT-01: /about `Get in touch` CTA opens the ContactModal dialog
 * (same dialog instance — mounted in app/layout.tsx so it's available on
 * every route).
 *
 * Source decisions: 05-CONTEXT D-04 (/about CTA is one of the 2 locked
 *                                    trigger surfaces, the other is Nav)
 *                   05-CONTEXT D-05 (atomic swap: CTAArrowLink `href="/"`
 *                                    → `href="#contact"`)
 *                   05-CONTEXT D-06 (hash-based trigger architecture)
 *
 * RED until Plan 05-02 lands ContactModal + Plan 05-03 atomically swaps
 * app/about/page.tsx line 75 `<CTAArrowLink href="/" staggerIndex={4}>`
 * → `<CTAArrowLink href="#contact" staggerIndex={4}>`.
 */
import { test, expect } from '@playwright/test';

test('CTCT-01: clicking /about Get in touch opens the contact modal + focus moves inside', async ({
  page,
}) => {
  await page.goto('/about');

  // Phase 5 ground-truth: /about CTA href === '#contact' (post-Plan-03)
  const cta = page.getByRole('link', { name: /Get in touch/i });
  await expect(
    cta,
    'exactly one /about CTA link matching /Get in touch/i',
  ).toHaveCount(1);
  await expect(
    cta,
    '/about CTA href must be #contact (D-05 atomic swap from `/`)',
  ).toHaveAttribute('href', '#contact');

  await cta.click();

  const dialog = page.locator('dialog[data-test="contact-modal"]');
  await expect(dialog, 'dialog must be mounted in DOM on /about route too').toHaveCount(1);
  await expect(dialog, 'dialog must be in [open] state after click').toHaveAttribute('open', /.*/);

  const focusInside = await page.evaluate(() => {
    const dlg = document.querySelector('dialog[data-test="contact-modal"]');
    if (!dlg) return false;
    return document.activeElement !== null && dlg.contains(document.activeElement);
  });
  expect(focusInside, 'focus must be inside dialog after showModal() (A11Y-03)').toBe(true);
});
