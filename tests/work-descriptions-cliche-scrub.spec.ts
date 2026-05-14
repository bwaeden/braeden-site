/**
 * D-15: All ProjectCard descriptions on /work pass the cliché-ban regex
 * (mirrors tests/about-renders.spec.ts line 28 — copy-paste reuse, do not
 * re-derive). Voice guardrail: no exclamation points in any card copy.
 *
 * RED until Plan 04-02 Wave 2 lands the page rewrite (which mounts
 * components/work/ProjectCard.tsx — Plan 04-01 Wave 1 ships the component).
 *
 * No `projects` import needed — the spec extracts description text from the
 * rendered DOM, which handles N implicitly.
 */
import { test, expect } from '@playwright/test';

// Verbatim from tests/about-renders.spec.ts line 28 — single source of truth
// for the cliché ban list across /about and /work.
const CLICHE_BAN_REGEX =
  /passionate|I love to learn|driven by|innovative|cutting[-\s]edge|lifelong learner|wear many hats|results[-\s]oriented|outcome[-\s]driven/i;

test('D-15: all ProjectCard descriptions pass the cliché-ban regex', async ({ page }) => {
  await page.goto('/work');

  // Extract description text via the <p> children of each card. The card
  // structure (per components/work/ProjectCard.tsx) is: status badge div +
  // title div + description <p> + tags <p>. Both <p>s are descriptive copy
  // that must clear the cliché ban.
  const paragraphTexts = await page.locator('[data-test="work-grid"] li p').allInnerTexts();
  const text = paragraphTexts.join(' ');

  expect(
    text,
    'card descriptions must NOT contain any AI-template cliché (D-15)'
  ).not.toMatch(CLICHE_BAN_REGEX);
});

test('D-15: no exclamation points in any card copy', async ({ page }) => {
  await page.goto('/work');

  const paragraphTexts = await page.locator('[data-test="work-grid"] li p').allInnerTexts();
  const text = paragraphTexts.join(' ');

  expect(
    text,
    'card copy must NOT contain exclamation points (D-15 voice guardrail)'
  ).not.toContain('!');
});
