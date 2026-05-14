/**
 * WORK-03, A11Y-05: Status badges render as colored dot + label, never
 * color-only. Each card's badge contains BOTH a decorative <span> dot
 * (aria-hidden, rounded-full, w-1.5 h-1.5) AND a <span> label with the
 * verbatim schema status text. Dot color matches STATUS_DOT_COLOR for the
 * card's declared status.
 *
 * Single source of truth: status values are derived from `projects[i].status`
 * (NOT a hard-coded enum literal in the spec) so the spec adapts cleanly to
 * data changes.
 *
 * RED until Plan 04-02 Wave 2 lands the page rewrite (which mounts
 * components/work/ProjectCard.tsx — Plan 04-01 Wave 1 ships the component).
 */
import { test, expect } from '@playwright/test';
import { projects } from '../data/projects';

// STATUS_DOT_COLOR per D-09 (matches components/work/ProjectCard.tsx
// constant). RGB-form regex tolerates Chromium serializing rgb() with or
// without the alpha channel.
const SHIPPED_RGB = /rgba?\(\s*124\s*,\s*135\s*,\s*255/;        // var(--color-accent) #7c87ff
const PAPER_TRADING_RGB = /rgba?\(\s*200\s*,\s*168\s*,\s*106/;  // #c8a86a inline literal
const IN_DEV_RGB = /rgba?\(\s*168\s*,\s*168\s*,\s*168/;         // var(--color-muted) #a8a8a8
// Note: ARCHIVED_RGB may need to update to /rgba?\(\s*122\s*,\s*122\s*,\s*122/
// if the Plan 04-02 Wave-3b WebAIM check forces the #7a7a7a fallback.
const ARCHIVED_RGB = /rgba?\(\s*112\s*,\s*112\s*,\s*112/;       // #707070 inline literal

test('WORK-03, A11Y-05: every card has status dot + label (color-not-only-indicator)', async ({ page }) => {
  await page.goto('/work');
  const cards = page.locator('[data-test="work-grid"] > li');

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]!;
    const card = cards.nth(i);

    // Decorative dot — aria-hidden, rounded-full
    const dot = card.locator('span[aria-hidden].rounded-full').first();
    await expect(
      dot,
      `card ${i} (${project.slug}): status dot must be present + aria-hidden`
    ).toHaveCount(1);

    // Label — visible text matching the literal schema enum value from the data
    const label = card.locator(`text=${project.status}`).first();
    await expect(
      label,
      `card ${i} (${project.slug}): status label "${project.status}" must be visible text`
    ).toHaveCount(1);
  }
});

test('WORK-03: dot color matches STATUS_DOT_COLOR for declared status', async ({ page }) => {
  await page.goto('/work');
  const cards = page.locator('[data-test="work-grid"] > li');

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]!;
    const card = cards.nth(i);
    const dot = card.locator('span[aria-hidden].rounded-full').first();

    const bg = await dot.evaluate((el) => getComputedStyle(el).backgroundColor);

    // Switch on project.status (NOT label text) — derive expectation from data
    let expected: RegExp;
    switch (project.status) {
      case 'shipped':
        expected = SHIPPED_RGB;
        break;
      case 'paper-trading':
        expected = PAPER_TRADING_RGB;
        break;
      case 'in-dev':
        expected = IN_DEV_RGB;
        break;
      case 'archived':
        expected = ARCHIVED_RGB;
        break;
    }
    expect(
      bg,
      `card ${i} (${project.slug}, status=${project.status}): dot bg should match STATUS_DOT_COLOR — got "${bg}"`
    ).toMatch(expected);
  }
});
