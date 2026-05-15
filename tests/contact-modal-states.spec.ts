/**
 * CTCT-02 + CTCT-03 + CTCT-05 + A11Y-03: Modal renders the 4 states (idle,
 * submitting, success, error) with the LOCKED verbatim copy from D-08..D-15.
 *
 * Source decisions (all verbatim strings — byte-for-byte match required):
 *   D-08 modal heading       = "Get in touch"
 *   D-09 idle button label   = "Send message"
 *   D-12 submitting label    = "Sending…"  (U+2026 horizontal ellipsis, NOT "...")
 *   D-10 success copy        = "Thanks — I'll get back to you within a day or two."
 *                              (U+2014 em-dash, U+2019 typographic apostrophe)
 *   D-11 error copy          = "Something went wrong sending that. Try the email link below."
 *   D-15 mailto link wording = "Or just email me directly →"  (U+2192 rightwards arrow)
 *
 * Phase 4 lesson carry-forward: use `:text-is()` exact-match selectors,
 * NOT `text=` substring. Substring matchers cause cross-DOM collisions
 * (e.g. "Send message" button label could substring-match a description in
 * another component; "Sending…" could collide with future status strings).
 * Lock exact strings, lock with `:text-is()`.
 *
 * Bot-defense gating (D-14): the submitting/success/error sub-tests sleep
 * past the 1500ms min-time-to-submit gate BEFORE submitting; the honeypot
 * stays empty. This is the "real submission" path. Honeypot-trip and
 * min-time-trip silent-rejects have their own spec files.
 *
 * RED until Plan 05-02 lands ContactModal with the 4-state rendering.
 */
import { test, expect } from '@playwright/test';

const D08_HEADING = 'Get in touch';
const D09_IDLE_BUTTON = 'Send message';
const D12_SUBMITTING_BUTTON = 'Sending…'; // U+2026 — NOT "..."
const D10_SUCCESS_COPY = "Thanks — I'll get back to you within a day or two."; // U+2014 + U+2019
const D11_ERROR_COPY = 'Something went wrong sending that. Try the email link below.';
const D15_MAILTO_TEXT = 'Or just email me directly →'; // U+2192

async function openModal(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Contact' }).first().click();
  await expect(page.locator('dialog[data-test="contact-modal"]')).toHaveAttribute('open', /.*/);
}

test('CTCT-02 idle state: D-08 heading + D-09 send button + D-15 mailto verbatim', async ({
  page,
}) => {
  await openModal(page);

  await expect(
    page.locator(`h2:text-is("${D08_HEADING}")`),
    'modal heading must read exactly "Get in touch" (D-08 verbatim)',
  ).toHaveCount(1);

  await expect(
    page.locator(`button:text-is("${D09_IDLE_BUTTON}")`),
    'idle submit button must read exactly "Send message" (D-09 verbatim)',
  ).toHaveCount(1);

  await expect(
    page.locator(`:text-is("${D15_MAILTO_TEXT}")`),
    'mailto fallback link must read exactly "Or just email me directly →" (D-15 verbatim, U+2192 arrow)',
  ).toHaveCount(1);
});

test('CTCT-05: empty submit blocks Formspree network call (native HTML required attrs)', async ({
  page,
}) => {
  let formspreeCallCount = 0;
  await page.route('**/formspree.io/**', (route) => {
    formspreeCallCount += 1;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await openModal(page);

  // Click Send with empty fields — `required` HTML attribute prevents submit
  await page.locator(`button:text-is("${D09_IDLE_BUTTON}")`).click();

  // Brief wait to let any async submit pipeline run
  await page.waitForTimeout(300);

  expect(
    formspreeCallCount,
    'empty submit must NOT trigger Formspree network call (CTCT-05 — required HTML attrs block)',
  ).toBe(0);
});

test('CTCT-02 + CTCT-03 + A11Y-03 submitting state: D-12 "Sending…" verbatim + aria-busy', async ({
  page,
}) => {
  // Delay the Formspree response so we can observe the submitting state
  await page.route('**/formspree.io/**', async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await openModal(page);

  // Wait past the 1500ms min-time-to-submit gate (D-14) so real submission goes through
  await page.waitForTimeout(1600);

  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page
    .locator('textarea[name="message"]')
    .fill('Hello world this is a real message past the min-time gate.');
  await page.locator(`button:text-is("${D09_IDLE_BUTTON}")`).click();

  await expect(
    page.locator(`button:text-is("${D12_SUBMITTING_BUTTON}")`),
    'submitting state button must read exactly "Sending…" (D-12 verbatim — U+2026 ellipsis, NOT three dots)',
  ).toHaveCount(1);

  await expect(
    page.locator('form[aria-busy="true"]'),
    'submitting state must set form[aria-busy="true"] (D-12 + A11Y-03)',
  ).toHaveCount(1);
});

test('CTCT-02 + CTCT-03 + A11Y-03 success state: D-10 verbatim copy + polite aria-live', async ({
  page,
}) => {
  await page.route('**/formspree.io/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  );

  await openModal(page);
  await page.waitForTimeout(1600); // past D-14 min-time gate

  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('textarea[name="message"]').fill('Real message past the min-time gate.');
  await page.locator(`button:text-is("${D09_IDLE_BUTTON}")`).click();

  await expect(
    page.locator(`:text-is("${D10_SUCCESS_COPY}")`),
    'success copy must read verbatim per D-10 (U+2014 em-dash, U+2019 apostrophe — NOT hyphen, NOT straight apostrophe)',
  ).toHaveCount(1);

  // Success copy lives inside an aria-live="polite" container
  // (D-10 explicit + UI-SPEC State 3 contract)
  await expect(
    page.locator('[aria-live="polite"]'),
    'success region must have aria-live="polite" (CTCT-03 + A11Y-03)',
  ).toHaveCount(1);
});

test('CTCT-02 + CTCT-03 + A11Y-03 error state: D-11 verbatim copy + assertive aria-live', async ({
  page,
}) => {
  await page.route('**/formspree.io/**', (route) => route.fulfill({ status: 500 }));

  await openModal(page);
  await page.waitForTimeout(1600); // past D-14 min-time gate

  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('textarea[name="message"]').fill('Real message past the min-time gate.');
  await page.locator(`button:text-is("${D09_IDLE_BUTTON}")`).click();

  await expect(
    page.locator(`:text-is("${D11_ERROR_COPY}")`),
    'error copy must read verbatim per D-11',
  ).toHaveCount(1);

  // Error copy lives inside role="alert" with aria-live="assertive" per D-11
  await expect(
    page.locator('[role="alert"][aria-live="assertive"]'),
    'error region must be role="alert" + aria-live="assertive" (D-11 + A11Y-03)',
  ).toHaveCount(1);
});
