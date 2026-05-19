# Phase 6: Polish + SEO + Launch - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning
**Mode:** `--auto` — gray areas auto-selected with recommended defaults; every selection logged below for audit.

<domain>
## Phase Boundary

Phase 6 is the **last phase before v1 launch of braehods.com**. It closes every quality bar in PROJECT.md (Lighthouse 95+, WCAG AA, OG/JSON-LD/sitemap, DNS swap) AND absorbs the 16 carry-forwards deliberately deferred from Phases 4 + 5, AND drains the 4 spec-failure categories inherited from Plan 05-01 spec design + Plan 05-02 implementation gaps. Phase 6 is the funnel for **everything that needs a deployed preview or a real-user signal to verify**.

**In scope (Phase 6 — 20 requirements + 16 carry-forwards + 4 spec categories + 4 own-ownership items):**

**Phase 6's own 20 requirements (from ROADMAP.md):**
- SEO: `app/sitemap.ts` + `app/robots.ts` + per-route `generateMetadata` (title/description/canonical) + Person JSON-LD + dynamic `@vercel/og` images + branded `app/not-found.tsx` + `X-Robots-Tag: noindex` on preview deploys (SEO-01..06, SEO-08, SEO-09)
- A11Y: keyboard-only walk-through verification + alt text audit + 200% zoom verification (A11Y-01, A11Y-04, A11Y-07)
- PERF: Lighthouse 95+ on mobile + desktop across `/`, `/about`, `/work` + bundle ≤50KB gz excluding contact island + Speed Insights install + measurement (PERF-01, PERF-02, PERF-03, PERF-05)
- LNCH: Vercel domain config + DNS swap + GitHub Pages archive + bio-link updates + post-launch real-device + Formspree + OG validation checklist + 320px overflow verify (LNCH-01..05)

**Phase 4 carry-forwards (6 items, from `04-01-SUMMARY.md` § Phase 6 Carry-Forwards):**
1. Manual Vercel deploy + Playwright-against-preview + 28-item Phase 4 visual checklist on deployed preview
2. WebAIM contrast measurement on `#707070` archived-project dot against `#1a1a1f` background
3. 3 placeholder GitHub repo URL real-link verification (`prediction-market-bot`, `no-more-short-form`, `mc-packet-client`) — flag 404s
4. Archived braehods href post-DNS-swap target decision
5. `STATUS_DOT_COLOR` `@theme` promotion (if status badges propagate beyond ProjectCard)
6. 7 pre-existing `/`-route Phase 1 spec failures (lighthouse, photo-lcp, no-bare-outline-none) — addressable post-CDN-deploy

**Phase 5 carry-forwards (10 items, from `05-03-SUMMARY.md` § Phase 6 Carry-Forwards):**
7. Real Formspree end-to-end email delivery verification (real submit → `fakegoat1@gmail.com` via preview)
8. 12-item Phase Exit Visual Verification walkthrough on deployed preview
9. Real-device iOS Safari verification (Pitfall 7 auto-zoom + Pitfall 8 dvh viewport)
10. Screen-reader manual audit (NVDA + VoiceOver) on the 2 `aria-live` regions
11. WebAIM contrast measurement on `#c8a86a` against `#0a0a0a` (2nd consumer; 3rd consumer would trigger `@theme` promotion)
12. PERF-03 first-page bundle size measurement (ContactModal+useForm chunk ≤50KB target)
13. The 22 cross-project spec failures (chromium-desktop 9/17 + Pixel 5 3/17) across Categories A–D — see Spec Fix § below

**Phase 6's own-ownership cleanup (4 items, from `.planning/.continue-here.md`):**
14. Delete `app/%5Ftokens/` URL-encoded folder (Next App Router private-folder workaround from Phase 1)
15. Final favicon + `icon.svg` pass replacing the Fraunces-Black-traced placeholder monogram (D-01 from Phase 1) — **DEFERRED to v1.x per D-06**
16. Replace `public/portrait.jpg` placeholder portrait with final asset (correcting `.continue-here.md` ref to `images/photo.jpg` — that was the OLD braehods repo path) — **DEFERRED to v1.x per D-06**
17. DNS migration to `braehods.com` + archive of old `bwaeden/braehods` GitHub Pages repo

