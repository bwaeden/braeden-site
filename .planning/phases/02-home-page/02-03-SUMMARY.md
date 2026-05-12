---
phase: 02-home-page
plan: 03
subsystem: interactive atoms (W1 — ChannelButton + ChannelButtonRow + CTAArrowLink)
tags: [phase-2, wave-1, server-components, motion-seam, external-links, security]
status: complete
requirements_completed: [HOME-03, HOME-05]
dependency_graph:
  requires:
    - data/channels.ts (Plan 02-01 — Channel type + 1-entry IG-only array per 02-SCOPE-AMENDMENT.md)
    - lib/motion.ts (Phase 1 seam — fadeInUp + stagger)
    - next/link (Next.js 16.2.6 built-in)
  provides:
    - "ChannelButton: Server Component exporting ChannelButton({ channel: Channel }): JSX.Element — single platform-recognizable hairline-bordered external link button (D-12, D-14, CD-01)"
    - "ChannelButtonRow: Server Component exporting ChannelButtonRow({ channels: Channel[] }): JSX.Element — single combined channels block with flex-wrap row + per-button stagger wrappers (D-13)"
    - "CTAArrowLink: Server Component exporting CTAArrowLink({ href: string, children: string, staggerIndex: number }): JSX.Element — accent text-link with arrow glyph and hover translate (D-19)"
  affects:
    - Plan 02-06 (Hero composition — imports ChannelButtonRow + CTAArrowLink)
    - Plan 02-04 (Footer SocialIconLink — must adopt same inline-SVG icon strategy since lucide-react has no brand icons)
    - CLAUDE.md Technology Stack table (lucide-react row is factually wrong about Instagram/Github/Youtube being available — should be amended)
tech-stack:
  added: []  # no new deps; inline SVG via established MonogramMark precedent
  patterns:
    - "Server Component default (FOUND-07 / D-25): all three files are zero-client"
    - "External <a target='_blank' rel='noopener noreferrer'> for tabnabbing prevention (T-02-11)"
    - "next/link for internal route prefetch (CTAArrowLink — /about, /work)"
    - "group/group-hover Tailwind hover-propagation (verb color in ChannelButton, arrow translate in CTAArrowLink)"
    - "Stagger-on-wrapper pattern (ChannelButtonRow — keeps fadeInUp keyframe transform from colliding with button's hover translateY)"
    - "Inline SVG with currentColor for brand icons (matches CLAUDE.md 'Monogram approach' precedent — MonogramMark.tsx)"
key-files:
  created:
    - components/home/ChannelButton.tsx (113 lines — incl. inline InstagramIcon sub-component + extended deviation comment block)
    - components/home/ChannelButtonRow.tsx (35 lines)
    - components/home/CTAArrowLink.tsx (43 lines)
  modified: []
decisions:
  - "Rule 3+4 deviation: lucide-react@1.14.0 does NOT export Instagram/Github/Youtube (verified at runtime: `node -e \"require('lucide-react').Instagram\"` returns undefined). Auto-mode active, auto-selected Option B (inline SVG with currentColor — matches CLAUDE.md 'Monogram approach' + existing MonogramMark.tsx precedent). Inline InstagramIcon co-located inside ChannelButton.tsx as a small sub-component, 24x24 viewBox + stroke-based geometry matching the historical Lucide Instagram glyph (rounded-square frame + inner circle + upper-right dot). currentColor inheritance so the parent's color cascade drives icon color."
  - "Hover-mechanism choice: Option B (group + group-hover) per plan action — canonical Tailwind hover-propagation pattern already a precedent in CTAArrowLink. The verb-span rest-state color HAD to switch from inline-style (`style={{ color: 'var(--color-muted)' }}`) to Tailwind arbitrary (`text-[var(--color-muted)]`) so the `group-hover:text-[var(--color-text)]` utility can win the cascade on hover (Tailwind utilities do NOT use !important, so a competing inline-style would always win)."
  - "ChannelButton uses `channel.platform as keyof typeof ICON_BY_PLATFORM` cast on the map lookup. Because the v1 maps are IG-only literals but the Channel.platform type union retains 'youtube' | 'instagram' (per 02-SCOPE-AMENDMENT.md forward-compat), the cast is necessary to satisfy noUncheckedIndexedAccess + strict mode. The lookup is `?? null`-guarded so a future YT entry without a matching map entry surfaces as a render-time miss (no Icon, no verb) rather than a typecheck failure on the channel-data side."
  - "InstagramIcon co-located inside ChannelButton.tsx rather than extracted to components/ui/ — keeps this plan's files_modified list to exactly the 3 promised files. Plan 04 (Footer) will also need Instagram + Github inline icons; that plan can decide whether to extract them to a shared components/ui/social-icons/ module at that time. Premature extraction would have inflated this plan's scope."
