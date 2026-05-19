---
phase: 6
slug: polish-seo-launch
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-19
approved: 2026-05-19
approver: gsd-plan-checker (Dimension 8 PASS — auto + checkpoint sampling continuity, Wave 0 completeness, feedback latency, no watch flags)
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright `^1.59.1` (already installed) + `@axe-core/playwright@^4.11.3` + `playwright-lighthouse@^4.0.0` |
| **Config file** | `playwright.config.ts` (repo root) — `baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'`; 2 projects: chromium-mobile (Pixel 5) + chromium-desktop (1280×800) |
| **Quick run command** | `npm run test` (= `playwright test --project=chromium-mobile -x`) |
| **Full suite command** | `npm run test:full` (= `playwright test` — both projects) |
| **Preview-URL full run** | `PLAYWRIGHT_BASE_URL=https://<preview>.vercel.app npm run test:full` |
| **Lighthouse-only run** | `PLAYWRIGHT_BASE_URL=<preview> npx playwright test tests/lighthouse.spec.ts tests/photo-lcp.spec.ts` |
| **Estimated runtime — quick** | ~30 seconds (chromium-mobile single-spec) |
| **Estimated runtime — full** | ~3-5 minutes (both projects, 30+ specs) |
| **Estimated runtime — preview** | ~6-9 minutes (full suite × CDN-roundtrip latency) |

---

## Sampling Rate

- **After every task commit (Plan 06-01 W0 spec-fix waves):** Run `npm run test` (chromium-mobile, <30s) on the affected spec PLUS regression canaries (`tests/no-client-components.spec.ts` + `tests/single-client-island.spec.ts`).
- **After every Category fix completion (Cat A/B/C/D):** Run `npm run test:full` (both projects) to verify all 22 originally-failing specs are now GREEN on both projects.
- **After every wave merge (Plan 06-01 W0 → W1 → W2; Plan 06-02 W0 → W1; Plan 06-03 W0 → W1):** Full local suite GREEN before pushing to preview.
- **Plan 06-01 exit gate:** `PLAYWRIGHT_BASE_URL=<preview> npm run test:full` GREEN on preview URL (real Vercel CDN, not localhost) PLUS the 40-item visual checklist clean PLUS real Formspree email arrives at `fakegoat1@gmail.com`.
- **Plan 06-02 exit gate:** All 6 Lighthouse audits ≥95 (3 routes × 2 form factors), all 8 new SEO specs GREEN against preview, Person JSON-LD passes Google Rich Results Test, NVDA + VoiceOver iOS walks clean.
- **Plan 06-03 exit gate (= Phase 6 exit gate = v1 ship gate):** `braehods.com` resolves to new Vercel deploy over HTTPS, smoke walks of Nav + Footer + ContactModal submit on prod URL produce real email at `fakegoat1@gmail.com`, iOS Safari + Android Chrome real-device tests clean, old `bwaeden/braehods` archived, bio links updated, `data/projects.ts` archived-braehods href = github URL committed BEFORE the DNS flip.
- **Before `/gsd-verify-work`:** Full suite must be GREEN on preview AND prod URL (`braehods.com`).
- **Max feedback latency:** ~30 seconds quick / ~5 minutes full local / ~9 minutes preview.

---

## Per-Task Verification Map

