# Phase 6: Polish + SEO + Launch - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `06-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-05-19
**Phase:** 6-polish-seo-launch
**Mode:** `--auto` — Claude selected recommended option for every gray area; no interactive prompts.
**Areas discussed:** Plan Structure, SEO Implementation, Spec Fix Sequencing, Audit + Visual Verification, Launch Sequencing, Asset Replacement, Preview noindex

---

## Plan Structure (how to split 30+ items)

| Option | Description | Selected |
|--------|-------------|----------|
| One monolithic plan | All 30+ items in a single PLAN.md | |
| Two plans | (deploy + cleanup + audits) + (launch) | |
| **Three plans** | (deploy + cleanup) + (audits) + (launch) — handoff recommendation | ✓ |
| Four+ plans | finer split per concern (deploy / spec-cleanup / audits / launch) | |

**Auto-selected:** Three plans
**Rationale:** `.planning/.continue-here.md` § context explicitly recommends 3 plans, citing scope-discussion benefit. Phase 4 hit the 5-task BLOCKER threshold and was forced to split — same risk here with 30+ items in one plan. Three plans give each a clean exit gate (deployable preview / audit reports / production live URL) and a per-plan SUMMARY.md.

---

## SEO Implementation (OG, JSON-LD, sitemap, 404)

| Option | Description | Selected |
|--------|-------------|----------|
| Static OG per route | 4 hand-tuned 1200×630 PNGs at build time | |
| Dynamic OG everywhere | `@vercel/og` for all routes | |
| **Hybrid (static `/` + dynamic others)** | locked by REQUIREMENTS § SEO-03 | ✓ |

**Auto-selected:** Hybrid
**Rationale:** SEO-03 verbatim: "Dynamic OG image generation via `@vercel/og` — renders page title in site typography on charcoal background; static fallback for `/`." Locked, no real choice.

| JSON-LD `sameAs` scope | | |
|--------|-------------|----------|
| **GH + IG only** | matches `data/site.ts.socials` + `02-SCOPE-AMENDMENT.md` | ✓ |
| GH + IG + YT placeholder | adds 404-prone YT URL | |
| GH + IG + LinkedIn | LinkedIn URL not on file | |

**Auto-selected:** GH + IG only
**Rationale:** YouTube was dropped from v1; adding a 404-prone YT sameAs URL is anti-credibility. No LinkedIn in `data/site.ts`. Single source consumed from `data/site.ts.socials`.

| Sitemap | | |
|--------|-------------|----------|
| Static route list | manual 4 entries | |
| **Dynamic, iterates `content/`** | locked by SEO-04 | ✓ |
| Hybrid | manual + auto-extend | |

**Auto-selected:** Dynamic
**Rationale:** SEO-04 verbatim: "sitemap iterates the content folder so future /writing routes get added free."

| 404 page chrome | | |
|--------|-------------|----------|
| Centered monogram + heading + link (no chrome) | bare | |
| **Full chrome (Nav + Footer) + monogram + text + link** | maintains identity on miss | ✓ |
| Bare monogram + link only | no chrome, no heading | |

**Auto-selected:** Full chrome
**Rationale:** `app/not-found.tsx` renders inside root layout — chrome comes for free. Preserves editorial-dark consistency on a miss.

---

## Spec Fix Sequencing (22 Categories A–D failures)

| Option | Description | Selected |
|--------|-------------|----------|
| **Fix all 22 inline in Plan 06-01 W0 before deploy** | deploy gate = "preview clean" is meaningful | ✓ |
| Deploy first, fix specs against real preview | adds noise to deploy gate | |
| Fix A+B inline, defer C+D to post-deploy | partial; muddies the exit criteria | |

**Auto-selected:** Fix all inline
**Rationale:** Per `05-checkpoint-state.md`, all 4 categories are pure source/spec edits — none need runtime preview data. Sequencing them BEFORE deploy makes Plan 06-01's exit gate ("preview is clean") an unambiguous binary.

| Category D fix approach | | |
|--------|-------------|----------|
| **`await page.evaluate(() => window.location.href)`** | handoff #14 definitive fix; reusable helper | ✓ |
| `page.waitForURL()` | doesn't help after `replaceState` | |
| Hybrid context-dependent | inconsistent | |

