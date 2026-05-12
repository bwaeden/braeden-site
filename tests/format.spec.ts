/**
 * HOME-02 (CD-02): lib/format.ts formatDate helper.
 *
 * Pure-function test — no `page.goto`. Imports formatDate directly and
 * asserts:
 *  - '2026-05-09' → 'May 9' (no year, no leading zero day)
 *  - '2026-01-03' → 'Jan 3' (single-digit day)
 *  - '2026-12-25' → 'Dec 25' (two-digit day)
 *  - UTC anchor: setting process.env.TZ to 'America/Los_Angeles' must not
 *    shift the rendered date (server-side formatters must not drift between
 *    timezones).
 *
 * Mirrors the existing test infrastructure (Playwright `test` runner) rather
 * than introducing Vitest/Jest. Spec file lives in tests/ alongside the rest;
 * uses relative import to avoid the @/ alias resolution (Playwright/tsx
 * picks up TS via the existing config).
 *
 * Source: PLAN.md 02-02-T1.
 */
import { test, expect } from '@playwright/test';
import { formatDate } from '../lib/format';

test('formatDate: "2026-05-09" → "May 9"', () => {
  expect(formatDate('2026-05-09')).toBe('May 9');
});

test('formatDate: "2026-01-03" → "Jan 3" (single-digit day, no leading zero)', () => {
  expect(formatDate('2026-01-03')).toBe('Jan 3');
});

test('formatDate: "2026-12-25" → "Dec 25" (two-digit day)', () => {
  expect(formatDate('2026-12-25')).toBe('Dec 25');
});

test('formatDate: UTC anchor — output is timezone-invariant', () => {
  // Render once with whatever the host TZ is.
  const baseline = formatDate('2026-05-09');
  expect(baseline).toBe('May 9');

  // Now force a host TZ that would shift '2026-05-09T00:00:00Z' back to May 8
  // if the formatter were timezone-naive. Intl.DateTimeFormat reads TZ at
  // call time, so this round-trip exercises the UTC anchor.
  const originalTZ = process.env.TZ;
  try {
    process.env.TZ = 'America/Los_Angeles';
    expect(formatDate('2026-05-09')).toBe('May 9');
  } finally {
    if (originalTZ === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = originalTZ;
    }
  }
});
