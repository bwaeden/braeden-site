---
phase: 01-foundation-design-tokens
plan: 01
type: execute
waves: [0, 1, 2, 3, 4]
depends_on: []
files_modified:
  # W0 — validation infrastructure
  - playwright.config.ts
  - tests/build-output.spec.ts
  - tests/folder-structure.spec.ts
  - tests/no-client-components.spec.ts
  - tests/no-bare-outline-none.spec.ts
  - tests/visual.spec.ts
  - tests/tokens.spec.ts
  - tests/lighthouse.spec.ts
  - tests/monogram.spec.ts
  - tests/focus-ring.spec.ts
  - tests/motion-seam.spec.ts
  - tests/reduced-motion.spec.ts
  - tests/contrast.spec.ts
  - tests/favicon.spec.ts
  # W1 — scaffold
  - package.json
  - package-lock.json
  - tsconfig.json
  - next.config.ts
  - eslint.config.mjs
  - prettier.config.cjs
  - postcss.config.mjs
  - .gitignore
  - .env.local.example
  - README.md
  - mdx-components.tsx
  - lib/utils.ts
  - data/site.ts
  - data/currently.ts
  - data/channels.ts
  - data/projects.ts
  # W2 — tokens + fonts + favicon
  - app/globals.css
  - app/fonts.ts
  - app/layout.tsx
  - app/page.tsx
  - app/icon.svg
  # W3 — components + contracts + showcase
  - components/ui/MonogramMark.tsx
  - components/layout/Nav.tsx
  - components/layout/Footer.tsx
  - lib/motion.ts
  - app/_tokens/page.tsx
  # W4 — deploy
  - .vercel/project.json
autonomous: false  # W4 includes manual Vercel-dashboard checkpoint + deploy-time sign-off
requirements:
  - FOUND-01
  - FOUND-02
  - FOUND-03
  - FOUND-04
  - FOUND-05
  - FOUND-06
  - FOUND-07
  - FOUND-08
  - DSGN-01
  - DSGN-02
  - DSGN-03
  - DSGN-04
  - DSGN-05
  - DSGN-06
  - DSGN-07
  - DSGN-08
  - DSGN-09
  - A11Y-02
  - A11Y-06
  - SEO-07
user_setup:
  - service: vercel
    why: "Phase 1 success criterion FOUND-05 — preview URL deploys within ~2 minutes of push (D-12, D-14)"
    env_vars:
      - name: NEXT_PUBLIC_FORMSPREE_ID
        value: xqeypnkw
        source: "Set in Vercel Project Settings -> Environment Variables for Production, Preview, Development (D-13)"
    dashboard_config:
      - task: "Create Vercel project named 'braeden-site', framework preset Next.js (auto-detected), production branch 'main'"
        location: "Vercel dashboard -> Add New... -> Project -> Import GitHub repo"
      - task: "Add custom domains 'braehods.com' and 'www.braehods.com'. DNS still points at GitHub Pages — Vercel will show 'Invalid Configuration', that is expected. SSL pre-stages anyway (Pitfall 17)"
        location: "Vercel project -> Settings -> Domains"
      - task: "Confirm 'Preview Deployments' is enabled on every branch + PR (default)"
        location: "Vercel project -> Settings -> Git"
must_haves:
  truths:
    - "Pushing a commit to any branch produces a Vercel preview URL within ~2 minutes"
    - "Visiting the preview URL shows a charcoal gradient (180deg, #1a1a1f -> #0a0a0a) with grain overlay"
    - "Body copy renders in Geist Sans, hero word renders in Fraunces 96px, no FOUT/FOIT, CLS = 0"
    - "B monogram appears in nav (24px), footer (16px), and as the favicon"
    - "Tabbing through any link shows a 2px solid #7c87ff focus ring with 2px offset"
    - "DevTools 'Emulate prefers-reduced-motion: reduce' zeroes all animation/transition durations"
    - "WebAIM/axe verifies AA contrast for --color-text and --color-muted at top, middle, bottom of gradient"
    - "/_tokens route renders all 6 color tokens, the typography ramp, and the monogram at 5 sizes"
    - "@vercel/analytics and @vercel/speed-insights register at least one event per preview"
    - "braehods.com + www.braehods.com appear in the Vercel project domains list (SSL staging started)"
    - "No file in the repo contains the string 'use client' (FOUND-07)"
  artifacts:
    - path: "app/globals.css"
      provides: "@theme block (6 color tokens + 3 font vars), body gradient, body::after grain, :focus-visible rule, reduced-motion override, @keyframes fade-in-up"
      contains: "@theme"
    - path: "app/fonts.ts"
      provides: "next/font wiring for Fraunces (axes ['SOFT','opsz'], weights 600/700, swap), GeistSans, GeistMono with --font-* CSS vars"
      exports: ["fraunces", "GeistSans", "GeistMono"]
    - path: "app/layout.tsx"
      provides: "Root layout with font CSS vars on <html>, <Nav/>, <main>, <Footer/>, <Analytics/>, <SpeedInsights/>"
      min_lines: 25
    - path: "app/page.tsx"
      provides: "Placeholder hero — single 'Braeden' word in Fraunces 96px (clamp 64->96), centered"
    - path: "app/_tokens/page.tsx"
      provides: "Hidden token-showcase route (D-11) — Colors, Typography, Monogram sections"
      contains: "noindex"
    - path: "app/icon.svg"
      provides: "Favicon: B monogram path with shape-rendering='crispEdges', text-on-charcoal direction"
    - path: "components/ui/MonogramMark.tsx"
      provides: "<MonogramMark size={number} className?={string} aria-hidden?={boolean} /> RSC, fill='currentColor'"
      exports: ["MonogramMark"]
    - path: "components/layout/Nav.tsx"
      provides: "Server <header> with monogram + 'Braeden Hodson' + About/Work/Contact placeholder links (route to /)"
    - path: "components/layout/Footer.tsx"
      provides: "Server <footer> with monogram (16px, --color-muted) + © 2026 Braeden Hodson + 'braehods.com' text"
    - path: "lib/motion.ts"
      provides: "respectsReducedMotion flag, fadeInUp class name, stagger(i) helper — isolation seam (CD-03)"
      exports: ["respectsReducedMotion", "fadeInUp", "stagger"]
    - path: "lib/utils.ts"
      provides: "cn(...inputs) helper using clsx + tailwind-merge"
      exports: ["cn"]
    - path: "data/site.ts"
      provides: "Site-level metadata (name, tagline, domain, social handles) — typed export"
    - path: "data/currently.ts"
      provides: "{ statement, updatedAt, link? } single object — Phase 2 will read"
      contains: "CurrentlyStatement"
    - path: "data/channels.ts"
      provides: "YouTube + Instagram channel handles + URLs — typed array"
    - path: "data/projects.ts"
      provides: "Project[] with Zod schema (slug, title, description, tags, status, href) — empty in P1; Phase 4 fills"
      contains: "z.object"
    - path: "next.config.ts"
      provides: "@next/mdx wiring, pageExtensions includes md+mdx"
      contains: "createMDX"
    - path: "mdx-components.tsx"
      provides: "useMDXComponents stub (4 lines) — prevents @next/mdx crash if any .mdx is imported"
      exports: ["useMDXComponents"]
    - path: "tsconfig.json"
      provides: "strict, noUncheckedIndexedAccess, paths { '@/*': ['./*'] }"
      contains: "strict"
    - path: "package.json"
      provides: "Pinned versions: next 16.2.6, react 19.2.6, typescript 5.9.x, tailwindcss 4.2.4, @next/mdx 16.2.6, geist 1.7.0, @vercel/analytics 2.0.1, @vercel/speed-insights 2.0.0, clsx 2.1.1, tailwind-merge 3.5.0, zod 4.4.3, lucide-react 1.14.0; scripts: dev, build, lint, typecheck, format, test, test:e2e"
    - path: "playwright.config.ts"
      provides: "Mobile + desktop projects, baseURL env var, chromium-only by default"
    - path: "tests/visual.spec.ts"
      provides: "Validates DSGN-01 (gradient), DSGN-02 (grain opacity 0.04)"
    - path: "tests/tokens.spec.ts"
      provides: "Validates DSGN-03 — all 6 CSS custom properties resolve to expected hex values"
    - path: "tests/focus-ring.spec.ts"
      provides: "Validates DSGN-06, A11Y-02 — 2px solid rgb(124,135,255) outline on focused link"
    - path: "tests/reduced-motion.spec.ts"
      provides: "Validates DSGN-08, A11Y-06 — emulateMedia({reducedMotion:'reduce'}) zeroes durations"
    - path: "tests/contrast.spec.ts"
      provides: "Validates DSGN-09 — axe-core color-contrast on /_tokens"
    - path: "tests/monogram.spec.ts"
      provides: "Validates DSGN-05 — monogram present at expected sizes on nav/footer/_tokens"
    - path: "tests/lighthouse.spec.ts"
      provides: "Validates DSGN-04 — CLS = 0 on /, fonts in computed font-family"
    - path: "tests/no-client-components.spec.ts"
      provides: "Validates FOUND-07 — zero 'use client' directives"
    - path: "tests/folder-structure.spec.ts"
      provides: "Validates FOUND-04 — required folders exist"
    - path: "tests/build-output.spec.ts"
      provides: "Validates FOUND-02 — emitted CSS contains '--color-bg-end: #0a0a0a'"
    - path: "tests/favicon.spec.ts"
      provides: "Validates SEO-07 — /icon.svg responds with valid SVG"
    - path: "tests/no-bare-outline-none.spec.ts"
      provides: "Validates A11Y-02 — no 'outline: none' without :focus-visible replacement"
    - path: "tests/motion-seam.spec.ts"
      provides: "Validates DSGN-07 — lib/motion.ts exports fadeInUp + stagger() + respectsReducedMotion"
  key_links:
    - from: "app/globals.css @theme"
      to: "Tailwind v4 utilities (bg-bg-end, text-text, font-serif, ...)"
      via: "Tailwind v4 CSS-first config — auto-emits utilities from @theme"
      pattern: "@theme\\s*\\{"
    - from: "app/layout.tsx"
      to: "Fraunces + GeistSans + GeistMono CSS variables on <html>"
      via: "className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}"
      pattern: "fraunces.variable.*GeistSans.variable.*GeistMono.variable"
    - from: "components/layout/Nav.tsx + Footer.tsx"
      to: "components/ui/MonogramMark.tsx"
      via: "import { MonogramMark } from '@/components/ui/MonogramMark'"
      pattern: "import\\s*\\{\\s*MonogramMark\\s*\\}"
    - from: "app/icon.svg"
      to: "Same B path data as MonogramMark (with crispEdges + thicker stem variant)"
      via: "Static file (Next 16 file convention auto-injects link[rel=icon])"
      pattern: "shape-rendering=\"crispEdges\""
    - from: "app/globals.css :focus-visible rule"
      to: "Every native interactive element (a, button, input)"
      via: "Universal CSS selector — no per-component focus styles"
      pattern: ":focus-visible\\s*\\{[^}]*outline:\\s*2px\\s*solid\\s*var\\(--color-accent\\)"
    - from: "app/globals.css @media (prefers-reduced-motion: reduce)"
      to: "Every animated/transitioned element (Phase 2+ hero, hover lifts)"
      via: "Universal selector with !important on animation/transition durations"
      pattern: "@media\\s*\\(\\s*prefers-reduced-motion:\\s*reduce"
    - from: "lib/motion.ts"
      to: "Phase 2 hero (consumes fadeInUp + stagger())"
      via: "Public API — no library install; CSS keyframe in globals.css"
      pattern: "export\\s+const\\s+(fadeInUp|stagger|respectsReducedMotion)"
    - from: "Vercel project 'braeden-site'"
      to: "GitHub repo at braeden-site"
      via: "Vercel for GitHub integration — preview deploy on every push"
      pattern: "n/a (dashboard config)"
---

<objective>
Phase 1 — Foundation + Design Tokens. Stand up a deployable Next.js 16 + Tailwind v4 project with the locked design-token surface, three fonts, the B-monogram component, the focus + reduced-motion contracts, a hidden token-showcase route, and a live Vercel preview URL with `braehods.com` SSL staging started.

Purpose: Every Phase 2-6 surface inherits the contracts established here. Get them right once, never re-litigate. CONTEXT.md locks 14 implementation decisions (D-01..D-14) and 3 Claude-discretion items (CD-01..CD-03); UI-SPEC.md locks the visual contract; RESEARCH.md provides verified patterns. The planner's job here is sequencing + verification, not redesign.

