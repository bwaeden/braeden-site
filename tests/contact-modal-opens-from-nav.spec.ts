/**
 * CTCT-01: Nav `Contact` link opens the ContactModal dialog.
 *
 * Source decisions: 05-CONTEXT D-05 (atomic trigger swap: `href="#contact"`)
 *                   05-CONTEXT D-06 (hash-based trigger architecture)
 *                   05-CONTEXT D-08 (modal heading verbatim "Get in touch")
 *
 * RED until Plan 05-02 lands `components/contact/ContactModal.tsx` (the
 * single 'use client' island that listens to hashchange + showModal) AND
 * Plan 05-03 atomically swaps Nav.tsx line 15 `href="/"` → `href="#contact"`.
 * GREEN sequence: Plan 02 first (modal listens to hash), then Plan 03 (Nav
 * link points at the hash). Until BOTH land, the click does nothing.
 *
 * Phase 4 lesson carry-forward: scope link locator to `.first()` because
 * the Nav LINKS array maps to BOTH desktop nav AND the mobile <details>
 * hamburger from a single source — there are 2 `Contact` links in the DOM.
 */
import { test, expect } from '@playwright/test';

// Phase 6 06-01 Cat A refactor — opens the mobile hamburger disclosure before
// reaching the Contact link when running on a viewport < 640px (chromium-mobile
// project, Pixel 5 viewport). On chromium-desktop (1280×800) the predicate is
// a no-op and the link is already reachable in the inline nav.
async function openMobileNavIfNeeded(page: import('@playwright/test').Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 640) {
    await page.locator('details.nav-mobile > summary').click();
  }
}

test('CTCT-01: clicking Nav Contact opens the contact modal + focus moves inside', async ({
  page,
}) => {
  await page.goto('/');

  await openMobileNavIfNeeded(page);

  // Phase 5 ground-truth: Nav Contact href === '#contact' (post-Plan-03)
  const navContact = page.getByRole('link', { name: 'Contact' }).first();
  await expect(
    navContact,
    'Nav Contact must point to modal hash trigger (D-05 — atomic swap from `/` to `#contact`)',
  ).toHaveAttribute('href', '#contact');

  await navContact.click();

  // The native <dialog data-test="contact-modal"> opens via showModal()
  const dialog = page.locator('dialog[data-test="contact-modal"]');
  await expect(dialog, 'dialog[data-test="contact-modal"] must be in DOM').toHaveCount(1);
  await expect(dialog, 'dialog must be in [open] state after click').toHaveAttribute('open', /.*/);

  // Focus has moved INSIDE the dialog (showModal() trap)
  const focusInside = await page.evaluate(() => {
    const dlg = document.querySelector('dialog[data-test="contact-modal"]');
    if (!dlg) return false;
    return document.activeElement !== null && dlg.contains(document.activeElement);
  });
  expect(focusInside, 'focus must be inside dialog after showModal() (A11Y-03)').toBe(true);
});
