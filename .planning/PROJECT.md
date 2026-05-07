# Braeden Site (braehods.com)

## What This Is

A personal website at braehods.com — a credibility-forward, professional home
for Braeden's name on the internet. Built to make a stranger arriving from
Instagram, GitHub, an investor intro, or a recruiter search think "this kid
looks interesting, let me reach out." Replaces the current minimal Geist-font
site at braehods.com and is designed as a foundation Braeden can keep building
on (writing, content hubs, future product launches).

## Core Value

Anyone who lands on the site walks away with two impressions, in order:
1. "That's a nice website."
2. "I want to follow up with him."

If everything else fails, the site has to clear that bar — visual polish first,
contact-conversion second. All other decisions defer to those.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero treats Braeden as the focal point (not projects, not content)
- [ ] One-line positioning under the name in the spirit of "Business student and
      entrepreneur in LA, building things and running a small content brand"
- [ ] "Currently" / status line that signals active work (e.g., "Currently
      shipping CapitolLens") and is easy to update
- [ ] Custom "B" monogram or wordmark used as the recurring visual anchor
      (favicon, hero, footer, transitions) — exact form deferred to design phase
- [ ] About section/page — short, photo, story
- [ ] Work / Projects page — all projects shown in equal-weight grid
      (CapitolLens, shorts-factory, meme-dashboard, prediction-market-bot,
      no-more-short-form, mc-packet-client, plus archived braehods)
- [ ] Channel links — buttons or block linking out to YouTube and Instagram
      channels (no on-site video embeds)
- [ ] Contact — modal or page using the existing Formspree integration
      (FORMSPREE_ID = xqeypnkw) preserved from the current site
- [ ] Hybrid IA — curated homepage + dedicated sub-pages for About and Work
- [ ] Dark mode default; charcoal gradient background (~#1a1a1f → #0a0a0a) with
      subtle grain overlay
- [ ] Display serif headline + clean sans body (editorial pairing); soft
      electric blue accent (~#7c87ff)
- [ ] Restrained craft motion — staggered fades on load, hover lifts, smooth
      section transitions; no scroll-jacking, no parallax, no WebGL
- [ ] Built on Next.js (App Router) + MDX, deployed to Vercel; written so a
      future /writing route can be added without restructuring
- [ ] Replace the existing braehods.com deployment (this repo becomes the new
      source of truth; old braehods repo gets archived)
- [ ] Lighthouse 95+ on mobile and desktop, accessible (WCAG AA), responsive
      from 320px up

### Out of Scope (v1)

- /writing or blog page — designed for later, not built now
- Video embeds (YouTube/IG iframes) — channel links only
- Newsletter signup / RSS — defer
- /now page (Derek-Sivers style) — defer; "Currently" line on home covers it
      for v1
- CMS / admin UI — content lives in MDX/JSON in the repo for v1
- Two-channel content split as separate UI surfaces — single "channels" block
      is enough; the strategic split is a content-side concern
- New portrait shoot — site is designed assuming a placeholder portrait (or
      current photo treated tastefully); new shoot happens out-of-band
- Light-mode toggle — dark only for v1, simpler design surface
- Multi-language — English only

## Context

- **Existing site at braehods.com**: minimal Geist-font landing page (Hero +
  Work + About + Connect modal), Formspree contact wired with id `xqeypnkw`,
  hosted via GitHub Pages with CNAME → braehods.com. Repo: `~/Projects/braehods`.
  Photo at `images/photo.jpg`.
- **Brand context**: Braeden is a business student and entrepreneur in LA who
  builds trading systems (CapitolLens — paper-traded Form 4 insider strategy,
  +18%/yr Sharpe 0.93 in backtest), runs a short-form content brand across two
  channels (Channel A = wholesome POV stories, Channel B = single-meme
  reaction VO), and ships a stack of side projects (shorts-factory,
  meme-dashboard, prediction-market-bot, no-more-short-form, mc-packet-client).
- **Audience is intentionally broad**: recruiters/employers, investors, fellow
  builders, content viewers from IG/YT. The site has to be broadly impressive
  rather than optimized for one persona.
- **Visual references discussed**: Braeden likes rauno.me (craft, manifesto-
  style, micro-detail) and brittanychiang.com (architectural rigor, dark navy
  + electric accent). The chosen direction is editorial-dark — not pure
  minimalist, not Vercel-template, not generic dev portfolio.
- **Anti-patterns to avoid** (surfaced during research): purple-to-blue
  gradient + glassmorphism heroes, WebGL particle fields, tech-stack-sticker
  walls, generic "passionate developer who loves to build" copy.

## Constraints

- **Tech stack**: Next.js (App Router) + MDX + TypeScript, deployed to Vercel.
  Chosen for extensibility (future /writing, future product pages) and for
  Geist/Vercel ecosystem fit.
- **Domain**: Must publish to braehods.com (replacing the current site). DNS /
  CNAME / GitHub link migration handled as part of the launch.
- **Contact**: Must preserve the Formspree integration (id `xqeypnkw`) so the
  existing inbox keeps receiving messages.
- **Performance**: Lighthouse 95+ on mobile; ship near-zero JS for initial
  load; defer or omit any heavy library that doesn't earn its bytes.
- **Accessibility**: WCAG AA at minimum — color contrast on the charcoal
  gradient must clear AA, all interactive elements keyboard-navigable, motion
  respects `prefers-reduced-motion`.
- **Content scope**: No CMS; content (project entries, channel links, copy)
  lives in MDX or typed JSON in the repo, edited via PR.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Editorial-dark over minimalist | User explicitly wants polish + craft, not whitespace-purism. References (rauno.me, chiang.com) are crafted and dense, not minimal. | — Pending |
| Hero pattern: photo + name + TL;DR + "Currently" | Multi-audience problem — TL;DR + Currently satisfy recruiter/investor/builder/fan in one scan. | — Pending |
| Custom "B" monogram as signature element | A recurring mark gives the site a memorable anchor without leaning on motion or templates; form deferred so design can iterate freely. | — Pending |
| All-equal projects grid (no flagship) | User chose breadth over hero-card. Lets the site read as "I do many things well" rather than "I have one thing." | — Pending |
| No video embeds, channel links only | User explicit. Keeps the site fast, clean, and aesthetically consistent — third-party iframes would break the editorial mood. | — Pending |
| Next.js + MDX over vanilla or Astro | User wants something to "build on." Next gives the cleanest path to add /writing, dynamic pages, or product surfaces later. Astro is content-faster but app-feature-poorer. | — Pending |
| Skip /writing for v1 | Zero existing essay backlog — a writing page would launch empty and look hollow. Architect the site to absorb it later. | — Pending |
| Skip light mode toggle | One mood, executed precisely, beats two moods executed loosely. Dark is the chosen identity. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-07 after initialization*
