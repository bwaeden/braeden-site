/**
 * CTCT-01 + CTCT-07 + A11Y-03: ESC closes the modal, focus returns to the
 * trigger element, URL hash is cleared via history.replaceState, AND the
 * SAME trigger can reopen the modal (regression guard for Pitfall 1 —
 * `location.hash = ''` would leave `#contact` cached and a same-hash click
 * after close wouldn't fire hashchange).
 *
 * Source decisions: 05-CONTEXT D-06 (hash-based architecture +
 *                                    history.replaceState close pattern)
 * Anti-pattern guard: .continue-here.md table row "location.hash = '' to
 *                     clear hash on close" → blocking. Plan 02 MUST use
 *                     history.replaceState(null, '', location.pathname +
 *                     location.search).
 *
 * RED until Plan 05-02 ships ContactModal with the close handler + Plan
 * 05-03 swaps Nav.tsx href to #contact.
 */
import { test, expect } from '@playwright/test';
import { liveUrl } from './helpers/live-url';

// Phase 6 06-01 Cat A refactor — open the mobile hamburger before reaching
// the Contact link on chromium-mobile (Pixel 5 viewport < 640px). No-op on
// chromium-desktop (1280×800).
async function openMobileNavIfNeeded(page: import('@playwright/test').Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 640) {
    await page.locator('details.nav-mobile > summary').click();
  }
}

test('CTCT-01 + CTCT-07: ESC closes + returns focus + clears hash + reopen works', async ({
  page,
}) => {
  await page.goto('/');

  await openMobileNavIfNeeded(page);

  // Capture trigger handle BEFORE opening so we can compare activeElement after close
  const navContact = page.getByRole('link', { name: 'Contact' }).first();
  const triggerHandle = await navContact.elementHandle();
  expect(triggerHandle, 'Nav Contact link must have an elementHandle').not.toBeNull();

  // Open the modal
  await navContact.click();
  const dialog = page.locator('dialog[data-test="contact-modal"]');
  await expect(dialog, 'dialog must be in [open] state after click').toHaveAttribute('open', /.*/);

  // ESC closes (browser-native behavior on <dialog>.showModal())
  await page.keyboard.press('Escape');

  // Dialog is no longer [open]
  const isOpenAfterEsc = await page.evaluate(() => {
    const dlg = document.querySelector(
      'dialog[data-test="contact-modal"]',
    ) as HTMLDialogElement | null;
    return dlg?.open ?? false;
  });
  expect(isOpenAfterEsc, 'dialog.open must be false after ESC (A11Y-03)').toBe(false);

  // URL hash cleared via history.replaceState (Pitfall 1 — anti-pattern guard).
  // Phase 6 06-01 Cat D fix: read via `liveUrl(page)` to bypass Playwright's
  // frame-URL cache, which does not invalidate on `history.replaceState`.
  expect(
    await liveUrl(page),
    'URL hash must be cleared on close (history.replaceState, NOT location.hash="")',
  ).not.toContain('#contact');

  // Focus returned to the trigger element
  const focusReturned = await page.evaluate((el) => document.activeElement === el, triggerHandle);
  expect(focusReturned, 'focus must return to the Nav Contact link (A11Y-03 return-focus)').toBe(
    true,
  );

  // REOPEN test: clicking same trigger again must fire hashchange and re-open
  // the dialog. This is the Pitfall 1 regression guard — `location.hash = ''`
  // would cache `#contact` and the same-hash click would silently fail.
  await navContact.click();
  await expect(
    dialog,
    'dialog must reopen on a SECOND click after ESC-close (Pitfall 1 — hash-clear via history.replaceState)',
  ).toHaveAttribute('open', /.*/);
});
