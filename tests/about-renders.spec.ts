/**
 * ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04: /about renders the bio + photo + CTA
 * composition with no AI-template phrasing, 150-300 words across 2-3 short
 * paragraphs, no exclamation points, single CTA pointing at `/` placeholder.
 *
 * On `/about`:
 *  - `[data-test="about-section"]` resolves once (proves Phase 3 composition shipped)
 *  - `[data-test="hero-photo-tile"]` resolves once (proves Option A HeroPhoto reuse — D-08)
 *  - exactly one `<a>` whose accessible text matches /Get in touch|Drop me a line|Say hi/i
 *    AND whose href === '#contact' (D-13 default + variants; D-15 → D-05 atomic swap landed in Plan 05-03)
 *  - section innerText:
 *      • does NOT match the cliché-ban regex (ABOUT-01 / D-05)
 *      • word count is 150-300 (D-06 target band 150-250 + 300 hard ceiling)
 *      • no `!` characters (D-05 voice guardrail)
 *  - section paragraph count (`p` children) is between 2 and 3 (D-06)
 *
 * RED until Plan 03-01 Task 2 lands the body rewrite of `app/about/page.tsx`.
 *
 * Phase-2 carry-forward: Chromium serializes `view-transition-name` as the
 * literal string `"hero-photo"` (no quoting) — see tests/view-transition-name-present.spec.ts
 * for the same caveat. The cliché-ban regex below is the verbatim D-05 list;
 * do NOT abbreviate or split — Task 2 self-scrub and Task 3 user review both
 * depend on this exact pattern.
 */
import { test, expect } from '@playwright/test';

const CLICHE_BAN_REGEX =
  /passionate|I love to learn|driven by|innovative|cutting[-\s]edge|lifelong learner|wear many hats|results[-\s]oriented|outcome[-\s]driven/i;

const CTA_TEXT_REGEX = /Get in touch|Drop me a line|Say hi/i;

test('ABOUT-01..04: /about section + photo + CTA + bio contract', async ({ page }) => {
  await page.goto('/about');

  const aboutSection = page.locator('[data-test="about-section"]');
  await expect(aboutSection, 'expected exactly one [data-test="about-section"] on /about').toHaveCount(1);

  const photoTile = page.locator('[data-test="hero-photo-tile"]');
  await expect(photoTile, 'HeroPhoto reuse (Option A per D-08) should render its tile on /about').toHaveCount(1);

  // CTA: exactly one <a> with the approved-variant text + href="#contact" per D-05 atomic swap (Plan 05-03).
  const cta = page.getByRole('link', { name: CTA_TEXT_REGEX });
  await expect(cta, 'exactly one CTA link matching /Get in touch|Drop me a line|Say hi/i').toHaveCount(1);
  await expect(cta, 'CTA href should be "#contact" — D-05 atomic swap landed in Plan 05-03').toHaveAttribute(
    'href',
    '#contact',
  );

  // Extract bio prose scoped to the <p> elements only — excludes the CTA link
  // text and the `→` glyph from word-count + cliché-ban gates (WR-01 fix).
  const paragraphTexts = await page.locator('[data-test="about-section"] p').allInnerTexts();
  const text = paragraphTexts.join(' ');

  expect(text, 'bio prose must NOT contain any AI-template cliché (ABOUT-01 / D-05)').not.toMatch(
    CLICHE_BAN_REGEX,
  );

  expect(text, 'bio prose must NOT contain exclamation points (D-05 voice guardrail)').not.toContain('!');

  const wordCount = text
    .split(/\s+/)
    .filter((token) => token.length > 0).length;
  expect(
    wordCount,
    `bio word count should be 150-300 (D-06 target 150-250 + 300 hard ceiling); measured ${wordCount}`,
  ).toBeGreaterThanOrEqual(150);
  expect(wordCount).toBeLessThanOrEqual(300);

  const paragraphCount = await page.locator('[data-test="about-section"] p').count();
  expect(
    paragraphCount,
    `bio paragraph count should be 2 or 3 (D-06); measured ${paragraphCount}`,
  ).toBeGreaterThanOrEqual(2);
  expect(paragraphCount).toBeLessThanOrEqual(3);
});
