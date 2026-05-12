---
phase: 02-home-page
type: scope-amendment
authority: user (2026-05-11)
supersedes: plan bodies (02-01..02-07), 02-CONTEXT.md, 02-UI-SPEC.md, REQUIREMENTS.md HOME-03
---

# Phase 2 Scope Amendment — YouTube dropped from v1

**Authored by:** user directive on 2026-05-11, captured during `/gsd-execute-phase 2` orchestration.

**One sentence:** No YouTube channel exists yet, so v1 ships with Instagram + GitHub only — no YouTube data, no YouTube channel button, no YouTube footer icon, no YouTube anywhere.

This amendment is **authoritative** and overrides any conflicting YouTube reference in:
- `02-01-PLAN.md` through `02-07-PLAN.md` (body text)
- `02-CONTEXT.md`
- `02-UI-SPEC.md`
- `REQUIREMENTS.md HOME-03` (amended in same commit)

The plan-file `must_haves:` YAML blocks have been amended in the same commit; executors and the gsd-verifier read the amended `must_haves` directly.

## What changes

### Data layer (Plan 02-01)
- `data/channels.ts` exports a 1-entry `Channel[]` containing only `platform: 'instagram'` (handle: `braehods`, url: `https://instagram.com/braehods`).
- `data/site.ts.socials` populates **only** `github` (`https://github.com/bwaeden`) and `instagram` (`https://instagram.com/braehods`). The `youtube` key is **omitted** from the literal — not set to empty string, not set to undefined explicitly — just absent.
- The `SiteMeta.socials` TypeScript interface keeps the optional `youtube?: string` field shape (so Phase 6 or post-v1 can populate it without an interface change), but no value is set in v1.
- The `Channel.platform` TypeScript union keeps `'youtube' | 'instagram'` (so the type accommodates future YT) but only `'instagram'` appears in the literal.

### Channel block (Plans 02-03, 02-06)
- `ChannelButton.tsx` keeps platform-agnostic logic (icon map + CTA verb map keyed by platform), but only the Instagram branch executes in v1.
- `ChannelButtonRow.tsx` maps the 1-entry `channels` array — renders 1 button (Instagram with "DM me" CTA per D-12 + memory `feedback_reel_cta_dm_format.md`).
- Stagger: Instagram = stagger(3) = 240ms (since `i=0`).
- `tests/channels-render.spec.ts` asserts **1** external `<a target="_blank" rel="noopener noreferrer">` button inside the hero region. The "Subscribe" assertion is dropped; the "DM me" assertion remains.

### Footer (Plan 02-04)
- `Footer.tsx` social row renders **2** `SocialIconLink` instances: `Github` + `Instagram`. No `Youtube` icon, no `Youtube` import.
- Lucide-react Footer import: `import { Github, Instagram } from 'lucide-react'`.
- `aria-label` set: `"GitHub profile"` + `"Instagram profile"` only. No `"YouTube channel"` aria-label.
- `tests/footer-socials-render.spec.ts` asserts **≥2** external `<a>` in the footer with the 2 expected aria-labels (not 3, not "YouTube channel").
- `Footer.tsx` `{site.socials.youtube && (...)}` conditional block is omitted entirely from the v1 source — not present even as a guarded no-op (avoids dead code).

### Hero composition (Plan 02-06)
- `Hero.tsx` Tab-order documentation says: Name → positioning → Currently → ChannelButton (Instagram) → CTA1 → CTA2 → HeroPhoto. Only one ChannelButton in the order.
- Plan 02-06 line 364 ("ChannelButton YouTube") and line 368 ("Footer social GH / IG / YT") are amended to drop YT.

### Phase verification (Plan 02-07)
- The 28-item visual checklist (UI-SPEC lines 744-770) item referencing "both channel buttons" is interpreted as "the Instagram channel button" — pass when one IG button renders correctly.
- Tab-order test (item 20 / line 137) is amended to: Nav (4) → channel IG → CTA1 → CTA2 → Footer social GH → IG → source link.
- Spec count remains **22** (Phase 1's 13 + Plan 02's `tests/format.spec.ts` + Plan 01's 8 new RED stubs). The 22-spec count is by file, not by assertion. Individual assertions inside `channels-render` and `footer-socials-render` are amended per above.

### Requirements (REQUIREMENTS.md)
- **HOME-03** amended to: "Channel-link block — Instagram channel button opens in new tab, no embeds, 'DM me' affordance" (YouTube clause dropped). YouTube can be re-added post-v1 via a one-file `data/channels.ts` edit; the component logic already handles it.
- **SEO-05** `sameAs` array: include GitHub + Instagram only in v1 (Phase 6 owns this; documented here for traceability).
- **LNCH-03**: "GitHub profile site link + Instagram bio link point at braehods.com" — YouTube clause dropped from v1 launch checklist.

### Component design forward-compat

The platform abstraction in `ChannelButton.tsx` (`ICON_BY_PLATFORM` + `CTA_BY_PLATFORM` maps) and the data-driven render in `ChannelButtonRow.tsx` mean re-enabling YouTube post-v1 is a single-line edit to `data/channels.ts` (add the YT entry) + uncommenting an optional Footer block. No component refactor required.

## What does NOT change

- The Phase 2 wave structure (5 waves, 7 plans).
- The Channel TypeScript interface (`platform: 'youtube' | 'instagram'`).
- The SiteMeta socials shape (`youtube?: string` stays optional).
- The CTA-verb map (`CTA_BY_PLATFORM = { youtube: 'Subscribe', instagram: 'DM me' }`) — keeps both keys for forward compat; only IG renders in v1.
- Stagger system (`stagger(3 + i)`) — already i-indexed, works for any count.
- All other locked design decisions (D-01..D-25), all tokens, all motion contracts, all Phase 1 chrome.

## Threat-model delta

- `T-02-02` (external IG/YT/GH links): only IG + GH external links exist in v1. `noopener noreferrer` still applied. No threat-model change beyond reducing the external-link surface.
- `T-02-14` (lucide bundle): 2 unique icons in v1 (Instagram in Plan 03; Github + Instagram in Plan 04 — Instagram dedup). Smaller bundle.

## Verification

- `data/channels.ts` exports `channels` of length 1, entry is `{ platform: 'instagram', handle: 'braehods', url: 'https://instagram.com/braehods' }`.
- `data/site.ts.socials` literal contains exactly `github` + `instagram` keys (regex: `socials:\s*\{[^}]*github[^}]*instagram[^}]*\}` AND NOT `youtube:\s*'`).
- `Footer.tsx` source does NOT contain `Youtube` (the lucide icon name) and does NOT contain `aria-label="YouTube channel"`.
- `ChannelButton.tsx` source MAY contain the `youtube` platform key in the maps (forward-compat) but the rendered output has zero YT buttons because `data/channels.ts` carries no YT entry.

---

*This file is part of the Phase 2 plan corpus. Each executor receives it as `@.planning/phases/02-home-page/02-SCOPE-AMENDMENT.md` alongside its plan and is instructed: "This amendment supersedes any YouTube reference in the plan body or context docs. Implement only what this amendment authorizes."*
