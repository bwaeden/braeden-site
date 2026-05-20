/**
 * CTCT-02 + CTCT-03 + CTCT-05 + A11Y-03: Modal renders the 4 states (idle,
 * submitting, success, error) with the LOCKED verbatim copy from D-08..D-15.
 *
 * Source decisions (all verbatim strings — byte-for-byte match required):
 *   D-08 modal heading       = "Get in touch"
 *   D-09 idle button label   = "Send message"
 *   D-12 submitting label    = "Sending…"  (U+2026 horizontal ellipsis, NOT "...")
 *   D-10 success copy        = "Thanks — I’ll get back to you within a day or two."
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
const D10_SUCCESS_COPY = "Thanks — I’ll get back to you within a day or two."; // U+2014 + U+2019
const D11_ERROR_COPY = 'Something went wrong sending that. Try the email link below.';
// Phase 6 06-01 Cat B refactor: the `→` arrow now renders via CSS `::after`
// pseudo-element on the mailto anchor. We assert two things separately:
//  - `D15_MAILTO_DOM_TEXT` — what `toHaveText` (textContent) returns: leading
//    copy ONLY (no arrow), because pseudo-element content is excluded from
//    `Node.textContent` per CSS spec.
//  - `D15_MAILTO_AFTER`   — what `getComputedStyle(el, '::after').content`
//    returns. CSS-parsed `content` values are returned as CSS-quoted strings
//    by the browser, so the expected return is the arrow glyph surrounded by
//    double-quote characters (i.e. literal '"→"'). U+2192 inside.
const D15_MAILTO_DOM_TEXT = 'Or just email me directly';
const D15_MAILTO_AFTER = '"→"';

async function openModal(page: import('@playwright/test').Page) {
  await page.goto('/');
  // Phase 6 06-01 Cat A: open the mobile hamburger on chromium-mobile
  // (Pixel 5 viewport below the sm breakpoint). No-op on chromium-desktop.
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 640) {
    await page.locator('details.nav-mobile > summary').click();
  }
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

  // Phase 6 06-01 Cat B: arrow lives in `::after`, not in DOM text. Assert
  // BOTH the leading copy (textContent) AND the pseudo-element content.
  const mailtoLink = page.locator('a[href^="mailto:"]');
  await expect(
    mailtoLink,
    'mailto fallback DOM textContent must be exactly "Or just email me directly" (D-15 leading copy — arrow is in ::after)',
  ).toHaveText(D15_MAILTO_DOM_TEXT);

  const afterContent = await mailtoLink.evaluate(
    (el) => getComputedStyle(el, '::after').content,
  );
  expect(
    afterContent,
    'mailto fallback ::after pseudo-element must render the `→` glyph (D-15 + Cat B refactor — getComputedStyle returns CSS-quoted form)',
  ).toBe(D15_MAILTO_AFTER);
});

test('CTCT-05: empty submit blocks Formspree network call (native HTML required attrs)', async ({
  page,
}) => {
  let formspreeCallCount = 0;
  await page.route('**/formspree.io/**', (route) => {
    formspreeCallCount += 1;
    // Phase 6 06-01 Cat E (W2): @formspree/core@4.0.0 parses success via
    // `"next" in s && typeof s.next == "string"`. `{"ok":true}` matches
    // neither the success nor error shape → falls through to
    // `new SubmissionError({message:"Unexpected response format"})` (kind=error).
    // Return the canonical success shape `{ next: "..." }`.
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"next":"https://formspree.io/forms/xqeypnkw/submission"}',
    });
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
  // Delay the Formspree response so we can observe the submitting state.
  // Phase 6 06-01 Cat E: canonical success shape `{ next: "..." }` per
  // @formspree/core parser (see CTCT-05 mock above for rationale).
  await page.route('**/formspree.io/**', async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"next":"https://formspree.io/forms/xqeypnkw/submission"}',
    });
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
  // Phase 6 06-01 Cat E: canonical success shape `{ next: "..." }` per
  // @formspree/core parser (see CTCT-05 mock above for rationale).
  await page.route('**/formspree.io/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"next":"https://formspree.io/forms/xqeypnkw/submission"}',
    }),
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
  // (D-10 explicit + UI-SPEC State 3 contract).
  // Phase 6 06-01 Cat F (W2): scope to `dialog` because ContactModal renders
  // TWO `aria-live="polite"` regions in the success state:
  //  - the visible D-10 success region (the one we're asserting)
  //  - an SR-only status announcer at the bottom of the dialog (line 428 of
  //    ContactModal.tsx) — always mounted for screen-reader transitions.
  // Both are in-dialog and intentional. The original selector
  // `[aria-live="polite"]` matched both, yielding count=2. Scoping with
  // `dialog[data-test="contact-modal"] [aria-live="polite"]` plus
  // `[role="status"]` AND the success-copy ancestor narrows to the visible
  // success region only.
  await expect(
    page.locator('dialog[data-test="contact-modal"] [role="status"][aria-live="polite"]:not(.sr-only)'),
    'success region must have aria-live="polite" inside dialog (CTCT-03 + A11Y-03)',
  ).toHaveCount(1);
});

test('CTCT-02 + CTCT-03 + A11Y-03 error state: D-11 verbatim copy + assertive aria-live', async ({
  page,
}) => {
  // Phase 6 06-01 Cat E: @formspree/core parses errors via
  // `"errors" in s && Array.isArray(s.errors) && every(r => typeof r.message == "string")`
  // OR `"error" in s && typeof s.error == "string"`. Previously this mock
  // was `status: 500` with no body — bundle's `.json()` threw on empty body
  // and the catch produced a generic SubmissionError, which worked but is
  // brittle. Return the canonical error shape so the parser hits the
  // intended branch.
  await page.route('**/formspree.io/**', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: '{"errors":[{"code":"UNSPECIFIED","message":"Server error during Formspree submission."}]}',
    }),
  );

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

  // Error copy lives inside role="alert" with aria-live="assertive" per D-11.
  // Phase 6 06-01 Cat F (W2): scope to `dialog` because Next.js App Router
  // injects `<div id="__next-route-announcer__" role="alert" aria-live="assertive">`
  // at document root (a visually-hidden SR-only announcer for route changes).
  // The original selector `[role="alert"][aria-live="assertive"]` matched
  // BOTH that announcer AND the in-dialog D-11 error region, yielding count=2.
  // Confirmed via diagnostic spec — the second element's id is
  // `__next-route-announcer__`. Scoping with `dialog[data-test="contact-modal"]`
  // narrows to the intended in-dialog region only.
  await expect(
    page.locator('dialog[data-test="contact-modal"] [role="alert"][aria-live="assertive"]'),
    'error region must be role="alert" + aria-live="assertive" inside dialog (D-11 + A11Y-03)',
  ).toHaveCount(1);
});