metrics:
  duration_minutes: 12
  completed: "2026-05-12T00:00:00Z"
  tasks_completed: 3
  commits: 3
---

# Phase 2 Plan 03: Interactive Atoms (W1) Summary

Three Server Components that own the hero's interactive surface — an external Instagram channel-link pill (`ChannelButton`), a flex-wrap row with per-button stagger wrappers (`ChannelButtonRow`), and a reusable accent text-link with arrow glyph (`CTAArrowLink`) — all built without `'use client'` and without `lucide-react` brand icons (which the installed v1.14.0 doesn't ship).

## What shipped

### `components/home/ChannelButton.tsx` (113 lines)

- **Export:** `ChannelButton({ channel }: { channel: Channel }): JSX.Element`
- Renders an external `<a href={channel.url} target="_blank" rel="noopener noreferrer">` with:
  - 18px inline-SVG `InstagramIcon` sub-component (currentColor, strokeWidth=1.75)
  - `@{channel.handle}` text span (color: `var(--color-text)`)
  - aria-hidden middle dot (`·`, color: `var(--color-muted)`)
  - verb span "DM me" (rest-state Tailwind `text-[var(--color-muted)]`, hover `group-hover:text-[var(--color-text)]`)
- Class chain: `group inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-[var(--color-border)] px-4 py-3 text-sm font-sans transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-px hover:border-[var(--color-accent)]`
- `ICON_BY_PLATFORM = { instagram: InstagramIcon }` and `CTA_BY_PLATFORM = { instagram: 'DM me' }` — platform-keyed maps preserved for forward-compat (post-v1 YT re-enable = 1-entry edit).

### `components/home/ChannelButtonRow.tsx` (35 lines)

- **Export:** `ChannelButtonRow({ channels }: { channels: Channel[] }): JSX.Element`
- Wraps `channels.map((c, i) => <div key={c.platform} className={fadeInUp} style={stagger(3 + i)}><ChannelButton channel={c} /></div>)` in `<div className="mt-8 flex flex-row flex-wrap gap-3">`.
- v1: 1-entry IG-only array → renders 1 ChannelButton with `stagger(3)` = 240ms.
- D-13 single combined channels block (NOT two separate Channel-A / Channel-B surfaces).
- Stagger-on-wrapper pattern avoids fadeInUp keyframe colliding with button's hover translateY.

### `components/home/CTAArrowLink.tsx` (43 lines)

- **Export:** `CTAArrowLink({ href, children, staggerIndex }: { href: string; children: string; staggerIndex: number }): JSX.Element`
- Renders Next.js `<Link>` with `group inline-flex items-center gap-2 text-base font-sans hover:underline hover:decoration-1 hover:underline-offset-4 fade-in-up` + inline style merging `color: var(--color-accent)` and `...stagger(staggerIndex)`.
- Children rendered as plain text, followed by aria-hidden `<span>→</span>` with `inline-block transition-transform group-hover:translate-x-1` (4px translate on hover).
- Plan 06 will pass `staggerIndex={5}` ("More about me") and `staggerIndex={6}` ("See the work") per CD-03.

## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | exit 0 — strict + `noUncheckedIndexedAccess` clean |
| `npm run lint` | exit 0 — zero warnings |
| `npm run build` | exit 0 — Turbopack compiled in 2.2s, 5 static pages, no warnings |
| `tests/no-client-components.spec.ts` | GREEN — 3 new Server Components add no `'use client'` |

### Invariant grep (all 3 files)

