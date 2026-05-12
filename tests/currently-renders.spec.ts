/**
 * HOME-02: CurrentlyLine renders accent dot + statement + formatted date.
 *
 * On `/`:
 *  - the `currently.statement` literal text appears
 *  - a `<time dateTime>` element inside the hero region exists, with
 *    `dateTime` attr === `currently.updatedAt` ("2026-05-09")
 *  - visible date text matches the formatter output ("May 9") from
 *    `lib/format.ts`
 *  - an accent dot is present whose computed `background-color` matches
 *    the `--color-accent` value `rgb(124, 135, 255)` (or rgba variant)
 *
 * RED until Plan 02-02 lands `components/home/CurrentlyLine.tsx` +
 * `lib/format.ts`.
 */
import { test, expect } from '@playwright/test';

const STATEMENT = 'Currently shipping CapitolLens';
const UPDATED_AT_ISO = '2026-05-09';
const FORMATTED_DATE = 'May 9';
// --color-accent is #7c87ff per Phase 1 tokens (rgb(124, 135, 255)).
const ACCENT_RGB = /rgba?\(\s*124\s*,\s*135\s*,\s*255/;

test('HOME-02: Currently statement + <time dateTime> + formatted date appear on /', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByText(STATEMENT, { exact: false }),
    'currently.statement literal should appear on /'
  ).toHaveCount(1);

  const timeEl = page.locator('time[dateTime]').first();
  await expect(timeEl, 'a <time dateTime=...> element should exist on /').toHaveCount(1);

  const dt = await timeEl.getAttribute('dateTime');
  expect(dt, `time[dateTime] attr should equal currently.updatedAt`).toBe(UPDATED_AT_ISO);

  await expect(
    timeEl,
    `<time> visible text should match formatter output ("${FORMATTED_DATE}")`
  ).toContainText(FORMATTED_DATE);
});

test('HOME-02: Currently accent dot uses --color-accent (rgb 124,135,255)', async ({ page }) => {
  await page.goto('/');

  // The first aria-hidden <span> inside the Currently paragraph is the dot.
  const dot = page
    .locator('p:has-text("Currently") span[aria-hidden]')
    .first();
  await expect(dot, 'Currently accent dot should exist').toHaveCount(1);

  const bg = await dot.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg, `accent dot background should be --color-accent (got: ${bg})`).toMatch(ACCENT_RGB);
});
