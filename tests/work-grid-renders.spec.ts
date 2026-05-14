/**
 * WORK-02, WORK-04, WORK-05, WORK-06: /work renders projects.length
 * ProjectCards in an equal-weight responsive grid sourced from typed
 * data/projects.ts. Each card has the hairline-tile structure: status badge
 * (dot + label) + title + arrow + description + tags. Status label uses the
 * verbatim schema enum value (lowercase, exact). Tags render as plain
 * comma-joined muted text. Each card's <a> opens externally with the
 * tabnabbing rel guards.
 *
 * Single source of truth (checker warning #4 fix): the expected card count
 * is `projects.length` — NEVER a hard-coded N literal in toHaveCount(N) —
 * so the spec adapts cleanly if Wave 0a OQ#1 changes the count.
 *
 * RED until Plan 04-02 Wave 2 lands the body rewrite of app/work/page.tsx.
 */
import { test, expect } from '@playwright/test';
import { projects } from '../data/projects';

test('WORK-06: /work renders projects.length ProjectCards in the grid', async ({ page }) => {
  await page.goto('/work');

  const section = page.locator('[data-test="work-section"]');
  await expect(section, 'expected exactly one [data-test="work-section"] on /work').toHaveCount(1);

  const grid = page.locator('[data-test="work-grid"]');
  await expect(grid, 'expected exactly one [data-test="work-grid"] on /work').toHaveCount(1);

  const cards = grid.locator('> li');
  await expect(
    cards,
    `expected projects.length (${projects.length}) ProjectCards in the grid`
  ).toHaveCount(projects.length);
});

test('WORK-02, WORK-05: each card has external <a> + status label matching schema enum', async ({ page }) => {
  await page.goto('/work');
  const cards = page.locator('[data-test="work-grid"] > li');

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]!;
    const card = cards.nth(i);

    // Each card has an <a target="_blank"> wrapping the body
    const externalLink = card.locator('a[target="_blank"]');
    await expect(
      externalLink,
      `card ${i} (${project.slug}): exactly one <a target="_blank">`
    ).toHaveCount(1);

    // Tabnabbing prevention — rel must contain BOTH noopener AND noreferrer
    await expect(externalLink, `card ${i} (${project.slug}): rel contains noopener`).toHaveAttribute(
      'rel',
      /noopener/
    );
    await expect(externalLink, `card ${i} (${project.slug}): rel contains noreferrer`).toHaveAttribute(
      'rel',
      /noreferrer/
    );

    // Status label = literal schema value from data (scoped to <span> +
    // exact-match — substring matchers collide with descriptions containing
    // the enum value, e.g. 'in-dev' status appearing inside 'in-development'
    // description text; exact-match alone collides with tag enum values like
    // 'archived' which appear both in the badge <span> and the tags <p>)
    await expect(
      card.locator(`span:text-is("${project.status}")`),
      `card ${i} (${project.slug}): status label "${project.status}" should appear`
    ).toHaveCount(1);
  }
});

test('WORK-04: tags render as visible comma-joined text per project', async ({ page }) => {
  await page.goto('/work');
  const cards = page.locator('[data-test="work-grid"] > li');

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]!;
    const card = cards.nth(i);
    const expectedTagsText = project.tags.join(', ');

    // Each card contains a <p> whose text matches the literal tags.join(', ')
    await expect(
      card.locator(`p:text-is("${expectedTagsText}")`),
      `card ${i} (${project.slug}): tags should render as "${expectedTagsText}"`
    ).toHaveCount(1);
  }
});