Output: 20 Phase 1 requirements satisfied (FOUND-01..08, DSGN-01..09, A11Y-02, A11Y-06, SEO-07), all 13 Playwright/axe/Lighthouse tests green against a Vercel preview URL, both `braehods.com` and `www.braehods.com` added to Vercel with cert pre-staging in flight.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md

**Wave structure (executor reads `wave` field on each task):**
- **Wave 0** — Validation infrastructure (Playwright + axe-core + Lighthouse + 13 test stubs). Runs BEFORE any source code so every later task has an `<automated>` verify. All Wave 0 tests start RED — that is intentional. Later waves turn them GREEN.
- **Wave 1** — Project scaffold (`create-next-app` merge, configs, typed data files, `mdx-components.tsx`). FOUND-01, FOUND-04, FOUND-06, FOUND-08 + the FOUND-03 stub.
- **Wave 2** — Design token + font + favicon layer (`globals.css` with `@theme`, `app/fonts.ts`, root `app/layout.tsx`, `app/page.tsx`, `app/icon.svg`). FOUND-02, FOUND-03, DSGN-01, DSGN-02, DSGN-03, DSGN-04, SEO-07.
- **Wave 3** — Components + accessibility contracts + token showcase (`MonogramMark`, `Nav`, `Footer`, `lib/motion.ts`, `:focus-visible` rule wired, `prefers-reduced-motion` rule wired, `/_tokens` route, no-`'use client'` enforcement). DSGN-05, DSGN-06, DSGN-07, DSGN-08, DSGN-09, A11Y-02, A11Y-06, FOUND-07.
- **Wave 4** — Vercel deploy + observability + sign-off. Connect repo, set env var, add domains, run full Playwright suite against preview URL, manual mix-blend-mode mobile-perf checkpoint, manual FOUND-05 sign-off.
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation-design-tokens/01-CONTEXT.md
@.planning/phases/01-foundation-design-tokens/01-UI-SPEC.md
@.planning/phases/01-foundation-design-tokens/01-RESEARCH.md
@.planning/phases/01-foundation-design-tokens/01-VALIDATION.md
@.planning/research/STACK.md
@.planning/research/ARCHITECTURE.md
@.planning/research/PITFALLS.md
@CLAUDE.md

<interfaces>
<!-- Contracts the executor needs. Embed verbatim — no codebase exploration. -->

## Six color tokens (D-08 — LOCKED, do not relitigate)
```css
--color-bg-start: #1a1a1f;  /* gradient top */
--color-bg-end:   #0a0a0a;  /* gradient bottom; baseline for all contrast checks */
--color-text:     #e8e8e8;  /* cool-white body */
--color-muted:    #a8a8a8;  /* AA-safe muted (D-06: was #707070, now #a8a8a8) */
--color-accent:   #7c87ff;  /* soft electric blue */
--color-border:   #2a2a2f;  /* hairline / dividers */
```

## Pinned package versions (from CLAUDE.md + RESEARCH.md, verified 2026-05-07)
```json
{
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.6",
    "react-dom": "19.2.6",
    "@next/mdx": "16.2.6",
    "@mdx-js/loader": "^3.0.0",
    "@mdx-js/react": "^3.0.0",
    "@types/mdx": "latest",
    "geist": "1.7.0",
    "@vercel/analytics": "2.0.1",
    "@vercel/speed-insights": "2.0.0",
    "clsx": "2.1.1",
    "tailwind-merge": "3.5.0",
    "zod": "4.4.3",
    "lucide-react": "1.14.0"
  },
  "devDependencies": {
    "typescript": "5.9.x",
    "tailwindcss": "4.2.4",
    "@tailwindcss/postcss": "4.2.4",
    "eslint": "^9.0.0",
    "@next/eslint-plugin-next": "16.2.6",
    "prettier": "3.8.0",
    "prettier-plugin-tailwindcss": "0.8.0",
    "@playwright/test": "^1.55.0",
    "@axe-core/playwright": "latest",
    "playwright-lighthouse": "latest"
  }
}
```

Pin exact versions (no `^` on production deps) per RESEARCH.md security domain V10. Re-run `npm view <pkg> version` for each pinned package on bootstrap to confirm currency.

## MonogramMark component API (D-04 — STABLE CONTRACT, Phase 6 only swaps path data)
```tsx
interface MonogramMarkProps {
  size?: number;              // pixel value; defaults to 24
  className?: string;         // for color override via Tailwind text-* utilities
  'aria-hidden'?: boolean;    // defaults to true (decorative everywhere in Phase 1)
}

export function MonogramMark(props: MonogramMarkProps): JSX.Element;
```

## CurrentlyStatement type (locked by SUMMARY.md resolved-divergences)
```ts
export interface CurrentlyStatement {
  statement: string;
  updatedAt: string;  // ISO date
  link?: string;
}
```

## lib/motion.ts contract (CD-03)
```ts
export const respectsReducedMotion: boolean;
export const fadeInUp: 'fade-in-up';
export function stagger(i: number): React.CSSProperties;  // returns { '--stagger': `${i*80}ms` }
```

## Validation framework (from 01-VALIDATION.md — do not invent new tests)

| Test file                           | Requirement(s)         | Wave that turns it GREEN |
|-------------------------------------|------------------------|--------------------------|
| tests/build-output.spec.ts          | FOUND-02               | W2                       |
| tests/folder-structure.spec.ts      | FOUND-04               | W1                       |
| tests/no-client-components.spec.ts  | FOUND-07               | W3                       |
| tests/no-bare-outline-none.spec.ts  | A11Y-02                | W3                       |
| tests/visual.spec.ts                | DSGN-01, DSGN-02       | W2                       |
| tests/tokens.spec.ts                | DSGN-03                | W2                       |
| tests/lighthouse.spec.ts            | DSGN-04                | W2 (CLS=0 verified W4)   |
| tests/monogram.spec.ts              | DSGN-05                | W3                       |
| tests/focus-ring.spec.ts            | DSGN-06, A11Y-02       | W3                       |
| tests/motion-seam.spec.ts           | DSGN-07                | W3                       |
| tests/reduced-motion.spec.ts        | DSGN-08, A11Y-06       | W3                       |
| tests/contrast.spec.ts              | DSGN-09                | W3 (re-verify W4)        |
| tests/favicon.spec.ts               | SEO-07                 | W2                       |

## npm scripts (package.json — every <verify> uses these)
```json
"scripts": {
  "dev": "next dev --turbo",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "format": "prettier --check .",
  "format:write": "prettier --write .",
  "test": "playwright test --project=chromium-mobile -x",
  "test:full": "playwright test"
}
```

## File paths excluded from EVERY edit (D-10 bootstrap merge constraint)
- `.git/` (preserve)
- `.planning/` (preserve)
- `CLAUDE.md` (preserve verbatim — only append project sections if explicitly requested)
- `node_modules/` (let npm regenerate)
- `.next/` (build artifact)
- `*-bootstrap/` (the temp create-next-app output is consumed and discarded)

</interfaces>
</context>

---

# Wave 0 — Validation Infrastructure

> Goal: Install Playwright + axe-core + Lighthouse, scaffold all 13 test files, ship `playwright.config.ts`. Tests fail at this stage — that is the point. Subsequent waves make them green.
>
> Why this is W0 (not interleaved): RESEARCH.md "Validation Architecture" puts test scaffolding before source code so every later task has an automated verify command. The Nyquist rule (every `<verify>` block needs an `<automated>` command) requires the test files exist before they are referenced.

<tasks>

<task id="W0-T1" wave="0" type="auto">
  <name>Task W0-T1: Install Playwright + axe + Lighthouse and write playwright.config.ts</name>
  <requirements>FOUND-01 (foundation), DSGN-04, DSGN-09, A11Y-02 (downstream consumers)</requirements>
  <files>package.json, package-lock.json, playwright.config.ts</files>
  <action>
    From the project root `C:\Users\Braeden\Projects\braeden-site`:

    1. If `package.json` does not yet exist (it will not — repo is greenfield except for `.planning/` and `CLAUDE.md`), initialize one with `npm init -y` so dev dependencies have a target. **Do NOT run `create-next-app` yet** — that happens in W1-T1; this step only creates the minimal `package.json` shell so Playwright installs into the project root.

    2. Install validation tooling exactly:
       ```bash
       npm install -D @playwright/test@^1.55.0 @axe-core/playwright playwright-lighthouse
       npx playwright install chromium
       ```

    3. Write `playwright.config.ts` at the project root with:
       - `testDir: './tests'`
       - `timeout: 30_000`
       - `use.baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'` (env var lets W4 point at the Vercel preview URL)
       - Two projects: `chromium-mobile` (Pixel 5 viewport, default) and `chromium-desktop` (1280x800)
       - `webServer` block disabled for now (W1 will add `npm run start` once Next is installed); add a TODO comment

    4. Add the test scripts to `package.json`:
       ```json
       "scripts": {
         "test": "playwright test --project=chromium-mobile -x",
         "test:full": "playwright test"
       }
       ```

    Per D-10, this `package.json` is intentionally bare — W1-T1's `create-next-app` merge will overwrite the dependencies block. Re-installing Playwright after the merge is acceptable; npm will dedupe.
  </action>
  <verify>
    <automated>npx playwright --version</automated>
    Plus: `cat playwright.config.ts | head -5` shows `testDir` and the `chromium-mobile` project name.
  </verify>
  <done>Playwright 1.55.x installed, chromium browser binary present, `playwright.config.ts` exists with two projects + `PLAYWRIGHT_BASE_URL` env wiring.</done>
</task>

