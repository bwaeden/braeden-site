/**
 * CTCT-04 (min-time-to-submit half): submission within 1500ms of mount
 * triggers SILENT success-shaped rejection — zero Formspree network call,
 * success UI rendered.
 *
 * Source decisions: D-14 — 1500ms (1.5s) min-time threshold. Mount
 *                          timestamp captured via useState(() => Date.now())
 *                          lazy init. Submit handler rejects if
 *                          Date.now() - mountTime < 1500.
 *
 *                   Pitfall 5 — bypassedSuccess state renders success UI
 *                          so bots can't differentiate from real submit.
 *
 * Second test in this file: submit AFTER mount-time elapses → real
 * submission goes through (formspreeCallCount === 1). This is the
 * positive-path canary that proves the min-time gate doesn't false-block
 * humans who type at normal speed.
 *
 * RED until Plan 05-02 ships ContactModal with the min-time check inside
 * wrappedHandleSubmit.
 */
import { test, expect } from '@playwright/test';

const D10_SUCCESS_COPY = "Thanks — I'll get back to you within a day or two.";

test('CTCT-04 min-time: submit within 1500ms of mount → silent reject + ZERO Formspree call', async ({
  page,
}) => {
  let formspreeCallCount = 0;
  await page.route('**/formspree.io/**', (route) => {
    formspreeCallCount += 1;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Contact' }).first().click();
  const dialog = page.locator('dialog[data-test="contact-modal"]');
  await expect(dialog).toHaveAttribute('open', /.*/);

  // Fill + submit IMMEDIATELY (well under 1500ms) — honeypot stays empty so
  // min-time is the ONLY trip condition.
  await page.locator('input[name="name"]').fill('Test');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('textarea[name="message"]').fill('Fast bot submit.');
  await page.locator('button:text-is("Send message")').click();

  await page.waitForTimeout(300);

  expect(
    formspreeCallCount,
    'submit within 1500ms must result in ZERO Formspree call (D-14)',
  ).toBe(0);

  await expect(
    page.locator(`:text-is("${D10_SUCCESS_COPY}")`),
    'silent success UI must render so bot can\'t detect the block (Pitfall 5)',
  ).toHaveCount(1);
});

test('CTCT-04 min-time canary: submit AFTER 1500ms → real Formspree call goes through', async ({
  page,
}) => {
  let formspreeCallCount = 0;
  await page.route('**/formspree.io/**', (route) => {
    formspreeCallCount += 1;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Contact' }).first().click();
  const dialog = page.locator('dialog[data-test="contact-modal"]');
  await expect(dialog).toHaveAttribute('open', /.*/);

  // Wait PAST the 1500ms gate, honeypot empty → real submission path
  await page.waitForTimeout(1600);

  await page.locator('input[name="name"]').fill('Human User');
  await page.locator('input[name="email"]').fill('human@example.com');
  await page
    .locator('textarea[name="message"]')
    .fill('Real human message past the min-time gate.');
  await page.locator('button:text-is("Send message")').click();

  await page.waitForTimeout(500);

  expect(
    formspreeCallCount,
    'submit AFTER 1500ms must hit Formspree exactly once (positive-path canary — D-14 does not false-block humans)',
  ).toBe(1);
});
