---
phase: 4
slug: work-projects
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-13
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `@playwright/test` ^1.59.1 (verified in package.json) |
| **Config file** | `playwright.config.ts` (root) |
| **Quick run command** | `npm run test` (chromium-mobile project, exit on first failure) |
| **Full suite command** | `npm run test:full` (all projects) |
| **Estimated runtime** | ~30s quick / ~90s full |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test tests/work-*.spec.ts tests/no-client-components.spec.ts tests/focus-ring.spec.ts`
- **After every plan wave:** Run `npm run test:full`
- **Before `/gsd-verify-work`:** Full suite must be green against deployed Vercel branch preview
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-W0a | 01 | 0 | WORK-02, WORK-06 | — | N/A | unit | `npx playwright test tests/work-grid-renders.spec.ts` | ❌ W0 | ⬜ pending |
| 04-01-W0b | 01 | 0 | WORK-03, A11Y-05 | — | N/A | unit | `npx playwright test tests/work-status-badges.spec.ts` | ❌ W0 | ⬜ pending |
| 04-01-W0c | 01 | 0 | WORK-01 | — | N/A | unit | `npx playwright test tests/work-no-flagship.spec.ts` | ❌ W0 | ⬜ pending |
| 04-01-W0d | 01 | 0 | D-15 (optional) | — | N/A | unit | `npx playwright test tests/work-descriptions-cliche-scrub.spec.ts` | ❌ W0 (optional) | ⬜ pending |
| 04-01-W1 | 01 | 1 | WORK-03, WORK-04, WORK-05, A11Y-05 | T-1 (tabnabbing) | `target="_blank"` always paired with `rel="noopener noreferrer"` | unit | `npx playwright test tests/work-status-badges.spec.ts tests/work-grid-renders.spec.ts` | ❌ → ✅ W1 | ⬜ pending |
| 04-01-W2 | 01 | 2 | WORK-01, WORK-02, WORK-04, WORK-05, WORK-06 | — | N/A | unit | `npx playwright test tests/work-*.spec.ts` | ❌ → ✅ W2 | ⬜ pending |
| 04-01-W3 | 01 | 3 | All WORK-01..06, A11Y-05 (regression on deployed preview) | T-1 | `rel` attrs verified on rendered HTML at preview URL | e2e | `npx playwright test --config=playwright.preview.config.ts` (or env-overridden BASE_URL) | ❌ W3 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/work-grid-renders.spec.ts` — stubs covering WORK-01, WORK-02, WORK-04, WORK-05, WORK-06
- [ ] `tests/work-status-badges.spec.ts` — stubs covering WORK-03, A11Y-05
- [ ] `tests/work-no-flagship.spec.ts` — stub covering WORK-01 equal-weight verification
- [ ] `tests/work-descriptions-cliche-scrub.spec.ts` — OPTIONAL per D-15 (recommend ship per RESEARCH OQ#4)
- Framework install: ✓ already present (`@playwright/test` ^1.59.1) — no install needed
- Shared fixtures: ✓ N/A — `playwright.config.ts` handles project + viewport setup

**Inherited regression coverage (already shipped, must remain GREEN):**
- `tests/no-client-components.spec.ts` — Phase 1 — verifies zero `'use client'` in `app/work/`, `components/work/`
- `tests/focus-ring.spec.ts` — Phase 1 — `:focus-visible` ring on cards, no `transition-colors` leak
- `tests/reduced-motion.spec.ts` — Phase 1 — stagger + hover transitions defeated under emulation
- Phase 1 + 2 + 3 chrome (Nav, Footer, hero, about) — full suite must stay GREEN

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `#707070`-on-`#1a1a1f` ~3.6:1 contrast on archived status dot | WCAG AA visual check | Borderline AA at 3:1 large-text threshold; grain layer affects perceived contrast — automated headless doesn't capture grain blend correctly | Wave 3 (deploy preview): open `/work` in actual browser → inspect archived (braehods) card → run WebAIM Contrast Checker on dot color against rendered background → if < 3:1 documented requirement, swap to `#7a7a7a` fallback documented in UI-SPEC |
| Card stagger reads as composed (not chaotic) | UI polish (UI-SPEC visual contract) | Subjective rhythm/timing judgment | Wave 3: load `/work` cold → confirm 80ms × 7 = ~960ms stagger feels composed, not jittery. If LCP ≥ 2.5s on Lighthouse mobile run, strip stagger from card 1 per UI-SPEC documented fallback |
| External-link glyph visible without hover | UX polish | Visual judgment of accent color contrast | Wave 3: confirm `↗` is visible in normal state (not only on hover); accent color must be discernible without interaction |

---

## Validation Sign-Off

- [ ] All tasks have automated verification or Wave 0 dependencies declared
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (3 required spec files + 1 optional)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter (after Wave 0 stubs land)

**Approval:** pending
