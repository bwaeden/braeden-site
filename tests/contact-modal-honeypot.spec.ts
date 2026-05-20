/**
 * CTCT-04 (honeypot half): submission with the honeypot `company` field
 * filled triggers SILENT success-shaped rejection — zero Formspree network
 * call, success UI rendered to the bot.
 *
 * Source decisions: D-13 — honeypot field name is `company` (NOT `_gotcha`
 *                          per CTCT-04 explicit exclusion). Visually hidden
 *                          via tabindex=-1 + autocomplete=off + aria-hidden.
 *
 *                   Pitfall 5 — `useForm.handleSubmit` is NEVER called on
 *                          silent-reject path; a separate `bypassedSuccess`
 *                          state renders the success UI so bots can't
 *                          distinguish real vs. blocked submissions.
 *
 * Anti-pattern guard (.continue-here.md): "Honeypot field name `_gotcha`"
 * is BLOCKING. ContactModal MUST use `name="company"`.
 *
 * RED until Plan 05-02 ships ContactModal with the wrappedHandleSubmit
 * pattern (honeypot check → silent return + bypassedSuccess flag).
 */
import { test, expect } from '@playwright/test';

const D10_SUCCESS_COPY = "Thanks — I’ll get back to you within a day or two.";

// Phase 6 06-01 Cat A refactor — open the mobile hamburger before reaching
// the Contact link on chromium-mobile (Pixel 5 viewport < 640px). No-op on
// chromium-desktop (1280×800).
async function openMobileNavIfNeeded(page: import('@playwright/test').Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 640) {
    await page.locator('details.nav-mobile > summary').click();
  }
}

test('CTCT-04 honeypot: filling `company` triggers silent success + ZERO Formspree call', async ({
  page,
}) => {
  // Network gate FIRST — established before any submit
  let formspreeCallCount = 0;
  await page.route('**/formspree.io/**', (route) => {
    formspreeCallCount += 1;
    // Phase 6 06-01 Cat E (W2): canonical success shape `{ next: "..." }` per
    // @formspree/core parser. Defensive — this mock should NEVER fire on the
    // honeypot path (the assertion below checks formspreeCallCount === 0).
    // Returning the right shape ensures that if a regression breaks the
    // honeypot, the resulting failure mode is "1 unexpected Formspree call"
    // rather than "modal stuck in error state on the bypassedSuccess UI".
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"next":"https://formspree.io/forms/xqeypnkw/submission"}',
    });
  });

  await page.goto('/');
  await openMobileNavIfNeeded(page);
  await page.getByRole('link', { name: 'Contact' }).first().click();
  const dialog = page.locator('dialog[data-test="contact-modal"]');
  await expect(dialog).toHaveAttribute('open', /.*/);

  // Sleep PAST the 1500ms min-time gate (D-14) so min-time alone wouldn't trip
  // — this isolates the honeypot trip as the cause of silent rejection.
  await page.waitForTimeout(1600);

  // Fill the visually-hidden honeypot field directly. It exists in DOM
  // (RED until Plan 02 adds it) and is addressable via name attribute.
  // Anti-pattern guard: field name MUST be `company`, NOT `_gotcha`.
  await page.locator('input[name="company"]').fill('I am a bot');

  // Fill the real fields too — a bot might fill everything
  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('textarea[name="message"]').fill('Real-looking message from a bot.');

  await page.locator('button:text-is("Send message")').click();

  // Give async submit pipeline time to run (it should NOT actually call Formspree)
  await page.waitForTimeout(500);

  expect(
    formspreeCallCount,
    'honeypot trip must result in ZERO Formspree network call (D-13 + Pitfall 5)',
  ).toBe(0);

  // The "bypassed success" UI renders so the bot sees what looks like success
  await expect(
    page.locator(`:text-is("${D10_SUCCESS_COPY}")`),
    'silent success UI must render so bot can\'t distinguish real vs. blocked (Pitfall 5 — bypassedSuccess state)',
  ).toHaveCount(1);
});
