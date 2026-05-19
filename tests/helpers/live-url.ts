// tests/helpers/live-url.ts
// Source: 06-PATTERNS.md § tests/helpers/live-url.ts; 06-RESEARCH.md § Code Examples.
//
// Why this exists (Cat D fix for the Phase 5 spec scoreboard):
//
// `tests/contact-modal-esc-closes.spec.ts` asserts that after the modal close
// handler calls `history.replaceState(null, '', window.location.pathname +
// window.location.search)`, the URL no longer contains `#contact`. The Phase 5
// spec read the URL with Playwright's `page.url()` API and observed that the
// assertion failed intermittently — `page.url()` returns the URL of the
// _committed frame_, which Playwright caches and does NOT invalidate on a
// `history.replaceState` mutation (history.replaceState fires no DOM event
// the driver is listening to, in contrast to `popstate` for back/forward or a
// navigation commit for `location.assign`). The cached value still contained
// `#contact` even though `window.location.href` had been updated.
//
// `liveUrl(page)` works around the cache by evaluating `window.location.href`
// _in the browser context_ on every call — which always reflects the latest
// hash, search, and path state regardless of how it was mutated. Use it
// anywhere a spec needs to read the URL after a `history.replaceState` or
// `history.pushState` mutation that bypassed Playwright's navigation
// listeners.
//
// API:
//   const url = await liveUrl(page);   // → string, the live window.location.href
import type { Page } from '@playwright/test';

export const liveUrl = (page: Page): Promise<string> =>
  page.evaluate(() => window.location.href);