> Plan IDs follow CONTEXT D-01 structure: 06-01 (deploy+cleanup), 06-02 (audits), 06-03 (launch). Task IDs are placeholders pending planner refinement.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 0 | (carry-fwd C-A) | T-06-09 / — | 7 mobile-only specs detect viewport + open `<details>` before clicking Contact | unit | `npm run test:full -- tests/contact-modal-*.spec.ts` | ✅ (7 specs exist, edited atomically per D-07) | ⬜ pending |
| 06-01-02 | 01 | 0 | (carry-fwd C-B) | — | Mailto link arrow renders via CSS `::after` (no `'use client'` leak) | unit | `npx playwright test tests/contact-modal-states.spec.ts` | ✅ (existing spec, refactored assertion) | ⬜ pending |
| 06-01-03 | 01 | 0 | (carry-fwd C-C) | T-06-05 / OWASP A03 | Error region has `role="alert"` + silent bot-rejection path no spurious success render | unit | `npx playwright test tests/contact-modal-states.spec.ts tests/contact-modal-honeypot.spec.ts tests/contact-modal-min-time.spec.ts` | ✅ (existing specs) | ⬜ pending |
| 06-01-04 | 01 | 0 | (carry-fwd C-D) | — | `tests/helpers/live-url.ts` wrapper + `tests/contact-modal-esc-closes.spec.ts` uses live URL after `history.replaceState` | unit | `npx playwright test tests/contact-modal-esc-closes.spec.ts` | ❌ W0 (helper to add) | ⬜ pending |
| 06-01-05 | 01 | 1 | — | — | Delete `app/%5Ftokens/` folder; no live refs remain | source assertion + build | `git grep -l "_tokens" -- 'app/**'` returns empty; `npm run build` clean | n/a (delete) | ⬜ pending |
| 06-01-06 | 01 | 1 | PERF-05 | — | Verify `<Analytics />` + `<SpeedInsights />` already mounted in `app/layout.tsx` (D-09 collapse — researcher Pivot #2) | build-output assertion | `grep -E "Analytics|SpeedInsights" app/layout.tsx` returns matches; build smoke shows analytics endpoint hit | ✅ (already mounted lines 22-23) | ⬜ pending verify |
| 06-01-07 | 01 | 2 | — | T-06-10 / OWASP A05 | Vercel preview deploy succeeds; URL resolves 200 | manual + integration | (manual: confirm preview URL from Vercel dashboard) + `curl -I <preview>/` 200 | n/a (Vercel pipeline) | ⬜ pending |
| 06-01-08 | 01 | 2 | — | — | `PLAYWRIGHT_BASE_URL=<preview> npm run test:full` GREEN on both projects | integration | as left | n/a (env-driven existing suite) | ⬜ pending |
| 06-01-09 | 01 | 2 | CTCT-02 | T-06-02 / OWASP A01 | Real Formspree submission from preview URL → real email at `fakegoat1@gmail.com` | **manual-only** | (manual: open preview, submit form, check inbox) | n/a (manual) | ⬜ pending |
| 06-01-10 | 01 | 2 | — | — | 40-item visual checklist clean (28 P4 + 12 P5 dedup'd) | **manual-only** | (manual: `.planning/phases/06-polish-seo-launch/visual-checklist.md` walk) | ❌ checklist to create | ⬜ pending |
| 06-01-11 | 01 | 2 | WORK-05 | — | 3 placeholder GH URL verifications return 200 (carry-fwd #3) | **manual + integration** | `curl -I https://github.com/bwaeden/prediction-market-bot https://github.com/bwaeden/no-more-short-form https://github.com/bwaeden/mc-packet-client` all 200 | n/a (one-shot curl) | ⬜ pending |
| 06-01-12 | 01 | 2 | A11Y-05 | — | WebAIM contrast: `#707070` against `#1a1a1f` and `#c8a86a` against `#0a0a0a` both ≥3.0:1 (carry-fwds #2 + #11) | **manual-only** (axe doesn't cover WCAG 1.4.11 per researcher Finding #4) | (manual: DevTools + https://webaim.org/resources/contrastchecker/) — document numbers in 06-01-SUMMARY.md | n/a (manual) | ⬜ pending |
| 06-02-01 | 02 | 0 | SEO-01 | T-06-04 / OWASP A05 | Per-route `<title>` + meta description present + unique + ≤160 chars | unit | `npx playwright test tests/metadata-per-route.spec.ts` | ❌ W0 | ⬜ pending |
| 06-02-02 | 02 | 0 | SEO-02, SEO-03 | T-06-08 / OWASP A05 | OG meta tags + image responds 200 + 1200×630 + content-type image/png on every route | integration | `npx playwright test tests/og-images-render.spec.ts` | ❌ W0 | ⬜ pending |
| 06-02-03 | 02 | 0 | SEO-04a | — | sitemap.xml serves expected route list (content-type `application/xml`, valid XML) | unit | `npx playwright test tests/sitemap-renders.spec.ts` | ❌ W0 | ⬜ pending |
| 06-02-04 | 02 | 0 | SEO-04b | — | robots.txt allows all + references sitemap URL | unit | `npx playwright test tests/robots-renders.spec.ts` | ❌ W0 | ⬜ pending |
| 06-02-05 | 02 | 0 | SEO-05 | T-06-06 / OWASP A05 | Person JSON-LD valid (parse), `@type === 'Person'`, `sameAs` matches `data/site.ts.socials` values, NO YT URL per scope amendment | unit | `npx playwright test tests/jsonld-person.spec.ts` | ❌ W0 | ⬜ pending |
| 06-02-06 | 02 | 0 | SEO-05 | — | Person JSON-LD passes Google Rich Results Test (no errors) | **manual-only** | (manual: https://search.google.com/test/rich-results?url=<preview>/) — document outcome in 06-02-SUMMARY.md | n/a (manual) | ⬜ pending |
| 06-02-07 | 02 | 0 | SEO-06 | — | Each route's `<link rel="canonical">` href matches expected (`/` → `https://braehods.com/`, etc.) | unit | `npx playwright test tests/canonical-urls.spec.ts` | ❌ W0 | ⬜ pending |
| 06-02-08 | 02 | 0 | SEO-08 | — | 404 route returns 404 status + renders Nav + monogram + Fraunces "Page not found" heading + "← Back home" link with full chrome (D-05) | integration | `npx playwright test tests/not-found-renders.spec.ts` | ❌ W0 | ⬜ pending |
| 06-02-09 | 02 | 0 | SEO-09 | T-06-04 / OWASP A05 | `X-Robots-Tag: noindex` on preview-URL response headers; locally `test.skip` when baseURL doesn't include `vercel.app` | integration (HTTP header) | `PLAYWRIGHT_BASE_URL=<preview> npx playwright test tests/preview-noindex.spec.ts` | ❌ W0 (preview-gated) | ⬜ pending |
| 06-02-10 | 02 | 0 | (Cat D helper) | — | `tests/helpers/live-url.ts` exports `liveUrl(page)` wrapper (created in Plan 06-01 T04; reused here) | source assertion | `grep -E "export.+liveUrl" tests/helpers/live-url.ts` | ❌ W0 (Plan 06-01 owns creation) | ⬜ pending |
| 06-02-11 | 02 | 1 | PERF-01 | — | Lighthouse Mobile (chromium-mobile project) ≥95 Perf+A11y+BestPractices+SEO on `/`, `/about`, `/work` | integration | `PLAYWRIGHT_BASE_URL=<preview> npx playwright test tests/lighthouse.spec.ts --project=chromium-mobile` | partial (spec exists, threshold=0; W0 bumps to 95 + parametrizes 3 routes) | ⬜ pending |
| 06-02-12 | 02 | 1 | PERF-02 | — | Lighthouse Desktop (chromium-desktop project) ≥95 same 4 categories | integration | same with `--project=chromium-desktop` | partial (same spec, separate project) | ⬜ pending |
| 06-02-13 | 02 | 1 | PERF-03 | — | First-page bundle ≤50KB gz excluding ContactModal chunk | one-shot integration (NOT spec — doc'd in SUMMARY); researcher Pivot #1 = `next experimental-analyze` (Turbopack-native) | `npx next experimental-analyze --output && node scripts/measure-first-page-bundle.mjs` | ❌ optional script in W0 | ⬜ pending |
| 06-02-14 | 02 | 1 | A11Y-01 | — | Keyboard tab order logical on `/`, `/about`, `/work` (manual walk) + axe-core no critical violations | manual-only + smoke | manual walk + `npx playwright test tests/contrast.spec.ts` (axe-driven) | partial (axe spec exists from Phase 1+) | ⬜ pending |
| 06-02-15 | 02 | 1 | A11Y-04 | — | All images have meaningful alt or `alt=""` for decorative | unit (axe `image-alt` rule already covers) | covered by `tests/contrast.spec.ts` (axe runs on all 3 routes) | partial (axe rule covers) | ⬜ pending |
| 06-02-16 | 02 | 1 | A11Y-07 | — | 200% zoom + 320px viewport no horizontal scroll on `/`, `/about`, `/work` | **manual-only** | (manual: DevTools mobile emulation 320×568 + browser zoom 200%) | n/a (manual) | ⬜ pending |
| 06-02-17 | 02 | 1 | (NVDA + VO audit) | T-06-03 / WCAG dialog | NVDA (Windows) + VoiceOver (iOS Safari) walks on `/`, `/about`, `/work` + ContactModal open/submit | **manual-only** (D-12) | (manual: NVDA installed locally; VO iOS on physical device) — document in 06-02-SUMMARY.md | n/a (manual) | ⬜ pending |
| 06-03-01 | 03 | 0 | — | — | `data/projects.ts` archived-braehods href = `https://github.com/bwaeden/braehods` (D-16) — single-line edit BEFORE DNS flip | source assertion + unit | `grep -E "github\.com/bwaeden/braehods" data/projects.ts` returns match; `tests/work-grid-renders.spec.ts` still GREEN | ✅ (data/projects.ts exists, 1-line edit) | ⬜ pending |
| 06-03-02 | 03 | 1 | LNCH-01 | T-06-07 / OWASP A09 | `braehods.com` + `www.braehods.com` added to Vercel project Domains; SSL "Valid" status confirmed BEFORE CNAME flip (D-13) | **manual-only** (Vercel dashboard) | (manual: Vercel dashboard → braeden-site → Domains; wait for "Valid" status) | n/a (manual) | ⬜ pending |
| 06-03-03 | 03 | 1 | LNCH-01 | — | CNAME at registrar flipped to `cname.vercel-dns.com` (or apex A `76.76.21.21`); DNS propagation verified | **manual-only** (registrar) | (manual: `dig braehods.com +short` shows Vercel IPs) | n/a (manual) | ⬜ pending |
| 06-03-04 | 03 | 1 | LNCH-01 | — | `https://braehods.com` returns 200 + new site content; valid SSL cert | integration | `curl -sI https://braehods.com` → `HTTP/2 200` + `cf-cache-status` absent (or Vercel-equivalent) | n/a (post-prop external) | ⬜ pending |
| 06-03-05 | 03 | 1 | LNCH-04 | — | Real-device test: iPhone Safari + Android Chrome smoke walk on `https://braehods.com` | **manual-only** (D-12 + LNCH-04) | (manual: physical-device walk through `/` + `/about` + `/work` + ContactModal submit) | n/a (manual) | ⬜ pending |
| 06-03-06 | 03 | 1 | LNCH-04 | — | Real Formspree submission from `https://braehods.com` (NOT preview) → real email at `fakegoat1@gmail.com` | **manual-only** | (manual: submit form on prod URL) | n/a (manual) | ⬜ pending |
| 06-03-07 | 03 | 1 | LNCH-04 | — | OG validation: paste `https://braehods.com` URL in iMessage / Slack / LinkedIn / X — preview renders correct 1200×630 OG image with title in site typography | **manual-only** | (manual: paste-and-screenshot in each platform) — document in 06-03-SUMMARY.md | n/a (manual) | ⬜ pending |
| 06-03-08 | 03 | 1 | LNCH-02 | — | Old `bwaeden/braehods` GitHub Pages repo archived (D-15) | **manual + CLI** | `gh repo archive bwaeden/braehods` OR GitHub UI "Archive this repository" | n/a (GH CLI/UI) | ⬜ pending |
| 06-03-09 | 03 | 1 | LNCH-03 | — | GitHub profile site link + IG bio + YT About all point at `braehods.com` (LNCH-03) | **manual-only** | (manual: edit each profile; user-driven, planner does NOT auto-edit external services) | n/a (manual) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

### Plan 06-01 W0 (spec fixes — 22 inherited failures + 1 new helper)
- [ ] `tests/helpers/live-url.ts` — D-06 Category D `liveUrl(page) => page.evaluate(() => window.location.href)` wrapper
- [ ] Update `tests/contact-modal-opens-from-nav.spec.ts`, `contact-modal-opens-from-about.spec.ts`, `contact-modal-esc-closes.spec.ts`, `contact-modal-states.spec.ts`, `contact-modal-honeypot.spec.ts`, `contact-modal-min-time.spec.ts`, `contact-modal-mailto-fallback.spec.ts` — Cat A mobile-viewport detection + `<details>` open before clicking Contact (**atomic single commit per D-07**)
- [ ] Update `tests/contact-modal-states.spec.ts` — Cat B mailto arrow `:text-is("→")` via `::after` content + Cat C `role="alert"` assertion on error region
- [ ] Update `tests/contact-modal-esc-closes.spec.ts` — Cat D `page.url()` → `await liveUrl(page)`
- [ ] `components/contact/ContactModal.tsx` source — Cat B implement CSS `::after { content: "→" }` on mailto link + Cat C add `role="alert"` to error `aria-live` region
- [ ] Plan 06-01 W0 also fixes the **7 pre-existing `/`-route failures** (carry-forward #6) — lighthouse, photo-lcp, no-bare-outline-none specs need preview-URL gating or threshold revision (researcher Open Question #5)

### Plan 06-02 W0 (8 new SEO specs RED-first + Lighthouse threshold update)
- [ ] `tests/sitemap-renders.spec.ts` — SEO-04a
- [ ] `tests/robots-renders.spec.ts` — SEO-04b
- [ ] `tests/og-images-render.spec.ts` — SEO-02 + SEO-03
- [ ] `tests/jsonld-person.spec.ts` — SEO-05
- [ ] `tests/not-found-renders.spec.ts` — SEO-08
- [ ] `tests/preview-noindex.spec.ts` — SEO-09 (preview-URL gated; `test.skip(!baseURL?.includes('vercel.app'))`)
- [ ] `tests/canonical-urls.spec.ts` — SEO-06
- [ ] `tests/metadata-per-route.spec.ts` — SEO-01
- [ ] Update `tests/lighthouse.spec.ts` — bump thresholds to 95 across Perf+A11y+BestPractices+SEO; parametrize over `/`, `/about`, `/work`; set `emulatedFormFactor` based on project name
- [ ] Optional `scripts/measure-first-page-bundle.mjs` — PERF-03 one-shot script reading `.next/diagnostics/analyze/client.html` (Turbopack output per researcher Pivot #1)

### Plan 06-03 W0 (pre-DNS-flip data edit only)
- [ ] `data/projects.ts` archived-braehods href update (single-line edit per D-16)

### Framework install
- [ ] Not needed — Playwright + axe-core + `playwright-lighthouse` already installed (`package.json` verified).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real Formspree end-to-end email delivery | CTCT-02 (deploy verify) | Requires real Vercel runtime + Formspree backend + email inbox check | Open preview URL, click Contact, fill form (test name + valid email + 50+ char message), wait ≥1500ms, submit. Within 2 min, email arrives at `fakegoat1@gmail.com` with subject "New braehods.com submission". Repeat on `braehods.com` post-DNS-flip. |
| 40-item visual checklist sweep | (all DSGN + HOME + ABOUT + WORK + CTCT carry-forwards) | Visual qualia not asserted by Playwright; D-08 single combined sweep | Walk `visual-checklist.md` (planner creates from `04-01-SUMMARY.md` + `05-03-SUMMARY.md` checklist sources, deduplicated). Check each item ✓/✗ + screenshot anything ✗. |
| 200% zoom + 320px viewport overflow | A11Y-07, LNCH-05 | Browser zoom and DevTools viewport emulation; Playwright `viewport` doesn't simulate zoom | DevTools → Toggle Device Toolbar → Responsive → 320×568. Browser → Ctrl+Shift+= until 200%. Verify no horizontal scroll on `/`, `/about`, `/work`, ContactModal open. |
| NVDA (Windows) screen-reader walk | A11Y-01, A11Y-03 (deploy verify) | NVDA is a separate process; no Playwright integration | Install NVDA (free, https://www.nvaccess.org/). Tab through `/`, `/about`, `/work`. Open ContactModal. Verify each interactive element announces purpose; modal announces dialog role + label; aria-live regions announce idle/submitting/success/error; error has appropriate alert urgency. |
| VoiceOver iOS Safari walk | A11Y-01, A11Y-03 | Requires physical iOS device | Open `<preview>` on iPhone Safari. Settings → Accessibility → VoiceOver on. Same walk as NVDA. Document any P0 bugs in 06-02-SUMMARY.md; cycle back to inline fix. |
| iOS Safari Pitfall 7 + 8 verify | (Phase 5 carry-fwd #9) | Pitfall 7 = input auto-zoom requires real iOS Safari rendering; Pitfall 8 = dvh viewport requires real iOS chrome | Open `<preview>` on iPhone Safari. Click each input field — verify NO auto-zoom (font-size ≥16px on all inputs). Check modal opens without dvh-vs-vh visual jump. |
| Person JSON-LD Google Rich Results Test | SEO-05 | Google's external validation service; no API surface for Playwright | Visit https://search.google.com/test/rich-results, paste preview URL, run test. Expect "Page is eligible for rich results" + Person detected with `sameAs` array. Screenshot result. |
| OG validation in iMessage / Slack / LinkedIn / X | SEO-02, LNCH-04 | External platform OG rendering — no automation surface | Post `<preview>/` and `<preview>/about` and `<preview>/work` in each platform. Verify 1200×630 thumbnail + correct title + monogram-on-charcoal aesthetic. Document in 06-02-SUMMARY.md. |
| Vercel domain add + SSL staging | LNCH-01 | Vercel dashboard external; SSL provisioning is async | Vercel dashboard → braeden-site → Domains → Add `braehods.com` + `www.braehods.com`. Wait for SSL "Valid" status (typically <5 min). DO NOT flip CNAME until both show Valid. |
| DNS CNAME flip at registrar | LNCH-01 | Registrar UI external | Registrar (TBD — user knows) → DNS settings → braehods.com → CNAME `@` → `cname.vercel-dns.com` (or apex A `76.76.21.21` if registrar lacks apex CNAME). Save. `dig braehods.com +short` should show Vercel IPs within ~5-10 min. |
| iPhone Safari + Android Chrome real-device | LNCH-04 | Physical devices required | Open `https://braehods.com` on iPhone Safari + Android Chrome. Walk Nav → About → Work → ContactModal. Submit real form. Verify no horizontal scroll, all CTAs work, real email arrives. |
| Old `bwaeden/braehods` archive | LNCH-02 | GitHub UI/CLI external action | `gh repo archive bwaeden/braehods` (preferred — CLI, no confirmation prompt) OR GitHub UI Settings → "Archive this repository". Confirms in 06-03-SUMMARY.md. |
| GH / IG / YT bio link updates | LNCH-03 | User-owned external accounts; planner does NOT auto-edit | User logs into each platform, updates bio/profile link to `https://braehods.com`. Document timestamps in 06-03-SUMMARY.md. |
| WebAIM contrast on `#707070` + `#c8a86a` | (carry-fwds #2 + #11) | axe-core covers WCAG 1.4.3 (4.5:1 body text) only — NOT 1.4.11 (3:1 graphical/UI) per researcher Finding #4 | DevTools color picker → pick `#707070` on archived dot, then on `#1a1a1f` body background. Paste both into https://webaim.org/resources/contrastchecker/. Verify ratio ≥3.0:1. Repeat for `#c8a86a` on `#0a0a0a`. Document numeric ratios in 06-01-SUMMARY.md. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify OR Wave 0 dependencies OR explicit Manual-Only entry above
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (manual-only items are explicitly flagged + cycle back to inline fix on failure)
- [ ] Wave 0 covers all MISSING references (8 new SEO specs + Cat D helper + lighthouse.spec.ts revision + bundle-measurement script)
- [ ] No watch-mode flags (suite always one-shot exit-coded)
- [ ] Feedback latency: <30s quick / <5min full local / <9min preview
- [ ] `nyquist_compliant: true` (set in frontmatter once planner approves the task verification map above)

**Approval:** pending

---

## Notes for Planner

Two pivots from researcher Findings #1 and #2 that the planner SHOULD apply when generating PLAN.md files:

- **Pivot #1 (D-11 revision):** `@next/bundle-analyzer` is incompatible with Turbopack (Next 16 default). Use `npx next experimental-analyze --output` (Next 16.1, Turbopack-native) instead. Zero devDeps. Task 06-02-13 above reflects this.
- **Pivot #2 (D-09 collapse):** `<Analytics />` + `<SpeedInsights />` are already mounted in `app/layout.tsx` lines 22-23. Task 06-01-06 reduces from "mount + install" to "verify already mounted + verify analytics endpoint hit on preview deploy".

Researcher Open Question #5 (404 Lighthouse exclusion): Lighthouse spec should only assert on `/`, `/about`, `/work` (NOT 404) per PERF-01 wording. Planner should verify the spec's route parametrization matches.