**Auto-selected:** evaluate
**Rationale:** Playwright caches the frame URL; `replaceState` doesn't fire a navigation. Live `window.location.href` from browser context is the truth. Pattern extracted to `tests/helpers/live-url.ts` for any future hash-driven UI.

---

## Audit + Visual Verification

| Visual checklist scope | | |
|--------|-------------|----------|
| **Single combined 40-item sweep** | dedup'd P4 28 + P5 12 | ✓ |
| Separate, two passes | duplicates effort on overlapping items | |
| Combine + augment with Lighthouse (50+ items) | conflates audit + visual | |

**Auto-selected:** Single combined sweep
**Rationale:** P4 + P5 checklists overlap heavily (mobile rendering, modal interaction, contact submit). Lives at `.planning/phases/06-polish-seo-launch/visual-checklist.md`.

| Speed Insights + Analytics install timing | | |
|--------|-------------|----------|
| **Plan 06-01 W1 (before first preview)** | preview deploys generate Web Vitals data for audit | ✓ |
| Plan 06-02 with other PERF work | misses preview-phase data | |
| Plan 06-03 production only | no audit-phase data | |

**Auto-selected:** Plan 06-01 W1
**Rationale:** Both packages already in `package.json`, NOT mounted. Mount in W1 so Plan 06-02 audit has real-user signal to cross-reference against synthetic Lighthouse.

| Lighthouse audit scope | | |
|--------|-------------|----------|
| **3 routes × 2 form factors = 6 audits** | per REQUIREMENTS § PERF-01/02 | ✓ |
| All 4 routes (incl. `/work/[slug]`) | slug route not built (reserved) | |
| Mobile only | misses desktop PERF-02 | |

**Auto-selected:** 3 × 2 = 6 audits
**Rationale:** `/work/[slug]` is reserved-not-built per WORK-05. 404 implicit; skipped per D-05.

| PERF-03 bundle measurement | | |
|--------|-------------|----------|
| **`@next/bundle-analyzer` one-shot devDep** | measure-then-uninstall | ✓ |
| Permanent dep | analyzer is a measurement tool, not runtime | |
| Vercel build output stats | less granular per-chunk view | |

**Auto-selected:** One-shot bundle-analyzer
**Rationale:** Measure, document, remove. Analyzer is not a runtime concern.

| Screen-reader audit | | |
|--------|-------------|----------|
| **NVDA + VoiceOver iOS** | user-Windows + audience-iOS | ✓ |
| NVDA only | misses iOS Safari audience | |
| All three (NVDA + VO iOS + JAWS) | JAWS paid, niche overlap with NVDA | |

**Auto-selected:** NVDA + VoiceOver iOS
**Rationale:** Audience-likely SRs. JAWS skipped per cost/overlap.

---

## Launch Sequencing (DNS, Archive, Production Gates)

| DNS swap order | | |
|--------|-------------|----------|
| **Add Vercel domain FIRST, confirm SSL, THEN flip CNAME** | locked by LNCH-01 | ✓ |
| Flip CNAME first | breaks SSL during propagation | |
| Stage on Vercel alias before swap | extra step, no benefit | |

**Auto-selected:** Vercel-first
**Rationale:** LNCH-01 verbatim: "DNS swap performed in correct order (add domain to Vercel before swapping CNAME so SSL stages)."

| Production deploy gate strictness | | |
|--------|-------------|----------|
| **Strict: specs GREEN + Lighthouse 95+ + visual sweep + real Formspree email + bundle ≤50KB** | full battery | ✓ |
| Skip Formspree email verify, defer to post-launch | risks silent prod-form-break | |
| Specs + Lighthouse only | misses real-user form & visual confidence | |

**Auto-selected:** Strict (all five)
**Rationale:** Core value depends on contact form working. Real-email gate is the single highest-stakes signal.

| Old `bwaeden/braehods` repo | | |
|--------|-------------|----------|
| **Archive (read-only)** | LNCH-02 satisfied | ✓ |
| 301 redirect via meta refresh | yak-shave, low traffic value | |
| Archive + 301 redirect | both | |

**Auto-selected:** Archive
**Rationale:** DNS flip moves the real traffic. `bwaeden.github.io/braehods` is unlikely to be a shared URL. Defer redirect to v1.x if Analytics shows referral traffic.

