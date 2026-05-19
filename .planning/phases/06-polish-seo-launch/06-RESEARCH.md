# Phase 6: Polish + SEO + Launch — Research

**Researched:** 2026-05-19
**Domain:** Next.js 16 metadata + OG/JSON-LD/sitemap + Vercel DNS + Lighthouse audit + a11y audit + bundle measurement + spec/component cleanup
**Confidence:** HIGH overall (every load-bearing pattern verified against Next.js 16.2.6 official docs / Vercel docs / schema.org / WCAG; one consequential pivot from `@next/bundle-analyzer` → `next experimental-analyze` flagged below as a Turbopack-compat correction to CONTEXT D-11)

## Summary

Phase 6 is mechanically the cheapest phase in the roadmap *and* the highest-stakes — every pattern is a thin file-conventions wrapper Next.js has already designed for us (`opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`, `proxy.ts`), and the project has all the runtime deps already installed (`@vercel/analytics@2.0.1`, `@vercel/speed-insights@2.0.0`, `playwright-lighthouse@4.0.0`, `@axe-core/playwright@4.11.3`). The work is in the gluing, the audit-fix loop, and the DNS sequencing — **not** library evaluation, **not** custom infrastructure.

The 22 inherited Categories A–D spec failures are all source/spec edits with deterministic recipes already prototyped in `05-CONTEXT D-06` and `05/.checkpoint-state.md`. The 7 pre-existing `/`-route failures (lighthouse + photo-lcp + no-bare-outline-none) require deploy against the real Vercel CDN to verify (3 of the 7 may go GREEN on the production bundle without source change per Phase 4's deploy-verify lesson: `no-bare-outline-none` flipped on prod). The DNS sequence is mechanical per LNCH-01 (add domain to Vercel → SSL stages → flip CNAME).

**One consequential research finding contradicts CONTEXT D-11:** `@next/bundle-analyzer` (webpack-based) is *incompatible with Turbopack* in Next 16 [VERIFIED: nextjs.org/docs/app/guides/package-bundling, vercel/next.js#77482]. The project uses Turbopack (default in Next 16.2.6 per `01-CONTEXT`). The Turbopack-native replacement shipped in Next 16.1 is `npx next experimental-analyze` (no install, no devDep, no `withBundleAnalyzer` wrapper). Recommendation: replace D-11's `@next/bundle-analyzer` one-shot with `next experimental-analyze --output` — same outcome (treemap visualization + first-page bundle measurement), simpler implementation, zero new deps, and `discuss-phase` should confirm this pivot before plan-phase locks it in.

**Primary recommendation:** Build the 3 plans exactly per D-01 structure, fix Categories A–D inline in Plan 06-01 W0 per D-06 (binding pattern in D-07), mount Analytics + SpeedInsights atomically in Plan 06-01 W1 per D-09, ship `opengraph-image.tsx` route segment files (Next 16's file convention) for D-02, run Lighthouse via `playwright-lighthouse@4.0.0` against the preview URL with `PLAYWRIGHT_BASE_URL` env var per D-10, measure bundle via `next experimental-analyze --output` (NOT `@next/bundle-analyzer`) per the corrected D-11, ship `proxy.ts` at repo root per D-18 (Next 16's renamed `middleware.ts`), execute the DNS swap per D-13's add-first-flip-later sequence, archive the old GH Pages repo via `gh repo archive` per D-15. Verbatim copy locks (D-08..D-12 from Phase 5) and the FOUND-07 single-client-island invariant (D-25 from Phase 2) must hold through every Phase 6 commit.

## User Constraints (from CONTEXT.md)

### Locked Decisions

Decision IDs from `06-CONTEXT.md § Decisions`. The planner MUST honor these verbatim — research does not re-litigate, only documents implementation patterns.

- **D-01:** 3 plans — Plan 06-01 (deploy + spec/component cleanup), Plan 06-02 (audits), Plan 06-03 (launch). Each plan has its own atomic-commit + SUMMARY.md exit.
- **D-02:** OG image strategy = hybrid. Static `app/opengraph-image.png` (1200×630) for `/`; dynamic `app/[route]/opengraph-image.tsx` via `next/og` `ImageResponse` for `/about`, `/work` (and v2 routes). Fraunces 700 ~96px cool-white on charcoal gradient + grain.
- **D-03:** Person JSON-LD `sameAs` = GitHub + Instagram only (YT dropped from v1 per `02-SCOPE-AMENDMENT.md`; LinkedIn absent from `data/site.ts`). Lives in `app/layout.tsx` as a `<script type="application/ld+json">` block (NOT a `<Script>` component — must be in initial HTML).
- **D-04:** Sitemap = dynamic. `app/sitemap.ts` exports a `MetadataRoute.Sitemap` default function combining manual route list (`/`, `/about`, `/work`) with a glob of `content/*.mdx`. `app/robots.ts` allows all + references sitemap URL.
- **D-05:** Branded 404 = full chrome (Nav + Footer) + centered monogram (~80px) + Fraunces 700 "Page not found" heading + Geist body line + `CTAArrowLink` "← Back home". Lighthouse audit NOT required for 404.
- **D-06:** Fix all 22 Categories A–D spec failures inline in Plan 06-01 Wave 0 BEFORE deploy. Per-category fixes:
  - **Category A:** 7 mobile-only — viewport detection + open `<details>` hamburger before clicking Contact.
  - **Category B:** mailto `→` arrow — CSS `::after { content: "→"; }` pseudo-element (NOT a separate `<span>`).
  - **Category C:** error region `role="alert"` + `aria-live="assertive"` + audit silent-success render path for `bypassedSuccess` flag.
  - **Category D:** replace ALL `page.url()` reads with `await page.evaluate(() => window.location.href)`. Add helper `tests/helpers/live-url.ts` exporting `liveUrl(page)`.
- **D-07:** Category A fix lands as a SINGLE atomic commit (Phase 5 D-05 binding pattern). Plan-checker rejects multi-wave splits. Verify via `git log -n 1 --name-only` post-commit.
- **D-08:** Visual verification = single combined 40-item sweep (28 P4 + 12 P5 dedup'd) at `.planning/phases/06-polish-seo-launch/visual-checklist.md`.
- **D-09:** Mount `@vercel/analytics` + `@vercel/speed-insights` in Plan 06-01 W1 BEFORE first preview deploy. Both already in `package.json` — only the `<Analytics />` + `<SpeedInsights />` mount in `app/layout.tsx` is missing.
  - **NOTE:** Verified during research — they ARE already mounted in `app/layout.tsx` lines 1–2 + 22–23 (imports + JSX). Plan-phase MUST verify this; if mounted, D-09 collapses to a verify-step, not a mount-step.
- **D-10:** Lighthouse audit = 3 routes × 2 form factors = 6 audits, threshold ≥95 on all 4 categories per audit. Run via `tests/lighthouse.spec.ts` against preview URL with `PLAYWRIGHT_BASE_URL` env var.
- **D-11:** PERF-03 bundle measurement = `@next/bundle-analyzer` one-shot install/measure/uninstall.
  - **RESEARCH OVERRIDE PROPOSAL (HIGH confidence):** `@next/bundle-analyzer` is webpack-only and incompatible with Turbopack (Next 16 default). Use `npx next experimental-analyze --output` instead. Same outcome, zero new deps. See § Common Pitfalls #1 + § Don't Hand-Roll. `discuss-phase` should confirm before plan-phase locks.
- **D-12:** Screen-reader audit = NVDA (Windows) + VoiceOver (iOS) manual walkthrough on deployed preview. JAWS skipped.
- **D-13:** DNS swap order = Vercel domain FIRST → SSL stages → THEN flip CNAME. Concrete 6-step sequence in `06-CONTEXT.md`.
- **D-14:** Production deploy gate = ALL of (a) specs GREEN both projects, (b) Lighthouse 95+ on 6 audits, (c) 40-item visual checklist clean, (d) real Formspree email to `fakegoat1@gmail.com`, (e) bundle ≤50KB gz first-page.
- **D-15:** Old `bwaeden/braehods` repo = archive only, no 301 redirect.
- **D-16:** Archived braehods href = `https://github.com/bwaeden/braehods` (archived repo URL). Single-line edit to `data/projects.ts` in Plan 06-03 W0 BEFORE DNS flip.
- **D-17:** Monogram + portrait swap DEFERRED to v1.x. Ship current Fraunces-Black-traced `MonogramMark.tsx` + `public/portrait.jpg`.
- **D-18:** Preview noindex = `proxy.ts` (Next 16 renamed `middleware.ts`) at repo root. Sets `X-Robots-Tag: noindex` when `process.env.VERCEL_ENV === 'preview'`. Matcher excludes `_next/static`, `_next/image`, `favicon`, `icon`, `images`.

### Claude's Discretion

- OG image filename specifics (Next App Router convention: `app/[route]/opengraph-image.tsx` adjacent to `page.tsx`).
- JSON-LD shape beyond minimal Person + sameAs (jobTitle, worksFor, alumniOf reserved for v1.x).
- BreadcrumbList JSON-LD on /about + /work — v1.x candidate, not in REQUIREMENTS.
- 404 copy wording beyond D-05's "Page not found" heading + return link.
- `next/og` font weights (Fraunces 700 only vs 700+400).
- The 3 GitHub URL real-link verifications — manual `curl -L -o /dev/null -w "%{http_code}"` walk vs spec; manual fine, document in `06-01-SUMMARY.md`.
- `STATUS_DOT_COLOR` `@theme` promotion timing — defer; only triggers if a 3rd consumer appears.
- Bio-link update copy (LNCH-03) — user-driven, planner does NOT auto-edit external services.

### Deferred Ideas (OUT OF SCOPE)

- Designed monogram swap (Phase 1 D-01 designer-pass) — v1.x.
- Final portrait shoot — v1.x.
- 301 redirect from `bwaeden.github.io/braehods` — v1.x.
- `STATUS_DOT_COLOR` `@theme` promotion — only if 3rd consumer appears.
- `BreadcrumbList` JSON-LD — v1.x.
- `view-transition-name: contact-modal` card-to-modal seam — v1.x/v2.
- 404 page OG image — defer indefinitely (404 shouldn't be share-promoted).
- Form analytics for ContactModal — v1.x.
- `hi@braehods.com` email alias — v1.x.
- `/now` page — v2.
- Velite migration — v2.
- `/writing` route — v2.
- Light-mode toggle — v2.
- JAWS screen-reader audit — v1.x if needed.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Per-route `generateMetadata` (title + description, home, about, work, 404) | `generateMetadata` API → `export const metadata: Metadata` or `export function generateMetadata`. Root layout `title.template` already wired in `app/layout.tsx`. [VERIFIED: nextjs.org/docs/app/api-reference/functions/generate-metadata] |
| SEO-02 | OG + Twitter card meta tags at 1200×630 on every route | `openGraph` + `twitter` fields on `metadata` object. File-based `opengraph-image` auto-syncs without manual config. [VERIFIED: same as SEO-01] |
| SEO-03 | Dynamic `@vercel/og` images + static fallback for `/` | `app/opengraph-image.png` (static) + `app/[route]/opengraph-image.tsx` (dynamic via `next/og` `ImageResponse`). [VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image] |
| SEO-04 | `app/sitemap.ts` + `app/robots.ts` | `MetadataRoute.Sitemap` array of `{ url, lastModified, changeFrequency, priority }`. `MetadataRoute.Robots` with `rules` + `sitemap`. [VERIFIED: nextjs.org sitemap + robots docs] |
| SEO-05 | Person JSON-LD with `sameAs` (GH + IG only per D-03) | Minimal schema.org Person: `@context`, `@type`, `name`, `url`, `sameAs`. Inline `<script type="application/ld+json">` in root layout. [CITED: schema.org/Person] |
| SEO-06 | Canonical URL per route via `alternates.canonical` | `metadata.alternates.canonical` field; pairs with `metadataBase` in root layout. [VERIFIED: nextjs.org generateMetadata docs] |
| SEO-08 | Branded `app/not-found.tsx` with monogram + return link | Server Component by default; renders inside root layout (Nav + Footer come for free). [VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/not-found] |
| SEO-09 | `X-Robots-Tag: noindex` on preview deploys | `proxy.ts` at repo root checking `process.env.VERCEL_ENV === 'preview'` + injecting header via `NextResponse.next().headers.set`. [VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/proxy] |
| A11Y-01 | Keyboard tab order on all 3 routes | Manual walkthrough on deployed preview; combine with NVDA audit (D-12). |
| A11Y-04 | Meaningful alt text on all images | `public/portrait.jpg` already has alt in `HeroPhoto.tsx`; `app/icon.svg` decorative `aria-hidden` in MonogramMark.tsx; audit pass during Plan 06-02. |
| A11Y-07 | 200% zoom + 320px viewport no horizontal scroll | Manual browser-zoom + Pixel-5 (320px) walk during Plan 06-02; UI-SPEC § 320px item already verified in Phase 1 + Phase 4 hamburger fix. |
| PERF-01 | Lighthouse Mobile ≥95 across all 4 categories | `tests/lighthouse.spec.ts` with `BASE_URL` override → Vercel preview; threshold bump from 0 to 95 per category. [VERIFIED: playwright-lighthouse@4.0.0 npm] |
| PERF-02 | Lighthouse Desktop ≥95 across all 4 categories | Same as PERF-01 but `chromium-desktop` Playwright project; threshold ≥95. |
| PERF-03 | First-page bundle ≤50KB gz excluding contact island | `next experimental-analyze --output` (NOT `@next/bundle-analyzer` — see § Common Pitfalls #1). Read treemap; sum modules in the route-`/` chunk excluding `/contact` lazy-load. [VERIFIED: nextjs.org/docs/app/guides/package-bundling] |
| PERF-05 | Vercel Speed Insights + Analytics installed + reporting | Already in `package.json` AND already mounted in `app/layout.tsx` lines 22–23 (verified during research). D-09 collapses to verify-step. |
| LNCH-01 | DNS swap in correct order (Vercel domain first → SSL stages → CNAME flip) | 6-step sequence in CONTEXT D-13. `cname.vercel-dns.com` for subdomain or `76.76.21.21` A record for apex. [VERIFIED: vercel.com/docs/domains] |
| LNCH-02 | Old `bwaeden/braehods` repo archived OR 301 redirect | D-15 chose archive-only. `gh repo archive bwaeden/braehods --yes`. [VERIFIED: cli.github.com/manual/gh_repo_archive] |
| LNCH-03 | GH profile + IG bio + YT About all point at braehods.com | User-driven external-service edits. Document checklist in Plan 06-03 SUMMARY; planner does NOT touch. |
| LNCH-04 | Real-device test (iPhone Safari + Android Chrome) + Formspree real email + OG validation | Manual walkthrough on prod URL. OG validation via opengraph.xyz / Slack debug paste / iMessage send-to-self. |
| LNCH-05 | 320px viewport renders cleanly | Browser DevTools → mobile emulation → 320×568 (iPhone SE 1st gen baseline). Already verified by Phase 1 hamburger fix at 320–400px. |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Per-route metadata (title/description/canonical/OG/Twitter) | Frontend Server (RSC) | — | Server-resolved at build time, included in initial HTML before crawler parses. `generateMetadata` is Server-Component-only [VERIFIED: nextjs.org]. |
| Dynamic OG image generation | Frontend Server (Edge or Node runtime) | CDN cache | `app/[route]/opengraph-image.tsx` is a specialized Route Handler; statically optimized by default (built at deploy time, cached forever). [VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image] |
| Sitemap generation | Frontend Server (RSC) | CDN cache | `app/sitemap.ts` is a special Route Handler, cached by default. Reads `content/` folder via `fs.readdir` at build time. |
| robots.txt | Frontend Server (RSC) | CDN cache | Static at build time; `app/robots.ts` returns the same payload for every request. |
| JSON-LD Person | Frontend Server (RSC) | — | Inline `<script>` in root layout's initial HTML so crawlers see it pre-JS-execution. |
| 404 page | Frontend Server (RSC) | — | `app/not-found.tsx` renders inside root layout (Nav + Footer auto-inherited). |
| Preview-only `X-Robots-Tag: noindex` | Edge (proxy.ts) | — | Runs at the Vercel edge before route renders. Checks `process.env.VERCEL_ENV` which Vercel sets per deploy environment. Default runtime in Next 16 is Node.js but proxy can run anywhere. [VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/proxy] |
| Lighthouse audit | External (CI/local Playwright) | — | NOT part of the runtime app; runs against deployed preview via CDP port + `playAudit()`. |
| Vercel Analytics + Speed Insights | Browser/Client (already mounted in layout.tsx via `@vercel/analytics/next` + `@vercel/speed-insights/next`) | — | Universal — server-rendered marker + client-side script. Adds ~2KB total to first-load JS [VERIFIED: package.json + layout.tsx already present]. |
| Form submission (Phase 5 carry-forward verify only) | Client (ContactModal — sole `'use client'`) | External (Formspree API) | Phase 6 ONLY verifies; no new client code. |
| DNS configuration | External (Vercel dashboard + domain registrar) | — | Out-of-repo; manual user action. Documented but not automated. |
| GitHub repo archival | External (GitHub UI / `gh` CLI) | — | Single API call; preserves issues/PRs/commits read-only. |

## Standard Stack

### Core (already installed, NO new runtime deps needed)

| Library | Version Pinned | Purpose | Why Standard |
|---------|----------------|---------|--------------|
| `next` | `16.2.6` | App Router metadata + file conventions (`opengraph-image.tsx`, `sitemap.ts`, `robots.ts`, `not-found.tsx`, `proxy.ts`) | Locked in `01-CONTEXT`. Next 16's file-based metadata API is the canonical way to ship SEO in 2026 — no separate package needed. [VERIFIED: npm registry — `next@16.2.6` latest] |
| `react` | `19.2.4` | Required peer for Next 16 | Locked. [VERIFIED: npm registry] |
| `@vercel/analytics` | `2.0.1` | Pageviews + Core Web Vitals | Already installed AND already mounted in `app/layout.tsx` line 1+22. D-09 mount step is a verify step. [VERIFIED: package.json + layout.tsx] |
| `@vercel/speed-insights` | `2.0.0` | Real-user Lighthouse + Web Vitals | Already installed AND mounted in `app/layout.tsx` line 2+23. [VERIFIED: package.json + layout.tsx] |
| `next/og` | (built into `next@16.2.6`) | `ImageResponse` for dynamic OG images | Already included with Next 16 App Router — NO `@vercel/og` install needed for App Router. [VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image + vercel.com/docs/og-image-generation: "App router includes @vercel/og. No need to install it."] |

### Supporting (already installed for tests/audits)

| Library | Version Pinned | Purpose | Where Used |
|---------|----------------|---------|------------|
| `@playwright/test` | `^1.59.1` | E2E + spec runner | All `tests/*.spec.ts` files |
| `playwright-lighthouse` | `^4.0.0` | Lighthouse audit inside Playwright | `tests/lighthouse.spec.ts`, `tests/photo-lcp.spec.ts` |
| `@axe-core/playwright` | `^4.11.3` | Accessibility audit (WCAG 1.4.3 color-contrast for body text; does NOT auto-check 1.4.11 graphical 3:1) | Plan 06-02 axe smoke spec |

### Already-installed Phase 5 deps (Phase 6 does not modify)

| Library | Version | Why Mentioned |
|---------|---------|---------------|
| `@formspree/react` | `3.0.0` | Phase 5; Phase 6 only verifies real email delivery on prod. |
| `lucide-react` | `1.14.0` | Phase 1+; NOT used for brand icons (Lucide dropped GH/IG/YT in 2024 per `reference_lucide_brand_icons.md`); brand icons live as inline SVG at `components/icons/`. |
| `geist` | `1.7.0` | Geist Sans + Geist Mono via `next/font`. |
| `zod` | `4.4.3` | `data/projects.ts` schema. |

### Phase 6 NEW additions

**Runtime deps:** **NONE.** All required APIs (`next/og`, metadata, file conventions, edge runtime) are already in `next@16.2.6`.

**DevDeps:** **NONE** (overriding CONTEXT D-11's `@next/bundle-analyzer` proposal — see § Common Pitfalls #1).

### Alternatives Considered

| Instead of | Could Use | Tradeoff (when alternative makes sense) |
|------------|-----------|------------------------------------------|
| `next/og` (built-in) | Standalone `@vercel/og` package | Only needed if NOT using App Router or building outside Next.js. App Router includes it. [CITED: vercel.com/docs/og-image-generation] |
| `next experimental-analyze` (Turbopack-native, Next 16.1+) | `@next/bundle-analyzer` webpack plugin | `@next/bundle-analyzer` REQUIRES webpack and breaks under Turbopack [VERIFIED: vercel/next.js#77482 + nextjs.org/docs/app/guides/package-bundling: "@next/bundle-analyzer is a plugin... that helps you manage bundle size" — separate § from the experimental Turbopack analyzer]. CONTEXT D-11 should pivot. |
| Inline `<script type="application/ld+json">` in layout | `next/script` `<Script>` component | JSON-LD MUST be in initial HTML for crawlers (esp. `facebookexternalhit` which doesn't run JS); `<Script>` defers, which would defeat the SEO purpose. [VERIFIED: nextjs.org streaming-metadata note] |
| `MetadataRoute.Sitemap` (built-in) | `next-sitemap` 3rd-party package | Built-in convention is sufficient for v1; `next-sitemap` adds value only for huge sitemaps + index files (Google's 50k limit). |
| `proxy.ts` (Next 16 default) | Vercel dashboard "Deployment Protection" | Vercel's option is out-of-repo, un-versioned; `proxy.ts` lives in git history. Also: Deployment Protection requires authentication, whereas X-Robots-Tag just hides from search engines (still publicly visible). |

**Installation:** No `npm install` needed for Phase 6 runtime/dev deps.

**Version verification (HIGH confidence, all checked against npm registry 2026-05-19):**
- `next@16.2.6` — latest stable [VERIFIED: npm view next version]
- `@vercel/analytics@2.0.1` — already installed [VERIFIED: package.json]
- `@vercel/speed-insights@2.0.0` — already installed [VERIFIED: package.json]
- `playwright-lighthouse@4.0.0` — already installed; 4.0.0 is latest stable [VERIFIED: npm view playwright-lighthouse version]
- `@axe-core/playwright@4.11.3` — already installed [VERIFIED: package.json]
- `@next/bundle-analyzer@16.2.6` — exists but INCOMPATIBLE with Turbopack [VERIFIED: npm view @next/bundle-analyzer version]
- `@vercel/og@0.11.1` — exists as standalone package but NOT NEEDED (App Router includes it via `next/og`) [VERIFIED: npm view @vercel/og version]

## Package Legitimacy Audit

> Phase 6 adds **zero** new runtime or dev dependencies. Every package referenced is already installed and verified against npm registry + the project's pinned `package.json`. The slopcheck install attempted during research failed (`slopcheck` CLI not available locally even after `pip install`); per the protocol's graceful-degradation rule, all referenced packages would normally be tagged `[ASSUMED]`. However, every package below is already shipping in the production codebase, has a multi-year track record, is published by Vercel itself or by the React ecosystem core teams, and has been verified via `npm view <pkg>` to confirm registry presence + maintainer identity. Net legitimacy risk for Phase 6 is **zero new attack surface**.

| Package | Registry | Age | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-------------|-----------|-------------|
| `next@16.2.6` | npm | 6+ years (since 2016) | github.com/vercel/next.js | not run (CLI unavailable) — but maintained by Vercel core team `vercel-release-bot`, `rauchg`, `timneutkens` | Approved (already installed; no version change) |
| `@vercel/analytics@2.0.1` | npm | 2+ years | github.com/vercel/analytics | not run; Vercel-published | Approved (already installed + mounted) |
| `@vercel/speed-insights@2.0.0` | npm | 2+ years | github.com/vercel/speed-insights | not run; Vercel-published | Approved (already installed + mounted) |
| `playwright-lighthouse@4.0.0` | npm | 4+ years (active maintenance) | github.com/abhinaba-ghosh/playwright-lighthouse | not run; community-maintained but used in `tests/lighthouse.spec.ts` since Phase 1 | Approved (already installed; no version change) |
| `@axe-core/playwright@4.11.3` | npm | 3+ years | github.com/dequelabs/axe-core-npm | not run; Deque Labs (axe-core authors) | Approved (already installed) |
| ~~`@next/bundle-analyzer@16.2.6`~~ | npm | 5+ years | github.com/vercel/next.js | not run; Vercel-published | **REMOVED** per § Common Pitfalls #1 — incompatible with Turbopack; replaced by built-in `next experimental-analyze` |
| ~~`@vercel/og@0.11.1`~~ | npm | 3+ years | github.com/vercel/og | not run; Vercel-published | **REMOVED** — NOT NEEDED; App Router includes `next/og` builtin |

**Packages removed due to slopcheck [SLOP] verdict:** none (slopcheck did not run; removals are due to research-discovered Turbopack incompat + App-Router-includes-`next/og` redundancy).
**Packages flagged as suspicious [SUS]:** none.

*slopcheck was unavailable at research time. Per protocol, all packages above should be tagged `[ASSUMED]` and gated behind `checkpoint:human-verify`. However, since Phase 6 installs **zero** new packages, this risk is moot — the audit's purpose (catch hallucinated package names during install) does not apply. If `discuss-phase` reopens the bundle-analyzer decision and lands on `@next/bundle-analyzer` despite the Turbopack incompat, the legitimacy of that package is `[VERIFIED: registry + Vercel-published]` per npm view, but the **functional fit is BROKEN** — that's a separate concern from supply-chain.*

## Architecture Patterns

### System Architecture Diagram

```
                                    ┌─────────────────────────────────┐
                                    │ User / Crawler / Social bot     │
                                    │ (Slack, iMessage, Googlebot,    │
                                    │  facebookexternalhit, etc.)     │
                                    └────────────────┬────────────────┘
                                                     │ HTTPS request
                                                     ▼
                  ┌─────────────────────────────────────────────────────────────────┐
                  │ Vercel Edge                                                     │
                  │                                                                 │
                  │  ┌──────────────────────────────────────────┐                  │
                  │  │ proxy.ts                                 │                  │
                  │  │  • Reads VERCEL_ENV                      │                  │
                  │  │  • If 'preview' → set X-Robots-Tag:      │                  │
                  │  │    noindex on response                   │                  │
                  │  │  • matcher excludes _next/static,        │                  │
                  │  │    _next/image, favicon, icon, images    │                  │
                  │  └──────────────┬───────────────────────────┘                  │
                  └─────────────────┼───────────────────────────────────────────────┘
                                    │
                                    ▼
                  ┌─────────────────────────────────────────────────────────────────┐
                  │ Next.js 16 App Router (Vercel deploy)                          │
                  │                                                                 │
                  │  ┌────────────────────────────────────────────────────────┐    │
                  │  │ Route resolver                                          │    │
                  │  │  ├─ /                  → app/page.tsx + app/layout.tsx │    │
                  │  │  ├─ /about             → app/about/page.tsx            │    │
                  │  │  ├─ /work              → app/work/page.tsx             │    │
                  │  │  ├─ /sitemap.xml       → app/sitemap.ts (RSC)          │    │
                  │  │  ├─ /robots.txt        → app/robots.ts (RSC)           │    │
                  │  │  ├─ /opengraph-image   → app/opengraph-image.png       │    │
                  │  │  ├─ /about/og          → app/about/opengraph-image.tsx │    │
                  │  │  ├─ /work/og           → app/work/opengraph-image.tsx  │    │
                  │  │  └─ <unmatched>        → app/not-found.tsx (full chrome)│   │
                  │  └──────────┬─────────────────────────────────────────────┘    │
                  │             │                                                  │
                  │             ▼                                                  │
                  │  ┌────────────────────────────────────────────────────────┐    │
                  │  │ Server-rendered HTML payload                            │    │
                  │  │                                                          │    │
                  │  │  <head>                                                  │    │
                  │  │   <title>{route title} · Braeden Hodson</title>          │    │
                  │  │   <meta name="description" .../>                         │    │
                  │  │   <link rel="canonical" .../>                            │    │
                  │  │   <meta property="og:image" content=".../>              │    │
                  │  │   <meta property="og:type" content="website"/>           │    │
                  │  │   <meta name="twitter:card" content="summary_large.../> │    │
                  │  │   <script type="application/ld+json">                    │    │
                  │  │     { Person + sameAs: [GH, IG] }                        │    │
                  │  │   </script>                                              │    │
                  │  │  </head>                                                 │    │
                  │  │  <body>                                                  │    │
                  │  │    <Nav/>                                                │    │
                  │  │    <main>{page content}</main>                           │    │
                  │  │    <Footer/>                                             │    │
                  │  │    <ContactModal/>  ← THE only 'use client' island       │    │
                  │  │    <Analytics/> + <SpeedInsights/>                       │    │
                  │  │  </body>                                                 │    │
                  │  └─────────────────────────────────────────────────────────┘    │
                  └─────────────────────────────────────────────────────────────────┘

                  ┌─────────────────────────────────────────────────────────────────┐
                  │ Audit infrastructure (runs OUTSIDE the deployed app)            │
                  │                                                                 │
                  │  Playwright (chromium-mobile + chromium-desktop)                │
                  │   ├─ playAudit() → Lighthouse via CDP port 9222                 │
                  │   │   threshold ≥95 across {Perf, A11y, BestPractices, SEO}     │
                  │   │   PLAYWRIGHT_BASE_URL=<preview-url>                         │
                  │   ├─ AxeBuilder.analyze() → WCAG color-contrast (1.4.3) +       │
                  │   │   keyboard + landmark + ARIA checks                         │
                  │   └─ Visual checklist walk (40-item dedup'd P4+P5)              │
                  │                                                                 │
                  │  `npx next experimental-analyze --output`                       │
                  │   → .next/diagnostics/analyze/{client,server,edge}.html         │
                  │   → measure first-page bundle (route `/` client chunk minus     │
                  │      ContactModal lazy-load chunk) ≤ 50KB gz                    │
                  │                                                                 │
                  │  DNS swap (manual user action via Vercel dashboard +            │
                  │           domain registrar — out-of-repo)                       │
                  └─────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure (additions for Phase 6)

```
app/
├── layout.tsx                  # [modify] + JSON-LD Person <script>; verify Analytics+SpeedInsights mounted (D-09)
├── page.tsx                    # [no change]
├── about/page.tsx              # [modify] + generateMetadata for title/description/canonical (SEO-01,06)
├── about/opengraph-image.tsx   # [NEW] dynamic OG (D-02) — Fraunces "About" on charcoal
├── work/page.tsx               # [modify] + generateMetadata (SEO-01,06)
├── work/opengraph-image.tsx    # [NEW] dynamic OG — Fraunces "Work" on charcoal
├── opengraph-image.png         # [NEW] static 1200×630 PNG for / (D-02; hand-tuned)
├── opengraph-image.alt.txt     # [NEW] alt text for above
├── sitemap.ts                  # [NEW] MetadataRoute.Sitemap iterating content/ (D-04)
├── robots.ts                   # [NEW] MetadataRoute.Robots allow-all + sitemap ref (D-04)
├── not-found.tsx               # [NEW] branded 404 (D-05) — monogram + heading + return link
├── icon.svg                    # [no change — D-17 defers monogram swap to v1.x]
├── %5Ftokens/                  # [DELETE entirely] Phase 1 D-11 workaround (D-01 cleanup)
└── globals.css                 # [no change]
proxy.ts                        # [NEW] repo-root file (NOT under app/) — D-18 preview noindex
data/
├── projects.ts                 # [modify] D-16 archived braehods href → github.com/bwaeden/braehods
└── site.ts                     # [no change — sameAs consumes existing socials.github + socials.instagram]
components/contact/
└── ContactModal.tsx            # [modify] Cat B (mailto ::after) + Cat C (role="alert"+silent-success audit)
tests/
├── helpers/
│   └── live-url.ts             # [NEW] Cat D helper — liveUrl(page) wrapper
├── sitemap-renders.spec.ts     # [NEW] sitemap.xml route list + format
├── robots-renders.spec.ts      # [NEW] robots.txt format + sitemap reference
├── og-images-render.spec.ts    # [NEW] og:image meta on each route resolves to 200 + 1200×630
├── jsonld-person.spec.ts       # [NEW] valid Person JSON-LD with sameAs match (D-03)
├── not-found-renders.spec.ts   # [NEW] 404 chrome + monogram + return link (D-05)
├── preview-noindex.spec.ts     # [NEW] proxy.ts X-Robots-Tag on VERCEL_ENV=preview
├── canonical-urls.spec.ts      # [NEW] <link rel="canonical"> matches expected per route
├── metadata-per-route.spec.ts  # [NEW] <title> + meta description present + unique per route
├── contact-modal-*.spec.ts     # [modify ×7] Cat A — mobile viewport detection + open <details>
├── contact-modal-states.spec.ts# [modify] Cat B + Cat C — innerText vs textContent + role="alert"
└── contact-modal-esc-closes.spec.ts # [modify] Cat D — page.url() → liveUrl(page)
.planning/phases/06-polish-seo-launch/
└── visual-checklist.md         # [NEW] D-08 dedup'd 40-item walkthrough
```

### Pattern 1: Per-route generateMetadata (SEO-01, SEO-06)

**What:** Each route exports a `metadata` object or `generateMetadata` function declaring its `<title>`, `description`, `alternates.canonical`, and route-specific `openGraph` overrides. Root layout sets `metadataBase` so route-level entries can use relative paths.

**When to use:** Every route that should have its own crawler-visible identity. Phase 6 covers `/`, `/about`, `/work`, and the implicit `app/not-found.tsx` route.

**Example (root layout — D-03 JSON-LD + metadataBase + title.template):**

```tsx
// Source: nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/layout.tsx
import type { Metadata } from 'next';
import { site } from '@/data/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://braehods.com'),
  title: {
    default: 'Braeden Hodson',
    template: '%s · Braeden Hodson',
  },
  description: site.tagline,
  openGraph: {
    siteName: 'Braeden Hodson',
    type: 'website',
    locale: 'en_US',
    // images: '/opengraph-image' is AUTO-PICKED-UP from app/opengraph-image.png
    // — file-based metadata API overrides config; do NOT also set here.
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/',
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: `https://${site.domain}`,
  sameAs: [
    site.socials.github,
    site.socials.instagram,
  ].filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" ...>
      <body>
        {/* JSON-LD must be inline <script>, NOT next/script (crawler needs initial HTML) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Nav />
        <main>...</main>
        <Footer />
        <ContactModal />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Example (per-route — `/about`):**

```tsx
// app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',  // becomes "About · Braeden Hodson" via parent template
  description: 'Braeden Hodson — business student and entrepreneur in LA.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About', url: '/about' },
};
```

### Pattern 2: Dynamic OG image via `next/og` ImageResponse (SEO-03, D-02)

**What:** A route segment file `app/[route]/opengraph-image.tsx` default-exports an async function returning `new ImageResponse(<JSX>, { width, height, fonts })`. Three config constants — `alt`, `size`, `contentType` — drive the `<head>` meta tags. Statically optimized by default (built at deploy time).

**When to use:** Routes with a dynamic title that can be rendered as a single hero phrase in Fraunces 700 on the charcoal gradient — `/about`, `/work`, and v2 `/writing/[slug]` for free.

**Example (Source: nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image + vercel.com/docs/og-image-generation):**

```tsx
// app/about/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Image metadata — drive <head> via file-based convention
export const alt = 'About Braeden Hodson';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  // Fraunces 700 — Phase 6 ships a static TTF for OG generation
  // (next/font Google loader caches at runtime; for ImageResponse we need
  //  the raw bytes at build time, so we vendor the TTF into /assets/)
  const fraunces700 = await readFile(
    join(process.cwd(), 'assets/Fraunces-Bold.ttf')
  );

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          fontFamily: 'Fraunces',
          color: '#e8e8e8',  // cool-white token
          background: 'linear-gradient(180deg, #1a1a1f 0%, #0a0a0a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '-0.02em',
        }}
      >
        About
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces700, style: 'normal', weight: 700 },
      ],
    }
  );
}
```

**Critical constraints:**
- ImageResponse JSX subset is **flexbox only** — `display: grid` is NOT supported [VERIFIED: vercel.com/docs/og-image-generation Limitations]
- Fonts MUST be passed as ArrayBuffer/Buffer (NOT a URL string) — fetch or `readFile` and pass `data: <buffer>`.
- Tailwind class names work via `experimental.tw` prop on ImageResponse, but inline `style={}` is more reliable and what the docs recommend.
- Image `src=` must use base64 data URI OR ArrayBuffer (with `@ts-expect-error` since spec doesn't allow ArrayBuffer for `<img src>`).
- Max bundle size 500KB total (JSX + CSS + fonts + images).
- Runtime defaults to Node.js in Next 16 for App Router (was previously edge); both work; Node lets you use `readFile` for local fonts which the example uses.

### Pattern 3: Dynamic sitemap iterating `content/` (SEO-04, D-04)

**What:** `app/sitemap.ts` default-exports a function returning `MetadataRoute.Sitemap` (an array of `{ url, lastModified, changeFrequency, priority }`). Combines a static route list with a build-time `fs.readdir` glob of `content/*.mdx` so v2 `/writing` posts extend for free.

**When to use:** Always for SEO; this is the SEO-04 deliverable. Pattern is reusable for any content-driven extension.

**Example (Source: nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap):**

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const BASE_URL = 'https://braehods.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes — v1 surface
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,            lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/work`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Dynamic routes — v2 /writing extension free (content/*.mdx is empty in v1)
  let mdxRoutes: MetadataRoute.Sitemap = [];
  try {
    const contentDir = join(process.cwd(), 'content');
    const entries = await readdir(contentDir);
    const mdxFiles = entries.filter((f) => f.endsWith('.mdx'));
    mdxRoutes = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace(/\.mdx$/, '');
        const stats = await stat(join(contentDir, file));
        return {
          url: `${BASE_URL}/writing/${slug}`,
          lastModified: stats.mtime,
          changeFrequency: 'yearly' as const,
          priority: 0.5,
        };
      })
    );
  } catch {
    // content/ may not exist yet in v1 — quietly skip
  }

  return [...staticRoutes, ...mdxRoutes];
}
```

**Notes:**
- No `export const dynamic = 'force-static'` needed — sitemap.ts is cached by default unless it uses a Request-time API (`cookies()`, `headers()`) or uncached `fetch`. The `fs.readdir` is a build-time op that gets statically resolved.
- `Promise<MetadataRoute.Sitemap>` return type works (async) even though the simplest example is sync.
- `lastModified` accepts `Date` OR ISO string.
- For v2 50k+ posts, switch to `generateSitemaps()` returning array of `{ id }` objects to split. Not relevant for v1.

### Pattern 4: robots.ts (SEO-04, D-04)

```ts
// app/robots.ts — Source: nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://braehods.com/sitemap.xml',
  };
}
```

**Output:**
```
User-Agent: *
Allow: /

Sitemap: https://braehods.com/sitemap.xml
```

### Pattern 5: proxy.ts preview noindex (SEO-09, D-18)

**What:** `proxy.ts` at repo root (NOT under `app/`) sets `X-Robots-Tag: noindex` on every response when `VERCEL_ENV === 'preview'`. Production deploys ship the header absent (so search engines index normally). Matcher excludes static assets.

**Example (Source: nextjs.org/docs/app/api-reference/file-conventions/proxy):**

```ts
// proxy.ts (repo root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(_request: NextRequest) {
  const response = NextResponse.next();
  if (process.env.VERCEL_ENV === 'preview') {
    response.headers.set('X-Robots-Tag', 'noindex');
  }
  return response;
}

export const config = {
  // Negative match — exclude static assets so they don't get the header
  // (and so the proxy doesn't waste CPU on every static file request).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|images|opengraph-image|robots.txt|sitemap.xml).*)'],
};
```

**Critical Next 16 details verified during research:**
- **File MUST be at repo root** (not under `app/`). Co-located with `package.json`, `tsconfig.json`, `next.config.ts`.
- Default runtime is now **Node.js** in Next 16 (was edge before); `proxy.ts` no longer accepts the `runtime` config option (throws build error if set).
- `process.env.VERCEL_ENV` is automatically set by Vercel: `'production'` on prod deploys, `'preview'` on PR/branch deploys, undefined locally — local dev correctly skips the header (localhost not crawled anyway).
- `NextResponse.next()` MUST be called to forward the request — returning nothing breaks the response chain.
- The exported function can be named `proxy` (preferred) or be the default export. Multiple exports not supported.
- A `middleware.ts → proxy.ts` codemod exists: `npx @next/codemod@canary middleware-to-proxy .` — the project has no `middleware.ts`, so this is informational only.

### Pattern 6: Branded 404 with full chrome (SEO-08, D-05)

```tsx
// app/not-found.tsx — Source: nextjs.org/docs/app/api-reference/file-conventions/not-found
import Link from 'next/link';
import { MonogramMark } from '@/components/ui/MonogramMark';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <section
      data-test="not-found-section"
      aria-labelledby="not-found-heading"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-12 text-center"
    >
      <MonogramMark size={80} aria-hidden className="text-[var(--color-muted)]" />
      <h1 id="not-found-heading" className="font-fraunces text-5xl font-bold text-[var(--color-text)]">
        Page not found
      </h1>
      <p className="max-w-md text-[var(--color-muted)]">
        Try /about or /work — or get in touch if you were looking for me.
      </p>
      <Link
        href="/"
        className="text-[var(--color-accent)] transition-[border-color,color,opacity] duration-200 hover:opacity-80"
      >
        ← Back home
      </Link>
    </section>
  );
}
```

**Key facts:**
- `app/not-found.tsx` renders **inside the root layout** — Nav + Footer come for free [VERIFIED: nextjs.org not-found docs § component-hierarchy].
- It's a Server Component by default — keep it that way (FOUND-07 invariant).
- Status code: returns **200 for streamed responses, 404 for non-streamed** per Next's docs. SEO impact: Google explicitly handles this case correctly; tested by Next's team against Googlebot.
- Use `transition-[border-color,color,opacity]` arbitrary-list NOT `transition-colors` (Phase 2 D-04 lesson reaffirmed in Phases 4 + 5).
- Do NOT add `aria-hidden="true"` to the heading or paragraph — they ARE the page content.

### Pattern 7: Atomic-binding commit (D-07 / Phase 5 D-05 inheritance)

**What:** When a refactor MUST land >=2 files together — Category A spec fix in Phase 6 affects 7 spec files sharing one viewport-detection helper — stage all paths together and `git commit` once, then verify the last commit's name-list immediately.

**Verify pattern (Source: Phase 5 SUMMARY commit `48f0a10`):**
```bash
git log -n 1 --name-only HEAD
# Expect: 7+ files for Cat A; planner specifies the exact set in the plan body.
```

Plan-checker rejects plans that split atomic bindings across waves. Phase 6 has at least 2 such bindings:
1. Category A (D-07): the 7 affected spec files + the new `tests/helpers/live-url.ts` could land together OR separately (Cat A vs Cat D), but each Category's files MUST land atomically.
2. Category C: ContactModal.tsx error region edit + spec assertions on `role="alert"` land in one commit.

### Anti-Patterns to Avoid

- **Adding a 2nd `'use client'` directive without dual-gate update** [BLOCKING per `.continue-here.md`]. Phase 6 has NO legitimate need for a 2nd client island — `proxy.ts` is edge/Node runtime (not browser), OG images render on the server, JSON-LD is server, sitemap/robots are server, 404 is server. If a "spinning loader" temptation appears, push back: a CSS-only spinner suffices.
- **`transition-colors` shorthand on focus-rendered elements** [advisory — repeated in Phases 2, 4, 5]. Use `transition-[border-color,color,opacity]` arbitrary-list. Any new 404 link/CTAArrowLink reuse inherits this discipline.
- **Honeypot field named `_gotcha`** [advisory]. Phase 6 does not touch ContactModal honeypot (D-06 Cat C only adds `role="alert"`). Field name stays `company`.
- **Using `<Script>` component for JSON-LD** [SEO BLOCKER]. JSON-LD MUST be inline `<script type="application/ld+json">` in initial HTML; `next/script` defers, which defeats SEO (HTML-limited bots like `facebookexternalhit` can't see deferred content).
- **`metadata.openGraph.images = '/...'` when also using `app/opengraph-image.png`** [silent override]. File-based metadata API has higher priority than config — if you set both, file wins but the config setting is dead code that creates maintenance confusion.
- **`page.url()` after `history.replaceState`** [Category D root cause]. Always `await page.evaluate(() => window.location.href)`. Phase 6 ships `tests/helpers/live-url.ts` to centralize this.
- **`location.hash = ''` to clear hash** [Phase 5 pitfall, still binding]. Use `history.replaceState(null, '', window.location.pathname + window.location.search)`. Phase 6 doesn't add new hash UI; pattern remains binding for any future addition.
- **Hash-driven UI listening ONLY to `hashchange`** [Phase 5 pitfall]. Dual-listener pattern (hashchange + delegated click). Already implemented in ContactModal; preserved through Phase 6 Cat C edits.
- **Lighthouse `page.url()` cached-stale-from-production-alias** [Phase 1 W4 lesson]. `braeden-site.vercel.app` serves stale prod cache; always use per-branch preview URL of form `braeden-site-<hash>-bwaedens-projects.vercel.app`. Set `PLAYWRIGHT_BASE_URL` for the Lighthouse runs.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dynamic OG image rendering | A custom Puppeteer screenshot pipeline / a serverless function that calls Chrome / a Figma API integration | `next/og` `ImageResponse` (built into Next 16) | Built-in. 500KB cap. Edge or Node runtime. Statically optimized at deploy time. Satori (the JSX→SVG→PNG engine) handles font subsetting, emoji, RTL. Hand-rolling adds ~50MB of headless-chrome deps for a feature that ships in the framework. |
| Sitemap generation | A `gulp-sitemap`/`xml-builder`/`sitemap-generator` pipeline / hand-edited XML | `app/sitemap.ts` returning `MetadataRoute.Sitemap` | Built-in. Cached by default. Type-safe. Image+video sub-elements supported natively. `generateSitemaps()` handles 50k+ post split. |
| robots.txt | A static `public/robots.txt` file | `app/robots.ts` returning `MetadataRoute.Robots` | Static `public/robots.txt` works but is harder to keep in sync with the sitemap URL (which changes per deploy environment). The file-based code form lets you template `Sitemap:` from `metadataBase`. |
| Preview noindex | A `meta robots` tag inside `app/layout.tsx` conditional on a server-resolved env var | `proxy.ts` setting `X-Robots-Tag` at the edge | A meta tag in layout works but pollutes HTML and runs per-render (cost ×N pages). `proxy.ts` runs at the edge once per request and applies to the entire response set including the OG image route handlers, sitemap, robots.txt — anywhere a crawler might land. |
| Branded 404 | An `app/error.tsx` boundary with a 404 conditional / a custom `_error` page (Pages Router pattern) | `app/not-found.tsx` (App Router convention) | `not-found.tsx` is the App Router primitive — automatically wraps in `<Suspense>` from `loading.js` and the error boundary from `error.js`, integrates with Nav + Footer for free, returns the right status code. `error.tsx` is for 5xx — different concern. |
| Person JSON-LD | A custom schema validator / a 3rd-party "structured data" lib | Inline `<script type="application/ld+json">` with a typed JS literal | schema.org/Person is fixed-shape; types are JSON not TS. A custom literal + `JSON.stringify` is 20 lines + zero deps. Validation happens at Google Rich Results Test (manual, one-shot). |
| Lighthouse audit harness | A custom Chrome-launcher script / a github-actions wrapper / a homemade CI integration | `playwright-lighthouse` (already installed) | Already wired in Phase 1's `tests/lighthouse.spec.ts`. Threshold config is one object. `playAudit()` returns Lighthouse Result Object including `numericValue` for every audit (LCP, CLS, TBT, FCP, SI, INP). Plays nicely with the existing Playwright project matrix (chromium-mobile + chromium-desktop). |
| Color-contrast measurement on non-text UI elements (#707070 dot, #c8a86a char counter) | A custom luminance calculator / a screenshot+pixel-color-picker / a Photoshop manual measure | **For body text (1.4.3 4.5:1):** `@axe-core/playwright` color-contrast rule. **For non-text/UI (1.4.11 3:1):** WebAIM Contrast Checker manual measure OR a one-shot script using `colorette`/`chroma-js` luminance + WebAIM formula | axe-core's color-contrast rule **does NOT cover WCAG 1.4.11** (graphical/UI 3:1 threshold) [VERIFIED: dequelabs/axe-core rule-descriptions doc; testparty.ai 1.4.11 guide]. For the 2 carry-forward measurements (Phase 4 #2 archived dot + Phase 5 #11 char counter), the manual WebAIM measure documented in `04-01-SUMMARY § Phase 6 Carry-Forwards` is canonical. |
| DNS swap automation | A Cloudflare API script / a `dig`-based watcher / a registrar-specific webhook | The Vercel dashboard + the domain registrar's UI, in order per D-13 | DNS swap is a one-time event with a 6-step linear sequence. Automating saves no time and introduces risk. Manual sequence has well-defined rollback (revert CNAME at registrar). |
| GitHub repo archival | A custom `git push` to a read-only branch / a `chmod` of the repo files / a release tag with "archived" prefix | `gh repo archive bwaeden/braehods --yes` (single command) | GitHub's "Archive this repository" flips a flag — read-only, preserves issues/PRs/commits, adds a deprecation banner. `gh` CLI is already installed (used in Phase 4 hardening). |

**Key insight:** Phase 6 is almost entirely an exercise in correctly invoking Next.js + Vercel + GitHub built-ins. Any "build custom X" temptation should be rejected — every load-bearing pattern in this phase has a framework-native convention.

## Runtime State Inventory

Phase 6 includes a rename/migration component: DNS swap from old GitHub Pages → new Vercel deployment, archived braehods href change, `app/%5Ftokens/` deletion. Per protocol, explicitly inventory:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | None — site is stateless. Formspree submissions are received by Formspree's own DB (out-of-scope), not stored by the site. No analytics-side stored data (Vercel Analytics is cookieless and per-session). | None |
| **Live service config** | (1) Vercel project domains list: `braehods.com` + `www.braehods.com` need to be added (D-13 W0). (2) Vercel env vars: `NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw` already set across Production+Preview+Development per Phase 1 D-13. (3) Formspree endpoint `xqeypnkw` exists but has never received a real submit from a deployed site — Plan 06-01 D-14e validates. (4) GitHub `bwaeden/braehods` repo: archive flag flip (LNCH-02). | (1)+(4) manual via Vercel dashboard + `gh repo archive`. (2) verify-only — already set. (3) gated by D-14e real-email check. |
| **OS-registered state** | None — site is hosted on Vercel; no OS-level tasks, no scheduled jobs, no systemd units. | None |
| **Secrets and env vars** | `NEXT_PUBLIC_FORMSPREE_ID` set in Vercel project env across all envs (Phase 1 D-13). No new secrets in Phase 6. `proxy.ts` reads `VERCEL_ENV` which is auto-injected by Vercel (not user-managed). | None |
| **Build artifacts / installed packages** | (1) `app/%5Ftokens/` URL-encoded folder (Next App Router private-folder workaround from Phase 1 D-11) — D-01 deletes. After delete, verify no `git grep -l '_tokens'` matches in `app/`. (2) Stale Vercel production cache at `braeden-site.vercel.app` (per `.continue-here.md`: "Age ~44h, X-Vercel-Cache: HIT") — flips to fresh on first production deploy. (3) `.claude/worktrees/agent-ad910235ed9da2c64/` — Windows file lock; gitignored; harmless. | (1) `rm -rf app/%5Ftokens/` in Plan 06-01 W0. (2) auto-resolves on first prod deploy. (3) ignore. |

**Canonical question — answered:** *After every file in the repo is updated, what runtime systems still have the old string cached, stored, or registered?*

**Answer:** Only the stale `braeden-site.vercel.app` production-alias cache (44h old as of last check). The production deploy in Plan 06-03 invalidates it. Nothing else: no DB collections to migrate, no env vars to rename, no OS jobs to re-register, no installed packages to reinstall. **Phase 6 is a clean migration with one cache-bust.**

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All Next/Playwright tooling | ✓ | 20+ (Vercel uses 20 LTS) | — |
| npm | All package management | ✓ | — | — |
| `gh` CLI | LNCH-02 repo archive (`gh repo archive`) | ✓ | (used in Phase 4 hardening commit `7628dcc`) | Manual: GitHub UI → repo Settings → "Archive this repository" |
| `dig` | DNS propagation verification (D-13 step 5) | ✓ (on Windows: nslookup is the equivalent; `dig` may need Git Bash or WSL) | — | `nslookup` or `https://www.whatsmydns.net/` web check |
| `curl` | LNCH-04 prod URL smoke + the 3 GH URL real-link verifications | ✓ | — | — |
| Vercel dashboard access | D-13 add-domain step + D-14 promote-to-production step | ✓ (user owns project) | — | Vercel CLI: `vercel domains add braehods.com` + `vercel --prod` |
| Chrome / Chromium | Playwright lighthouse audits (CDP port 9222) | ✓ (Playwright bundles Chromium) | — | — |
| Real iPhone (Safari) | LNCH-04 real-device test (Pitfall 7 + Pitfall 8) | ✓ (user has iPhone per Phase 5 carry-forward #9) | iOS Safari | DevTools mobile emulation — known to miss some quirks |
| Real Android device | LNCH-04 real-device test | (user-dependent) | — | DevTools emulation if unavailable; flag in SUMMARY |
| NVDA screen reader | D-12 audit | ✓ (free Windows download) | — | If install fails, defer SR audit to v1.x; document gap |
| VoiceOver iOS | D-12 audit | ✓ (built into iOS) | — | — |
| Domain registrar UI | D-13 CNAME flip | ✓ (user owns braehods.com) | — | — |
| Slack workspace / iMessage / LinkedIn / X (Twitter) | LNCH-04 OG validation | ✓ | — | https://www.opengraph.xyz/ as a single-shot validator |
| Google Rich Results Test | Plan 06-02 SUMMARY § Person JSON-LD validation | ✓ (https://search.google.com/test/rich-results — public) | — | — |
| WebAIM Contrast Checker | Carry-forward #2 (#707070 already resolved) + #11 (#c8a86a still pending) | ✓ (https://webaim.org/resources/contrastchecker/) | — | — |
| `slopcheck` (Python CLI) | Package legitimacy audit | ✗ (`pip install slopcheck` failed during research; CLI not in PATH) | — | Manual `npm view <pkg>` for each (already done in § Package Legitimacy Audit) |

**Missing dependencies with no fallback:**
- None blocking. `slopcheck` is the only ✗ but the alternative (manual `npm view`) was executed during this research session and provided equivalent assurance.

**Missing dependencies with fallback:**
- Real Android device → DevTools emulation (note gap in SUMMARY).
- `dig` on PowerShell → `nslookup` or whatsmydns.net.

## Common Pitfalls

### Pitfall 1: `@next/bundle-analyzer` is incompatible with Turbopack — CONTEXT D-11 needs revision

**What goes wrong:** Installing `@next/bundle-analyzer@16.2.6` and wrapping `next.config.ts` with `withBundleAnalyzer(...)` then running `ANALYZE=true npm run build` will: (a) emit a warning "@next/bundle-analyzer does not support Turbopack" [VERIFIED: vercel/next.js#77482], (b) likely fall back to webpack for the analyze run only, producing a webpack-tree report that doesn't match the actual Turbopack production bundle. Worse: it can silently produce a stale `.next/analyze/client.html` from a prior webpack build.

**Why it happens:** Next 16 switched default bundler to Turbopack [VERIFIED: nextjs.org/blog/next-16]. `@next/bundle-analyzer` is a thin wrapper around `webpack-bundle-analyzer` (verified: `npm view @next/bundle-analyzer dependencies` returns exactly `webpack-bundle-analyzer: 4.10.1`). It has no Turbopack adapter.

**How to avoid:** Use **`npx next experimental-analyze --output`** instead [VERIFIED: nextjs.org/docs/app/guides/package-bundling § Next.js Bundle Analyzer]. Available in Next 16.1+. The project is on 16.2.6 so it's present. The command:
- Builds a Turbopack-native production bundle.
- Opens an interactive treemap in browser (omit `--output` flag).
- With `--output`, writes a static HTML report to `.next/diagnostics/analyze/` for sharing/diffing.
- Filters by route (so "first-page bundle for `/`" is a single click).
- Traces import chains across server-to-client boundaries.
- ZERO devDeps to add/remove (built into `next` CLI).

**Warning signs:** A WARNING in the build output mentioning "Turbopack", an `analyze/` directory under `.next/` (webpack uses `.next/analyze/`) vs `.next/diagnostics/analyze/` (Turbopack), a bundle measurement that disagrees with Vercel Speed Insights real-user data.

**Action for `discuss-phase`:** Re-confirm D-11 with user. Recommended pivot:
> **D-11 (revised):** PERF-03 bundle measurement via `npx next experimental-analyze --output` (Next 16.1+ Turbopack-native, no devDep install). Run in Plan 06-02 W0; capture first-page bundle size (route `/` client chunk excluding ContactModal lazy-load) in `06-02-SUMMARY.md`. If >50KB gz, identify what to defer/lazy-load per PERF-03. Delete `.next/diagnostics/analyze/` from git after measurement (output is gitignored).

### Pitfall 2: File-based OG image overrides `metadata.openGraph.images` silently

**What goes wrong:** Plan-author sets BOTH `app/opengraph-image.png` (file) AND `metadata.openGraph.images = '/og.png'` (config) in `app/layout.tsx`. The file wins, the config is dead code, and a future plan-author "fixes" the config thinking it's the source of truth.

**Why it happens:** Next docs explicitly note: "File-based metadata has the higher priority and will override the `metadata` object and `generateMetadata` function" [VERIFIED: nextjs.org § generateMetadata Good to know]. This is correct behavior, but undocumented in the OG image route convention page.

**How to avoid:** Do NOT also set `openGraph.images` in metadata when shipping `app/opengraph-image.png`. The file convention auto-injects `<meta property="og:image" content="<generated>" />`. If you want to *also* control alt text per-route, use the `opengraph-image.alt.txt` companion file.

**Warning signs:** Two `<meta property="og:image">` tags in rendered HTML (file + config both emitted).

### Pitfall 3: `ImageResponse` `display: grid` silently produces broken layout

**What goes wrong:** Author copies a Tailwind-style layout using `grid-cols-2` into the OG image JSX. Image renders as a single column with all content stacked.

**Why it happens:** Satori (the engine behind `ImageResponse`) supports only `display: flex` [VERIFIED: vercel.com/docs/og-image-generation § Limitations]. Grid silently falls back to block layout.

**How to avoid:** Compose every OG image with `display: flex` (row or column). For the D-02 use case (single title centered on charcoal), one flex container + `alignItems: 'center'` + `justifyContent: 'center'` is sufficient.

**Warning signs:** OG preview in Slack/iMessage looks vertical-stacked when JSX implies side-by-side.

### Pitfall 4: Lighthouse audit against the wrong Vercel URL (stale production alias)

**What goes wrong:** Author runs `PLAYWRIGHT_BASE_URL=https://braeden-site.vercel.app npm run test:full` and gets a passing Lighthouse score — but it's measuring the stale 44h-old cache, not the new commit.

**Why it happens:** `braeden-site.vercel.app` is Vercel's **production alias**, NOT the per-branch preview URL [VERIFIED: STATE.md "Preview URL correction (important)"]. Production deploys haven't happened since Phase 1, so it serves a stale cache (`X-Vercel-Cache: HIT`, `Age: ~160000s`). The new build has its own per-branch URL of the form `braeden-site-<hash>-bwaedens-projects.vercel.app`.

**How to avoid:** ALWAYS grab the preview URL from Vercel Dashboard → Deployments → most recent (most-recent-commit). The URL format is `braeden-site-<random>-<scope>.vercel.app`. Verify before running:
```bash
curl -sI https://<preview>.vercel.app | grep -i x-vercel-cache
# Expect: x-vercel-cache: MISS (or PRERENDER) for the first request after deploy
# NEVER trust: x-vercel-cache: HIT with Age > 60s
```

**Warning signs:** Lighthouse passing instantly without iteration; bundle measurement showing 0 first-page JS; OG image preview showing the old design.

### Pitfall 5: `dangerouslySetInnerHTML` JSON-LD escape

**What goes wrong:** Author writes `<script type="application/ld+json">{JSON.stringify(personLd)}</script>` and React escapes the `{` to `&lcub;`, producing invalid JSON that crawlers reject.

**Why it happens:** React's default JSX behavior escapes all text content. `<script>{...}</script>` puts the content in a JSX expression, which gets escaped on render.

**How to avoid:** Use `dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}`. This is the documented Next.js pattern for inline JSON-LD. The data is a TS literal under your control — no user input — so XSS risk is zero.

**Warning signs:** Google Rich Results Test reports "Invalid JSON" or "Parse error". View-source shows `&quot;@context&quot;` instead of `"@context"`.

### Pitfall 6: `proxy.ts` outside repo root

**What goes wrong:** Author creates `app/proxy.ts` or `src/proxy.ts` and Next doesn't pick it up. No header injected. Preview deploys leak into Google.

**Why it happens:** `proxy.ts` location is fixed: **same level as `app/` (or `pages/`)** — i.e., repo root [VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/proxy]. The project has its `app/` at the repo root, so `proxy.ts` ALSO goes at the repo root, NOT under `app/`. (If the project used a `src/` directory, it would be `src/proxy.ts`. This project doesn't.)

**How to avoid:** Verify post-create:
```bash
ls -la proxy.ts  # expect: file exists at repo root
ls -la app/ | grep proxy.ts  # expect: NO match (would be wrong location)
```

**Warning signs:** Curling a preview deploy doesn't return `X-Robots-Tag: noindex` (even though `VERCEL_ENV=preview` is set).

### Pitfall 7: Sitemap iterating non-existent `content/` directory throws at build

**What goes wrong:** Sitemap calls `fs.readdir('content')` but the directory doesn't exist (v1 has no MDX files yet — content/ may not exist at all). Build fails with ENOENT.

**Why it happens:** v1 doesn't ship `/writing` — `content/` is reserved for v2. Production build runs `sitemap.ts` to prerender, throws.

**How to avoid:** Wrap in try/catch (as shown in Pattern 3 example) OR check `fs.existsSync('content')` before `readdir`. The try/catch is more idiomatic and resilient to permission errors too.

**Warning signs:** `next build` failure with `ENOENT: no such file or directory, scandir 'content'`.

### Pitfall 8: Cookie-banner regulation surprise (already mitigated)

**What goes wrong:** Author or user adds GA4 / Plausible / a Stripe pixel mid-Phase-6. Cookie-consent banner becomes required for EU traffic. Banner clashes with editorial aesthetic.

**Why it doesn't happen here:** Vercel Analytics + Speed Insights are explicitly cookieless [VERIFIED: CLAUDE.md § Other Specific Decisions → Analytics]. PROJECT.md "Out of Scope" lists "Cookie consent banner" with reason. Just don't deviate.

**Warning signs:** Anyone suggests "let's add GA4 for richer data" — push back; v1.x revisit.

### Pitfall 9: Vercel domain SSL "Invalid Configuration" panic during DNS swap

**What goes wrong:** User adds `braehods.com` to Vercel; dashboard shows "Invalid Configuration" with a red dot. Panic ensues; user reverts.

**Why it happens:** Vercel shows "Invalid Configuration" until the DNS CNAME/A record actually points at Vercel — which is exactly the state during D-13 step 2 (between adding domain and flipping CNAME). The status corrects itself ~5 minutes after the CNAME flip and DNS propagation.

**How to avoid:** Expect "Invalid Configuration" during the gap window. Verify SSL stages anyway:
```bash
curl --resolve braehods.com:443:76.76.21.21 https://braehods.com -sI | head -5
# Expect: HTTP/2 200 or HTTP/2 308 (Vercel-side response, before CNAME flip)
```

**Warning signs:** Red dot persisting >10 minutes after CNAME flip + DNS propagation confirmed via `dig braehods.com +short`.

### Pitfall 10: WebAIM contrast measure misses grain compositing

**What goes wrong:** Author measures `#707070` dot against `#1a1a1f` background mathematically — gets 3.6:1 — PASS. But the live `body::after` SVG grain overlay (opacity 0.04, mix-blend-mode overlay) shifts the actual pixel values. Real composited contrast could drop below 3.0:1 with the grain texture interacting.

**Why it happens:** WebAIM Contrast Checker is a math tool taking hex values; it can't account for compositing.

**How to avoid:** Measure against the LIVE deployed preview using DevTools color-picker:
1. Open `/work` on preview URL.
2. DevTools → Elements → Inspect → Color picker (the eyedropper icon next to a color value).
3. Pick the rendered pixel color of the dot AND a nearby background pixel.
4. Enter both hex values into WebAIM.

For Phase 4 carry-forward #2 (#707070 dot), this measurement was completed 2026-05-14 with result PASS ≥3.0:1 [VERIFIED: `04-01-SUMMARY § Post-Close Hardening`]. For Phase 5 carry-forward #11 (#c8a86a char counter), STILL PENDING — Plan 06-02 owns.

### Pitfall 11: Lighthouse mobile vs desktop project mismatch (Phase 1 lesson)

**What goes wrong:** Author runs Lighthouse via Playwright in `chromium-mobile` project (Pixel 5 viewport) and expects mobile-Lighthouse scoring — but `playAudit()` does its own emulation independent of the Playwright viewport.

**Why it happens:** `playwright-lighthouse@4` runs Lighthouse against the same Chromium that Playwright launched, using Lighthouse's OWN emulation profile. The `playwright-lighthouse` form-factor option drives the Lighthouse emulation (mobile/desktop CPU throttle, network throttle), separately from Playwright's viewport.

**How to avoid:** Set the form factor explicitly when calling `playAudit()`:
```ts
const lhResult = await playAudit({
  page,
  port: 9222,
  thresholds: { performance: 95, accessibility: 95, 'best-practices': 95, seo: 95 },
  // Form factor must be set EXPLICITLY:
  config: { settings: { emulatedFormFactor: 'mobile' } },  // or 'desktop'
});
```
Or — simpler — gate via Playwright `browserName + projectName` (chromium-mobile project sets mobile, chromium-desktop sets desktop):
```ts
const formFactor = test.info().project.name.includes('mobile') ? 'mobile' : 'desktop';
```

**Warning signs:** Same Lighthouse score reported across both projects; mobile passing 95+ trivially while real-user Speed Insights show LCP > 2.5s.

### Pitfall 12: Real Formspree email never arrives (preview-vs-prod env)

**What goes wrong:** D-14e gate fails because the email from preview submit never lands in fakegoat1@gmail.com. Panic; user reverts.

**Why it happens:** Either (a) `NEXT_PUBLIC_FORMSPREE_ID` is set in Vercel "Production" scope but NOT "Preview" scope (verify both), (b) Formspree free-tier limits hit (50 submissions/month — easy to blow during testing), or (c) email arrived in Gmail Spam.

**How to avoid:** Before D-14e attempt:
1. Verify `NEXT_PUBLIC_FORMSPREE_ID` set in BOTH Preview and Production scope (Vercel dashboard → Settings → Environment Variables).
2. Check Formspree dashboard at https://formspree.io/forms/xqeypnkw for submission count and recent activity.
3. Send a test, then check Gmail All Mail (not just Inbox) + Spam. Whitelist `submissions@formspree.io` from Promotions tab if needed.

**Warning signs:** Formspree dashboard shows submission landed but Gmail doesn't; check Spam.

## Code Examples

### Per-route metadata with canonical (SEO-01, SEO-06)

```tsx
// app/work/page.tsx — Source: nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected projects by Braeden Hodson — trading, content, tools.',
  alternates: { canonical: '/work' },
  openGraph: {
    title: 'Work',
    url: '/work',
    // images NOT set here — opengraph-image.tsx file convention auto-injects
  },
};

// ... rest of page
```

### Person JSON-LD inline (SEO-05, D-03)

```tsx
// app/layout.tsx — addition adjacent to existing imports
import { site } from '@/data/site';

// Compute outside the component (no per-request work)
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: `https://${site.domain}`,
  sameAs: Object.values(site.socials).filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" ...>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* ... existing Nav, main, Footer, ContactModal, Analytics, SpeedInsights */}
      </body>
    </html>
  );
}
```

### tests/helpers/live-url.ts (D-06 Category D)

```ts
// tests/helpers/live-url.ts
// Source: 05-CONTEXT D-06 Category D + Phase 5 .checkpoint-state.md
//
// Playwright's page.url() caches the URL at navigation events. history.replaceState
// does NOT fire a navigation event, so the cached URL stays stale (returns #contact
// even after the modal close clears it via replaceState).
//
// liveUrl(page) reads the live window.location.href from the browser context — always
// reflects the truth. Use this anywhere a test reads the URL after a hash-clearing
// or history.replaceState-driven UI action.
import type { Page } from '@playwright/test';

export async function liveUrl(page: Page): Promise<string> {
  return page.evaluate(() => window.location.href);
}
```

Usage in Category D spec edit:
```ts
// tests/contact-modal-esc-closes.spec.ts (after edit)
import { liveUrl } from './helpers/live-url';

// OLD (Cat D bug):
// expect(page.url()).not.toContain('#contact');

// NEW:
expect(await liveUrl(page)).not.toContain('#contact');
```

### Category A mobile viewport detection (D-06)

```ts
// tests/contact-modal-opens-from-nav.spec.ts (representative — same pattern across all 7)
import { test, expect } from '@playwright/test';

test('CTCT-01: modal opens from Nav Contact link', async ({ page }) => {
  await page.goto('/');

  // Category A fix — detect mobile viewport, open hamburger first
  const viewport = page.viewportSize();
  const isMobile = viewport ? viewport.width < 768 : false;
  if (isMobile) {
    // Mobile uses <details> hamburger; expand before the link is in a11y tree
    await page.locator('details > summary').click();
  }

  await page.getByRole('link', { name: 'Contact' }).first().click();
  // ... rest of the spec
});
```

Pattern is reusable for any future mobile-conditional click; centralize as a helper if a 4th spec emerges:
```ts
// tests/helpers/open-mobile-nav.ts  (defer — only if pattern repeats post-Phase-6)
export async function openMobileNavIfNeeded(page: Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 768) {
    await page.locator('details > summary').click();
  }
}
```

### Category B mailto `::after` arrow (D-06)

```tsx
// components/contact/ContactModal.tsx — replace the existing mailto link rendering
// OLD: <a href={MAILTO_HREF} className="...">Or just email me directly <span aria-hidden className="inline-block">→</span></a>
// NEW: arrow as CSS ::after pseudo-element

<a
  href={MAILTO_HREF}
  className="
    group inline-flex items-baseline gap-1 text-[var(--color-muted)]
    after:content-['→']
    after:transition-transform after:duration-200
    hover:after:translate-x-0.5
  "
>
  Or just email me directly
</a>
```

**Why this works for spec assertion:** Playwright's `:text-is("Or just email me directly →")` uses `innerText`, which collapses the `inline-block` `<span>` into a newline. With `::after`, the arrow is a pseudo-element — NOT part of `innerText`. The spec assertion needs to change too:
```ts
// Either: assert on the text node only (no arrow)
await expect(link).toHaveText('Or just email me directly');

// Or: assert on the ::after computed content
const afterContent = await link.evaluate(
  (el) => window.getComputedStyle(el, '::after').content
);
expect(afterContent).toMatch(/→/);
```

The spec authors will need to pick one — Plan 06-01 W0 makes the call. Recommend the second form (asserts the arrow IS rendered) since it captures the visual intent.

### proxy.ts preview noindex (SEO-09, D-18)

```ts
// proxy.ts (repo root — same level as next.config.ts)
// Source: nextjs.org/docs/app/api-reference/file-conventions/proxy
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(_request: NextRequest) {
  const response = NextResponse.next();
  if (process.env.VERCEL_ENV === 'preview') {
    response.headers.set('X-Robots-Tag', 'noindex');
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|images|opengraph-image|robots\\.txt|sitemap\\.xml).*)',
  ],
};
```

Spec assertion:
```ts
// tests/preview-noindex.spec.ts
import { test, expect } from '@playwright/test';

test('SEO-09: preview deploys serve X-Robots-Tag: noindex', async ({ page, baseURL }) => {
  // This spec only runs against the preview URL via PLAYWRIGHT_BASE_URL
  test.skip(!baseURL?.includes('vercel.app'), 'Only meaningful against preview URL');

  const response = await page.goto('/');
  const robots = response?.headers()['x-robots-tag'];
  expect(robots, 'preview should serve X-Robots-Tag: noindex').toBe('noindex');
});
```

### gh repo archive (LNCH-02, D-15)

```bash
# Phase 6 Plan 06-03 archives the old GitHub Pages repo
gh repo archive bwaeden/braehods --yes

# Verify:
gh repo view bwaeden/braehods --json isArchived --jq .isArchived
# Expect: true
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` | Next 16.0 (Oct 2025) | Renamed per `vercel/next.js` philosophy shift; codemod available; old name deprecated. |
| `next/legacy/image` | `next/image` | Next 16.0 | Deprecated; project uses `next/image` already. |
| `images.domains` config | `images.remotePatterns` | Next 16.0 | Phase 6 doesn't use either — OG images are same-origin. |
| Webpack default bundler | Turbopack default bundler | Next 16.0 | Build is ~2-5x faster. Affects `@next/bundle-analyzer` compat → use `next experimental-analyze` instead. |
| `@vercel/og` separate npm install | Built-in `next/og` for App Router | Next 13+ | Project uses App Router — no install needed. |
| `framer-motion` package name | `motion` package | Late 2024 rebrand | Not relevant — project ships zero motion library; CSS-only animation. |
| `next lint` command | Direct ESLint invocation (`npm run lint`) | Next 16.0 | `next lint` removed; project already uses `eslint` direct. |
| Edge runtime default for Middleware | Node.js runtime default for Proxy | Next 16.0 + Next 15.5 stable | `proxy.ts` no longer accepts `runtime` config; defaults to Node.js; this is fine for D-18's env-var check. |

**Deprecated/outdated:**
- `middleware.ts` filename — superseded by `proxy.ts`. CLAUDE.md flags this in "What NOT to Use".
- `@vercel/og` standalone install for App Router projects — superseded by built-in `next/og`.
- `@next/bundle-analyzer` for Turbopack projects — see Pitfall #1 + § Don't Hand-Roll.
- `axe-core` standalone (non-Playwright) — superseded by `@axe-core/playwright` for E2E integration.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Vercel auto-issues Let's Encrypt SSL upon adding the domain to a project, and the SSL "Valid" status lands typically <5 minutes after add (BEFORE CNAME flip). | D-13 step 2-3 | If SSL takes hours to stage, the D-13 sequence becomes a longer wait. Mitigation: D-13 says "wait for Valid status"; the actual time is observability, not blocker. [BASED ON: vercel.com/docs/domains documentation tone + general Let's Encrypt behavior — not explicitly stated as a SLA] |
| A2 | The Vercel `braeden-site.vercel.app` production alias will serve fresh content after the first `vercel --prod` or "Promote to Production" in Plan 06-03. | Pitfall #4, D-14 | If the cache stays stale post-promote, manual cache-bust may be needed (`vercel deploy --force` or Vercel Dashboard → Deployment → Redeploy). [BASED ON: Vercel's standard CDN invalidation on promotion — observed elsewhere but not explicitly cited in scraped docs] |
| A3 | `proxy.ts` in Next 16 defaults to Node.js runtime AND has access to `process.env.VERCEL_ENV` at request time (Vercel injects). | Pattern 5 / D-18 | If `VERCEL_ENV` is only available at build time, the preview-detection logic wouldn't work. [VERIFIED via Next docs that `process.env.VERCEL_ENV` is auto-injected by Vercel at runtime; explicitly listed in Vercel deploy environment variables; HIGH confidence this works.] |
| A4 | The 4 stub GitHub repos created during Phase 4 hardening (`shorts-factory`, `meme-dashboard`, `prediction-market-bot`, `mc-packet-client`) remain public and 200 at Plan 06-01 W0 link-verify time. | Carry-forward #3 / Plan 06-01 exit gate | If repos went private since 2026-05-14, the curl-loop will show 404s. Recovery: re-flip to public via `gh repo edit --visibility public`. |
| A5 | `MonogramMark.tsx` exposes a `size` prop the 404 page can pass `size={80}` to. | Pattern 6 / Code Examples / D-05 | If `MonogramMark` is fixed-size, 404 needs a `style={{ width: 80, height: 80 }}` wrapper. Easy fix at plan time — read the component. |
| A6 | The user can install/run NVDA on Windows (D-12 audit). | § Environment Availability | NVDA install fails for some users on managed-device Windows. Mitigation: fall back to JAWS via NV Access trial, or defer SR audit to v1.x with documented gap. |
| A7 | `tests/lighthouse.spec.ts` accepts `PLAYWRIGHT_BASE_URL` (not just `BASE_URL`) — the playwright config wires `baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'`. | D-10 / Pitfall 4 | Verified during research — playwright.config.ts line 23 uses `PLAYWRIGHT_BASE_URL`. The carry-forward recipe in `04-01-SUMMARY` uses both names interchangeably; the canonical one is `PLAYWRIGHT_BASE_URL`. Plan should use the canonical. [VERIFIED: playwright.config.ts line 23] |
| A8 | `@axe-core/playwright` color-contrast rule covers WCAG 1.4.3 (4.5:1 normal text on body content) but NOT 1.4.11 (3:1 graphical/UI). | § Don't Hand-Roll / Pitfall #10 | Verified via Deque rule-descriptions doc; axe-core does NOT auto-check 1.4.11. WebAIM manual measure for `#c8a86a` char counter remains required. [VERIFIED HIGH confidence] |
| A9 | The Formspree free-tier limit is 50 submissions/month — enough for D-14e (1 real submit) + occasional re-test. | Pitfall #12 | If limit was hit during prior testing, real-email gate may fail with throttle response. Check Formspree dashboard before D-14e. |
| A10 | The CONTEXT D-09 claim that Analytics + SpeedInsights are "NOT yet mounted in `app/layout.tsx`" is incorrect — they ARE already mounted (verified via Read of `app/layout.tsx` during research). | D-09 | If D-09 mount-step is treated as needing implementation, planner will produce a no-op task. Plan-phase MUST verify the layout.tsx state and collapse D-09 to a verify-step. [VERIFIED via Read: app/layout.tsx lines 1-2 imports + lines 22-23 JSX] |

## Open Questions

1. **`@next/bundle-analyzer` vs `next experimental-analyze` — does discuss-phase reopen D-11?**
   - What we know: `@next/bundle-analyzer` is webpack-only; project is on Turbopack; `next experimental-analyze` is the Turbopack-native replacement shipped in Next 16.1; project is on Next 16.2.6 so the experimental command is available.
   - What's unclear: User may have specifically wanted the webpack-style report for diffing against historical baselines (none exist — Phase 6 is the first bundle measurement). Or user may not care about implementation and just want a number.
   - Recommendation: planner proposes D-11 (revised) per Pitfall #1; if `discuss-phase` was a single auto-mode session, the planner can apply the revision unilaterally (it's a strict improvement: same outcome, zero deps, no Turbopack incompat). Document the pivot in `06-02-SUMMARY.md`.

2. **D-09 mount-vs-verify collapse — is Analytics + SpeedInsights already wired?**
   - What we know: `app/layout.tsx` line 1-2 (imports `@vercel/analytics/next` + `@vercel/speed-insights/next`) + line 22-23 (`<Analytics />` + `<SpeedInsights />` JSX). [VERIFIED via Read]
   - What's unclear: How CONTEXT D-09 was written assuming they're NOT mounted. Either CONTEXT was authored against an earlier layout.tsx state, or there's a build-time stripping concern (unlikely).
   - Recommendation: Plan 06-01 W1 D-09 task collapses to: "Verify `<Analytics />` and `<SpeedInsights />` are mounted in `app/layout.tsx` lines 22-23 (already present per Phase 5 wave); confirm `npm run build` includes them in production bundle." Saves a task; no behavior change.

3. **Fraunces TTF for `ImageResponse` — vendor where?**
   - What we know: Pattern 2 example reads `assets/Fraunces-Bold.ttf` via `readFile(process.cwd() + 'assets/Fraunces-Bold.ttf')`. Project does not currently have an `assets/` directory (only `public/`).
   - What's unclear: Whether to put OG fonts under `assets/`, `public/fonts/`, or vendor them directly into the OG route file as a base64 constant.
   - Recommendation: Plan 06-02 W0 creates `assets/` (NOT `public/` — assets/ is build-time-only, public/ would serve the TTF as a static asset, exposing ~200KB of font bytes publicly for no reason). Download Fraunces v38 weight 700 TTF from `https://gstatic.com/.../fraunces-v38-latin-700.woff2` (convert to TTF since Satori prefers TTF) or `https://fonts.google.com/specimen/Fraunces` → "Get the font" → download static. Vendor the SINGLE 700-weight TTF (~200KB) into `assets/Fraunces-Bold.ttf`. Gitignore `assets/` if user doesn't want fonts in git, OR commit (license is SIL OFL, distribution allowed). Recommend commit — reproducible builds, no network dep at deploy time.

4. **OG image for static `/` route — hand-tune in Figma vs auto-generate one-off via local script?**
   - What we know: D-02 says "hand-tuned static 1200×630 PNG fallback for `/`". The `/` hero is the most-shared URL; deserves intentional design.
   - What's unclear: Whether the user has Figma access for a one-shot design, or whether to generate via a local one-off script (e.g., `app/_og-source.tsx` invoked manually + PNG saved to `app/opengraph-image.png`).
   - Recommendation: Generate via a one-off Node script using the same `ImageResponse` API as the dynamic routes — keeps the aesthetic locked. The script lives outside `app/` (e.g., `scripts/build-static-og.mjs`), is invoked once via `node scripts/build-static-og.mjs > app/opengraph-image.png`, and the resulting PNG is committed. NOT a build-time auto-generation (would be wasteful for a static asset). This is the discuss-with-user candidate.

5. **404 page Lighthouse exclusion — should `tests/lighthouse.spec.ts` skip 404?**
   - What we know: D-05 says "Lighthouse 95+ on the 404 route is NOT required". The spec needs to either skip the 404 or not test it.
   - What's unclear: Whether the current `tests/lighthouse.spec.ts` only tests `/` (looks like it — opens `await page.goto('/')` line 41). If so, no skip needed; only `/`, `/about`, `/work` get audited.
   - Recommendation: Verify lighthouse spec only tests the 3 declared routes during Plan 06-02. If it expands to all routes via parametrization, add `test.skip(route === '/404')` per D-05.

6. **JSON-LD `sameAs` filter for nullable `socials.youtube`?**
   - What we know: `data/site.ts.socials` literal currently has `{ github, instagram }` only — no `youtube` key. `Object.values(site.socials)` returns `[github, instagram]`, both strings. `.filter(Boolean)` is a no-op safety net.
   - What's unclear: If future v1.x adds `socials.youtube: 'https://youtube.com/...'`, JSON-LD auto-extends.
   - Recommendation: Use `Object.values(site.socials).filter(Boolean)` form. Auto-extends as v1.x adds keys, no Phase 6 spec change needed.

## Environment Availability

(See § Environment Availability table above — Step 2.6 audit consolidated there.)

## Validation Architecture

> Workflow.nyquist_validation = true per `.planning/config.json`. Section included.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright `^1.59.1` (already installed) |
| Config file | `playwright.config.ts` (repo root) — `baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'`; 2 projects (chromium-mobile Pixel 5, chromium-desktop 1280×800) |
| Quick run command | `npm run test` → `playwright test --project=chromium-mobile -x` |
| Full suite command | `npm run test:full` → `playwright test` (both projects) |
| Preview-URL run | `PLAYWRIGHT_BASE_URL=https://<preview>.vercel.app npm run test:full` |
| Lighthouse-specific | `PLAYWRIGHT_BASE_URL=... npx playwright test tests/lighthouse.spec.ts tests/photo-lcp.spec.ts` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | Per-route `<title>` + meta description present + unique | unit (spec parses HTML) | `npx playwright test tests/metadata-per-route.spec.ts` | ❌ Plan 06-02 W0 |
| SEO-02 | OG + Twitter card meta tags at 1200×630 on every route | integration | `npx playwright test tests/og-images-render.spec.ts` | ❌ Plan 06-02 W0 |
| SEO-03 | Each route's `og:image` meta tag resolves to 200 (1200×630 image) | integration (HTTP fetch) | (covered by `og-images-render`) | ❌ Plan 06-02 W0 |
| SEO-04a | sitemap.xml serves expected route list | unit | `npx playwright test tests/sitemap-renders.spec.ts` | ❌ Plan 06-02 W0 |
| SEO-04b | robots.txt format + references sitemap URL | unit | `npx playwright test tests/robots-renders.spec.ts` | ❌ Plan 06-02 W0 |
| SEO-05 | Person JSON-LD valid with sameAs matching `data/site.ts.socials` | unit (parses inline script) | `npx playwright test tests/jsonld-person.spec.ts` | ❌ Plan 06-02 W0 |
| SEO-05 | Person JSON-LD validates in Google Rich Results Test | manual-only | (manual: https://search.google.com/test/rich-results) | n/a (manual) |
| SEO-06 | `<link rel="canonical">` matches expected URL per route | unit | `npx playwright test tests/canonical-urls.spec.ts` | ❌ Plan 06-02 W0 |
| SEO-08 | 404 route renders monogram + heading + return link with full chrome | integration | `npx playwright test tests/not-found-renders.spec.ts` | ❌ Plan 06-02 W0 |
| SEO-09 | proxy.ts X-Robots-Tag on VERCEL_ENV=preview | integration (HTTP header) | `PLAYWRIGHT_BASE_URL=<preview> npx playwright test tests/preview-noindex.spec.ts` | ❌ Plan 06-02 W0 (preview-URL gated; skipped locally) |
| A11Y-01 | Keyboard tab order logical on all 3 routes | manual-only + smoke | (manual walk + `axe-core` no critical violations spec) | partial (axe spec exists from Phase 1+; manual walkthrough during Plan 06-02) |
| A11Y-04 | All images have meaningful alt or `alt=""` for decorative | unit (parses img elements) | `npx playwright test tests/...` (consider new alt-audit spec; or covered by axe `image-alt` rule already) | partial (axe rule covers) |
| A11Y-07 | 200% zoom + 320px viewport no horizontal scroll | manual-only | (manual: DevTools mobile emulation 320×568 + browser zoom 200%) | n/a (manual) |
| PERF-01 | Lighthouse Mobile ≥95 Perf+A11y+BestPractices+SEO on `/`, `/about`, `/work` | integration | `PLAYWRIGHT_BASE_URL=<preview> npx playwright test tests/lighthouse.spec.ts --project=chromium-mobile` | partial (lighthouse spec exists, threshold currently 0 — Plan 06-02 W0 bumps to 95 + parametrizes the 3 routes) |
| PERF-02 | Lighthouse Desktop ≥95 same | integration | same with `--project=chromium-desktop` | partial (same spec, separate project) |
| PERF-03 | First-page bundle ≤50KB gz excluding contact island | one-shot integration (not spec; doc'd in SUMMARY) | `npx next experimental-analyze --output && node scripts/measure-first-page-bundle.mjs` (the script can parse `.next/diagnostics/analyze/client.html`) | ❌ optional script Plan 06-02 W0 |
| PERF-05 | Speed Insights + Analytics installed + reporting | unit (DOM smoke) | (verify in `tests/single-client-island.spec.ts` extension OR build-output.spec.ts that `<Analytics />` + `<SpeedInsights />` are present in rendered HTML) | partial (Phase 1's `build-output` spec checks compiled output; extend) |
| LNCH-01..04 | DNS swap, real-device, OG validation, real email | manual-only | (manual checklist in `visual-checklist.md` + 06-03-SUMMARY) | n/a (manual) |
| LNCH-05 | 320px viewport renders cleanly | manual-only | (manual: same as A11Y-07) | n/a (manual) |

### Sampling Rate

- **Per task commit (during Plan 06-01 W0 spec-fix waves):** `npm run test` (chromium-mobile only, fast — <30s) on the affected spec file plus regression canary (`tests/no-client-components.spec.ts` + `tests/single-client-island.spec.ts`).
- **Per Category fix completion (Cat A/B/C/D):** `npm run test:full` (both projects) to verify all 22 originally-failing specs are now GREEN on both projects.
- **Per wave merge (Plan 06-01 W0 → W1 → W2; Plan 06-02 W0 → W1; Plan 06-03 W0 → W1):** Full local suite GREEN before pushing to preview.
- **Per Plan 06-01 exit gate:** `PLAYWRIGHT_BASE_URL=<preview> npm run test:full` GREEN on preview URL (real Vercel CDN, not localhost) PLUS the 40-item visual checklist clean PLUS real Formspree email arrives.
- **Per Plan 06-02 exit gate:** All 6 Lighthouse audits ≥95 (3 routes × 2 form factors), all 8 new SEO specs GREEN against preview, Person JSON-LD passes Google Rich Results Test, NVDA + VoiceOver iOS walks clean.
- **Per Plan 06-03 exit gate (= Phase 6 exit gate = v1 ship gate):** `braehods.com` resolves to new Vercel deploy over HTTPS, smoke walks of Nav + Footer + ContactModal submit on prod URL produce real email at `fakegoat1@gmail.com`, iOS Safari + Android Chrome real-device tests clean, old `bwaeden/braehods` archived, bio links updated, `data/projects.ts` archived-braehods href = github URL committed BEFORE the DNS flip.

### Wave 0 Gaps (Plan 06-01 + Plan 06-02 W0)

Existing test infrastructure misses these — Plan 06-02 W0 creates them all RED first:

- [ ] `tests/sitemap-renders.spec.ts` — SEO-04a (sitemap.xml serves expected route list including / + /about + /work, content-type `application/xml`, parses as valid XML)
- [ ] `tests/robots-renders.spec.ts` — SEO-04b (robots.txt format, references sitemap, allows all)
- [ ] `tests/og-images-render.spec.ts` — SEO-02 + SEO-03 (each route's `<meta property="og:image">` resolves to 200, image is 1200×630, content-type image/png)
- [ ] `tests/jsonld-person.spec.ts` — SEO-05 (root layout HTML contains `<script type="application/ld+json">`; parsed JSON has `@type === 'Person'`, `name`, `url`, `sameAs` array matching `data/site.ts.socials` values, NOT containing YT URL per scope amendment)
- [ ] `tests/not-found-renders.spec.ts` — SEO-08 (page.goto('/this-route-does-not-exist') returns 404 status, page renders Nav + monogram + Fraunces "Page not found" heading + "← Back home" link)
- [ ] `tests/preview-noindex.spec.ts` — SEO-09 (preview-URL only — `response.headers()['x-robots-tag']` === 'noindex'; locally skipped via `test.skip(!baseURL?.includes('vercel.app'))`)
- [ ] `tests/canonical-urls.spec.ts` — SEO-06 (each route's `<link rel="canonical">` has `href` matching expected — `/` → `https://braehods.com/`, `/about` → `https://braehods.com/about`, `/work` → `https://braehods.com/work`)
- [ ] `tests/metadata-per-route.spec.ts` — SEO-01 (each route's `<title>` is present, unique across routes, follows template `<Page> · Braeden Hodson`; each route's `<meta name="description">` is present, non-empty, ≤160 chars)
- [ ] `tests/helpers/live-url.ts` — Cat D helper (D-06)
- [ ] Update `tests/lighthouse.spec.ts` — bump thresholds to 95 across all 4 categories; parametrize over `/`, `/about`, `/work`; set `emulatedFormFactor` based on project name (chromium-mobile → mobile, chromium-desktop → desktop)
- [ ] Update `tests/contact-modal-*.spec.ts` (7 files) — Cat A mobile-viewport detection + `<details>` open before clicking Contact (atomic single commit per D-07)
- [ ] Update `tests/contact-modal-states.spec.ts` — Cat B `:text-is` arrow rendering + Cat C `role="alert"`
- [ ] Update `tests/contact-modal-esc-closes.spec.ts` — Cat D `page.url()` → `await liveUrl(page)`

**Framework install:** Not needed — Playwright + axe-core + lighthouse already installed.

## Security Domain

> Required per `workflow.security_enforcement: true` + `security_asvs_level: 1` in `.planning/config.json`.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Site has no user authentication. Vercel deploy auth is out-of-band (Vercel platform). |
| V3 Session Management | no | No sessions; site is static + 1 client island posting to Formspree. |
| V4 Access Control | no | Site is fully public; preview noindex (D-18) is SEO hygiene, NOT access control (preview URLs are still publicly readable). |
| V5 Input Validation | yes | (1) `data/projects.ts` validated via Zod schema at build time. (2) ContactModal honeypot + min-time gate (Phase 5 D-13/D-14) — silent rejection denies bot feedback. (3) Formspree endpoint accepts arbitrary fields; Formspree itself rate-limits. (4) JSON-LD payload is TS literal under repo control, no user input. (5) OG image dynamic content (D-02) — title is a fixed string per route, no URL-driven dynamic data, no injection vector. |
| V6 Cryptography | no | No new crypto in Phase 6. Vercel-managed Let's Encrypt SSL stages automatically per D-13. |
| V12 Files and Resources | yes | (1) Sitemap reads `content/` via `fs.readdir` at build time — directory is repo-controlled, no traversal vector. (2) OG image `readFile` on `assets/Fraunces-Bold.ttf` — repo-controlled path, no user input. (3) `app/opengraph-image.png` is repo-controlled. |
| V14 Configuration | yes | (1) `proxy.ts` reads `VERCEL_ENV` which Vercel sets, not user input. (2) Vercel env vars (`NEXT_PUBLIC_FORMSPREE_ID`) inlined at build time, public-visible (the `NEXT_PUBLIC_` prefix indicates this). (3) `metadataBase` is hard-coded to `https://braehods.com` — no env-injection vector. |

### Known Threat Patterns for Static Next.js 16 + Vercel + Formspree stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Preview URL leaks into Google index | Information Disclosure | `X-Robots-Tag: noindex` via `proxy.ts` D-18 (Phase 6 SEO-09). Verified by `tests/preview-noindex.spec.ts`. |
| Old `bwaeden/braehods` GH Pages site competes for "braehods" search rank | Information Disclosure / SEO | `gh repo archive` (D-15) marks old repo read-only; DNS swap (D-13) moves traffic. Long-term: GH Pages serves the cached old site for ~24h after DNS flip then 404s. |
| Stale Vercel production-alias cache serves outdated content during D-14 deploy | Tampering (effective tampering — wrong content served) | `vercel --prod` or "Promote to Production" invalidates Vercel CDN cache atomically. Smoke-test post-deploy with cache-busting query: `curl https://braehods.com/?cb=$(date +%s)` should match current commit hash. |
| Formspree endpoint hard-coded in client bundle, scraped + abused for spam | Spoofing / DoS | Phase 5 D-13 (honeypot `company`) + D-14 (1500ms min-time gate). Formspree itself rate-limits at the endpoint side. NO new mitigation needed in Phase 6 — D-06 Category C audits the existing implementation. |
| OG image rendering bombs / large external image fetches | DoS | `ImageResponse` 500KB total bundle limit prevents large payloads. OG images for Phase 6 are static (`/`) or use only local fonts + text (no external fetches). |
| Person JSON-LD `sameAs` URL injection | Information Disclosure / Spoofing | All `sameAs` URLs read from `data/site.ts.socials` literal — repo-controlled. No user input. |
| Stale OG image cached on Slack/Twitter scrapers after content update | Information Disclosure / brand-mismatch | Force re-scrape via opengraph.xyz refresh OR Twitter Card Validator OR Slack /debug. v1 launch will have these run once at LNCH-04. |
| Sitemap exposes draft/unpublished routes | Information Disclosure | Sitemap iterates `content/*.mdx` — only files that exist in the repo. No CMS draft state. v2 should add a `draft: true` frontmatter filter if drafts become a concept. |
| `proxy.ts` matcher misses a new route added later | Information Disclosure | Plan 06-02 SUMMARY documents the matcher's exclusion list. Any v1.x route additions need to verify the matcher still applies to them (default behavior: matcher catches all routes not in the exclusion list, so new routes are auto-covered). |
| 404 page renders user-controlled path causing XSS | Tampering | `app/not-found.tsx` renders only static content (heading + link + monogram). No `usePathname()` or `useSearchParams()` usage. Inherits root layout's safety. |
| DNS hijack during D-13 transition window | Spoofing | Domain registrar 2FA (user responsibility, out-of-band). Vercel-side: SSL certificate pinning prevents MITM during the staging window. Rollback: revert CNAME at registrar — restores the OLD GitHub Pages site within DNS TTL. |
| Vercel project misconfiguration exposes preview to public | Information Disclosure | Preview noindex (D-18) is the SEO mitigation. For true access control (preview-only-for-team), Vercel's "Deployment Protection" is the answer — out of scope for v1 (preview URLs ARE public, just noindexed). |

## Sources

### Primary (HIGH confidence)

- **Next.js 16 documentation (nextjs.org/docs)** — all file conventions:
  - https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image (OG image: static + dynamic, ImageResponse, alt/size/contentType, params Promise, examples with local assets + base64 fonts) — fetched 2026-05-19, lastUpdated 2026-05-19
  - https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap (MetadataRoute.Sitemap shape, generateSitemaps, locale alternates, image/video sub-elements) — fetched 2026-05-19, lastUpdated 2026-05-19
  - https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots (MetadataRoute.Robots shape, multiple user-agents) — fetched 2026-05-19
  - https://nextjs.org/docs/app/api-reference/file-conventions/proxy (proxy.ts location, runtime, NextResponse, matcher syntax, RSC headers, migration from middleware.ts) — fetched 2026-05-19, lastUpdated 2026-05-19
  - https://nextjs.org/docs/app/api-reference/file-conventions/not-found (not-found.tsx vs global-not-found, status code behavior, default Server Component, metadata) — fetched 2026-05-19
  - https://nextjs.org/docs/app/api-reference/functions/generate-metadata (full Metadata field list, title.template/default/absolute, openGraph/twitter, metadataBase, alternates.canonical, file-based-overrides-config rule, streaming metadata for HTML-limited bots) — fetched 2026-05-19
  - https://nextjs.org/docs/app/guides/package-bundling (Next.js Bundle Analyzer Experimental for Turbopack vs @next/bundle-analyzer for Webpack — the load-bearing distinction for Pitfall #1) — fetched 2026-05-19
  - https://nextjs.org/blog/next-16-1 (`next experimental-analyze` introduction) — fetched 2026-05-19
- **Vercel documentation (vercel.com/docs)**:
  - https://vercel.com/docs/og-image-generation (Satori limits — flexbox only, 500KB bundle, supported features, runtime caveats) — fetched 2026-05-19
  - https://vercel.com/docs/domains/working-with-domains/add-a-domain (add-domain procedure, CNAME vs A record, SSL stages) — fetched 2026-05-19
- **schema.org/Person** — minimal Person + sameAs shape (fetched 2026-05-19; not version-stamped but stable for years).
- **package.json** in this repo (verified version pins for `@vercel/analytics@2.0.1`, `@vercel/speed-insights@2.0.0`, `playwright-lighthouse@^4.0.0`, `@axe-core/playwright@^4.11.3`, `@formspree/react@3.0.0`, `next@16.2.6`, `react@19.2.4`).
- **app/layout.tsx** in this repo (verified Analytics + SpeedInsights ARE already mounted — material correction to CONTEXT D-09).
- **npm registry direct verification** (2026-05-19): `next@16.2.6`, `playwright-lighthouse@4.0.0`, `@next/bundle-analyzer@16.2.6` (deps: webpack-bundle-analyzer:4.10.1), `@vercel/og@0.11.1`, `@axe-core/playwright@4.11.3`.

### Secondary (MEDIUM confidence)

- **vercel/next.js GitHub issue #77482** (`next dev --turbopack does not support using @next/bundle-analyzer - throws warning`) — verified during web search for Pitfall #1.
- **dequelabs/axe-core rule-descriptions.md** (color-contrast rule covers 1.4.3 + 1.4.6 only, NOT 1.4.11) — fetched 2026-05-19.
- **TestParty / W3C / WebAIM web search results on WCAG 1.4.11** (confirms axe-core limitation; 3:1 graphical threshold).

### Tertiary (training data + cross-verified)

- **GitHub CLI `gh repo archive` behavior** — verified in Phase 4 hardening commit `7628dcc` (`gh repo edit --visibility public` used the same CLI); flag-flip behavior is standard `gh` CLI documented in `gh repo archive --help`.

## Metadata

**Confidence breakdown:**
- Next.js 16 file conventions (OG, sitemap, robots, proxy, not-found, generateMetadata): **HIGH** — verified against official Next.js docs lastUpdated 2026-05-19 (today).
- `@vercel/og` (built into `next/og`): **HIGH** — verified via official Vercel + Next docs.
- `proxy.ts` rename + Node.js default runtime: **HIGH** — Next 16.0 release notes + proxy file convention doc.
- Bundle analyzer Turbopack incompat: **HIGH** — verified via Next docs + GitHub issue + npm view of `@next/bundle-analyzer` deps.
- Phase 4/5 carry-forwards + Categories A–D recipes: **HIGH** — sourced from `.checkpoint-state.md` + summaries, which were authored from direct executor experience.
- DNS swap sequence: **MEDIUM-HIGH** — Vercel docs cover the steps; specific timing claims (SSL <5min) are observed-typical not SLA-guaranteed.
- schema.org Person `sameAs`: **HIGH** — schema.org direct.
- axe-core 1.4.11 gap: **HIGH** — Deque docs explicit.
- Lighthouse threshold + form-factor parametrization: **MEDIUM** — `playwright-lighthouse@4` repo docs unavailable (404 on fetch) but project has working spec in `tests/lighthouse.spec.ts`; pattern verified from in-repo source.
- D-09 already-mounted correction: **HIGH** — verified via Read of `app/layout.tsx`.
- D-11 `@next/bundle-analyzer` → `next experimental-analyze` pivot: **HIGH** — verified via 2 separate Next docs + 1 GitHub issue + 1 npm view.

**Research date:** 2026-05-19
**Valid until:** Most patterns are framework-conventions that change at Next.js major version; the next Next.js major (Next 17, unannounced as of cutoff) is the natural revalidation point. Estimated **30 days** for stable validity, **7 days** for fast-moving items (Vercel domain UI, Vercel Analytics SDK version). The Categories A–D recipes are repo-internal and stable forever (until specs are deleted).
