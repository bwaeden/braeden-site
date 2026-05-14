/**
 * WORK-01, D-08: No card is "flagship" — every card in the same row of the
 * 2-col md grid has the same width AND the same height (items-stretch row
 * equalization per D-07). The orphan card on the last row (when
 * projects.length is odd) sits left-aligned at the same width as its
 * row-mates — NOT spanning two columns.
 *
 * Single source of truth: row-pair count is derived from projects.length —
 * NEVER a hard-coded N literal in toHaveCount(N).
 *
 * RED until Plan 04-02 Wave 2 lands the page rewrite + components/work/
 * ProjectCard.tsx (Plan 04-01 Wave 1 ships the component).
 */
import { test, expect } from '@playwright/test';
import { projects } from '../data/projects';

test('WORK-01, D-08: cards in the same row have matching width at md viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto('/work');

  const cards = page.locator('[data-test="work-grid"] > li');
  await expect(cards, `expected projects.length (${projects.length}) <li> cards`).toHaveCount(
    projects.length
  );

  const widths = await cards.evaluateAll((els) => els.map((el) => el.clientWidth));

  // 2-col md:grid-cols-2 layout — derive row-pair count from data
  const pairCount = Math.floor(projects.length / 2);
  for (let k = 0; k < pairCount; k++) {
    const i = 2 * k;
    const j = 2 * k + 1;
    expect(
      widths[i],
      `row pair (cards ${i}, ${j}): widths must match — got widths[${i}]=${widths[i]} vs widths[${j}]=${widths[j]}`
    ).toBe(widths[j]);
  }

  // If odd count: orphan card width must equal its row-mates' width — NOT
  // spanning two columns (D-06).
  if (projects.length % 2 === 1) {
    const orphanIdx = projects.length - 1;
    expect(
      widths[orphanIdx],
      `orphan card (${orphanIdx}) must NOT span — same width as row 0 (got widths[${orphanIdx}]=${widths[orphanIdx]} vs widths[0]=${widths[0]})`
    ).toBe(widths[0]);
  }
});

test('WORK-01, D-07: cards in the same row have matching heights (items-stretch)', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto('/work');

  const cards = page.locator('[data-test="work-grid"] > li');
  await expect(cards).toHaveCount(projects.length);

  // Read clientHeight of the inner <a> (NOT the <li>) per Pitfall 6 —
  // items-stretch sizes the <li> cell, but the <a> needs h-full to fill it.
  const heights = await cards.evaluateAll((els) =>
    els.map((el) => {
      const anchor = el.querySelector('a');
      return anchor ? anchor.clientHeight : 0;
    })
  );

  const pairCount = Math.floor(projects.length / 2);
  for (let k = 0; k < pairCount; k++) {
    const i = 2 * k;
    const j = 2 * k + 1;
    expect(
      Math.abs((heights[i] ?? 0) - (heights[j] ?? 0)),
      `row pair (cards ${i}, ${j}): heights must match within 1px — got ${heights[i]} vs ${heights[j]}`
    ).toBeLessThanOrEqual(1);
  }
});