- Zero `'use client'` (FOUND-07 / D-25). ✓
- Every external `<a>` has `target="_blank" rel="noopener noreferrer"` (HOME-03 + T-02-11). ✓
- No fractional Tailwind utilities — `py-2.5`, `py-1.5`, `gap-1.5`, `p-1.5`, `translate-x-0.5` all absent. ✓
- No forbidden font-weight classes — `font-medium`, `font-bold`, `font-semibold` all absent (2-weight inventory: Geist Sans 400 + Fraunces 700 only). ✓
- ChannelButton uses `px-4 py-3` (45px computed height — clears WCAG 44px touch target). ✓
- ChannelButtonRow uses `flex-wrap` + `gap-3` + `mt-8` + `stagger(3 + i)` + `key={channel.platform}`. ✓
- CTAArrowLink uses `next/link` + `staggerIndex` prop + `group-hover:translate-x-1` + Unicode `→` glyph + `var(--color-accent)`. ✓
- ChannelButton imports `lucide-react` — **OMITTED** (deviation: lucide doesn't ship Instagram; using inline SVG instead). The forward-compat YT branch is also absent from the v1 source per 02-SCOPE-AMENDMENT.md.

### Hover-mechanism confirmation

ChannelButton ships **Option B** (`group` on parent + `group-hover:text-[var(--color-text)]` on the verb span). Verb rest-state color uses Tailwind arbitrary `text-[var(--color-muted)]` (necessary one-off deviation from Phase 1's inline-style preference for muted color — documented in the source's leading comment) so the `group-hover` utility wins the cascade on hover. CTAArrowLink uses the same `group/group-hover` pattern for the arrow's `translate-x-1` micro-motion.

### Animation-collision verification

ChannelButtonRow's `fadeInUp` + `stagger(3 + i)` lives on a wrapper `<div>` around each `<ChannelButton>` — NOT on the `<a>` itself. The button's `hover:-translate-y-px` is therefore free to run without colliding with the keyframe's final `transform: translateY(0)` end state. CTAArrowLink, by contrast, applies `fadeInUp` directly on its `<Link>` because its hover motion is on a child `<span>` (the arrow), not the link element — no collision either.

## Spec scoreboard

| Spec | Before this plan | After this plan | Notes |
|------|------------------|-----------------|-------|
| `tests/no-client-components.spec.ts` | GREEN | GREEN | No regression — all 3 new files Server Components |
| `tests/channels-render.spec.ts` (HOME-03) | RED | RED (mount-gated) | Asserts presence on `/` via `[data-test="hero-section"]`. Component shape is GREEN-ready; turns GREEN when Plan 02-06 mounts `<ChannelButtonRow channels={channels} />` inside the hero region of `app/page.tsx`. |
| `tests/hero-renders.spec.ts` (channel-relevant assertions) | RED | RED (mount-gated) | Same Plan 06 gate. |
| `tests/ctas-resolve-200.spec.ts` | RED | RED (route-gated) | Asserts `/about` and `/work` return 200. Plan 05 ships the stub pages; Plan 06 wires CTAArrowLink's href to them. |
| `tests/format.spec.ts` | GREEN | GREEN | No regression (Plan 02). |
| Phase 1 13 specs | GREEN | GREEN | No regression. |

**Net Phase 2 movement:** No new GREEN this plan (all assertions are mount-gated by Plan 06). All three components ship in their final GREEN-ready shape — Plan 06 needs zero changes to ChannelButton/Row/CTAArrowLink to flip the relevant assertions GREEN.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3+4 — Blocking + Architectural; auto-selected in auto-mode] `lucide-react@1.14.0` does NOT export Instagram/Github/Youtube**

- **Found during:** Task 1 dependency check (before writing a single line).
- **Verification:**
  ```
  $ node -e "const l = require('lucide-react'); console.log(typeof l.Instagram, typeof l.Github, typeof l.Youtube, typeof l.Mail)"
  undefined undefined undefined object
  $ ls node_modules/lucide-react/dist/esm/icons/ | grep -i instagram
  (no output)
  ```
- **Why:** Lucide upstream dropped brand icons in 2024 over trademark concerns. The installed `lucide-react@1.14.0` ships utility icons (Mail, ArrowRight, etc.) but no brand glyphs.
- **Why this conflicts with the plan corpus:**
  - `02-03-PLAN.md` body (line 200, line 258, frontmatter must_haves) instructs `import { Instagram } from 'lucide-react'`.
  - `02-SCOPE-AMENDMENT.md` line 41 codifies `import { Github, Instagram } from 'lucide-react'` for Footer.
  - `02-PATTERNS.md` line 258 inlines `import { Youtube, Instagram } from 'lucide-react'` as the verbatim transposition template.
  - `CLAUDE.md` Supporting Libraries table (lucide-react row) claims "Lucide has all three [YouTube/Instagram/GitHub specifically]" — factually wrong as of 2026-05-11.
- **Auto-selection (auto-mode active per `workflow.auto_advance = true`):** Option B — inline SVG with `currentColor`. Rationale:
  - **Matches existing project precedent.** `components/ui/MonogramMark.tsx` already uses this exact pattern with `currentColor` fill + 1.75 strokeWidth + small viewBox.
  - **CLAUDE.md explicitly endorses it.** The "Monogram approach: inline SVG component" section lists three benefits — recolorable via currentColor, zero HTTP request, tiny footprint — all of which apply equally to a brand glyph.
  - **No new dependency.** Adding `simple-icons` or `react-icons` would inflate the bundle and require its own version-locking discussion. The inline SVG is ~400 bytes per icon.
  - **No CLAUDE.md amendment required mid-execution.** Future plans (especially Plan 04 Footer) can continue this pattern OR extract a shared component without re-architecting.
