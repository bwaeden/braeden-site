# Phase 1: Foundation + Design Tokens - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-08
**Phase:** 1-Foundation + Design Tokens
**Areas discussed:** B monogram for v1, Token color values + Tailwind v4 wiring, Repo bootstrap + Vercel deploy shape

---

## B monogram for v1

### Q1 — Where does the B monogram come from for Phase 1?

| Option | Description | Selected |
|--------|-------------|----------|
| Ship a placeholder, swap in Phase 6 | Use a typographic placeholder for v1; Phase 1 ships on schedule, real mark lands as a Phase 6 swap. | ✓ |
| Pause Phase 1 until a real mark is designed | Treat the monogram as a hard prerequisite; Phase 1 starts later but ships with the final identity. | |
| Design it inside Phase 1, mid-flight | Design in parallel with the build; risks blocking favicon/nav/footer until path data lands. | |

**User's choice:** Ship a placeholder, swap in Phase 6
**Notes:** Aligns with the fallback already documented in STATE.md.

### Q2 — What form should the v1 placeholder monogram take?

| Option | Description | Selected |
|--------|-------------|----------|
| Fraunces "B" rendered as SVG path | Hand-traced from Fraunces (the chosen display serif), reuses locked font identity, looks intentional. | ✓ |
| Geometric "B" (custom 30-min sketch) | Quick architectural mark; more design-intent than a font letter, but more visibly placeholder. | |
| Letter-in-shape (B inside circle/square) | Geist Mono "B" inside a charcoal/accent circle; reads more "app icon" than editorial. | |

**User's choice:** Fraunces "B" rendered as SVG path

### Q3 — Which Fraunces variant should the SVG "B" be traced from?

| Option | Description | Selected |
|--------|-------------|----------|
| Fraunces Black, Soft axis full | Max weight + max softness; reads dense and editorial small, sculpted at large. | ✓ |
| Fraunces Black, Soft axis off (sharp) | Max weight, sharp serif optical; more architectural, less warmth. | |
| Fraunces SemiBold, Soft axis full | Lighter mark, more elegance, risk of invisibility at favicon scale. | |

**User's choice:** Fraunces Black, Soft axis full

### Q4 — How should the monogram render at favicon size and which surfaces use which?

| Option | Description | Selected |
|--------|-------------|----------|
| Same SVG path, optimized at small sizes | One source path; `shape-rendering="crispEdges"` + slightly thicker stem for favicon.svg at 16/32px. One component, size prop. | ✓ |
| Separate favicon path (manually simplified) | Hand-simplify a parallel path for favicon-only; two files. | |
| Path for everything, plus 32×32 PNG fallback | SVG everywhere modern + PNG `apple-icon.png` for iOS. | |

**User's choice:** Same SVG path, optimized at small sizes

---

## Token color values + Tailwind v4 wiring

### Q1 — How should we resolve the muted-text contrast conflict (REQUIREMENTS ~#707070 vs PITFALLS ≥#a8a8a8)?

| Option | Description | Selected |
|--------|-------------|----------|
| Trust PITFALLS, lock at ~#a8a8a8 | Set muted to #a8a8a8; clears AA at the dark gradient end; update REQUIREMENTS to match. | ✓ |
| Keep #707070, restrict to large-text-only | Two muted scales: large-only at #707070, body at #a8a8a8. | |
| Lighten the dark gradient endpoint | Change the gradient lower bound so #707070 passes; softens the editorial mood. | |

**User's choice:** Trust PITFALLS, lock at ~#a8a8a8
**Notes:** REQUIREMENTS.md DSGN-03 will be updated to match.

### Q2 — Where should design tokens live?

| Option | Description | Selected |
|--------|-------------|----------|
| @theme only, Tailwind classes everywhere | Single source; Tailwind v4 auto-exposes tokens as CSS vars for non-Tailwind consumers. | ✓ |
| @theme + parallel `:root` CSS vars | Two sources, manual sync, drift risk. | |
| Raw `:root` only, Tailwind reads via @theme inheritance | CSS-first, framework-agnostic, more boilerplate. | |

**User's choice:** @theme only, Tailwind classes everywhere

### Q3 — What's the full color palette for v1?

