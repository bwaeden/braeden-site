// lib/format.ts
// Source: PLAN.md 02-02-T1; UI-SPEC § CurrentlyLine (CD-02 date suffix).
//
// Date formatter helper. Server-side (RSC) — no client-side date math, no
// timezone surprises. Input: ISO YYYY-MM-DD. Output: "MMM D" (e.g. "May 9").
//
// Uses Intl.DateTimeFormat with timeZone: 'UTC' against a Date constructed
// from Date.UTC(year, monthIndex, day). This anchors the format to UTC so
// '2026-05-09' renders 'May 9' regardless of host timezone (avoids the
// "May 9 in PST = May 8 in UTC" hazard that bites server-rendered dates).
//
// Zero runtime deps — Intl is built into Node + browser. Mirrors lib/motion.ts
// shape: small pure-function module, named export, no third-party imports.

/** Format an ISO YYYY-MM-DD date string as "MMM D" (no year, no leading zero on day). */
export function formatDate(iso: string): string {
  const parts = iso.split('-').map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`formatDate: expected ISO YYYY-MM-DD, got "${iso}"`);
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