**Out of scope (Phase 6 — deferred indefinitely or to v1.x):**
- New portrait shoot (out-of-band per PROJECT.md "Out of Scope (v1)"; placeholder ships)
- Designed monogram refresh (Phase 1 D-01 designer-pass deferred to v1.x per D-06 below)
- Light-mode tokens for OG image or 404 page (v1 dark-only)
- `/writing` route (v2 — sitemap iterates `content/` so it auto-extends free)
- Cookie consent banner (Vercel Analytics is cookieless)
- 301 redirect from old `bwaeden.github.io/braehods` to braehods.com (archive-only per D-07; redirect is v1.x polish)
- `STATUS_DOT_COLOR` `@theme` promotion (carry-forward #5 — only triggers if a 3rd consumer appears; v1 ships 2 consumers, defer)
- v2 `view-transition-name: contact-modal` card-to-modal seam (Phase 5 D-17 informational reservation)

</domain>

<decisions>
## Implementation Decisions

### Area 1: Plan Structure (how to split 30+ items)

- **D-01:** Phase 6 splits into **3 plans** (Plan 6.1 deploy + cleanup, Plan 6.2 audits, Plan 6.3 launch). `[auto]` Selected: "Three plans" (recommended per `.planning/.continue-here.md` § context). One monolithic plan would exceed the 5-task BLOCKER threshold seen in Plan 4 (which checker forced into a 2-plan split); 3 plans gives each plan a clear scope boundary (deployable preview / audit reports / production live URL), each with its own atomic-commit + SUMMARY.md exit. The 3 plans:
  - **Plan 06-01 — Deploy + spec/component cleanup**: ship to Vercel preview; fix all 22 Categories A–D spec failures inline before deploy; fix the 7 pre-existing `/`-route failures (carry-forward #6); delete `app/%5Ftokens/` (#14); install Speed Insights + Analytics if not wired; real Formspree submit verify; combined 40-item visual checklist (28 P4 + 12 P5 dedup'd); 3 GitHub URL real-link verify (#3); WebAIM contrast on `#707070` + `#c8a86a` (#2 + #11). **Exit:** clean preview URL with all specs GREEN on both projects + real email arrives + visual sweep clean.
  - **Plan 06-02 — A11Y + PERF + SEO audit**: Lighthouse 95+ pass on `/`, `/about`, `/work` mobile + desktop (PERF-01, PERF-02); PERF-03 bundle measurement; screen-reader audit (#10); 200% zoom verify; 320px overflow verify; `@vercel/og` dynamic OG images + static `/` fallback (SEO-02, SEO-03); per-route `generateMetadata` (SEO-01, SEO-06); Person JSON-LD with GH+IG sameAs (SEO-05); `app/sitemap.ts` iterating `content/` (SEO-04); `app/robots.ts` (SEO-04); branded `app/not-found.tsx` (SEO-08); `proxy.ts` setting `X-Robots-Tag: noindex` on preview (SEO-09). **Exit:** Lighthouse + axe scores published; all SEO surfaces live on preview; archived braehods href decided (#4).
  - **Plan 06-03 — Launch**: archived braehods href finalized; add `braehods.com` + `www.braehods.com` to Vercel domain settings (LNCH-01 SSL stages BEFORE CNAME flip); flip DNS CNAME; smoke test on real `braehods.com`; iOS Safari + Android Chrome real-device test (#9, LNCH-04); update GitHub profile + IG bio + YT About bio links (LNCH-03); archive `bwaeden/braehods` GitHub Pages repo (LNCH-02, #17). **Exit:** braehods.com serves new site over HTTPS; old repo archived; bios updated; v1 shipped.

### Area 2: SEO Implementation

- **D-02:** OG image strategy = **hybrid (locked by SEO-03)**. `[auto]` Selected: "Hybrid — `@vercel/og` dynamic for `/about`, `/work`, `/work/[slug]`-reserved, `404`; static 1200×630 PNG fallback for `/`". REQUIREMENTS § SEO-03 literally states "static fallback for `/`". The `/` route is the homepage — most-shared, deserves a hand-tuned static image with Fraunces "Braeden" wordmark + monogram on charcoal. All other routes get dynamic `@vercel/og` `ImageResponse` rendering the route title (Fraunces 700 ~96px, cool-white) on the charcoal gradient + grain. **Stack:** install **no new deps** — `next/og` is built into Next 16. Fonts loaded via `fetch()` of self-hosted Geist + Fraunces TTF (Fraunces from Google CDN, Geist from `geist` package). Lives in `app/[route]/opengraph-image.tsx` route segment files (Next App Router convention).

- **D-03:** Person JSON-LD `sameAs` = **GitHub + Instagram only**. `[auto]` Selected: GH + IG. YouTube was explicitly dropped from v1 per `02-SCOPE-AMENDMENT.md` (channels.ts is 1-entry, footer-socials assert IG+GH only with explicit `.toHaveCount(0)` guard against the YT aria-label). Adding a `sameAs` YT URL that 404s is anti-credibility and inconsistent with the rest of the site. LinkedIn — REQUIREMENTS § SEO-05 says "LinkedIn if available"; no LinkedIn URL is on file in `data/site.ts`, so omit. Single source: `data/site.ts.socials` (Phase 2 D-15). JSON-LD lives in `app/layout.tsx` as a `<script type="application/ld+json">` block (NOT a `<Script>` component — JSON-LD must be in initial HTML for crawlers).

- **D-04:** Sitemap = **dynamic, iterates `content/`** (locked by SEO-04). `[auto]` Selected: "Dynamic". `app/sitemap.ts` exports a `MetadataRoute.Sitemap` default function that combines a manual route list (`/`, `/about`, `/work`) with a glob of `content/*.mdx` (currently empty for v1; reserved for v2 `/writing`). `lastModified` derives from file `mtime` for MDX entries and from a single project commit date for static routes (or just `new Date()` build time — pragmatic for static routes that change at build time). `app/robots.ts` allows all crawlers + references the sitemap URL.

- **D-05:** Branded 404 = **full chrome (Nav + Footer) + centered monogram + heading + return link**. `[auto]` Selected: "Full chrome". `app/not-found.tsx` is rendered inside the root layout, so Nav + Footer come for free; explicitly preserving them keeps identity on a miss. Layout: monogram at ~80px (matches hero-secondary scale), Fraunces 700 "Page not found" heading (~48px), Geist Sans body line "Try `/about` or `/work` — or `Get in touch` if you were looking for me", a `CTAArrowLink href="/"` "← Back home" link. Tab order: chrome → monogram (decorative, `aria-hidden`) → return link → footer. Lighthouse 95+ on the 404 route is NOT required (REQUIREMENTS § PERF-01 lists `/`, `/about`, `/work`, `/work/[slug]` — 404 is implicit but acceptable to omit from the gate).

### Area 3: Spec Fix Sequencing (the 22 Category A–D failures)

- **D-06:** Fix all 22 spec failures **inline in Plan 06-01 Wave 0 (before deploy)**. `[auto]` Selected: "Fix all inline". Per `.planning/phases/05-contact-modal/.checkpoint-state.md` analysis, all 4 categories are pure source/spec edits — none require runtime preview data. Sequencing them BEFORE the deploy means Plan 06-01's exit gate ("preview is clean") is meaningful — otherwise the deploy would land on a known-RED state and the visual sweep would compete with the spec sweep for attention. Per-category fixes:
  - **Category A — 7 mobile-only spec failures** (viewport detection + `<details>` open before clicking Contact): refactor specs to detect `chromium-desktop` vs `Pixel 5` projects via `test.use({ viewport })` reads + open the mobile hamburger `<details>` element before clicking Contact. Pattern reusable for any future mobile-conditional click.
  - **Category B — mailto `→` arrow rendering**: implement CSS `::after { content: "→"; }` pseudo-element on the mailto link in `components/contact/ContactModal.tsx` so the arrow is content, not a Lucide icon (memory `reference_lucide_brand_icons.md` confirms Lucide dropped brand icons in 2024; arrow is a generic glyph but the `::after` pattern keeps the link a plain `<a>` and avoids a `'use client'` boundary leak). Spec asserts the rendered arrow via `getComputedStyle(el, '::after').content`.
  - **Category C — error region `role="alert"` + `aria-live="assertive"` + silent-success render-path audit**: add `role="alert"` to the error `aria-live` region in `ContactModal.tsx` (currently only `aria-live="assertive"`); audit the silent-bot-rejection render path to confirm no spurious success render fires (verify against `tests/contact-modal-honeypot.spec.ts` + `tests/contact-modal-min-time.spec.ts`).
  - **Category D — `page.url()` reads after `history.replaceState`**: replace ALL `page.url()` reads with `await page.evaluate(() => window.location.href)` in the affected specs (handoff item #14, definitive fix). Pattern: Playwright caches the frame URL at navigation events; `history.replaceState()` doesn't fire a navigation event, so the cached URL stays stale. The live `window.location.href` read from the browser context reflects the truth. **Add a custom helper** `tests/helpers/live-url.ts` exporting `liveUrl(page) => page.evaluate(() => window.location.href)` so the pattern is reusable for any future hash-driven UI.

- **D-07:** Spec category A fix MUST land in a **single atomic commit** per the Phase 5 D-05 atomic-binding pattern. The 7 affected specs share a single helper refactor (mobile-viewport detection + hamburger-open precondition); splitting across waves would leave intermediate spec states RED while half the helper exists. Plan-checker should reject any plan that puts category A across multiple commits.

### Area 4: Audit + Visual Verification Approach

- **D-08:** Visual verification = **single combined 40-item sweep** (28 Phase 4 + 12 Phase 5, deduplicated). `[auto]` Selected: "Combine". The two checklists overlap significantly (mobile rendering, modal interaction, contact submit) — running them separately would do the same scroll-through twice. Plan 06-01 Task N (last task before SUMMARY) walks a single dedup'd 40-item list against the preview URL. The merged checklist lives at `.planning/phases/06-polish-seo-launch/visual-checklist.md` (planner creates).

- **D-09:** Speed Insights + Vercel Analytics = **installed in Plan 06-01 Wave 1** (BEFORE first preview deploy). `[auto]` Selected: "Install in 06-01". Both packages are already in `package.json` (`@vercel/analytics@2.0.1` + `@vercel/speed-insights@2.0.0`) but their `<Analytics />` and `<SpeedInsights />` components are NOT yet mounted in `app/layout.tsx`. Mount them in Plan 06-01 W1 so the preview deploys (Plan 06-01 W2+) generate Web Vitals data the Plan 06-02 Lighthouse audit can cross-reference against synthetic Lighthouse scores. Adds ~2KB total to first-load JS (still well under the 50KB PERF-03 target).

- **D-10:** Lighthouse audit scope = **3 routes (`/`, `/about`, `/work`) × 2 form factors (mobile + desktop) = 6 audits**. `[auto]` Selected: "3 routes × 2 form factors". REQUIREMENTS § PERF-01 lists `/`, `/about`, `/work`, `/work/[slug]` — but `/work/[slug]` is REQ-WORK-05 reserved-not-built ("route `/work/[slug]` reserved but not built"). 404 is implicit but skipped per D-05. Lighthouse runs via existing `tests/lighthouse.spec.ts` infrastructure (Phase 1, currently RED on `/` local — Plan 06-02 W0 ports it to run against the preview URL via `BASE_URL` env var instead of `localhost`). Threshold: ≥95 on all 4 categories per audit. Failing audits surface ranked recommendations; Plan 06-02 owns the iteration loop until all 6 are GREEN.

- **D-11:** PERF-03 bundle measurement = **`@next/bundle-analyzer` one-shot** (no permanent dep add). `[auto]` Selected: "One-shot @next/bundle-analyzer". Install as devDep in Plan 06-02 W0, run `ANALYZE=true npm run build`, capture the first-page bundle size (excluding the ContactModal chunk per PERF-03 wording: "excluding contact modal client island"), document in `06-02-SUMMARY.md`. Uninstall after measurement (don't carry the dep) — analyzer is a measurement tool, not a runtime concern. The 50KB gz target is the gate; if first-page bundle exceeds 50KB, Plan 06-02 must identify what to defer/lazy-load.

- **D-12:** Screen-reader audit = **NVDA (Windows) + VoiceOver (iOS Safari)** manual walkthrough on the deployed preview. `[auto]` Selected: "NVDA + VoiceOver iOS". User is on Windows so NVDA is the natural desktop SR; VoiceOver iOS is the audience-likely mobile SR (recruiters/investors on iPhone are far more common than NVDA-on-Android in the target audience). JAWS skipped — paid, niche overlap with NVDA users. Walks: (1) tab through all 3 routes, verifying SR announces each link's purpose; (2) open ContactModal, verify dialog role + aria-labelledby + focus-trap announce; (3) submit form, verify both `aria-live` regions announce idle/submitting/success/error states; (4) trigger error path, verify the new `role="alert"` from D-06 Category C announces with appropriate urgency. Results documented in `06-02-SUMMARY.md`; any P0 SR bugs cycle back to inline source fix (NOT deferred to v1.x).

### Area 5: Launch Sequencing (DNS, Archive, Production Gates)

- **D-13:** DNS swap order = **add Vercel domain FIRST, confirm SSL stages, THEN flip CNAME** (locked by LNCH-01). `[auto]` Selected: "Vercel-first". Verbatim from LNCH-01: "DNS swap performed in correct order (add domain to Vercel before swapping CNAME so SSL stages)". Concrete sequence in Plan 06-03 W0:
  1. Vercel dashboard → braeden-site project → Domains → add `braehods.com` + `www.braehods.com`.
  2. Vercel auto-issues SSL via Let's Encrypt; wait for "Valid" status (typically <5 minutes).
  3. Briefly test the Vercel-provisioned domain (e.g., `braehods.com` resolves once SSL is staged — but DNS still points to GH Pages, so this test must use a `--resolve` curl flag or `/etc/hosts` override to verify before propagation).
  4. Update CNAME at registrar: `braehods.com` → `cname.vercel-dns.com` (or A record `76.76.21.21` if registrar doesn't support apex CNAMEs).
  5. Verify DNS propagation via `dig braehods.com +short` (expect Vercel IPs).
  6. Curl `https://braehods.com` — expect 200 + new site content.

- **D-14:** Production deploy gate = **strict, all of: (a) all specs GREEN on preview both projects (chromium-mobile + chromium-desktop + Pixel 5), (b) Lighthouse 95+ on all 6 audits (3 routes × 2 form factors), (c) 40-item visual checklist clean, (d) real Formspree email arrives at `fakegoat1@gmail.com` from a real preview submission, (e) bundle ≤50KB gz first-page**. `[auto]` Selected: "Strictest gate". Core value is "nice site" + "follow up with him" — both depend on the contact form working in production. The Formspree real-email check (d) is the single highest-stakes signal: a CDN/SSL/DNS issue could break form submission silently (Formspree endpoint hard-coded in client bundle reads `NEXT_PUBLIC_FORMSPREE_ID` — set in Vercel env Production scope per Phase 1 D-13, but worth verifying once with a real submit). The production deploy command itself is `vercel --prod` from the project root OR Vercel dashboard "Promote to Production" on the satisfied preview.

- **D-15:** Old `bwaeden/braehods` GitHub Pages repo handling = **archive (read-only) only — NO 301 redirect**. `[auto]` Selected: "Archive". LNCH-02 wording: "archived OR serves a 301 redirect stub". The DNS flip in D-13 itself moves traffic; the only remaining old-site URL is `bwaeden.github.io/braehods` (the GH Pages subdomain), which no one is likely sharing (the `braehods.com` CNAME masked it). Archiving = single GitHub setting flip ("Archive this repository") + adds a deprecation banner on the repo page. The redirect alternative would require either a `meta refresh` in the GH Pages HTML (still slow, anti-SEO) OR a GH Actions workflow (yak-shave). Defer 301 redirect to v1.x if anyone actually hits the old URL — Vercel Analytics on the new site will show referrer data if so.

- **D-16:** Archived braehods href target post-DNS-swap = **`https://github.com/bwaeden/braehods` (archived repo URL)**. `[auto]` Selected: "Link to archived repo on GitHub". The "archived braehods.com (v0)" project card in `data/projects.ts` currently links to `https://braehods.com` (the old URL). Post-DNS-swap, that URL serves the NEW site — so the archived card would be a self-link. Three options were on the table: (a) link to the archived GH repo, (b) link to a Wayback Machine snapshot, (c) remove the card entirely. Recommendation: (a) — the GitHub-archive URL is canonical, doesn't expire, and reads as "here's the actual previous version's source." Wayback snapshot is brittle (URL can change, screenshot may be unflattering). Card removal loses the breadth-of-projects signal. Plan 06-03 W0 makes the single-line edit to `data/projects.ts` immediately BEFORE the DNS flip so the new site never serves a self-loop link.

### Area 6: Asset Replacement Scope (Monogram + Photo)

- **D-17:** Monogram + photo replacement = **DEFERRED to v1.x — ship v1 with current Fraunces-traced placeholder monogram + `public/portrait.jpg`**. `[auto]` Selected: "Defer to v1.x". Two parts:
  - **Monogram:** Phase 1 D-01 documented "Phase 6 designer-pass (D-01) replaces with the final designed mark." But the existing monogram is NOT a geometric placeholder — it's a real Fraunces v38 Black "B" glyph traced via opentype.js (MD5 `360deacfd3f695e5cb4b2cae542a7c42`, byte-identical between `components/ui/MonogramMark.tsx` and `app/icon.svg` per D-04 single-source contract). It's tasteful, intentional, and ships the editorial-restrained aesthetic faithfully. A "designer pass" would be polish, not a launch-blocker. Defer to v1.x — track as a follow-up after v1 lives long enough to assess if anyone notices.
  - **Photo:** PROJECT.md "Out of Scope (v1)" literally lists "New portrait shoot — site is designed assuming a placeholder portrait (or current photo treated tastefully); new shoot happens out-of-band". The current `public/portrait.jpg` is the "current photo treated tastefully" path. v1 ships as-is.
  - Carry forward: track both in v1.x follow-up issues. If post-launch traffic data shows a high `/`-bounce rate that could be hero-photo-related, prioritize the photo swap; if not, the monogram polish lives indefinitely.

### Area 7: Preview noindex Implementation

- **D-18:** Preview deployment noindex = **`proxy.ts` (Next 16) with conditional `X-Robots-Tag` header**. `[auto]` Selected: "proxy.ts". CLAUDE.md notes: "`middleware.ts` → Renamed to `proxy.ts` in Next 16; old name deprecated." This IS one of the legitimate proxy.ts use cases. Logic:
  ```ts
  // proxy.ts
  import { NextResponse } from 'next/server';
  export function proxy() {
    const res = NextResponse.next();
    if (process.env.VERCEL_ENV === 'preview') {
      res.headers.set('X-Robots-Tag', 'noindex');
    }
    return res;
  }
  export const config = { matcher: '/((?!_next/static|_next/image|favicon|icon|images).*)' };
  ```
  Lives at `proxy.ts` in repo root (Next 16 convention). `VERCEL_ENV` is set by Vercel automatically — `'preview'` on PR/branch deploys, `'production'` on prod. Local dev (`VERCEL_ENV` unset) ships no header — also acceptable since `localhost` isn't crawled. Alternatives considered: `next.config.ts` `headers()` (can't easily distinguish preview at config-time without env var gymnastics); Vercel dashboard "Deployment Protection" (out-of-repo, un-versioned); meta robots tag in root layout with conditional render (same env-var-at-runtime check but pollutes HTML when proxy.ts can do it at the edge). **Note:** Phase 5's FOUND-07 carve-out doesn't apply — `proxy.ts` runs at the edge, not client-side; it's not a `'use client'` boundary leak.

### Claude's Discretion

These are sub-implementation details that don't move the gray-area needle; planner picks against existing convention:
- Exact filenames for OG image route segments (`app/about/opengraph-image.tsx` vs `app/about/og.tsx`) — Next App Router convention says `opengraph-image.tsx` lives next to `page.tsx`, no flexibility there
- Specific JSON-LD shape beyond Person + sameAs (whether to add `jobTitle`, `worksFor`, `alumniOf`) — minimal Person + sameAs is canonical; richer detail is v1.x polish
- Whether to add `BreadcrumbList` JSON-LD to /about, /work (one-step breadcrumbs from `/`) — not in REQUIREMENTS, v1.x candidate
- Exact wording on the 404 page beyond what D-05 specifies — anchored to editorial-restrained-but-warm register
- Specific `next/og` font weights (Fraunces 700 only vs 700+400 for OG body text) — defer to planner; minimize fetched font bytes
- Whether the 3 GitHub URL real-link verifications (#3) trigger spec or just manual curl — spec is reusable but the URLs themselves are stable; manual curl is fine, document in `06-01-SUMMARY.md`
- `STATUS_DOT_COLOR` `@theme` promotion timing (carry-forward #5) — defer entirely; only triggers if a 3rd consumer appears in v1.x
- Bio-link update copy for GH/IG/YT profiles (LNCH-03) — user-driven, planner does NOT auto-edit external services

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner) MUST read these before planning or implementing.**

### Project + Requirements
- `.planning/PROJECT.md` — Core value ("nice website" #1, "follow up with him" #2 — anchors every Phase 6 trade-off), Constraints § Performance ("Lighthouse 95+ on mobile; ship near-zero JS for initial load"), Constraints § Accessibility (WCAG AA minimum)
- `.planning/REQUIREMENTS.md` § SEO (SEO-01..06, SEO-08, SEO-09), § A11Y (A11Y-01, A11Y-04, A11Y-07), § PERF (PERF-01, PERF-02, PERF-03, PERF-05), § LNCH (LNCH-01..05) — 20 locked Phase 6 requirements
- `.planning/REQUIREMENTS.md` § Out of Scope — explicit rejection of cookie banner, reCAPTCHA, light-mode toggle, video embeds (informs SEO + Speed Insights install choices)
- `.planning/ROADMAP.md` § Phase 6 — phase goal, 5 success criteria, dependencies on Phases 1–5

### Carry-forward sources (load-bearing for plan scoping)
- `.planning/phases/04-work-projects/04-01-SUMMARY.md` § Phase 6 Carry-Forwards — 6 items (#1–#6 above): deploy + WebAIM contrast + GH URL verify + archived braehods href + STATUS_DOT_COLOR promotion + 7 pre-existing `/`-route failures
- `.planning/phases/05-contact-modal/05-03-SUMMARY.md` § Phase 6 Carry-Forwards — 10 items (#7–#13 above): Formspree real-email + 12-item visual checklist + iOS Safari + screen-reader + Categories A–D + WebAIM `#c8a86a` + PERF-03 bundle
- `.planning/phases/05-contact-modal/.checkpoint-state.md` — full Categories A–D failure analysis with affected spec lists; D-06 fix-strategy table maps to this file
- `.planning/.continue-here.md` — root-level between-phases handoff written 2026-05-16; § Critical Anti-Patterns (especially the `'use client'` dual-gate `blocking` row applies if Phase 6 adds a 2nd client island, which it should NOT); § Phase 6's own ownership (4 items: %5Ftokens delete + monogram swap deferred + photo swap deferred + DNS)

### Prior phase decisions still binding
- `.planning/phases/01-foundation-design-tokens/01-CONTEXT.md` D-13 — `NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw` set in Vercel project env across Production + Preview + Development. Plan 06-01 production-deploy gate (D-14e real-email check) relies on this.
- `.planning/phases/01-foundation-design-tokens/01-CONTEXT.md` D-04 — single-source monogram contract (MD5 byte-identical between `MonogramMark.tsx` + `app/icon.svg`). D-17 (defer monogram swap) inherits this invariant: any future swap must preserve the dual-write contract.
- `.planning/phases/02-home-page/02-CONTEXT.md` D-25 — FOUND-07 single client island. Phase 6 MUST NOT add a 2nd `'use client'` directive; `proxy.ts` is an edge-runtime file, not a client boundary (D-18 verified safe).
- `.planning/phases/02-home-page/02-CONTEXT.md` D-15 — `data/site.ts.socials` is the single source for GH + IG URLs. D-03 JSON-LD `sameAs` consumes from this same source (no duplicate URL lists).
- `.planning/phases/02-home-page/02-SCOPE-AMENDMENT.md` — YouTube dropped from v1; `data/channels.ts` is 1-entry IG-only; `footer-socials-render.spec.ts` asserts `.toHaveCount(0)` on YT aria-label. Plan 06-02 D-03 JSON-LD sameAs MUST exclude YT to stay consistent.
- `.planning/phases/05-contact-modal/05-CONTEXT.md` D-13/D-14 — honeypot `company` name + 1500ms min-time-to-submit. Plan 06-01 D-06 Category C audit verifies the silent-success render path doesn't fire a spurious success on bot rejection.
- `.planning/phases/05-contact-modal/05-CONTEXT.md` D-17 — `view-transition-name: contact-modal` reservation in dialog element; NOT implemented in v1, Phase 6 polish optional.

### Stack + library docs (Next 16 / Tailwind v4 / Vercel)
- `CLAUDE.md` § Recommended Stack — Next.js 16.2.6 + React 19.2.6 + TypeScript 5.9.x + Tailwind 4.2.4. Phase 6 adds NO runtime deps; `@next/bundle-analyzer` is a one-shot devDep (D-11). Phase 6 USES already-installed `@vercel/analytics@2.0.1` + `@vercel/speed-insights@2.0.0`.
- `CLAUDE.md` § Other Specific Decisions → "Analytics" — locks Vercel Analytics + Speed Insights over Plausible / Umami / GA4. Plan 06-01 D-09 mounts both.
- `CLAUDE.md` § What NOT to Use → `middleware.ts` renamed to `proxy.ts` in Next 16. D-18 uses `proxy.ts`.
- `CLAUDE.md` § What NOT to Use → `images.domains` deprecated in favor of `images.remotePatterns`. Phase 6 OG images are SAME-ORIGIN (no remote pattern needed).
- Next.js 16 `opengraph-image.tsx` route convention — https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image — verify static-vs-dynamic syntax for D-02
- Next.js 16 `sitemap.ts` route convention — https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap — verify `MetadataRoute.Sitemap` return shape for D-04
- Next.js 16 `proxy.ts` middleware rename — https://nextjs.org/docs/app/api-reference/file-conventions/proxy — verify D-18 export signature + matcher config
- Vercel `@vercel/og` (now `next/og`) — https://vercel.com/docs/functions/og-image-generation — verify `ImageResponse` API for D-02 dynamic OG images
- Vercel domain configuration + SSL staging — https://vercel.com/docs/projects/domains/add-a-domain — verify D-13 add-domain-before-CNAME-flip sequence
- Google Rich Results Test — https://search.google.com/test/rich-results — Plan 06-02 SUMMARY records validation result for D-03 Person JSON-LD
- Schema.org Person — https://schema.org/Person — minimal required fields for D-03 (name, url, sameAs)
- WebAIM Contrast Checker — https://webaim.org/resources/contrastchecker/ — Plan 06-01 carry-forwards #2 + #11 use this tool
- WCAG 2.1 § 1.4.10 Reflow (200% zoom) — https://www.w3.org/WAI/WCAG21/Understanding/reflow.html — Plan 06-02 A11Y-07 audit reference

### Reusable source files (Phase 6 modifies or imports from these)
- `app/layout.tsx` — root layout; D-03 JSON-LD injection + D-09 `<Analytics />` + `<SpeedInsights />` mount here
- `app/page.tsx` — homepage; D-02 static OG image lives at `app/opengraph-image.png` (Next App Router file convention for `/` route OG image)
- `app/about/page.tsx` — about route; D-02 dynamic `app/about/opengraph-image.tsx` adjacent
- `app/work/page.tsx` — work route; D-02 dynamic `app/work/opengraph-image.tsx` adjacent
- `app/%5Ftokens/` — URL-encoded private folder workaround from Phase 1 D-11; D-01 cleanup target (delete entirely in Plan 06-01)
- `app/icon.svg` — monogram SVG, byte-identical with `components/ui/MonogramMark.tsx` path; D-17 explicitly preserves this (no swap in v1)
- `components/ui/MonogramMark.tsx` — D-05 404 page consumer (centered monogram), D-17 preserves
- `components/contact/ContactModal.tsx` — D-06 Category B mailto `::after` arrow fix + Category C `role="alert"` addition
- `data/site.ts` — D-03 JSON-LD `sameAs` source (already has `socials.github` + `socials.instagram`); D-15a from Phase 5 informational alias-swap candidate (still v1.x, not Phase 6)
- `data/projects.ts` — D-16 archived-braehods href update target (single-line edit before DNS flip)
- `tests/lighthouse.spec.ts` — Phase 1 RED-on-local spec; D-10 ports to preview-URL via `BASE_URL` env var
- `tests/no-bare-outline-none.spec.ts`, `tests/photo-lcp.spec.ts` — 7 pre-existing `/`-route failures (carry-forward #6) addressable post-CDN-deploy

### New files Phase 6 adds (planner refines exact paths)
- `app/sitemap.ts` — D-04 dynamic sitemap iterating `content/`
- `app/robots.ts` — D-04 robots config
- `app/not-found.tsx` — D-05 branded 404 page
- `app/opengraph-image.png` — D-02 static OG for `/` (1200×630 PNG, hand-tuned)
- `app/about/opengraph-image.tsx` — D-02 dynamic `/about` OG
- `app/work/opengraph-image.tsx` — D-02 dynamic `/work` OG
- `app/not-found/opengraph-image.tsx` (optional) — dynamic 404 OG; defer to v1.x if not needed
- `proxy.ts` (repo root) — D-18 preview noindex
- `tests/helpers/live-url.ts` — D-06 Category D helper `liveUrl(page)` wrapper
- `.planning/phases/06-polish-seo-launch/visual-checklist.md` — D-08 dedup'd 40-item combined visual sweep (P4 28 + P5 12)
- New specs (planner confirms exact list):
  - `tests/sitemap-renders.spec.ts` — D-04 sitemap.xml serves expected route list
  - `tests/robots-renders.spec.ts` — D-04 robots.txt allows all + references sitemap
  - `tests/og-images-render.spec.ts` — D-02 each route's `og:image` meta tag resolves to a 200 (1200×630)
  - `tests/jsonld-person.spec.ts` — D-03 layout includes valid Person JSON-LD with `sameAs` array matching `data/site.ts.socials`
  - `tests/not-found-renders.spec.ts` — D-05 404 route shows monogram + heading + return link with chrome
  - `tests/preview-noindex.spec.ts` — D-18 `proxy.ts` sets `X-Robots-Tag: noindex` on `VERCEL_ENV=preview` (preview-URL test, skipped on local)
  - `tests/canonical-urls.spec.ts` — SEO-06 each route's `<link rel="canonical">` matches expected URL
  - `tests/metadata-per-route.spec.ts` — SEO-01 each route's `<title>` + meta description present + unique

### Memory (cross-project user context)
- `user_email = fakegoat1@gmail.com` (CLAUDE.md context) — D-14e Formspree real-email gate target
- `reference_lucide_brand_icons.md` — Lucide dropped brand icons in 2024; D-06 Category B mailto arrow uses CSS `::after` (no Lucide arrow icon) to keep mailto link plain `<a>` (no `'use client'` boundary leak)
- `feedback_avoid_paid_tools.md` — informs Vercel Analytics + Speed Insights choice (D-09) over Plausible / paid alternatives

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`app/layout.tsx`** — root layout already wraps Nav + Footer + ContactModal; D-03 JSON-LD `<script>` + D-09 `<Analytics />` + `<SpeedInsights />` mount here as siblings to the modal.
- **`components/ui/MonogramMark.tsx`** — single-source monogram (Phase 1 D-04 byte-identical with `app/icon.svg`); D-05 404 page reuses it at ~80px. D-17 preserves the file unchanged in v1.
- **`data/site.ts`** — `socials.github` + `socials.instagram` URLs already locked from Phase 2; D-03 JSON-LD `sameAs` reads from this same source.
- **`data/channels.ts`** — IG-only 1-entry (post-`02-SCOPE-AMENDMENT.md`); D-03 sameAs explicitly does NOT add YT.
- **`@vercel/analytics@2.0.1` + `@vercel/speed-insights@2.0.0`** — already in package.json, NOT yet mounted; D-09 mounts in Plan 06-01.
- **`app/icon.svg`** — present at the right App-Router-magic-file location; D-05 404 + D-02 OG image generation read the monogram path data from `MonogramMark.tsx`.
- **`tests/lighthouse.spec.ts`** — Phase 1 spec, RED on local; D-10 ports to preview-URL via `BASE_URL` env var override.

### Established Patterns
- **Single client island (FOUND-07 + Phase 5 carve-out)** — `git grep -l "use client" -- 'app/**' 'components/**' 'lib/**'` returns exactly 1 file: `components/contact/ContactModal.tsx`. `tests/single-client-island.spec.ts` (count) + `tests/no-client-components.spec.ts` (allow-list) both guard this invariant. Phase 6 MUST NOT introduce a 2nd `'use client'`. `proxy.ts` is edge-runtime, not a client boundary — verified safe in D-18.
- **Atomic-binding refactor commits (Phase 5 D-05 pattern)** — D-07 Category A spec fix lands as a single commit per this established pattern. `git log -n 1 --name-only` post-commit verifies the file list.
- **`transition-[border-color,color,opacity]` arbitrary-list** (Phases 2, 4, 5 anti-pattern repeats from `transition-colors` shorthand) — D-05 404 return link uses the arbitrary-list pattern to avoid the focus-ring 200ms-bleed seen on prior phases.
- **MD5 byte-identical dual-write contract** for the monogram (Phase 1 D-04) — D-17 monogram-swap-deferred preserves this; any future swap re-runs the trace + dual-write.
- **`history.replaceState()` over `location.hash = ''`** for hash-clearing close handlers (Phase 5 lesson) — no new hash-driven UI in Phase 6, but if 404 page adds a "Back" link with a hash target, this pattern applies.
- **`:text-is("...")` Playwright selector for verbatim copy assertions** (Phase 4 lesson reaffirmed in Phase 5 D-08) — D-05 404 page copy specs use exact-match selectors.

### Integration Points
- **`app/layout.tsx`** — D-03 (JSON-LD) + D-09 (Analytics + SpeedInsights) + the existing ContactModal mount all live as siblings here. Verify no `'use client'` directive added (FOUND-07).
- **`app/%5Ftokens/`** — D-01 deletes entirely. Verify no live references via `git grep -l "_tokens" -- 'app/**'` post-delete. The folder rename to URL-encoded `%5Ftokens` was a Phase 1 workaround; delete the whole folder, no rename.
- **`tests/lighthouse.spec.ts` `BASE_URL` env var hook** — D-10 reads `process.env.BASE_URL` (defaults to `http://localhost:3000` for local dev, set to preview URL in Plan 06-02 CI/manual flow).
- **`data/projects.ts` "braehods (archived)" entry** — D-16 single-line href update (currently `https://braehods.com` → `https://github.com/bwaeden/braehods`) lands in Plan 06-03 W0 BEFORE the DNS flip in W1.
- **`proxy.ts` matcher config** — D-18 excludes `_next/static`, `_next/image`, `favicon`, `icon`, `images` to keep static assets cacheable. Verify against any new asset paths Phase 6 adds (OG image PNGs in `app/opengraph-image.png` are at the route level, NOT under `public/images/` — matcher exclusion list may need a single update if OG image responses should also skip the header).

### Existing infra state (from `.planning/.continue-here.md` § Infrastructure State, verified 2026-05-19)
- **Vercel project**: `braeden-site` linked to `bwaeden/braeden-site`; `NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw` set across all envs (Phase 1 D-13).
- **Branch**: `main`, 22 commits ahead of `origin/main` (handoff said 16; 6 more orchestrator commits since 2026-05-16). No outstanding feature branches.
- **Working tree**: clean (after this CONTEXT.md commit, plus the in-progress STATE.md session-continuity edit).
- **Worktree leftovers**: `.claude/worktrees/agent-ad910235ed9da2c64/` preserved by Windows file lock; harmless (gitignored).
- **Formspree endpoint `xqeypnkw`**: configured but never tested with a real submission via the deployed site — D-14e is the gate.

</code_context>

<specifics>
## Specific Ideas

- **Plan 06-01 deploy gate exit criteria** (combined acceptance for "preview is clean"):
  1. `npm run typecheck` clean
  2. `npm run lint` clean (the pre-existing `_staggerIndex` warning is acceptable carry-forward — flag for v1.x if it propagates)
  3. `npm run build` clean (Turbopack)
  4. `npm run test:full` GREEN on all 3 projects (chromium-mobile + chromium-desktop + Pixel 5) — this is the explicit acceptance that the 22 Categories A–D failures are CLOSED (verify via `grep -r "test.fixme\|test.skip" tests/ | wc -l` returns the pre-Phase-6 baseline)
  5. Preview deploy succeeds (Vercel build green, preview URL resolves 200)
  6. Real Formspree submission from the preview URL lands at `fakegoat1@gmail.com` (D-14e)
  7. 40-item visual checklist clean (D-08)
  8. 3 GH URL real-link verifications return 200 (carry-forward #3)
  9. WebAIM contrast measurements documented for `#707070` + `#c8a86a` (carry-forwards #2 + #11; both expected ≥3.0:1 against `#1a1a1f` / `#0a0a0a` respectively per Phase 4 D-09 + Phase 5 D-02 inline literal context)

- **Plan 06-02 audit gate exit criteria**:
  1. All 6 Lighthouse audits ≥95 across all 4 categories (D-10)
  2. PERF-03 first-page bundle ≤50KB gz excluding ContactModal chunk, documented in SUMMARY (D-11)
  3. NVDA + VoiceOver iOS walk-throughs clean (D-12); any P0 SR bug fixed inline before SUMMARY
  4. 200% zoom + 320px viewport overflow verify clean on the preview (carry-forwards #9 + LNCH-05)
  5. All 8 new SEO specs GREEN (sitemap, robots, og-images, jsonld-person, not-found, preview-noindex, canonical-urls, metadata-per-route)
  6. Google Rich Results Test validates the Person JSON-LD with no errors

- **Plan 06-03 launch gate exit criteria**:
  1. `braehods.com` + `www.braehods.com` resolve to the Vercel deployment over HTTPS (D-13)
  2. Smoke test: visit `https://braehods.com`, click through Nav (Home + About + Work + Contact), submit a real Formspree message, verify email arrives
  3. Real-device test on iPhone Safari + Android Chrome (LNCH-04 + carry-forward #9)
  4. Old `bwaeden/braehods` repo archived (D-15)
  5. GitHub profile + IG bio + YT About bio links updated to `braehods.com` (LNCH-03)
  6. `data/projects.ts` archived-braehods href = `https://github.com/bwaeden/braehods` (D-16, landed BEFORE DNS flip)

- **OG image static-`/` vs dynamic-others rationale (D-02)**: the homepage is the most-shared URL and benefits from a hand-tuned image (the wordmark + monogram composition + grain texture is hard to nail in `ImageResponse` JSX); `/about` and `/work` are dynamic-title surfaces where `ImageResponse` rendering scales free as routes are added (and the page title in Fraunces 700 on charcoal IS the entire OG composition — minimal JSX). v2 `/writing` posts get dynamic OG for free.

- **Critical anti-pattern from `.planning/.continue-here.md` § Critical Anti-Patterns — re-stated for Phase 6**:
  - **2nd `'use client'` directive without dual-gate update** [SEVERITY: BLOCKING]: If Phase 6 ever needs a 2nd client island (it should not — `proxy.ts` is edge, OG images are server, JSON-LD is server, sitemap is server, 404 is server), the directive MUST land in the SAME commit as updates to `tests/single-client-island.spec.ts` (the count spec must flip to `expect(N)`) AND `tests/no-client-components.spec.ts` (the allow-list must add the new path to `ALLOWED_CLIENT_ISLANDS`).
  - **Cross-file refactor without atomic-binding commit** [advisory]: D-07 enforces this for Category A spec fix; plan-checker should also enforce for D-09 (Analytics + SpeedInsights mount in `app/layout.tsx` in a single commit with their import statements).
  - **`transition-colors` shorthand on focus-rendered elements** [advisory]: any new 404 return link, monogram-hover, etc. must use `transition-[border-color,color,opacity]` arbitrary-list per the Phase 2/4/5 anti-pattern.
  - **Honeypot field named `_gotcha`** [advisory]: Phase 6 does not touch ContactModal honeypot; D-06 Category C audit only adds `role="alert"` to the error region and audits the silent-bot-rejection render path. Honeypot name remains `company`.

</specifics>

<deferred>
## Deferred Ideas

- **Designed monogram swap (Phase 1 D-01 designer-pass)** — D-17 defers to v1.x. The current Fraunces-Black-traced monogram is intentional, not placeholder-as-shame. Re-evaluate after v1 lives long enough to assess if the editorial mark needs a custom polish.
- **Final portrait shoot** — PROJECT.md "Out of Scope (v1)" explicit; D-17 honors. v1.x candidate; current `public/portrait.jpg` ships.
- **301 redirect from `bwaeden.github.io/braehods` to `braehods.com`** — D-15 defers; archive-only suffices for v1. v1.x if Vercel Analytics shows referral traffic from the old GH Pages URL.
- **`STATUS_DOT_COLOR` `@theme` promotion** (carry-forward #5) — v1 ships with 2 inline-literal consumers (`#707070` archived dot + `#c8a86a` paper-trading dot + Phase 5 char counter). 3rd consumer triggers promotion; defer entirely from Phase 6.
- **`BreadcrumbList` JSON-LD** for `/about` + `/work` — not in REQUIREMENTS; v1.x SEO polish if Google surfaces breadcrumb-richness as a ranking signal worth pursuing.
- **`view-transition-name: contact-modal` card-to-modal seam** — Phase 5 D-17 reserved the placeholder; v1.x or v2 if a card → modal seam becomes useful (currently cards link out externally, no in-site target).
- **404 page OG image** — `app/not-found/opengraph-image.tsx` is technically possible but anti-credibility (404 should not be share-promoted). Defer indefinitely.
- **Form analytics for ContactModal** (open-rate, abandon-rate, send-rate via custom events) — v1 ships with page-level Vercel Analytics only. v1.x if conversion-funnel data becomes a priority.
- **Public-facing email alias `hi@braehods.com`** — Phase 5 D-15a informational. Requires domain mail (Cloudflare Email Routing or Vercel-side). Defer to v1.x post-launch.
- **`/now` page (Derek-Sivers convention)** — REQUIREMENTS § Out of Scope explicit; `/` Currently line covers v1. v2 candidate.
- **Velite migration** for content layer — CLAUDE.md "Recommended Stack" defers Velite until `/writing` post count crosses ~10-15. v2.
- **`/writing` route** — REQUIREMENTS v2 (WRIT-01..04). Sitemap iterates `content/` in D-04 so v2 routes auto-extend free.
- **Light-mode toggle** — REQUIREMENTS § Out of Scope explicit; LITE-01 in v2.
- **JAWS screen-reader audit** — D-12 covers NVDA + VoiceOver. JAWS skipped — paid, niche overlap with NVDA. v1.x if accessibility-conscious feedback comes in post-launch.

### Reviewed Todos (not folded)

None — `gsd-sdk query todo.match-phase 6` returned `todo_count: 0`.

</deferred>

---

*Phase: 6-polish-seo-launch*
*Context gathered: 2026-05-19*
*Auto-mode: all decisions selected with recommended defaults; see § Decisions for `[auto]` selection log inline per decision.*