| Archived braehods href in `data/projects.ts` | | |
|--------|-------------|----------|
| **`https://github.com/bwaeden/braehods` (archived repo)** | canonical, stable | ✓ |
| Wayback Machine snapshot | brittle URL, screenshot may be unflattering | |
| Remove the card | loses breadth-of-projects signal | |

**Auto-selected:** Archived repo URL
**Rationale:** GH-archive URL doesn't expire and reads as "actual previous version's source." Single-line edit lands BEFORE DNS flip so the new site never serves a self-loop link.

---

## Asset Replacement (Monogram + Photo)

| Option | Description | Selected |
|--------|-------------|----------|
| **Defer monogram + photo swap to v1.x** | ship v1 with current Fraunces-traced monogram + `public/portrait.jpg` | ✓ |
| Block production deploy until new monogram + new photo | adds out-of-band designer/shoot work to launch | |
| Ship v1.0 placeholder + open v1.0.1 follow-up tracker | overlap with option 1 in practice | |

**Auto-selected:** Defer to v1.x
**Rationale:** Monogram is a real Fraunces v38 Black "B" glyph — tasteful, intentional, not a placeholder-as-shame. Photo is explicitly placeholder-acceptable per PROJECT.md "Out of Scope (v1)." Replacing both would require out-of-band designer/portrait work that doesn't belong in a launch phase.

---

## Preview noindex Implementation

| Option | Description | Selected |
|--------|-------------|----------|
| **`proxy.ts` (Next 16 middleware rename)** with conditional `X-Robots-Tag` | edge-runtime, version-controlled, clean | ✓ |
| `next.config.ts` `headers()` | can't easily distinguish preview at config time | |
| Vercel dashboard Deployment Protection | out-of-repo, un-versioned | |
| Meta robots in root layout (conditional) | pollutes HTML; same env check happens at runtime anyway | |

**Auto-selected:** `proxy.ts`
**Rationale:** CLAUDE.md confirms Next 16 renamed `middleware.ts` → `proxy.ts`. Legitimate `proxy.ts` use case. Runs at the edge, not client-side — no `'use client'` boundary leak (FOUND-07 preserved).

---

## Claude's Discretion

These are sub-implementation details deferred to planner / executor against existing convention:

- Exact filenames for OG image route segments (Next App Router convention is `opengraph-image.tsx` adjacent to `page.tsx` — no real flexibility)
- Specific JSON-LD shape beyond Person + sameAs (whether to add `jobTitle`, `worksFor`, `alumniOf` — minimal Person + sameAs is canonical)
- Whether to add `BreadcrumbList` JSON-LD to /about, /work — not in REQUIREMENTS; v1.x SEO polish
- Exact 404 page copy beyond what D-05 specifies — anchored to editorial-restrained-but-warm
- `next/og` font weight count (Fraunces 700 only vs 700+400) — minimize fetched bytes
- 3 GH URL real-link verifications (carry-forward #3) — manual curl vs spec; manual fine, document in 06-01-SUMMARY.md
- `STATUS_DOT_COLOR` `@theme` promotion timing (carry-forward #5) — deferred entirely; only triggers if 3rd consumer appears
- Bio-link update copy for GH/IG/YT profiles (LNCH-03) — user-driven, planner does NOT auto-edit external services

## Deferred Ideas

Captured during decision logging; not in Phase 6 scope:

- Designed monogram swap (Phase 1 D-01 designer-pass) — v1.x
- Final portrait shoot — v1.x (PROJECT.md "Out of Scope")
- 301 redirect from old `bwaeden.github.io/braehods` — v1.x if referral traffic appears
- `STATUS_DOT_COLOR` `@theme` promotion — only if 3rd consumer appears
- `BreadcrumbList` JSON-LD — v1.x SEO polish
- `view-transition-name: contact-modal` card-to-modal seam — v1.x or v2
- 404 page OG image — anti-credibility; defer indefinitely
- Form analytics (open-rate, abandon-rate) — v1.x
- `hi@braehods.com` public email alias — v1.x post-launch (Phase 5 D-15a informational)
- `/now` page — v2
- Velite migration — v2 (when post count crosses 10-15)
- `/writing` route — v2 (WRIT-01..04)
- Light-mode toggle — v2 (LITE-01)
- JAWS screen-reader audit — v1.x if accessibility feedback warrants