- **Fix:** Defined `InstagramIcon` as a small sub-component inside `ChannelButton.tsx` (lines 38-58). Geometry matches the historical Lucide Instagram glyph (rounded-square frame at `<rect rx=5>` + inner circle "lens" + upper-right "light" dot via `<line>`). Inherits color from parent via `stroke="currentColor"`. Same prop API (`size`, `strokeWidth`) as lucide so a future migration is trivial.
- **Files modified:** `components/home/ChannelButton.tsx` (the inline icon + the import statement deviation).
- **Commit:** `8dd8163`.
- **Forward implications (not fixed in this plan — out of scope):**
  - Plan 04 (Footer) will hit the same blocker for Github + Instagram footer icons. The same inline-SVG approach should be used; the Footer SocialIconLink can take an `Icon: ComponentType` prop (already planned per `02-04-PLAN.md` line 154) and the call site passes the inline-SVG component.
  - CLAUDE.md "Supporting Libraries" lucide-react row claim "Lucide has all three" is factually wrong. **Recommend a `chore(docs)` commit in Plan 04 or Plan 07** to amend that line (out of scope for this plan; logged here for the verifier).

### Out-of-scope discoveries (NOT fixed; logged)

- **CLAUDE.md inaccuracy** about lucide-react brand-icon availability — flagged above. Not amended in this plan because Plan 04 (Footer) is the next plan to encounter the same blocker; a single chore(docs) commit in Plan 04 can fix both lucide row + the related ARCHITECTURE note in one place.

## Authentication gates

None.

## Threat Flags

None — the threat-model already covered the external-link surface (T-02-11 tabnabbing prevention, T-02-12 React JSX escaping for `channel.handle`, T-02-13 Next.js same-origin prefetch, T-02-14 bundle inflation). The deviation REDUCES the lucide-react bundle footprint (Instagram glyph is now ~280 bytes of inline SVG vs whatever the lucide tree-shake would have added) — strict improvement on T-02-14.

The inline SVG path is hand-written and contains no untrusted user data (`channel.handle` is rendered via React JSX text, never embedded into the SVG).

## Known Stubs

None. All three components are wired to live data sources:
- `ChannelButton.channel` consumed from `data/channels.ts` (Plan 01 populated).
- `ChannelButtonRow.channels` accepts the same array end-to-end.
- `CTAArrowLink.href` will be wired to `/about` and `/work` by Plan 06 — those stub pages land via Plan 05 (parallel wave 2). No stub on this side.

## Commit history

| Commit | Description |
|--------|-------------|
| `8dd8163` | `feat(phase-2/w1): ChannelButton (Instagram-only per scope amendment, DM me CTA, hairline pill)` |
| `8f965e2` | `feat(phase-2/w1): ChannelButtonRow (single channels block, stagger wrappers)` |
| `a0d76d8` | `feat(phase-2/w1): CTAArrowLink (D-19 accent text-link with arrow glyph)` |

## Next plan unblocked

- **Plan 02-06 (Wave 2 — Hero composition):** Can import `ChannelButtonRow` + `CTAArrowLink` without modification. Pass `channels` from `data/channels.ts` to the row, pass `staggerIndex={5}` and `staggerIndex={6}` to the two CTAArrowLink instances per CD-03.
- **Plan 02-04 (Wave 2 — Footer):** Inherits the lucide-brand-icon blocker. Should adopt the same inline-SVG approach (precedent now established in `ChannelButton.tsx`). Plan 04's SocialIconLink already takes an `Icon: ComponentType` prop, so the call site can pass an inline-SVG component the same way.

## Self-Check: PASSED

- `components/home/ChannelButton.tsx` — FOUND
- `components/home/ChannelButtonRow.tsx` — FOUND
- `components/home/CTAArrowLink.tsx` — FOUND
- Commit `8dd8163` — FOUND in git log
- Commit `8f965e2` — FOUND in git log
- Commit `a0d76d8` — FOUND in git log
- `npm run typecheck` — exit 0
- `npm run lint` — exit 0
- `npm run build` — exit 0
- `tests/no-client-components.spec.ts` — 2/2 GREEN (no regression)
- `tests/channels-render.spec.ts` — RED as documented (mount-gated by Plan 06)