| Option | Description | Selected |
|--------|-------------|----------|
| Compact: 6 tokens | Just what v1 uses: bg-start, bg-end, text, muted, accent, border. | ✓ |
| Standard scale: charcoal-50..950 + accent-400..700 | Tailwind-style numeric scales; predictable; risk of unused tokens. | |
| Compact + alpha-overlay tokens | Six colors + 3 alpha overlay tokens for grain/hover/divider. | |

**User's choice:** Compact: 6 tokens

### Q4 — How should the gradient + grain combine on body?

| Option | Description | Selected |
|--------|-------------|----------|
| Body bg gradient + fixed `::after` grain overlay | linear-gradient on body, grain on body::after with mix-blend-mode overlay; no GPU repaint per scroll. | ✓ |
| Single root `<div>` with both layers as backgrounds | Adds a DOM node and a `<GrainOverlay />` component file. | |
| Gradient on body, grain via shorthand `background-image` | Most compact, loses mix-blend-mode ergonomics. | |

**User's choice:** Body bg gradient + fixed `::after` grain overlay

---

## Repo bootstrap + Vercel deploy shape

### Q1 — How do we bootstrap the Next.js app inside this repo?

| Option | Description | Selected |
|--------|-------------|----------|
| `create-next-app` into a temp dir, then merge | Generate elsewhere, copy files in, strip defaults. Preserves existing `.git`, `.planning/`, `CLAUDE.md`. | ✓ |
| Hand-roll: package.json + minimal config | Full control; ~30 min more work; risk of missing a Next 16 default. | |
| `create-next-app` directly here with `--skip-install` | Likely fails because cwd is not empty. | |

**User's choice:** `create-next-app` into a temp dir, then merge

### Q2 — What does the Phase 1 Vercel preview render?

| Option | Description | Selected |
|--------|-------------|----------|
| Token showcase page | Gradient + grain + monogram + Fraunces hero word; plus hidden `/_tokens` route showing every token. | ✓ |
| Truly blank charcoal page | Just gradient + grain + monogram. Smallest deliverable; less to review. | |
| Showcase page only, no `/_tokens` route | Single `/` page with all tokens visible inline. Simpler; gets fully replaced in Phase 2. | |

**User's choice:** Token showcase page

### Q3 — When do we add the production domain to Vercel?

| Option | Description | Selected |
|--------|-------------|----------|
| Stage in Phase 1, swap CNAME in Phase 6 | Add domain now so Vercel begins SSL cert staging; CNAME flip stays in Phase 6. | ✓ |
| Defer entirely to Phase 6 | Risk: SSL cert takes hours to stage; cutover window lengthens. | |
| Add only `braehods.com` (skip www) in Phase 1 | Saves a click for no real benefit. | |

**User's choice:** Stage in Phase 1, swap CNAME in Phase 6

### Q4 — Vercel project setup details?

| Option | Description | Selected |
|--------|-------------|----------|
| Project=`braeden-site`, prod=`main`, NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw | Speed Insights + Analytics enabled in Phase 1 for baseline metrics. | ✓ |
| Same, but defer Speed Insights/Analytics to Phase 6 | No real-user data on early previews. | |
| Same, but env var named FORMSPREE_ID (no NEXT_PUBLIC_) | Implies Phase 5 architecture change away from `@formspree/react` client island. | |

**User's choice:** Project=`braeden-site`, prod=`main`, NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw

---

## Claude's Discretion

The user did not select the **reduced-motion + focus-ring** gray area, so the planner / executor implements DSGN-06 / DSGN-07 / DSGN-08 / A11Y-02 / A11Y-06 directly from PITFALLS.md guidance:
- Opt-out reduced-motion override in `globals.css` (`*, *::before, *::after { animation-duration: 0.01ms !important; ... }`).
- `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` global rule.
- `lib/motion.ts` ships in Phase 1 as the isolation seam (per ARCHITECTURE.md), even though Phase 1 has no motion of its own.

## Deferred Ideas

- Real B monogram design (Phase 6 swap-pass)
- iOS Safari favicon PNG fallback (Phase 6 if real-device testing flags it)
- `apple-touch-icon.png`, web manifest (Phase 6 SEO sweep)
- TS 6.0 adoption (re-evaluate at first phase boundary)
- Light-mode toggle (LITE-01, v2)
