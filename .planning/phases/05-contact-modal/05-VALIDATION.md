---
phase: 5
slug: contact-modal
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-14
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Source: 05-RESEARCH.md `## Validation Architecture` section.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright `^1.59.1` (already installed) |
| **Config file** | `playwright.config.ts` — `testDir ./tests`, timeout 30s, baseURL `process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'`, projects `chromium-mobile` + `chromium-desktop` |
| **Quick run command** | `npx playwright test tests/contact-modal-*.spec.ts tests/single-client-island.spec.ts tests/contact-trigger-rewire.spec.ts --project=chromium-mobile` |
| **Full suite command** | `npm run test:full` |
| **Estimated runtime** | ~10s (focused Phase 5 set, mobile project) / ~60s (full suite) |

---

## Sampling Rate

- **After every task commit:** Run focused Phase 5 quick command (~10s).
- **After every plan wave:** Run `npm run test:full` against local `npm start`.
- **Before `/gsd-verify-work`:** Full suite must be green + manual Phase Exit Visual Verification (UI-SPEC lines 600-628) complete.
- **Max feedback latency:** 10 seconds (per-task), 60 seconds (per-wave).

---

## Per-Task Verification Map

| Test ID | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 5-V-01 | 0 | CTCT-01 | — | Modal opens via Nav Contact link, focus trapped | integration | `npx playwright test tests/contact-modal-opens-from-nav.spec.ts` | ❌ W0 | ⬜ pending |
| 5-V-02 | 0 | CTCT-01 | — | Modal opens via /about Get in touch CTA, focus trapped | integration | `npx playwright test tests/contact-modal-opens-from-about.spec.ts` | ❌ W0 | ⬜ pending |
| 5-V-03 | 0 | CTCT-01 + CTCT-07 + A11Y-03 | — | ESC closes, focus returns to trigger, hash clears via `history.replaceState` | integration | `npx playwright test tests/contact-modal-esc-closes.spec.ts` | ❌ W0 | ⬜ pending |
| 5-V-04 | 0 | CTCT-02 + CTCT-03 + CTCT-05 + A11Y-03 | — | Form submits to mocked Formspree; idle/submitting/success/error states render verbatim copy + `aria-live`; empty submit blocks | integration | `npx playwright test tests/contact-modal-states.spec.ts` | ❌ W0 | ⬜ pending |
| 5-V-05 | 0 | CTCT-04 | T-Spam-Honeypot | Honeypot trip → silent success, ZERO Formspree network call | integration | `npx playwright test tests/contact-modal-honeypot.spec.ts` | ❌ W0 | ⬜ pending |
| 5-V-06 | 0 | CTCT-04 | T-Spam-MinTime | Min-time trip (submit < 1500ms) → silent success, ZERO Formspree call | integration | `npx playwright test tests/contact-modal-min-time.spec.ts` | ❌ W0 | ⬜ pending |
| 5-V-07 | 0 | CTCT-06 | — | mailto: fallback link present + correct href + visible in all 4 states | integration | `npx playwright test tests/contact-modal-mailto-fallback.spec.ts` | ❌ W0 | ⬜ pending |
| 5-V-08 | 0 | D-05 (atomic swap) | — | Both Nav.tsx (line 15) + /about CTA (line 75) point at `#contact` (filesystem assertion) | unit | `npx playwright test tests/contact-trigger-rewire.spec.ts` | ❌ W0 | ⬜ pending |
| 5-V-09 | 0 | FOUND-07 | — | Exactly 1 `'use client'` directive across `app/`, `components/`, `lib/` (the ContactModal) | unit | `npx playwright test tests/single-client-island.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/contact-modal-opens-from-nav.spec.ts` — covers CTCT-01 (Nav trigger)
- [ ] `tests/contact-modal-opens-from-about.spec.ts` — covers CTCT-01 (/about trigger)
- [ ] `tests/contact-modal-esc-closes.spec.ts` — covers CTCT-01 + CTCT-07 + A11Y-03
- [ ] `tests/contact-modal-states.spec.ts` — covers CTCT-03 + CTCT-05 + A11Y-03 (uses `:text-is()` exact-match for the 5 verbatim-locked copy strings per Phase 4 lesson)
- [ ] `tests/contact-modal-honeypot.spec.ts` — covers CTCT-04 (honeypot half) — uses `page.route('**/formspree.io/**', ...)` to assert ZERO network call
- [ ] `tests/contact-modal-min-time.spec.ts` — covers CTCT-04 (min-time half) — uses Playwright clock manipulation OR direct Date.now() check
- [ ] `tests/contact-modal-mailto-fallback.spec.ts` — covers CTCT-06
- [ ] `tests/contact-trigger-rewire.spec.ts` — covers D-05 atomic swap (filesystem grep on Nav.tsx line 15 + about/page.tsx line 75)
- [ ] `tests/single-client-island.spec.ts` — covers FOUND-07 (recursive grep across `app/`, `components/`, `lib/` for exactly 1 `'use client'`)

**Update existing spec:** `tests/no-client-components.spec.ts` — adjust to assert ZERO `'use client'` outside the ContactModal path (or replace entirely with `single-client-island.spec.ts`).

**No framework install needed** — Playwright + 2 projects already configured.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real Formspree submission lands in inbox `xqeypnkw` | CTCT-02 | Specs mock the Formspree network. End-to-end mail delivery is not a unit/integration concern. | UI-SPEC Phase Exit Visual Verification (lines 600-628). Open modal → fill → submit → confirm test message arrives at fakegoat1@gmail.com. |
| Screen reader announces all 4 states (NVDA/JAWS/VoiceOver) | CTCT-03 + A11Y-03 | Playwright cannot drive screen-reader output streams. | Manual: NVDA on Windows OR VoiceOver on macOS — open modal, navigate through idle/submit-clicked/success/error, confirm each state is announced via `aria-live` region. |
| Visual fidelity to UI-SPEC (spacing, color, typography, animation) | UI-SPEC contract | Pixel-level visual comparison out of scope for v1 specs. | UI-SPEC Phase Exit Visual Verification checklist. |
| `prefers-reduced-motion` disables modal entrance fade | UI-SPEC + WCAG | Playwright supports media-emulation but visual-vs-no-animation diff is human-judged. | Set OS reduced-motion ON; open modal; confirm no opacity transition. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s per-task, < 60s per-wave
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
