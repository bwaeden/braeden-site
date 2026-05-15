/**
 * CTCT-06: mailto fallback link is present, points at the locked email
 * target with the correct subject param, displays verbatim D-15 text, AND
 * stays visible across idle + submitting + success states (per D-15: "Sits
 * below the form. Visible in idle, submitting, and success states; in
 * error state, the error copy explicitly references it.").
 *
 * Source decisions: D-15 — mailto:fakegoat1@gmail.com?subject=Hi%20Braeden
 *                          link wording "Or just email me directly →"
 *                          (verbatim — U+2192 arrow glyph, U+2014 N/A here)
 *
 * Phase 4 lesson carry-forward: use `:text-is()` exact-match selector.
 *
 * RED until Plan 05-02 ships ContactModal with the mailto link in the
 * idle/submitting/success state JSX.
 */
import { test, expect } from '@playwright/test';

const D15_HREF = 'mailto:fakegoat1@gmail.com?subject=Hi%20Braeden';
const D15_TEXT = 'Or just email me directly →'; // U+2192 arrow

async function openModal(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Contact' }).first().click();
  await expect(page.locator('dialog[data-test="contact-modal"]')).toHaveAttribute('open', /.*/);
}

test('CTCT-06: mailto fallback href + verbatim text in idle state', async ({ page }) => {
  await openModal(page);

  const mailto = page.locator('a[href^="mailto:"]');
  await expect(mailto, 'exactly one mailto: link inside the modal (idle state)').toHaveCount(1);
  await expect(
    mailto,
    'mailto href must match D-15 verbatim (fakegoat1@gmail.com + subject param)',
  ).toHaveAttribute('href', D15_HREF);

  await expect(
    page.locator(`:text-is("${D15_TEXT}")`),
    'mailto link text must read verbatim "Or just email me directly →" (D-15, U+2192 arrow)',
  ).toHaveCount(1);
});

test('CTCT-06: mailto fallback stays visible during submitting state', async ({ page }) => {
  // Delay Formspree response so submitting state holds
  await page.route('**/formspree.io/**', async (route) => {
    await new Promise((r) => setTimeout(r, 2000));
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await openModal(page);
  await page.waitForTimeout(1600); // past D-14 min-time gate
  await page.locator('input[name="name"]').fill('Test');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('textarea[name="message"]').fill('Real message.');
  await page.locator('button:text-is("Send message")').click();

  // While submitting, mailto link still visible
  await expect(
    page.locator('a[href^="mailto:"]'),
    'mailto link must stay visible during submitting state (D-15 — visible in all non-error states)',
  ).toHaveCount(1);
});

test('CTCT-06: mailto fallback stays visible after success render', async ({ page }) => {
  await page.route('**/formspree.io/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  );

  await openModal(page);
  await page.waitForTimeout(1600);
  await page.locator('input[name="name"]').fill('Test');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('textarea[name="message"]').fill('Real message.');
  await page.locator('button:text-is("Send message")').click();

  // Wait for success state to render
  await expect(page.locator(":text-is(\"Thanks — I'll get back to you within a day or two.\")"))
    .toHaveCount(1);

  await expect(
    page.locator('a[href^="mailto:"]'),
    'mailto link must stay visible in success state (D-15 explicit)',
  ).toHaveCount(1);
});
