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

// Phase 6 06-01 Cat A refactor — kept here for grep-symmetry across the 7
// contact-modal-* specs (acceptance criterion: the viewport predicate appears
// once per spec file, 7 total). The /about route's "Get in touch" CTA is a
// CTAArrowLink in the page body, NOT inside the Nav disclosure, so the
// hamburger-open path is a no-op for this spec — but the predicate stays so
// every spec file shares the same shape and the grep contract holds.
async function openMobileNavIfNeeded(page: import('@playwright/test').Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 640) {
    // No-op for /about — the CTA lives in <main>, not <header>. Intentional.
  }
}

test('CTCT-01: clicking /about Get in touch opens the contact modal + focus moves inside', async ({
  page,
}) => {
  await page.goto('/about');
  await openMobileNavIfNeeded(page);

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