<task id="W0-T2" wave="0" type="auto">
  <name>Task W0-T2: Stub all 13 test files (RED on purpose)</name>
  <requirements>FOUND-02, FOUND-04, FOUND-07, DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, DSGN-06, DSGN-07, DSGN-08, DSGN-09, A11Y-02, A11Y-06, SEO-07</requirements>
  <files>
    tests/build-output.spec.ts,
    tests/folder-structure.spec.ts,
    tests/no-client-components.spec.ts,
    tests/no-bare-outline-none.spec.ts,
    tests/visual.spec.ts,
    tests/tokens.spec.ts,
    tests/lighthouse.spec.ts,
    tests/monogram.spec.ts,
    tests/focus-ring.spec.ts,
    tests/motion-seam.spec.ts,
    tests/reduced-motion.spec.ts,
    tests/contrast.spec.ts,
    tests/favicon.spec.ts
  </files>
  <action>
    Create all 13 spec files under `tests/`. Each file must:
    - Use `import { test, expect } from '@playwright/test';` (or `node:fs`/`node:path` for filesystem-only tests).
    - Import `AxeBuilder` from `@axe-core/playwright` where the table calls for axe.
    - Encode the assertion described in 01-VALIDATION.md verbatim — do **not** invent new tests.

    Per-file contracts (each spec is small — most are 10-30 lines):

    1. **tests/build-output.spec.ts** (FOUND-02 — runs after `npm run build`):
       - Read every CSS file under `.next/static/css/` via `node:fs`.
       - Strip header comments (`grep -v '^#'` equivalent — line starts with `#` is not relevant for CSS but apply the same hygiene to ignore comments).
       - Assert at least one CSS file contains `--color-bg-end: #0a0a0a` (or `--color-bg-end:#0a0a0a` allowing optional whitespace via regex).
       - **Specificity:** Per critical-rules grep gate hygiene, do NOT use bare `grep -c ... == 0`. The assertion is `expect(matchCount).toBeGreaterThan(0)`.

    2. **tests/folder-structure.spec.ts** (FOUND-04):
       - Use `node:fs.statSync` to assert all of these are directories: `app/`, `components/`, `components/ui/`, `components/layout/`, `content/`, `data/`, `lib/`, `public/`.
       - Test fails if any is missing.

    3. **tests/no-client-components.spec.ts** (FOUND-07):
       - Recursively scan `app/`, `components/`, `lib/` for `*.tsx` and `*.ts` files.
       - For each file, read contents and **strip top-of-file comment lines** (`//`, `/* */`) before searching for `'use client'` or `"use client"`.
       - Assert zero hits across the scan.
       - This is a filesystem-only test — does not need a browser.

    4. **tests/no-bare-outline-none.spec.ts** (A11Y-02):
       - Read `app/globals.css` (and any other `.css` files).
       - Find every `outline: none` (or `outline:none`) occurrence. For each, assert that within the same selector block (or within 3 lines following), there is a `:focus-visible` rule with `outline: 2px solid var(--color-accent)`.
       - Use a tiny CSS parser via regex — full PostCSS not required; the file is tiny.

    5. **tests/visual.spec.ts** (DSGN-01, DSGN-02):
       - `await page.goto('/')`.
       - DSGN-01: `const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);` — assert `bg` matches `/linear-gradient\(180deg,\s*rgb\(26,\s*26,\s*31\),\s*rgb\(10,\s*10,\s*10\)\)/`.
       - DSGN-02: `const opacity = await page.evaluate(() => getComputedStyle(document.body, '::after').opacity);` — assert `opacity === '0.04'`.

    6. **tests/tokens.spec.ts** (DSGN-03):
       - `await page.goto('/')`.
       - For each of the 6 tokens (`--color-bg-start`, `--color-bg-end`, `--color-text`, `--color-muted`, `--color-accent`, `--color-border`):
         `const value = await page.evaluate((name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(), tokenName);`
         assert it equals the expected hex (e.g., `#0a0a0a` for `--color-bg-end`).

    7. **tests/lighthouse.spec.ts** (DSGN-04):
       - Use `playwright-lighthouse` to run a Lighthouse audit on `/`.
       - Assert `audits['cumulative-layout-shift'].numericValue === 0`.
       - Assert the computed `font-family` of `body` includes `'Geist'` and the hero element includes `'Fraunces'` and the `font-mono` element includes `'Geist Mono'`. (Hero element has data attribute `data-test="hero-display"` — see W2-T4.)

    8. **tests/monogram.spec.ts** (DSGN-05):
       - `await page.goto('/')`.
       - Assert exactly one SVG in `<header>` (nav) with `width="24"` and `height="24"`.
       - Assert exactly one SVG in `<footer>` with `width="16"` and `height="16"`.
       - `await page.goto('/_tokens')`.
       - Assert SVGs at sizes 16, 24, 48, 96, 120 are all present.

    9. **tests/focus-ring.spec.ts** (DSGN-06, A11Y-02):
       - `await page.goto('/')`.
       - `await page.keyboard.press('Tab')` until first focusable element receives focus.
       - `const outline = await focused.evaluate(el => getComputedStyle(el).outline);`
       - Assert `outline` matches `/2px solid (rgb\(124,\s*135,\s*255\)|#7c87ff)/i`.
       - Repeat the Tab + assert pattern for the next 4 focusable elements (covers nav links + footer link).

    10. **tests/motion-seam.spec.ts** (DSGN-07):
        - This is a Node-side test, not browser. Use `import('../lib/motion.ts')` (Playwright's transformer can handle TS).
        - Assert `respectsReducedMotion === true`.
        - Assert `fadeInUp === 'fade-in-up'`.
        - Assert `stagger(2)` returns an object with `'--stagger': '160ms'`.
        - Also assert `app/globals.css` contains `@keyframes fade-in-up` (filesystem read).

    11. **tests/reduced-motion.spec.ts** (DSGN-08, A11Y-06):
        - `await page.emulateMedia({ reducedMotion: 'reduce' });`
        - `await page.goto('/');`
        - `const td = await page.evaluate(() => { const el = document.body; el.style.transition = 'opacity 1s'; return getComputedStyle(el).transitionDuration; });`
        - Assert `td === '0.01ms'` (the reduce override).

    12. **tests/contrast.spec.ts** (DSGN-09):
        - `await page.goto('/_tokens');`
        - Run `await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();`
        - Assert `results.violations.filter(v => v.id === 'color-contrast').length === 0`.

    13. **tests/favicon.spec.ts** (SEO-07):
        - `await page.goto('/icon.svg');`
        - Assert response status 200, content-type contains `svg`.
        - Assert response body contains `<path` and `viewBox=`.

    All 13 specs ship as RED at this point — they reference files (`/`, `/_tokens`, `app/globals.css`, `app/icon.svg`, `lib/motion.ts`) that do not exist yet. Run `npm test` to confirm they fail. **That is the contract** — Wave 1-3 turn each one green; W4 runs the full suite against the live preview URL.
  </action>
  <verify>
    <automated>npm test 2>&1 | tee w0-baseline.log; grep -c "passed\|failed" w0-baseline.log</automated>
    Expected: every spec exits with a failure (not an error — failure means the test ran and the assertion was false). At least 13 specs reported. Errors related to "module not found" for `@/components/...` are acceptable at this stage; assertion failures are required.
  </verify>
  <done>13 test files exist under `tests/`, every one references the requirement IDs from 01-VALIDATION.md table, `npm test` runs all of them and they fail with assertion errors (not parse errors).</done>
</task>

</tasks>

---

# Wave 1 — Project Scaffold

> Goal: Bootstrap Next 16 + React 19 + TS 5.9 + Tailwind v4 via `create-next-app`, merge into the repo (preserving `.git/`, `.planning/`, `CLAUDE.md`, the `tests/` directory + `playwright.config.ts` from W0), commit configs, ship typed data scaffolds + `mdx-components.tsx` stub. Turns `tests/folder-structure.spec.ts` GREEN.

<tasks>

<task id="W1-T1" wave="1" type="checkpoint:human-action" gate="blocking">
  <what-built>Wave 0 left the repo with `package.json` + Playwright + 13 RED tests + `playwright.config.ts`. This step needs a manual `npx create-next-app` run because the npm interactive prompts cannot be reliably automated from inside Claude's bash environment.</what-built>
  <how-to-verify>
    Open a PowerShell terminal at `C:\Users\Braeden\Projects\braeden-site` and run, in this order:

    1. **Bootstrap to a sibling directory** (per D-10 — keeps the existing `.git/`, `.planning/`, `CLAUDE.md`, and W0's `tests/` + `playwright.config.ts` + `package.json` safe):
       ```powershell
       cd ..
       npx create-next-app@latest braeden-site-bootstrap --typescript --tailwind --app --use-npm --eslint
       ```
       Accept defaults for any remaining prompts (e.g. `src/` directory: NO; default import alias `@/*`: YES).

    2. **Verify the bootstrap succeeded** — `ls braeden-site-bootstrap` should show `app/`, `node_modules/`, `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `app/globals.css`, `app/page.tsx`, `app/layout.tsx`.

    3. **Sanity-check versions** — open `braeden-site-bootstrap/package.json` and confirm `next` is `16.x` (target `16.2.6`), `react` is `19.x`, `tailwindcss` is `4.x`. If versions drifted (e.g., Next 17 shipped), STOP and flag it — RESEARCH.md pinned to 16.2.6 / 19.2.6 / 4.2.4 on 2026-05-07.

    4. **Confirm you have NOT run any destructive merge yet** — `braeden-site/` should still contain only `.git/`, `.planning/`, `CLAUDE.md`, `tests/`, `playwright.config.ts`, `package.json`, `package-lock.json`, `node_modules/` (Playwright).

    5. **Resume signal:** type "bootstrap-ok" once the temp directory exists and versions are correct, OR describe the version drift / failure.
  </how-to-verify>
  <resume-signal>Type "bootstrap-ok" or describe the issue.</resume-signal>
  <files>../braeden-site-bootstrap/</files>
  <verify>
    <automated>test -d ../braeden-site-bootstrap/app &amp;&amp; node -p "require('../braeden-site-bootstrap/package.json').dependencies.next"</automated>
    Should print a version starting with `16.`.
  </verify>
  <done>`../braeden-site-bootstrap/` exists with Next 16.x, React 19.x, Tailwind v4.x; user has typed "bootstrap-ok".</done>
</task>

<task id="W1-T2" wave="1" type="auto">
  <name>Task W1-T2: Diff-and-keep merge of bootstrap into the repo</name>
  <requirements>FOUND-01, FOUND-04, FOUND-06</requirements>
  <files>
    package.json,
    package-lock.json,
    tsconfig.json,
    next.config.ts,
    eslint.config.mjs,
    postcss.config.mjs,
    .gitignore,
    app/layout.tsx,
    app/page.tsx,
    app/globals.css,
    app/favicon.ico
  </files>
  <action>
    Per D-10, copy a curated subset of `../braeden-site-bootstrap/` files into the repo root, preserving the W0 artifacts. **Do NOT use a recursive copy** — it will stomp `.planning/`, `CLAUDE.md`, `tests/`, `playwright.config.ts`. Copy file-by-file:

    1. **Copy these from bootstrap to repo root** (overwrite OK):
       - `package.json` (overwrites W0's bare init — Playwright deps will be re-merged in step 4)
       - `package-lock.json` (will regenerate on `npm install`)
       - `tsconfig.json`
       - `next.config.ts` (W2 will modify for MDX)
       - `eslint.config.mjs`
       - `postcss.config.mjs`
       - `.gitignore`
       - `app/layout.tsx` (W2 replaces wholesale; copy now so the build does not break)
       - `app/page.tsx` (W2 replaces wholesale)
       - `app/globals.css` (W2 replaces wholesale)

    2. **Delete `app/favicon.ico`** if present — D-04 ships `app/icon.svg` instead (W2-T5). Stale `.ico` will cause Next 16's metadata file convention to prefer the wrong file.

    3. **Delete the bootstrap directory** after merge: `rm -rf ../braeden-site-bootstrap` (PowerShell: `Remove-Item -Recurse -Force ..\braeden-site-bootstrap`). The repo no longer needs it.

    4. **Re-merge Playwright + axe + Lighthouse devDependencies** into `package.json`. The bootstrap `package.json` overwrote W0's. Open `package.json`, add to `devDependencies`:
       ```json
       "@playwright/test": "^1.55.0",
       "@axe-core/playwright": "latest",
       "playwright-lighthouse": "latest"
       ```
       And add to `scripts`:
       ```json
       "typecheck": "tsc --noEmit",
       "format": "prettier --check .",
       "format:write": "prettier --write .",
       "test": "playwright test --project=chromium-mobile -x",
       "test:full": "playwright test"
       ```
       (`dev`, `build`, `start`, `lint` come from the bootstrap.)

    5. **Pin versions per D-10 / RESEARCH.md security V10** — change every `^x.y.z` to exact `x.y.z` for production dependencies. Keep `^` only on `@types/*` and pure dev dependencies. Per RESEARCH.md A6, this de-risks supply-chain.

    6. **Run `npm install`** — regenerates `node_modules/` and `package-lock.json` cleanly.

    7. **tsconfig.json hardening** — open `tsconfig.json` and ensure:
       - `"strict": true`
       - `"noUncheckedIndexedAccess": true` (CLAUDE.md requirement)
       - `"paths": { "@/*": ["./*"] }`
       Bootstrap defaults usually include strict but not `noUncheckedIndexedAccess` — add it explicitly.

    8. **Verify `npm run build` succeeds** with the bootstrap's default page.

    Per critical-rules: do not re-read files you already have in context. The above file list is exhaustive — no exploration needed.
  </action>
  <verify>
    <automated>npm run build</automated>
    Plus: `npm run lint` exits 0 and `npm run typecheck` exits 0.
    Plus: `npm test` (folder-structure.spec.ts is still RED because `components/` etc. do not yet exist — that is OK; W1-T3 fixes it).
  </verify>
  <done>`npm run build` succeeds against the bootstrap default page; bootstrap directory deleted; Playwright deps re-merged; `tsconfig.json` enforces strict + noUncheckedIndexedAccess + `@/*` alias; bootstrap `app/favicon.ico` removed.</done>
</task>

<task id="W1-T3" wave="1" type="auto">
  <name>Task W1-T3: Establish folder layout + .gitignore + Prettier + .env wiring + README</name>
  <requirements>FOUND-04, FOUND-06</requirements>
  <files>
    components/.gitkeep,
    components/ui/.gitkeep,
    components/layout/.gitkeep,
    content/.gitkeep,
    data/.gitkeep,
    lib/.gitkeep,
    public/.gitkeep,
    .gitignore,
    .env.local.example,
    prettier.config.cjs,
    README.md
  </files>
  <action>
    1. **Create the project folders** (FOUND-04). Each gets a `.gitkeep` placeholder so git tracks them and `tests/folder-structure.spec.ts` turns GREEN. Folders to create:
       - `components/`, `components/ui/`, `components/layout/`
       - `content/`
       - `data/`
       - `lib/`
       - `public/`

    2. **Augment `.gitignore`** (the bootstrap version is good; append):
       ```
       .env*
       !.env.local.example
       .vercel
       .DS_Store
       *-bootstrap/
       w0-baseline.log
       playwright-report/
       test-results/
       ```

    3. **Create `.env.local.example`** as the committed reference (real values live in Vercel env, per D-13):
       ```
       NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw
       ```

    4. **Install Prettier + prettier-plugin-tailwindcss** (CLAUDE.md "Development Tools"):
       ```bash
       npm install -D prettier@3.8.0 prettier-plugin-tailwindcss@0.8.0
       ```

    5. **Write `prettier.config.cjs`**:
       ```js
       /** @type {import('prettier').Config} */
       module.exports = {
         singleQuote: true,
         semi: true,
         trailingComma: 'all',
         printWidth: 100,
         plugins: ['prettier-plugin-tailwindcss'],
       };
       ```

    6. **Write a one-paragraph `README.md`**:
       - Project name: "Braeden Site (braehods.com)"
       - One-line summary from PROJECT.md Core Value
       - Dev commands: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`
       - Deploy target: Vercel (preview on every branch)

    7. **Run `npm run format:write`** on the existing files to baseline formatting.
  </action>
  <verify>
    <automated>npm test -- tests/folder-structure.spec.ts</automated>
    Folder-structure spec MUST go GREEN. Plus: `npm run format` exits 0 (clean formatting), `npm run lint` exits 0.
  </verify>
  <done>All 7 required folders exist with `.gitkeep`; `.gitignore`/`.env.local.example`/`prettier.config.cjs`/`README.md` exist; `npm run format` clean; `tests/folder-structure.spec.ts` GREEN.</done>
</task>

<task id="W1-T4" wave="1" type="auto">
  <name>Task W1-T4: @next/mdx wiring (config + components stub) + lib/utils.ts + typed data scaffolds</name>
  <requirements>FOUND-03, FOUND-08</requirements>
  <files>
    package.json,
    next.config.ts,
    mdx-components.tsx,
    lib/utils.ts,
    data/site.ts,
    data/currently.ts,
    data/channels.ts,
    data/projects.ts
  </files>
  <action>
    1. **Install MDX + utility deps** (versions pinned per CLAUDE.md):
       ```bash
       npm install @next/mdx@16.2.6 @mdx-js/loader @mdx-js/react @types/mdx
       npm install clsx@2.1.1 tailwind-merge@3.5.0 zod@4.4.3 lucide-react@1.14.0
       ```
       Also install runtime telemetry now (D-14) so W2 can wire them into layout:
       ```bash
       npm install @vercel/analytics@2.0.1 @vercel/speed-insights@2.0.0
       ```
       Then install Geist (D-04 — fonts will be wired in W2-T2):
       ```bash
       npm install geist@1.7.0
       ```

    2. **Write `next.config.ts`** with `@next/mdx` wiring per RESEARCH.md Pattern 5:
       ```ts
       import type { NextConfig } from 'next';
       import createMDX from '@next/mdx';

       const withMDX = createMDX({
         extension: /\.mdx?$/,
         options: {
           remarkPlugins: [],   // Phase 4 will add remark-gfm
           rehypePlugins: [],   // Phase 4 will add rehype-pretty-code
         },
       });

       const nextConfig: NextConfig = {
         pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
       };

       export default withMDX(nextConfig);
       ```

    3. **Write `mdx-components.tsx`** at the repo root (per RESEARCH.md Open Question #5 — ship the stub now even though Phase 1 has no MDX content):
       ```tsx
       import type { MDXComponents } from 'mdx/types';

       export function useMDXComponents(components: MDXComponents): MDXComponents {
         return { ...components };
       }
       ```

    4. **Write `lib/utils.ts` (cn helper)** per RESEARCH.md Pattern 7:
       ```ts
       import { clsx, type ClassValue } from 'clsx';
       import { twMerge } from 'tailwind-merge';

       export function cn(...inputs: ClassValue[]): string {
         return twMerge(clsx(inputs));
       }
       ```

    5. **Write `data/site.ts`** — placeholder typed export (Phase 2 reads):
       ```ts
       export interface SiteMeta {
         name: string;
         tagline: string;
         domain: string;
         email?: string;
         socials: { github?: string; instagram?: string; youtube?: string };
       }

       export const site: SiteMeta = {
         name: 'Braeden Hodson',
         tagline: 'Business student and entrepreneur in LA, building things and running a small content brand',
         domain: 'braehods.com',
         socials: {},
       };
       ```

    6. **Write `data/currently.ts`** — locked shape per CONTEXT.md `<specifics>`:
       ```ts
       export interface CurrentlyStatement {
         statement: string;
         updatedAt: string;
         link?: string;
       }

       export const currently: CurrentlyStatement = {
         statement: 'Currently shipping CapitolLens',
         updatedAt: '2026-05-08',
       };
       ```

    7. **Write `data/channels.ts`** — placeholders, Phase 2 fills real handles:
       ```ts
       export interface Channel {
         platform: 'youtube' | 'instagram';
         handle: string;
         url: string;
       }

       export const channels: Channel[] = [];
       ```

    8. **Write `data/projects.ts`** — Zod schema + empty array per RESEARCH.md Pattern 7:
       ```ts
       import { z } from 'zod';

       export const ProjectStatus = z.enum(['shipped', 'paper-trading', 'in-dev', 'archived']);
       export const ProjectTag = z.enum(['trading', 'content', 'tools', 'archived']);

       export const Project = z.object({
         slug: z.string(),
         title: z.string(),
         description: z.string().max(140),
         tags: z.array(ProjectTag),
         status: ProjectStatus,
         href: z.string().url(),
       });
       export type Project = z.infer<typeof Project>;

       export const projects: Project[] = [];
       ```
  </action>
  <verify>
    <automated>npm run typecheck &amp;&amp; npm run build &amp;&amp; npm run lint</automated>
    All three must exit 0. The build verifies `@next/mdx` wires without crashing (FOUND-03 — RESEARCH.md confirms this is the meaningful smoke test, since `mdx-components.tsx` missing would crash any MDX import).
  </verify>
  <done>`@next/mdx` configured; `mdx-components.tsx` stub exists; `lib/utils.ts` exports `cn`; all 4 `data/*.ts` files type-check; `npm run build` succeeds.</done>
</task>

</tasks>

---

# Wave 2 — Design Token Layer + Fonts + Favicon

> Goal: Replace the bootstrap `globals.css` / `layout.tsx` / `page.tsx` with the editorial-dark surface. Wire all 3 fonts via `next/font`. Ship `app/icon.svg`. Turns `tests/build-output.spec.ts`, `tests/visual.spec.ts`, `tests/tokens.spec.ts`, `tests/lighthouse.spec.ts`, `tests/favicon.spec.ts` GREEN.

<tasks>

<task id="W2-T1" wave="2" type="auto">
  <name>Task W2-T1: Replace app/globals.css with @theme + gradient + grain + focus + reduced-motion + keyframe</name>
  <requirements>FOUND-02, DSGN-01, DSGN-02, DSGN-03, DSGN-06, DSGN-08, A11Y-02, A11Y-06</requirements>
  <files>app/globals.css</files>
  <action>
    Replace the bootstrap `app/globals.css` wholesale. Use the verbatim Pattern 1 from RESEARCH.md (lines ~300-370) — every value is locked by D-07/D-08/D-09 and CD-01/CD-02. No invention; no scope reduction.

    File contents (write exactly):

    ```css
    @import "tailwindcss";

    @theme {
      /* Colors — D-08, D-06 (muted locked at #a8a8a8) */
      --color-bg-start: #1a1a1f;
      --color-bg-end: #0a0a0a;
      --color-text: #e8e8e8;
      --color-muted: #a8a8a8;
      --color-accent: #7c87ff;
      --color-border: #2a2a2f;

      /* Font CSS variables — populated by next/font via app/fonts.ts */
      --font-serif: var(--font-fraunces), ui-serif, Georgia, serif;
      --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
      --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    /* Body gradient + base type — D-09 */
    body {
      background: linear-gradient(180deg, var(--color-bg-start), var(--color-bg-end));
      background-attachment: fixed;
      color: var(--color-text);
      font-family: var(--font-sans);
      font-feature-settings: "kern", "liga";
      text-rendering: optimizeLegibility;
      min-height: 100vh;
    }

    /* Grain overlay — D-09 + Pitfall 2 */
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: -1;
      opacity: 0.04;
      mix-blend-mode: overlay;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 200px;
      will-change: auto;
    }

    /* Focus ring — CD-02 / DSGN-06 / A11Y-02 */
    *:focus { outline: none; }
    *:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
      border-radius: inherit;
    }

    /* Reduced-motion override — CD-01 / DSGN-08 / A11Y-06 */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    /* Phase 2 hero will consume — defined now per CD-03 */
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-in-up {
      animation: fade-in-up 400ms cubic-bezier(0.2, 0, 0, 1) both;
      animation-delay: var(--stagger, 0ms);
    }

    /* Hairline divider helper used by Nav/Footer */
    .divider-bottom { border-bottom: 1px solid var(--color-border); }
    .divider-top { border-top: 1px solid var(--color-border); }
    ```

    **Why this exact form:** D-07 mandates `@theme` only (no parallel `:root`). D-09 mandates `mix-blend-mode: overlay` at opacity 0.04 — the W4 perf checkpoint will fall back to flat opacity if mobile Lighthouse drops <95. CD-01/02 are verbatim. The `@keyframes fade-in-up` ships now per CD-03 even though Phase 1 has no consumer, so Phase 2 is a one-import wire-up.

    **Anti-pattern guard:** Do NOT add a `tailwind.config.ts`. Tailwind v4 is CSS-first; `@theme` is the entire config. (PITFALLS Pitfall 15.)
  </action>
  <verify>
    <automated>npm run build &amp;&amp; npm run start &amp; sleep 5 &amp;&amp; npm test -- tests/visual.spec.ts tests/tokens.spec.ts tests/build-output.spec.ts</automated>
    All three specs MUST go GREEN against the running dev/preview server. (Note: in PowerShell the `&amp;` chain must be run as separate commands; the executor adapts the actual orchestration. Conceptually: build, start, run the three specs, kill the server.)
  </verify>
  <done>`app/globals.css` matches the locked surface; `tests/visual.spec.ts`, `tests/tokens.spec.ts`, `tests/build-output.spec.ts` GREEN.</done>
</task>

<task id="W2-T2" wave="2" type="auto">
  <name>Task W2-T2: app/fonts.ts — Fraunces + Geist Sans + Geist Mono via next/font with axes verification</name>
  <requirements>DSGN-04</requirements>
  <files>app/fonts.ts</files>
  <action>
    Per RESEARCH.md Pattern 3 + Open Question #2 (Fraunces `axes` API correctness — verify SOFT and opsz actually apply under Turbopack):

    Write `app/fonts.ts`:
    ```ts
    import { Fraunces } from 'next/font/google';
    import { GeistSans } from 'geist/font/sans';
    import { GeistMono } from 'geist/font/mono';

    export const fraunces = Fraunces({
      subsets: ['latin'],
      display: 'swap',
      variable: '--font-fraunces',
      axes: ['SOFT', 'opsz'],
      weight: ['600', '700'],
      // adjustFontFallback defaults to true for Google fonts in Next 16+ (CLS-killer)
    });

    export { GeistSans, GeistMono };
    ```

    **Verification step the executor must run** (Open Question #2 from RESEARCH.md):
    After wiring fonts (W2-T3), open the running preview, inspect the `<html>` element's computed style in DevTools, and confirm `font-variation-settings` references both `SOFT` and `opsz`. If the SOFT axis is not applied, the executor must:
    1. Document the issue in the phase SUMMARY ("Fraunces SOFT axis did not load under Turbopack 16.2.6 via `axes: ['SOFT', 'opsz']` — fell back to weight-only and traced the monogram from a static Black instance externally").
    2. Remove `axes` from the Fraunces config and proceed with weight-only loading.
    3. Note that the monogram path tracing in W3-T1 must use a static Fraunces Black source instead of the runtime variable instance.

    Document this fallback path in a leading comment in `app/fonts.ts` so a future maintainer sees the contingency.

    **Do NOT load extra Fraunces weights "for later"** — PITFALLS performance trap. 600 + 700 are the only weights Phase 1 + Phase 2 hero need.
  </action>
  <verify>
    <automated>npm run typecheck &amp;&amp; npm run build</automated>
    Plus DevTools inspection per the in-task verification step (manual; documented in SUMMARY).
  </verify>
  <done>`app/fonts.ts` exports `fraunces`, `GeistSans`, `GeistMono`; build succeeds; SOFT axis verified in DevTools OR the documented fallback applied with a leading comment.</done>
</task>

<task id="W2-T3" wave="2" type="auto">
  <name>Task W2-T3: app/layout.tsx — root layout with font vars, Analytics, SpeedInsights</name>
  <requirements>DSGN-04, FOUND-07 (no 'use client' — RSC by default)</requirements>
  <files>app/layout.tsx</files>
  <action>
    Replace the bootstrap `app/layout.tsx` wholesale per RESEARCH.md Pattern 3 (and per UI-SPEC § Layout & Component Inventory). At this point `<Nav/>` and `<Footer/>` do not exist yet — W3 ships them. Use placeholder divs in this task; W3-T2/W3-T3 swap them in.

    File contents:
    ```tsx
    import { Analytics } from '@vercel/analytics/next';
    import { SpeedInsights } from '@vercel/speed-insights/next';
    import { fraunces, GeistSans, GeistMono } from './fonts';
    import './globals.css';

    export const metadata = {
      title: { default: 'Braeden Hodson', template: '%s · Braeden Hodson' },
      description: 'Personal site of Braeden Hodson.',
    };

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html
          lang="en"
          className={`${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}
        >
          <body>
            {/* Phase 1 W3 will replace this placeholder header with <Nav/> */}
            <header className="divider-bottom px-6 py-6 lg:px-12" data-test="nav-placeholder" />
            <main className="mx-auto max-w-3xl px-6 py-16 lg:px-12">{children}</main>
            {/* Phase 1 W3 will replace this placeholder footer with <Footer/> */}
            <footer className="divider-top px-6 py-8 lg:px-12" data-test="footer-placeholder" />
            <Analytics />
            <SpeedInsights />
          </body>
        </html>
      );
    }
    ```

    **Important:** This task ships `<Analytics/>` + `<SpeedInsights/>` per D-14 — they must be in the root layout from Phase 1, not deferred to Phase 6, so every preview emits real-user telemetry from day one.

    **Pitfall guard:** Do NOT mark this file `'use client'`. The `Analytics` and `SpeedInsights` components from `@vercel/analytics/next` and `@vercel/speed-insights/next` are designed to be embedded in server layouts.
  </action>
  <verify>
    <automated>npm run build &amp;&amp; npm run typecheck &amp;&amp; npm test -- tests/no-client-components.spec.ts</automated>
    `no-client-components.spec.ts` GREEN (still no `'use client'` anywhere).
  </verify>
  <done>`app/layout.tsx` is a server component; emits font CSS variables on `<html>`; renders Analytics + SpeedInsights; placeholder header/footer await W3.</done>
</task>

<task id="W2-T4" wave="2" type="auto">
  <name>Task W2-T4: app/page.tsx — placeholder Fraunces 'Braeden' hero word</name>
  <requirements>DSGN-04, FOUND-01 (smoke)</requirements>
  <files>app/page.tsx</files>
  <action>
    Replace the bootstrap `app/page.tsx` wholesale. Per UI-SPEC § Copywriting, the Phase 1 hero is the single Fraunces word "Braeden" at 96px (clamp 64→96 mobile→desktop). Phase 2 will delete this entirely and ship the real hero.

    File contents:
    ```tsx
    export default function HomePage() {
      return (
        <section className="min-h-[60vh] flex items-center justify-center" data-test="hero-section">
          <h1
            data-test="hero-display"
            className="font-serif font-bold leading-[1.05] text-[clamp(4rem,12vw,6rem)]"
          >
            Braeden
          </h1>
        </section>
      );
    }
    ```

    `data-test="hero-display"` lets `tests/lighthouse.spec.ts` query the hero element to verify Fraunces is in its computed font-family. Tailwind `font-serif` resolves to `var(--font-serif)` → Fraunces (from `@theme`).

    **Pitfall guard:** No animation on this hero (PITFALLS Pitfall 4 — keep LCP trivially fast). Phase 2 layers in the staggered fade.
  </action>
  <verify>
    <automated>npm run build &amp;&amp; npm run start &amp; sleep 5 &amp;&amp; npm test -- tests/lighthouse.spec.ts</automated>
    `lighthouse.spec.ts` MUST go GREEN — CLS = 0, Fraunces in hero font-family stack, Geist Sans in body, Geist Mono in `.font-mono` (note: `.font-mono` element does not exist on `/` yet; the spec's font-family check for mono runs against `/_tokens` once W3-T4 ships it. Acceptable to skip the mono assertion this wave and re-run after W3-T4).
  </verify>
  <done>`/` renders the Fraunces "Braeden" word; CLS = 0; Lighthouse spec GREEN (mono assertion deferred to W3-T4 if needed).</done>
</task>

<task id="W2-T5" wave="2" type="auto">
  <name>Task W2-T5: app/icon.svg — favicon with B monogram path (text-on-charcoal default)</name>
  <requirements>SEO-07, DSGN-05</requirements>
  <files>app/icon.svg</files>
  <action>
    Per CONTEXT.md D-04 / D-05 + RESEARCH.md Open Question #1 / Assumption A1, the favicon is a static SVG file at `app/icon.svg` that mirrors the MonogramMark path data with `shape-rendering="crispEdges"` and a slightly thicker stem variant for 16/32px legibility.

    **Default direction (per A1):** text-on-charcoal — light B (`#e8e8e8`) on charcoal background (`#0a0a0a`). RESEARCH.md flags this as an executor decision-with-default; the leading SVG comment must document the choice so it is reversible.

    **Path data:** This task uses a placeholder path that visually reads as a "B" — the *real* Fraunces-traced path comes in W3-T1 when the MonogramMark component is built. The favicon and the component must share the same path data (D-04 — single source). After W3-T1 finalizes the path, the executor returns to this task and replaces the placeholder path here. **Document this back-pointer with a code comment.**

    File contents (initial — placeholder path; W3-T1 will overwrite with the traced path):
    ```svg
    <!-- app/icon.svg
         Source: CONTEXT.md D-04, D-05; nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
         Direction: text-on-charcoal (light B on dark bg) per RESEARCH.md A1 default.
         If real-device 16px legibility is poor in Phase 2 testing, swap fill/background.
         The <path> below is a Phase 1 W2 placeholder. W3-T1 (MonogramMark) will trace
         the final path from Fraunces Black + SOFT axis full and update BOTH this file
         AND components/ui/MonogramMark.tsx (D-04: single source). -->
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64" shape-rendering="crispEdges">
      <rect width="64" height="64" fill="#0a0a0a"/>
      <!-- TODO(W3-T1): replace with traced Fraunces Black SOFT-axis-full B path -->
      <path
        d="M16 12 H36 C42 12 46 16 46 22 C46 26 44 29 41 30 C45 31 48 35 48 40 C48 47 43 52 36 52 H16 Z M22 18 V28 H35 C38 28 40 26 40 23 C40 20 38 18 35 18 Z M22 34 V46 H36 C40 46 42 43 42 40 C42 37 40 34 36 34 Z"
        fill="#e8e8e8"
      />
    </svg>
    ```

    Next 16's `app/icon.svg` file convention auto-injects a `<link rel="icon">` tag with `sizes="any"`.
  </action>
  <verify>
    <automated>npm run build &amp;&amp; npm run start &amp; sleep 5 &amp;&amp; npm test -- tests/favicon.spec.ts</automated>
    `tests/favicon.spec.ts` GREEN — `/icon.svg` returns 200 with `<path>` and `viewBox`.
  </verify>
  <done>`app/icon.svg` exists with a placeholder B path + leading comment documenting (a) text-on-charcoal direction, (b) the W3-T1 back-pointer to update path data; `tests/favicon.spec.ts` GREEN.</done>
</task>

</tasks>

---

# Wave 3 — Components, Contracts, Token Showcase

> Goal: Ship `MonogramMark` (and finalize the Fraunces-traced path), `Nav`, `Footer`, `lib/motion.ts`, the `/_tokens` showcase, and verify all accessibility contracts. Turns `tests/monogram.spec.ts`, `tests/focus-ring.spec.ts`, `tests/motion-seam.spec.ts`, `tests/reduced-motion.spec.ts`, `tests/contrast.spec.ts`, `tests/no-client-components.spec.ts`, `tests/no-bare-outline-none.spec.ts` GREEN.

<tasks>

<task id="W3-T1" wave="3" type="auto">
  <name>Task W3-T1: components/ui/MonogramMark.tsx with Fraunces-traced path; sync app/icon.svg</name>
  <requirements>DSGN-05, FOUND-07</requirements>
  <files>components/ui/MonogramMark.tsx, app/icon.svg</files>
  <action>
    Per CONTEXT.md D-01..D-05 + RESEARCH.md Pattern 4. The component is a pure server SVG, fill=`currentColor`, `size` prop driving width/height.

    **Path-tracing process** (executor-side, before writing code):
    1. Open Fraunces variable font in a font tool (FontDrop, FontGoggles, or Glyphs/FontLab) at weight Black (700+), opsz at display, SOFT axis at full (typically 100).
    2. Type capital "B", export the glyph as an SVG `<path>` with viewBox normalized to `0 0 64 64`.
    3. If no font tool is available, fallback A: use FontForge's CLI to extract the path. Fallback B (per RESEARCH.md A3): if the SOFT axis did not apply at runtime in W2-T2, trace from a static Fraunces Black SVG via Google Fonts download.

    **Component contract** (per the locked API in `<interfaces>` block above):
    ```tsx
    // components/ui/MonogramMark.tsx — Server Component, NO 'use client'
    interface MonogramMarkProps {
      size?: number;
      className?: string;
      'aria-hidden'?: boolean;
    }

    export function MonogramMark({
      size = 24,
      className,
      'aria-hidden': ariaHidden = true,
    }: MonogramMarkProps) {
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="currentColor"
          className={className}
          aria-hidden={ariaHidden}
          role={ariaHidden ? 'presentation' : 'img'}
        >
          {/* Path traced from Fraunces Black, SOFT axis full, character "B".
              Phase 6 swap-pass will replace with the designed mark (D-01). */}
          <path d="<TRACED_PATH_DATA_HERE>" />
        </svg>
      );
    }
    ```

    **Sync to `app/icon.svg`:** Replace the W2-T5 placeholder path with the SAME `<TRACED_PATH_DATA_HERE>` exported from this step. The favicon retains its `shape-rendering="crispEdges"`, the charcoal `<rect>` background, and the light fill — only the `<path d="...">` data swaps.

    **Pitfall guards:**
    - No `'use client'` (FOUND-07).
    - Use `currentColor` for fill so the parent's `text-*` class drives color (CLAUDE.md "Monogram approach").
    - `role="presentation"` when `aria-hidden` (decorative everywhere in Phase 1).
    - Do NOT export a separate hand-simplified favicon path (D-04 — single path data, favicon adds rendering hints only).
  </action>
  <verify>
    <automated>npm run typecheck &amp;&amp; npm run build &amp;&amp; npm test -- tests/no-client-components.spec.ts</automated>
    Manual visual: open `/_tokens` (after W3-T4) and confirm the monogram is recognizable as a "B" at 16/24/48/96/120px.
  </verify>
  <done>`components/ui/MonogramMark.tsx` exports `MonogramMark` with the locked API; `app/icon.svg` shares identical path data (single source); no `'use client'`; visually reads as "B" at all 5 sizes.</done>
</task>

<task id="W3-T2" wave="3" type="auto">
  <name>Task W3-T2: components/layout/Nav.tsx — Server header with monogram + name + 3 placeholder links</name>
  <requirements>DSGN-05, DSGN-06, FOUND-07, A11Y-02</requirements>
  <files>components/layout/Nav.tsx, app/layout.tsx</files>
  <action>
    Per RESEARCH.md Pattern 2 (RSC by Default) + UI-SPEC § Layout & Component Inventory + Copywriting:

    **Write `components/layout/Nav.tsx`:**
    ```tsx
    import Link from 'next/link';
    import { MonogramMark } from '@/components/ui/MonogramMark';

    export function Nav() {
      return (
        <header className="divider-bottom px-6 py-6 lg:px-12">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <MonogramMark size={24} aria-hidden />
              <span className="font-sans text-base">Braeden Hodson</span>
            </Link>
            <nav aria-label="Primary" className="flex flex-wrap gap-4">
              {/* Phase 1 stubs — all route to /; Phases 3/4/5 swap in real targets */}
              <Link href="/" className="font-sans text-base hover:underline underline-offset-4 decoration-1 px-2 py-2">
                About
              </Link>
              <Link href="/" className="font-sans text-base hover:underline underline-offset-4 decoration-1 px-2 py-2">
                Work
              </Link>
              <Link href="/" className="font-sans text-base hover:underline underline-offset-4 decoration-1 px-2 py-2">
                Contact
              </Link>
            </nav>
          </div>
        </header>
      );
    }
    ```

    **Update `app/layout.tsx`:** Replace the placeholder header (`<header data-test="nav-placeholder" />`) with `<Nav />`. Import: `import { Nav } from '@/components/layout/Nav';`.

    **Pitfall guards:**
    - No `'use client'` (FOUND-07). Native `<a>` / `next/link` is keyboard-activatable by default.
    - Click target ≥ 44×44 (UI-SPEC Interaction Contract): `px-2 py-2` + 16px line-height + 16px text = ~48px touch area.
    - `aria-label="Primary"` on the inner `<nav>` so screen readers can land on it (A11Y).
    - Hover affordance is underline only — hover-lift is reserved for Phase 2+.
  </action>
  <verify>
    <automated>npm run build &amp;&amp; npm run start &amp; sleep 5 &amp;&amp; npm test -- tests/monogram.spec.ts tests/focus-ring.spec.ts tests/no-client-components.spec.ts</automated>
    `monogram.spec.ts` (nav-side assertion) and `focus-ring.spec.ts` GREEN.
  </verify>
  <done>`<Nav/>` renders monogram (24px) + name + 3 links; tab-navigation shows electric-blue focus ring on each link.</done>
</task>

<task id="W3-T3" wave="3" type="auto">
  <name>Task W3-T3: components/layout/Footer.tsx — Server footer with muted monogram + © + braehods.com text</name>
  <requirements>DSGN-05, FOUND-07</requirements>
  <files>components/layout/Footer.tsx, app/layout.tsx</files>
  <action>
    Per UI-SPEC § Layout & Component Inventory + Copywriting:

    **Write `components/layout/Footer.tsx`:**
    ```tsx
    import { MonogramMark } from '@/components/ui/MonogramMark';

    export function Footer() {
      return (
        <footer className="divider-top px-6 py-8 lg:px-12">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3" style={{ color: 'var(--color-muted)' }}>
              <MonogramMark size={16} aria-hidden />
              <span className="font-sans text-sm">© 2026 Braeden Hodson</span>
            </div>
            <span className="font-sans text-sm" style={{ color: 'var(--color-muted)' }}>
              braehods.com
            </span>
          </div>
        </footer>
      );
    }
    ```

    **Update `app/layout.tsx`:** Replace the placeholder footer (`<footer data-test="footer-placeholder" />`) with `<Footer />`. Import: `import { Footer } from '@/components/layout/Footer';`.

    **Pitfall guards:**
    - The monogram and text both inherit `color: var(--color-muted)` so the SVG's `currentColor` resolves to muted gray (PITFALLS Pitfall 1 — muted clears AA against `#0a0a0a` at 7:1).
    - `braehods.com` is plain text, NOT a link in Phase 1 (UI-SPEC Copywriting note — real source link arrives in Phase 6).
    - Year hardcoded for Phase 1 (UI-SPEC: "Phase 6 polish pass evaluates whether to make it dynamic").
    - No `'use client'`.
  </action>
  <verify>
    <automated>npm run build &amp;&amp; npm run start &amp; sleep 5 &amp;&amp; npm test -- tests/monogram.spec.ts</automated>
    `monogram.spec.ts` (footer assertion: 16px SVG in `<footer>`) GREEN.
  </verify>
  <done>`<Footer/>` renders 16px muted monogram + © 2026 line + 'braehods.com' text; muted color reads AA against gradient.</done>
</task>

<task id="W3-T4" wave="3" type="auto">
  <name>Task W3-T4: app/_tokens/page.tsx — hidden showcase route (noindex)</name>
  <requirements>DSGN-03, DSGN-05, DSGN-09</requirements>
  <files>app/_tokens/page.tsx</files>
  <action>
    Per CONTEXT.md D-11 + RESEARCH.md Pattern showcase code example + Open Question #4 (noindex on `/_tokens`):

    **Write `app/_tokens/page.tsx`:**
    ```tsx
    import { MonogramMark } from '@/components/ui/MonogramMark';

    // Hidden but deployed — D-11. Phase 2 deletes this route.
    export const metadata = {
      title: 'Tokens',
      robots: { index: false, follow: false },  // RESEARCH.md Open Q #4 — cheap insurance
    };

    const tokens = [
      { name: '--color-bg-start', value: '#1a1a1f' },
      { name: '--color-bg-end',   value: '#0a0a0a' },
      { name: '--color-text',     value: '#e8e8e8' },
      { name: '--color-muted',    value: '#a8a8a8' },
      { name: '--color-accent',   value: '#7c87ff' },
      { name: '--color-border',   value: '#2a2a2f' },
    ] as const;

    export default function TokensPage() {
      return (
        <div className="space-y-12">
          <section>
            <h2 className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>Colors</h2>
            <div className="mt-6 space-y-2">
              {tokens.map((t) => (
                <div key={t.name} className="flex items-center gap-4">
                  <span
                    className="block h-8 w-8 rounded"
                    style={{ background: t.value, border: '1px solid var(--color-border)' }}
                  />
                  <span className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>{t.name}</span>
                  <span className="font-mono text-sm">{t.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>Typography</h2>
            <p className="mt-6 font-serif font-bold leading-[1.05] text-[6rem]">Display XL · 96</p>
            <p className="font-serif font-bold leading-[1.10] text-[4rem]">Display L · 64</p>
            <p className="font-serif font-semibold leading-[1.15] text-[2.5rem]">Display M · 40</p>
            <p className="mt-6 font-sans text-base">Body 16 / Geist Sans · The quick brown fox jumps over the lazy dog.</p>
            <p className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>Mono 14 / Geist Mono · 0123456789</p>
          </section>

          <section>
            <h2 className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>Monogram</h2>
            <div className="mt-6 flex items-end gap-6 flex-wrap">
              {[16, 24, 48, 96, 120].map((s) => (
                <MonogramMark key={s} size={s} aria-hidden />
              ))}
            </div>
            <div className="mt-6" style={{ color: 'var(--color-accent)' }}>
              <MonogramMark size={48} aria-hidden />
              <p className="font-mono text-sm mt-2" style={{ color: 'var(--color-muted)' }}>currentColor inherits — accent variant</p>
            </div>
          </section>
        </div>
      );
    }
    ```

    **Why noindex matters even pre-launch:** Vercel preview URLs are publicly reachable. SEO-09 (Phase 6) noindexes ALL preview routes; this metadata is per-route insurance until then. `robots: { index: false, follow: false }` emits `<meta name="robots" content="noindex, nofollow">` (Next 16 metadata API).

    **Anti-pattern guard:** Phase 1 contains Fraunces below 40px nowhere except the smallest displayed sample is "Display M · 40" at 40px exactly — at the threshold (PITFALLS Pitfall 3). Do NOT add a 24px or 16px Fraunces sample.
  </action>
  <verify>
    <automated>npm run build &amp;&amp; npm run start &amp; sleep 5 &amp;&amp; npm test -- tests/monogram.spec.ts tests/contrast.spec.ts tests/tokens.spec.ts</automated>
    `monogram.spec.ts` (the `/_tokens` 5-sizes assertion) GREEN; `contrast.spec.ts` (axe AA on `/_tokens`) GREEN; `tokens.spec.ts` re-runs GREEN.
  </verify>
  <done>`/_tokens` route renders 3 sections (Colors / Typography / Monogram); 6 tokens displayed; 5 monogram sizes + accent variant; meta robots noindex; axe color-contrast violations = 0.</done>
</task>

<task id="W3-T5" wave="3" type="auto">
  <name>Task W3-T5: lib/motion.ts — isolation seam (CD-03)</name>
  <requirements>DSGN-07</requirements>
  <files>lib/motion.ts</files>
  <action>
    Per CONTEXT.md CD-03 + RESEARCH.md Pattern 8 + UI-SPEC § Motion + Focus Contract — verbatim:

    ```ts
    // lib/motion.ts
    // Isolation seam for animation. CSS-only for v1; if motion@12.x is ever added,
    // this is the one file that changes. Source: CONTEXT.md CD-03; ARCHITECTURE.md.

    export const respectsReducedMotion = true;

    /** Class name applying @keyframes fade-in-up (defined in app/globals.css). */
    export const fadeInUp = 'fade-in-up' as const;

    /** Inline-style helper for staggered animation delays.
     *  Usage: <div style={stagger(2)} className={fadeInUp}>...
     *  Phase 2 hero will consume both. */
    export function stagger(i: number): React.CSSProperties {
      return { '--stagger': `${i * 80}ms` } as React.CSSProperties;
    }
    ```

    **Pitfall guards:**
    - Do NOT install `motion@12.x` (CLAUDE.md "What NOT to Use" — locked).
    - Phase 1 has zero consumers of these exports — that is intentional (CD-03: "ships in Phase 1 as the isolation seam ARCHITECTURE.md calls for, even though Phase 1 has no motion of its own").
  </action>
  <verify>
    <automated>npm run typecheck &amp;&amp; npm test -- tests/motion-seam.spec.ts tests/reduced-motion.spec.ts</automated>
    `motion-seam.spec.ts` (asserts the 3 exports + the keyframe rule in globals.css) GREEN.
    `reduced-motion.spec.ts` (assertion that `prefers-reduced-motion: reduce` zeroes a transition to `0.01ms`) GREEN — the global override from W2-T1 covers this.
  </verify>
  <done>`lib/motion.ts` exports `respectsReducedMotion`, `fadeInUp`, `stagger`; `tests/motion-seam.spec.ts` and `tests/reduced-motion.spec.ts` GREEN.</done>
</task>

<task id="W3-T6" wave="3" type="auto">
  <name>Task W3-T6: Sweep enforcement — no 'use client', no bare outline:none, full local suite</name>
  <requirements>FOUND-07, A11Y-02</requirements>
  <files>(verification-only — no new files)</files>
  <action>
    Run the full Phase 1 verification sweep locally (W4 will repeat against the deployed Vercel preview). Three-step process:

    1. **Source-tree grep audit** (per critical-rules grep gate hygiene — strip comments before counting):
       ```bash
       # FOUND-07 — no 'use client' anywhere
       grep -rn -E "^[^/]*['\"]use client['\"]" app/ components/ lib/ || echo "OK: zero use-client"

       # A11Y-02 — no bare 'outline: none' without a :focus-visible peer
       grep -n "outline:\s*none" app/globals.css | grep -v ":focus-visible"
       # Output should be empty (the only `outline: none` block is `*:focus { outline: none; }` paired with `*:focus-visible { outline: 2px solid... }`)
       ```

    2. **Run the full Playwright suite locally**:
       ```bash
       npm run build &amp;&amp; npm run start &amp;
       sleep 5
       npx playwright test
       ```
       All 13 specs MUST be GREEN. Document any flake.

    3. **Lint + typecheck + format gate**:
       ```bash
       npm run lint &amp;&amp; npm run typecheck &amp;&amp; npm run format
       ```
       All exit 0.

    If any spec is RED, isolate the failure, fix in the appropriate Wave file, and re-run.

    **Pitfall watch:** RESEARCH.md A4 — `tests/lighthouse.spec.ts` may report Performance < 95 locally on a slow machine; the meaningful Performance number is from the Vercel preview run in W4 (because Speed Insights and the Vercel CDN are part of the deploy target). CLS = 0 must clear locally regardless.
  </action>
  <verify>
    <automated>npm run lint &amp;&amp; npm run typecheck &amp;&amp; npm run format &amp;&amp; npm run build &amp;&amp; npx playwright test</automated>
    All 13 specs GREEN locally. Three guard scripts (lint / typecheck / format) exit 0.
  </verify>
  <done>Zero `'use client'` in scope; zero bare `outline: none`; all 13 Playwright specs GREEN against `localhost:3000`; lint/typecheck/format clean.</done>
</task>

</tasks>

---

# Wave 4 — Vercel Deploy + Observability + Sign-Off

> Goal: Ship to a real Vercel preview URL, verify all Phase Exit checks against the deployed surface (not just localhost), checkpoint the mix-blend-mode mobile-perf question (RESEARCH.md A4 / Open Q #3), and obtain manual FOUND-05 sign-off.
>
> This wave has `autonomous: false` — three checkpoints are unavoidable: (1) Vercel project creation requires the user's account, (2) the mix-blend-mode mobile perf check is a manual Lighthouse + DevTools observation that a Playwright spec cannot make a binary judgment on, (3) FOUND-05 sign-off requires the user to confirm preview URL deploy time was ≤ 2 minutes via the Vercel dashboard.

<tasks>

<task id="W4-T1" wave="4" type="checkpoint:human-action" gate="blocking">
  <what-built>All Phase 1 source code and tests are complete locally. Now the repo needs to push to GitHub, get linked to a Vercel project, and produce a real preview URL.</what-built>
  <how-to-verify>
    1. **Push the repo to GitHub** (if not already pushed). The remote should be a private or public repo — either is fine for Phase 1.
       - If no remote yet: create one on GitHub named `braeden-site`, then `git remote add origin <url>` and `git push -u origin main`.

    2. **Create a Vercel project** (D-12):
       - Open Vercel dashboard → "Add New..." → "Project" → import the GitHub repo.
       - Project name: `braeden-site`.
       - Framework preset: Next.js (auto-detected).
       - Root directory: `./` (default).
       - Build command: `next build` (default).
       - Production branch: `main`.
       - Click Deploy. **First deploy can take longer than 2 min while Vercel sets up — that is OK.** FOUND-05 measures subsequent pushes, not the very first cold deploy.

    3. **Add environment variable** (D-13):
       - Vercel → Project → Settings → Environment Variables.
       - `NEXT_PUBLIC_FORMSPREE_ID` = `xqeypnkw`. Set for Production, Preview, Development (all 3 boxes checked).

    4. **Add custom domains** (D-12 — DNS still on GitHub Pages, that is expected):
       - Vercel → Project → Settings → Domains.
       - Add `braehods.com`. Vercel will show "Invalid Configuration" — IGNORE that, SSL begins staging anyway.
       - Add `www.braehods.com`. Same expected error.
       - Phase 6 will flip the DNS CNAME and the cert will already be staged (Pitfall 17 mitigation).

    5. **Confirm preview-on-PR is enabled** (default — verify):
       - Vercel → Project → Settings → Git → Preview Deployments → "All branches and pull requests" should be checked.

    6. **Push a test branch** to confirm preview deploys work:
       ```bash
       git checkout -b test/phase-1-preview
       git commit --allow-empty -m "chore(01): trigger preview deploy"
       git push -u origin test/phase-1-preview
       ```
       Open Vercel dashboard, watch the deploy. **Note the build duration** — this is the FOUND-05 evidence point. Capture the preview URL (something like `https://braeden-site-git-test-phase-1-preview-<account>.vercel.app`).

    7. **Resume signal:** type the preview URL once the deploy succeeds AND build duration ≤ 2 min. If duration > 2 min on a non-cold deploy, note the duration; the FOUND-05 sign-off in W4-T4 will gate on it.
  </how-to-verify>
  <resume-signal>Paste the preview URL + the build duration in seconds.</resume-signal>
  <files>(Vercel dashboard config — no repo files modified)</files>
  <verify>
    <automated>curl -sI "$PREVIEW_URL" | head -1</automated>
    Should return `HTTP/2 200`. Plus: Vercel dashboard shows `braehods.com` and `www.braehods.com` in the Domains list with "Invalid Configuration" warnings (expected) and SSL status "Issuing" or similar.
  </verify>
  <done>Vercel project `braeden-site` exists; `NEXT_PUBLIC_FORMSPREE_ID` set across all 3 environments; both domains added; preview URL renders 200 with the gradient + monogram + Fraunces hero word; user provided URL + duration.</done>
</task>

<task id="W4-T2" wave="4" type="auto">
  <name>Task W4-T2: Run full Playwright suite against the deployed preview URL</name>
  <requirements>FOUND-01, FOUND-02, FOUND-04, FOUND-07, DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, DSGN-06, DSGN-07, DSGN-08, DSGN-09, A11Y-02, A11Y-06, SEO-07</requirements>
  <files>(verification-only)</files>
  <action>
    With the preview URL from W4-T1 in hand, run the full Playwright suite against the live deploy (not localhost). This is the meaningful gate — Speed Insights data, real-CDN font delivery, and the actual `mix-blend-mode` rendering all only manifest on the deployed surface.

    1. **Set the base URL env var:**
       ```bash
       export PLAYWRIGHT_BASE_URL="<preview-url-from-w4-t1>"
       # PowerShell: $env:PLAYWRIGHT_BASE_URL = "<preview-url>"
       ```

    2. **Run the full suite:**
       ```bash
       npx playwright test
       ```

    3. **Expected outcome:** all 13 specs GREEN against the preview URL.
       - If `tests/lighthouse.spec.ts` reports CLS != 0 against the preview, dig into `next/font` `adjustFontFallback` — RESEARCH.md A3 + Pitfall 27. Fix in W2-T2 and redeploy.
       - If `tests/contrast.spec.ts` reports any color-contrast violation against the preview, the grain layer may be reducing legibility more than the locally-tested baseline (PITFALLS Pitfall 2 note). Document and consider the W4-T3 mitigation (drop mix-blend-mode).

    4. **Save the test report** to `playwright-report/` (Playwright default). Reference the report URL in the phase SUMMARY.
  </action>
  <verify>
    <automated>PLAYWRIGHT_BASE_URL="$PREVIEW_URL" npx playwright test</automated>
    All 13 specs GREEN against the preview URL.
  </verify>
  <done>Full Playwright suite green against the Vercel preview URL; report archived under `playwright-report/`.</done>
</task>

<task id="W4-T3" wave="4" type="checkpoint:human-verify" gate="blocking">
  <what-built>The deploy works and the automated suite is green. But two manual verifications remain that no automated test can definitively decide:
    (a) Mix-blend-mode mobile-performance — RESEARCH.md A4 / Open Q #3 — does `mix-blend-mode: overlay` cause GPU recomposite spikes on real mobile?
    (b) Phase 1 visual sign-off across the UI-SPEC § Phase Exit Visual Verification checklist (12 items).
  </what-built>
  <how-to-verify>
    Two parts:

    **PART A — Mobile mix-blend-mode performance check (RESEARCH.md Open Q #3):**

    1. Open Chrome DevTools on the preview URL.
    2. Toggle device emulation → select "Pixel 5" or "iPhone 13 Pro" → CPU throttling: "4x slowdown".
    3. Open the Performance tab → click Record → scroll the page rapidly up and down for ~10 seconds → Stop.
    4. Inspect frames. **Acceptance:** no frame drops below 30fps sustained; no "Frame" entries marked with red bars longer than 16ms back-to-back.
    5. Run Lighthouse mobile (the in-DevTools Lighthouse panel) on the preview URL. **Acceptance:** Performance ≥ 95.
    6. **If frame drops OR Performance < 95 with `mix-blend-mode` flagged as a culprit:**
       - Edit `app/globals.css`, remove the `mix-blend-mode: overlay;` line from `body::after`.
       - Commit: `fix(01): drop mix-blend-mode per W4 mobile perf check`.
       - Push, wait for redeploy, repeat steps 1-5.
       - Document the resolution in the phase SUMMARY ("mix-blend-mode dropped at W4-T3 because Lighthouse mobile Performance regressed to <95 / frame drops on Pixel 5 emulation; flat opacity 0.04 retained, gradient banding acceptable").

    **PART B — Phase Exit Visual Verification checklist (UI-SPEC):**

    Walk the deployed preview URL and check off each item. (Re-tab through the page on a real keyboard, not just emulated — focus rings can render differently.)

    - [ ] Gradient renders without banding on a 1080p mid-tier mobile (open preview on phone).
    - [ ] Three fonts load with zero CLS — Lighthouse mobile CLS = 0 on `/`.
    - [ ] Body and muted text both clear AA at the top, middle, and bottom of the gradient (WebAIM Contrast Checker — sample 3 points).
    - [ ] Tabbing through `/` shows visible electric-blue focus ring on every nav link, footer link, and `/_tokens` interactive element.
    - [ ] DevTools "Emulate prefers-reduced-motion: reduce" stops all animation (Phase 1 has nothing animated, but verify the rule is present in computed style).
    - [ ] Monogram renders correctly at 16, 24, 48, 96, 120px on `/_tokens`. Favicon renders crisply at 16/32 in the browser tab.
    - [ ] No mix-blend-mode-induced repaint on scroll (PART A above).
    - [ ] `@vercel/analytics` AND `@vercel/speed-insights` are reporting — open Vercel dashboard → Analytics tab AND Speed Insights tab; confirm at least one event from this preview URL.
    - [ ] `braehods.com` and `www.braehods.com` are listed in Vercel project Domains.
    - [ ] `NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw` set in Vercel env across all 3 environments.
    - [ ] 320px viewport renders cleanly — open DevTools, set width to 320px, no horizontal overflow, hero word readable, nav and footer fit.
    - [ ] Fraunces "Braeden" hero reads at desktop and 320px without serif strokes disappearing on Windows ClearType (test on Windows Chrome OR via BrowserStack).

    **Resume signal:** type "phase-exit-checklist-pass" with any notes on the mix-blend-mode resolution, OR list the items that failed and what was changed.
  </how-to-verify>
  <resume-signal>Type "phase-exit-checklist-pass" plus notes, or describe failures + fixes.</resume-signal>
  <files>(possibly: app/globals.css if mix-blend-mode is dropped)</files>
  <verify>
    <automated>echo "Manual verification — see how-to-verify"</automated>
    No automated check; this is the user verification gate.
  </verify>
  <done>All 12 Phase Exit checklist items pass against the preview URL; mix-blend-mode either retained (perf OK) or removed (with documented rationale); user typed "phase-exit-checklist-pass".</done>
</task>

<task id="W4-T4" wave="4" type="checkpoint:human-verify" gate="blocking">
  <what-built>The single Phase 1 success criterion that no automation can fully verify (FOUND-05 — "preview URL deploys within ~2 minutes of push") needs the user to confirm against the Vercel dashboard build-duration history.</what-built>
  <how-to-verify>
    1. Open Vercel dashboard → braeden-site → Deployments tab.
    2. Look at the last 3-5 preview deploys (excluding the very first cold deploy from W4-T1 step 2).
    3. **Acceptance:** Build durations should consistently be ≤ 2 minutes. Vercel typical for a Phase 1-sized Next 16 bundle is 30-60 seconds; ≤ 120s is the FOUND-05 threshold.
    4. If any deploy in that window exceeded 2 min and the cause is not "Vercel free-tier queue" (which is variable): investigate. Likely culprits — bundle size regression, font network blocking. Document and decide whether to defer or fix.
    5. Push one more empty commit on a fresh branch to time a clean deploy:
       ```bash
       git checkout -b test/phase-1-found-05-final
       git commit --allow-empty -m "chore(01): final FOUND-05 timing check"
       git push -u origin test/phase-1-found-05-final
       ```
       Watch the dashboard. Note the duration.

    6. **Resume signal:**
       - "found-05-pass <duration-in-seconds>" if the latest deploy ≤ 120s.
       - "found-05-fail <duration> <suspected-cause>" otherwise.
  </how-to-verify>
  <resume-signal>Type "found-05-pass" with the duration, or "found-05-fail" with cause.</resume-signal>
  <files>(no source changes — sign-off only)</files>
  <verify>
    <automated>echo "Manual sign-off; recorded in phase SUMMARY"</automated>
  </verify>
  <done>User has confirmed preview deploys consistently complete in ≤ 2 minutes; duration recorded in phase SUMMARY.</done>
</task>

<task id="W4-T5" wave="4" type="auto">
  <name>Task W4-T5: Final commit, merge to main, write phase SUMMARY</name>
  <requirements>FOUND-01..08, DSGN-01..09, A11Y-02, A11Y-06, SEO-07 (all phase requirements — completion sign-off)</requirements>
  <files>.planning/phases/01-foundation-design-tokens/01-01-SUMMARY.md</files>
  <action>
    1. **Merge the test branch** used for W4-T4 into main (or open a PR from the test branch — user preference). Confirm the merge commit also produces a clean preview URL on main.

    2. **Write `.planning/phases/01-foundation-design-tokens/01-01-SUMMARY.md`** per the template at `$HOME/.claude/get-shit-done/templates/summary.md`. Include:

       - **Goal achieved:** Yes / partial / no (expected: Yes).
       - **Requirements coverage:** All 20 requirements GREEN with reference to the test file that proved each.
       - **Files created** (final list — pull from `files_modified` frontmatter, drop any that were not actually shipped).
       - **Decisions honored:** D-01..D-14 + CD-01..CD-03, with notes on any drift (e.g., "mix-blend-mode dropped at W4-T3 due to mobile perf — flat opacity retained" if applicable).
       - **Open Questions resolved:**
         - OQ #1 (favicon direction) — chose text-on-charcoal default, documented in `app/icon.svg` leading comment.
         - OQ #2 (Fraunces SOFT axis) — verified working / fell back to weight-only (whichever applies).
         - OQ #3 (mix-blend-mode mobile perf) — retained / dropped (whichever applies).
         - OQ #4 (`/_tokens` noindex) — `metadata.robots = { index: false, follow: false }` shipped on the route.
         - OQ #5 (`mdx-components.tsx` location) — shipped at repo root in W1-T4.
       - **Patterns established (for downstream phases):**
         - Tailwind v4 `@theme` is the design-token surface; no parallel `:root` block. Phase 2-6 add tokens here, not anywhere else.
         - Server components by default; `'use client'` lands first in Phase 5 (`ContactModal`).
         - `lib/motion.ts` is the motion isolation seam — Phase 2 hero imports `fadeInUp` + `stagger()` and the keyframe is already in `globals.css`.
         - All tests live in `tests/` and run via `npm test` (mobile chromium subset) or `npm run test:full` (full suite); `PLAYWRIGHT_BASE_URL` env var lets CI point at the Vercel preview.
       - **Carried-forward TODOs:**
         - Phase 6 swap-pass: real B monogram path data + apple-touch-icon + web manifest.
         - Phase 6 polish: dynamic copyright year (currently hardcoded `© 2026`).
         - Phase 6 SEO sweep: `X-Robots-Tag: noindex` on all preview routes (currently only `/_tokens` has per-route `metadata.robots`).
       - **Vercel artifacts:** preview URL + production URL (`braeden-site-<account>.vercel.app`); `braehods.com` SSL status (staging started, awaiting Phase 6 DNS flip).
       - **FOUND-05 timing evidence:** the duration recorded in W4-T4.

    3. **Commit the SUMMARY** on main with message:
       ```
       docs(01): phase 1 SUMMARY — foundation + design tokens shipped
       ```
  </action>
  <verify>
    <automated>test -f .planning/phases/01-foundation-design-tokens/01-01-SUMMARY.md &amp;&amp; node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" verify summary .planning/phases/01-foundation-design-tokens/01-01-SUMMARY.md 2>/dev/null || echo "summary file present"</automated>
    File exists and is committed; if `gsd-tools.cjs` summary verifier is available, it returns valid.
  </verify>
  <done>SUMMARY.md committed on main; merge to main triggers a successful production deploy; phase officially closed.</done>
</task>

</tasks>

---

<threat_model>

## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Browser ↔ Vercel CDN (HTTPS) | Static asset delivery, font self-hosting, analytics beacon |
| GitHub repo ↔ Vercel build | Source code → CI build pipeline; lockfile + env-var injection points |
| Public preview URL ↔ Search engines | `/_tokens` route is hidden but reachable; preview URLs are not yet noindexed wholesale (SEO-09 = Phase 6) |
| `data/projects.ts` ↔ Build (Zod runtime check) | Typed data layer where future contributor edits could ship malformed data |

## STRIDE Threat Register (Phase 1 — static personal site, ASVS L1)

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-01 | Information Disclosure | Vercel preview URLs | mitigate | `/_tokens` route ships `metadata.robots = { index: false, follow: false }` in W3-T4. Phase 6 (SEO-09) adds `X-Robots-Tag: noindex` to all preview deploys for full coverage. |
| T-01-02 | Tampering | npm dependency supply chain | mitigate | Pin exact versions in `package.json` (no `^` on production deps — W1-T2 step 5). Commit `package-lock.json`. Run `npm audit` before each merge. RESEARCH.md security V10. |
| T-01-03 | Information Disclosure | Secrets in git | mitigate | `.env*` in `.gitignore` (W1-T3). Only `NEXT_PUBLIC_*` env vars (Formspree ID is intentionally public-safe). `.env.local.example` committed as the reference. |
| T-01-04 | Tampering | MDX content injection | accept | `@next/mdx` renders MDX server-side via React — no client-side `eval`. Phase 1 has zero MDX content; Phase 4 onward author-controls all `content/` files. Risk re-evaluated when external MDX (e.g., user-submitted) ever lands — not in v1 scope. |
| T-01-05 | Tampering | External link click-jacking (Phase 2+ external links) | accept | Phase 1 has no external links — nav stubs all route to `/`. Phase 2's first external links (channel buttons) MUST use `target="_blank" rel="noopener noreferrer"` per RESEARCH.md security domain. Carried forward to Phase 2 plan. |
| T-01-06 | Spoofing | Vercel SSL cert timing race at Phase 6 DNS flip | mitigate | Phase 1 W4-T1 adds `braehods.com` and `www.braehods.com` to the Vercel project BEFORE the CNAME flip. Cert pre-stages while DNS still points at GitHub Pages. PITFALLS Pitfall 17 mitigation. |
| T-01-07 | Information Disclosure | `@vercel/analytics` PII leakage | accept | `@vercel/analytics` is cookieless, IP-anonymized, no localStorage (RESEARCH.md security V8). No consent banner needed in EU. Acceptable risk for a public personal site. |
| T-01-08 | Denial of Service | Formspree submission abuse (deferred — Phase 5 owns) | accept | Phase 1 only sets the `NEXT_PUBLIC_FORMSPREE_ID` env var. Phase 5 ships honeypot + min-time-to-submit per CTCT-04. Phase 1 boundary unchanged. |
| T-01-09 | Elevation of Privilege | Server-side code injection via `next.config.ts` import | mitigate | `@next/mdx` is the only third-party plugin in `next.config.ts`; verified npm package from Vercel. Pinned `16.2.6`. Lockfile commits. |
| T-01-10 | Tampering | `package-lock.json` not committed | mitigate | `.gitignore` does NOT include `package-lock.json`; W1-T2 step 6 commits it after `npm install`. Required for reproducible builds + supply-chain audit. |

**Phase 1 security posture:** Low-risk by design. ASVS Level 1 trivially clearable for a static read-only site with no auth, no user input, no DB. Six concrete mitigations (T-01-01, T-01-02, T-01-03, T-01-06, T-01-09, T-01-10); four accepted risks documented.

</threat_model>

<verification>

## Phase-level verification gate (run all of these against the deployed Vercel preview URL before phase exit)

1. `npm run lint` exits 0
2. `npm run typecheck` exits 0
3. `npm run format` exits 0 (Prettier check — read-only)
4. `npm run build` exits 0 against current `main`
5. `PLAYWRIGHT_BASE_URL=<preview-url> npx playwright test` — all 13 specs GREEN
6. UI-SPEC § Phase Exit Visual Verification — all 12 items checked (W4-T3)
7. FOUND-05 sign-off — preview deploy duration ≤ 2 min on 3+ consecutive non-cold deploys (W4-T4)
8. SUMMARY.md committed (W4-T5)

## Per-requirement verification map (cross-reference 01-VALIDATION.md)

| Req ID | Verified by |
|--------|-------------|
| FOUND-01 | `npm run build` exits 0 (W1-T2, W4-T2) |
| FOUND-02 | `tests/build-output.spec.ts` GREEN (W2-T1) |
| FOUND-03 | `npm run build` succeeds with `mdx-components.tsx` present (W1-T4) |
| FOUND-04 | `tests/folder-structure.spec.ts` GREEN (W1-T3) |
| FOUND-05 | W4-T4 manual sign-off (Vercel deploy duration ≤ 2 min) |
| FOUND-06 | `npm run lint && npm run format` exit 0 (W1-T3, W3-T6) |
| FOUND-07 | `tests/no-client-components.spec.ts` GREEN (W3-T6) |
| FOUND-08 | `npm run typecheck` exits 0; data files compile (W1-T4) |
| DSGN-01 | `tests/visual.spec.ts` (gradient assertion) GREEN (W2-T1) |
| DSGN-02 | `tests/visual.spec.ts` (grain opacity 0.04) GREEN (W2-T1) |
| DSGN-03 | `tests/tokens.spec.ts` (all 6 tokens via getPropertyValue) GREEN (W2-T1) |
| DSGN-04 | `tests/lighthouse.spec.ts` (CLS = 0 + fonts in font-family) GREEN (W2-T2..T4, re-run W4-T2) |
| DSGN-05 | `tests/monogram.spec.ts` (nav 24, footer 16, _tokens 5 sizes) GREEN (W3-T1..T4) |
| DSGN-06 | `tests/focus-ring.spec.ts` (electric-blue 2px outline on Tab) GREEN (W3-T2, W3-T3) |
| DSGN-07 | `tests/motion-seam.spec.ts` (lib/motion.ts exports + keyframe) GREEN (W3-T5) |
| DSGN-08 | `tests/reduced-motion.spec.ts` (emulateMedia zeroes durations) GREEN (W2-T1, verified W3-T5) |
| DSGN-09 | `tests/contrast.spec.ts` (axe AA on /_tokens) GREEN (W3-T4) |
| A11Y-02 | `tests/no-bare-outline-none.spec.ts` + `tests/focus-ring.spec.ts` GREEN (W3-T6) |
| A11Y-06 | `tests/reduced-motion.spec.ts` GREEN (W2-T1) |
| SEO-07 | `tests/favicon.spec.ts` (/icon.svg returns SVG with path) GREEN (W2-T5, W3-T1) |

</verification>

<success_criteria>

Phase 1 is complete when ALL of these hold:

1. **Pushing a commit to any branch produces a Vercel preview URL within ~2 minutes** (FOUND-05, manually verified W4-T4).
2. **Visiting the preview shows the charcoal gradient + grain overlay + cool-white text in Fraunces / Geist Sans / Geist Mono with zero font-swap flash (CLS = 0)** — `tests/visual.spec.ts`, `tests/lighthouse.spec.ts` GREEN against the preview URL.
3. **The B monogram appears as the favicon, in the nav, and in the footer at the right sizes** — `tests/favicon.spec.ts` + `tests/monogram.spec.ts` GREEN against the preview URL.
4. **Tabbing through any link shows a visible electric-blue focus ring** — `tests/focus-ring.spec.ts` GREEN; users with `prefers-reduced-motion: reduce` see no animation — `tests/reduced-motion.spec.ts` GREEN.
5. **Body and accent text colors clear WCAG AA against both gradient endpoints** — `tests/contrast.spec.ts` (axe-core color-contrast) GREEN against `/_tokens`.
6. **All 20 Phase 1 requirements (FOUND-01..08, DSGN-01..09, A11Y-02, A11Y-06, SEO-07) have a green test or sign-off** per the per-requirement map above.
7. **`braehods.com` and `www.braehods.com` are added in Vercel project settings with SSL cert staging started** (D-12 / Pitfall 17 mitigation).
8. **`NEXT_PUBLIC_FORMSPREE_ID=xqeypnkw` set in Vercel env across Production + Preview + Development** (D-13).
9. **`@vercel/analytics` and `@vercel/speed-insights` are emitting events** to the Vercel dashboard (D-14).
10. **SUMMARY.md committed** to `.planning/phases/01-foundation-design-tokens/01-01-SUMMARY.md` documenting decisions honored, open-question resolutions, and patterns established for Phase 2-6.

</success_criteria>

<output>

After Wave 4 sign-off, the executor creates `.planning/phases/01-foundation-design-tokens/01-01-SUMMARY.md` per `$HOME/.claude/get-shit-done/templates/summary.md`. The SUMMARY MUST capture:

- Final answer to each of the 5 RESEARCH.md Open Questions.
- Whether `mix-blend-mode: overlay` was retained or dropped (with mobile-perf evidence).
- Final FOUND-05 build duration on a fresh push.
- Vercel preview URL + production URL.
- Decisions honored (D-01..D-14, CD-01..CD-03) — flag any drift with rationale.
- Carried-forward TODOs to Phase 2 (real hero, channel buttons, view transitions) and Phase 6 (real monogram, apple-touch-icon, web manifest, dynamic copyright year, sitewide noindex on previews).

</output>
