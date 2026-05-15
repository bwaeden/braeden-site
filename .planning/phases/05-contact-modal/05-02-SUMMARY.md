---
phase: 5
plan: 02
subsystem: contact-modal
tags: [phase-5, contact-modal, client-island, formspree, found-07-carve-out, atomic-coupling]
status: complete
completed: 2026-05-14
requires:
  - phase-5-01: "@formspree/react@3.0.0 pinned + modal-fade-in keyframe + 9 RED specs"
provides:
  - "components/contact/ContactModal.tsx — THE single 'use client' island per FOUND-07 carve-out"
  - "data/site.ts.email value wired for D-15 mailto target + D-15a forward-compat"
  - "tests/no-client-components.spec.ts atomically updated (allow-list ContactModal)"
affects:
  - "components/contact/ — new directory + sole occupant"
  - "data/site.ts — 3-line addition (email value + decision comment)"
  - "tests/no-client-components.spec.ts — JSDoc rewrite + ALLOWED_CLIENT_ISLANDS pattern (Path B from plan)"
tech-stack:
  added:
    - "@formspree/react useForm + ValidationError consumed (first import)"
  patterns:
    - "Hash-driven open via useEffect+hashchange listener (D-06; deep-link friendly; preserves Nav.tsx + CTAArrowLink.tsx as pure Server Components)"
    - "bypassedSuccess separate state for honeypot/min-time silent rejection (Pitfall 5; bot can't distinguish gate-blocked from real submit)"
    - "history.replaceState close cleanup (Pitfall 1; NOT location.hash='' which breaks same-hash reopen)"
    - "transition-[border-color,color,opacity] arbitrary-list (Pitfall 4; Phase 2+4 lesson; preserves focus-visible accent ring)"
    - "text-base (16px) on all inputs + textarea (Pitfall 7; defeats iOS Safari auto-zoom)"
    - "Native <dialog> showModal() + e.target===e.currentTarget backdrop-click handler (Pitfall 6; zero custom focus mgmt)"
    - "Inline #c8a86a literal scoped to char counter only (D-02 + Phase 4 D-09 carry-forward; NOT promoted to @theme)"
key-files:
  created:
    - "components/contact/ContactModal.tsx (387 lines)"
    - ".planning/phases/05-contact-modal/05-02-SUMMARY.md (this file)"
  modified:
    - "data/site.ts (3 lines added — email value + decision comment)"
    - "tests/no-client-components.spec.ts (JSDoc rewrite + ALLOWED_CLIENT_ISLANDS pattern; 105 lines total)"
decisions:
  - "Path B for tests/no-client-components.spec.ts atomic update (ALLOWED_CLIENT_ISLANDS allow-list mirroring tests/single-client-island.spec.ts) over Path A (toEqual single-element literal). Path B is more readable + extensible if a future justified 2nd client island ever lands."
  - "Mailto link rendered in BOTH form-shown branch AND success branch per tests/contact-modal-mailto-fallback.spec.ts:65 (stays visible after success render). The plan body's `{!showSuccess && (<>form + mailto</>)}` wrapping would have failed that assertion — implemented separate render in each branch."
  - "U+2019 curly apostrophe (’) rendered as literal Unicode in JSX text (NOT &apos; entity) — react/no-unescaped-entities rule defaults to `' \" > }` only, so U+2019 is safe. Same for U+2014 em-dash, U+2192 arrow, U+2026 ellipsis. This keeps the source byte-for-byte matching the CONTEXT.md lock + the regex assertions in the plan's verify block."
  - "Verification-scope correction vs. plan body line 32 (must_haves.truths bullet 17): plan claims 6/9 Plan 01 RED specs flip GREEN at end of Plan 02. ONLY 2 actually flip (the 2 filesystem-level FOUND-07 specs). The other 7 (states/honeypot/min-time/mailto/opens-from-nav/opens-from-about/esc-closes) all click 'Contact' link to open modal — they REMAIN RED until Plan 03 atomically mounts ContactModal in app/layout.tsx + swaps trigger hrefs. Plan 03 will flip 8 RED specs (all 7 above + contact-trigger-rewire) when its atomic D-05 swap lands. See Deviations section for details."
metrics:
  duration_minutes: 32
  tasks_completed: 1
  files_created: 1
  files_modified: 2
  commits: 1
requirements:
  staged_for_flip:
    - CTCT-01 (Plan 03 atomic mount + href swap flips)
    - CTCT-02 (Plan 03 flip — modal must be in DOM to test state rendering)
    - CTCT-03 (Plan 03 flip)
    - CTCT-04 (Plan 03 flip)
    - CTCT-05 (Plan 03 flip)
    - CTCT-06 (Plan 03 flip)
    - CTCT-07 (Plan 03 flip)
    - A11Y-03 (Plan 03 flip)
---

# Phase 5 Plan 02: ContactModal Client Island — Summary

**Built the FIRST and ONLY `'use client'` directive in the codebase per FOUND-07 carve-out. 387-line `<dialog>`-based ContactModal composing native focus-trap + `@formspree/react` `useForm` + hash-driven open + honeypot/min-time silent rejection (`bypassedSuccess` Pitfall 5 pattern) + char-counter + 4-state render with verbatim-locked copy + mailto fallback. Atomically updated `tests/no-client-components.spec.ts` in the same commit (allow-list ContactModal as the carve-out gate). 1 atomic commit per D-05 atomic-coupling rule.**

## Plan Goal vs. Outcome

Plan 05-02 lands THE single client island for the entire site. The component is feature-complete and ready for Plan 03's atomic mount + trigger rewire to make it visible to users. Every locked decision (D-01..D-19) from CONTEXT.md is honored byte-for-byte. Every blocking anti-pattern from `.continue-here.md` is avoided. The FOUND-07 carve-out invariant gate is now enforced from two angles (`single-client-island.spec.ts` count check + `no-client-components.spec.ts` allow-list check) — both GREEN.

| Outcome | Status |
|---------|--------|
| `components/contact/ContactModal.tsx` shipped — sole `'use client'` filesystem-wide | DONE — 387 lines (160% above 130-min spec) |
| 21 source-level locked checks (verbatim copy + anti-pattern guards + decision references) | DONE — all PASS via the plan's verify-block regex script |
| FOUND-07 carve-out invariant intact + enforced | DONE — directive scan finds exactly 1 file = `components/contact/ContactModal.tsx` |
| `data/site.ts.email` wired for D-15 mailto target + D-15a forward-compat | DONE — 3-line addition; spec regex `email:\s*['"]fakegoat1@gmail\.com['"]` PASS |
| `tests/no-client-components.spec.ts` atomically updated to allow ContactModal | DONE — Path B (ALLOWED_CLIENT_ISLANDS pattern); JSDoc rewritten to reflect Phase 5 carve-out |
| Single atomic commit | DONE — commit `859a6fd` carries all 3 files |
| `npm run typecheck` exits 0 (relative to Plan 02 work) | DONE — only the pre-existing HeroPhoto.tsx error remains (Plan 01 deferred-items.md) |
| `npm run lint` exits 0 | DONE — only the pre-existing ProjectCard.tsx `_staggerIndex` warning remains (Plan 01 deferred-items.md) |
| `npm run build` exits 0 (Turbopack compiles cleanly; client chunk in bundle output) | DONE — `✓ Compiled successfully in 2.6s`; static prerender for all 7 routes |
| 2 of 9 Plan 01 RED specs flip GREEN at end of Plan 02 | DONE — `single-client-island.spec.ts` + `no-client-components.spec.ts` (post atomic update) PASS |
| Phase 1+2+3+4 chrome canaries unchanged GREEN | DONE — 12/12 PASS (focus-ring, no-bare-outline-none, reduced-motion, about-renders, work-grid-renders, footer-socials-render, no-client-components, single-client-island) |
| 7 modal-behavior specs remain RED awaiting Plan 03 mount+rewire | DOCUMENTED — see Deviations + Hand-off |

## Commit

| Task | Commit | Type | Description |
|------|--------|------|-------------|
| 1 | `859a6fd` | feat | ContactModal client island (D-01..D-19; the single 'use client' carve-out per FOUND-07) |

Diff stats: 3 files changed, 423 insertions(+), 12 deletions(-). On worktree branch `worktree-agent-accef43281b6b41d6` (base: `7eedfc0` — Plan 05-01 orchestrator state update post-merge). Orchestrator will merge this worktree back to `main` after Wave 1 completes.

## ContactModal.tsx Structure Summary (387 lines)

1. **File header banner** (lines 1-30): Source line, INVERTED FOUND-07 line ("Client Component ('use client' — THE single client island per FOUND-07 carve-out"), 3 LOAD-BEARING PATTERN rationales (hash-driven open, bypassedSuccess separate state, transition arbitrary-list discipline).
2. **`'use client'` directive** (line 32): the single client directive in the codebase. Single-quoted to match Phase 1-4 string-literal convention.
3. **Imports** (lines 34-36): `useEffect, useRef, useState` from react; `useForm, ValidationError` from `@formspree/react`; `site` from `@/data/site` (consumes new `email` field).
4. **Module-level constants** (lines 38-51): `FORMSPREE_ID` (env var + fallback), `MAILTO_HREF` (template literal + resolved literal in comment for build-time grep), `MIN_TIME_MS = 1500`, `MAX_LEN = 1000`, `WARN_LEN = 800`.
5. **Component opening + state** (lines 53-72): `dialogRef`, `useForm` triple, lazy-init `mountTime`, controlled `message`, `bypassedSuccess`.
6. **Effect 1: hash-driven open/close** (lines 74-94): mount-time sync + hashchange listener with cleanup.
7. **Effect 2: dialog close handler** (lines 96-119): `history.replaceState` + `reset()` + local-state clear.
8. **`wrappedHandleSubmit`** (lines 121-141): honeypot + min-time silent-reject via `bypassedSuccess`.
9. **`onDialogClick`** (lines 143-150): backdrop-click handler using `e.target === e.currentTarget`.
10. **`showSuccess` flag** (line 152): `state.succeeded || bypassedSuccess`.
11. **JSX** (lines 154-385):
    - `<dialog>` root with `data-test`, `aria-labelledby`, padding + max-width per D-17.
    - `<h2>` D-08 heading.
    - Error region (`role="alert" aria-live="assertive"`) — renders ABOVE form per D-11; suppressed when showSuccess (prevents stale error during success render).
    - `showSuccess` branch: D-10 success copy + Send another link + D-15 mailto link (mailto visible in success per mailto-fallback spec).
    - `!showSuccess` branch: form with honeypot wrapper, 3 field groups (Name / Email / Message with char counter), Send button + D-15 mailto.
    - Trailing screen-reader-only `aria-live="polite"` region for submitting announcements.

## Verbatim Copy Verification Table (D-08..D-15)

All literal counts via `grep -c` against the source file:

| Decision | Locked Literal | Count | Notes |
|----------|---------------|------:|-------|
| D-08 | `Get in touch` | 1 | Modal `<h2>` heading |
| D-09 | `Send message` | 1 | Idle submit-button label |
| D-12 | `Sending…` | 1 | Submitting button label; U+2026 horizontal ellipsis (NOT `...`) |
| D-10 | `Thanks — I’ll get back to you within a day or two.` | 1 | Success copy; U+2014 em-dash + U+2019 curly apostrophe (NOT hyphen-minus + ASCII apostrophe) |
| D-11 | `Something went wrong sending that. Try the email link below.` | 1 | Error copy verbatim |
| D-15 | `Or just email me directly` | 2 | Visible in form-shown branch AND success branch per mailto-fallback spec contract |
| D-15 | `mailto:fakegoat1@gmail.com?subject=Hi%20Braeden` | 1 | Resolved literal in MAILTO_HREF comment for source-grep verification (template literal in code itself resolves to same value at runtime) |
| D-13 | `name="company"` | 2 | Form field + formData.get check |
| D-14 | `1500` (MIN_TIME_MS) | 2 | Const declaration + threshold comparison |
| — | `→` (U+2192 arrow) | 4 | 2 mailto renders + Send another link + comments |

Plus all 21 source-level regex checks PASS (from plan's `<verify>` block):

```
OK: 'use client' directive at top
OK: D-08..D-15 verbatim copy
OK: D-13 honeypot name (company)
OK: D-14 1500ms threshold
OK: D-19 useForm() invocation
OK: history.replaceState (Pitfall 1)
OK: bypassedSuccess (Pitfall 5)
OK: showModal (NOT show — anti-pattern guard)
OK: aria-busy, aria-labelledby, role=status, role=alert
NEG OK: !/transition-colors/ (Pitfall 4 arbitrary-list discipline)
NEG OK: !/_gotcha/ (D-13 — Formspree default-name avoided)
OK: arrow glyph U+2192 present
```

## FOUND-07 Carve-out Verification

Custom directive-scan script (mirrors `tests/no-client-components.spec.ts` + `tests/single-client-island.spec.ts` `stripLeadingComments` + regex logic):

```
Directives found: [ 'components/contact/ContactModal.tsx' ]
FOUND-07 OK: exactly 1 client island = components/contact/ContactModal.tsx
```

Cross-verified by both Playwright specs running against the worktree:
- `tests/single-client-island.spec.ts` — RED → GREEN (allow-list matches; offenders.sort() === ALLOWED_CLIENT_ISLANDS.sort())
- `tests/no-client-components.spec.ts` — atomic update kept it GREEN (was GREEN with `[]` assertion; now GREEN with `ALLOWED_CLIENT_ISLANDS` assertion containing exactly the new file)

## data/site.ts.email Wire-up Diff (3 lines added)

```diff
   domain: 'braehods.com',
+  // Phase 5 D-15 — modal mailto target. Future: hi@braehods.com per D-15a once
+  // domain mail is configured (single-line edit, no code change elsewhere).
+  email: 'fakegoat1@gmail.com',
   // v1: github + instagram only. ...
```

Source-grep regex `/email:\s*['"]fakegoat1@gmail\.com['"]/` PASS. The `email?: string` interface slot was already present at line 5 of the existing SiteMeta interface from prior phases — only a value wire-up was needed.

## tests/no-client-components.spec.ts Atomic Update

Plan offered two paths (a) replace assertion with single-element literal vs. (b) ALLOWED_CLIENT_ISLANDS allow-list mirroring single-client-island.spec.ts. **Picked Path B** for symmetry with the companion spec and for forward-compat (allow-list extends to allow more files cleanly if a justified 2nd client island ever lands).

Key changes:
- JSDoc fully rewritten: history note (Phase 1 → Phase 5), "GREEN at Phase 5 once ContactModal lands as the sole carve-out per FOUND-07" wording, companion-spec cross-reference.
- New `const ALLOWED_CLIENT_ISLANDS = ['components/contact/ContactModal.tsx'];` near the top.
- Cross-platform path normalization (`path.relative(...).split(path.sep).join('/')`) added — was missing in the Phase 1 form because Phase 1 just checked `offenders === []` and never returned paths to assert.
- Test name renamed: `no 'use client' directives anywhere in app/ components/ lib/` → `exactly 1 'use client' directive (ContactModal — Phase 5 FOUND-07 carve-out)`.
- Assertion: `expect(offenders).toEqual([])` → `expect(offenders.sort()).toEqual([...ALLOWED_CLIENT_ISLANDS].sort())`.
- Error message updated to surface the allow-list contents when the test fails.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] Mailto link visible in success state (plan body would have failed test)**
- **Found during:** Verifying against `tests/contact-modal-mailto-fallback.spec.ts:65` "mailto fallback stays visible after success render"
- **Issue:** Plan body's JSX sketch (Action step 10) wraps both form AND mailto block inside `{!showSuccess && (<>...</>)}`. That layout would hide the mailto link in success state, failing the test that asserts `page.locator('a[href^="mailto:"]')` has count 1 after success rendering.
- **Fix:** Rendered the mailto link in BOTH branches — once inside the success-state JSX (alongside D-10 copy + Send another), once inside the form-shown JSX (below Send button). Two `<a href={MAILTO_HREF}>...` blocks with identical styling. This matches D-15's CONTEXT.md wording exactly ("Visible in idle, submitting, and success states; in error state, the error copy explicitly references it") — the plan body's JSX sketch was a simplification that lost the success-state mailto.
- **Files modified:** `components/contact/ContactModal.tsx` (success branch + form-shown branch each have one mailto block)
- **Commit:** `859a6fd`
- **Rule:** Rule 1 — code-as-specified would not match the locked test contract.

**2. [Rule 1 — Bug] HTML entities in JSX text would fail source-grep verification**
- **Found during:** First-pass source-regex run after initial Write
- **Issue:** Wrote `&mdash;`, `&rsquo;`, `&rarr;` HTML entities in JSX text initially (out of habit for safe entity escaping). These render correctly in the DOM (browser decodes to U+2014, U+2019, U+2192) so the Playwright `:text-is()` assertions would have passed. BUT the source-grep verification regex in the plan's verify block (`/Thanks — I’ll get back/`) checks SOURCE characters, not rendered text. The entities would not match.
- **Fix:** Replaced all HTML entities with literal Unicode characters (U+2014 em-dash `—`, U+2019 curly apostrophe `’`, U+2192 rightwards arrow `→`, U+2026 horizontal ellipsis `…`). Verified the react/no-unescaped-entities ESLint rule default config flags only `'`, `"`, `>`, `}` in JSX children — Unicode characters U+2014/U+2019/U+2192/U+2026 are safe. lint exits 0.
- **Files modified:** `components/contact/ContactModal.tsx` (4 entity → literal-Unicode replacements)
- **Commit:** `859a6fd`
- **Rule:** Rule 1 — source-grep verification would have failed.

**3. [Rule 1 — Bug] `_gotcha` in comments tripped negative regex**
- **Found during:** First-pass source-regex run
- **Issue:** Wrote two comments mentioning the rejected `_gotcha` field name for documentation purposes (e.g., "field name is `company` (NOT `_gotcha` per CTCT-04)"). The plan's negative regex `!/_gotcha/.test(src)` checks the entire source including comments — it tripped.
- **Fix:** Rewrote both comments to describe the rationale without naming the rejected default ("custom name; the Formspree default is too well-known to bots"). The semantic content is preserved + still references CTCT-04. Negative regex now PASS.
- **Files modified:** `components/contact/ContactModal.tsx` (2 comments reworded)
- **Commit:** `859a6fd`
- **Rule:** Rule 1 — negative regex check would have failed.

**4. [Rule 1 — Bug] `transition-colors` substring in comments tripped negative regex**
- **Found during:** First-pass source-regex run
- **Issue:** Header banner referenced `transition-colors` shorthand twice (for the Pitfall 4 explanation: "NOT transition-colors shorthand"). The plan's negative regex `!/transition-colors/.test(src)` is intentional — the project-wide blocking anti-pattern guard. But it tripped on documentation references to the rejected pattern.
- **Fix:** Rewrote the header banner Pattern 3 explanation to call it "the all-colors Tailwind shorthand" instead of the literal `transition-colors`. The semantic content (Pitfall 4 rationale + Phase 2 e3ed657 + Phase 4 ProjectCard line 51 cross-references) is preserved. Negative regex now PASS.
- **Files modified:** `components/contact/ContactModal.tsx` (2 header-banner lines reworded)
- **Commit:** `859a6fd`
- **Rule:** Rule 1 — negative regex check would have failed.

**5. [Rule 1 — Scope correction] Plan body's claim of 6/9 specs flipping GREEN in Plan 02 is incorrect**
- **Found during:** Post-implementation Playwright run (8 modal-behavior specs against worktree dev server)
- **Issue:** Plan 05-02 body (must_haves.truths bullet 17 + verification.4) claims `contact-modal-states`, `contact-modal-honeypot`, `contact-modal-min-time`, `contact-modal-mailto-fallback` flip RED → GREEN in Plan 02 (alongside `single-client-island` + `no-client-components`). But ALL these specs do `page.goto('/'); page.getByRole('link', { name: 'Contact' }).first().click(); await expect(page.locator('dialog[data-test="contact-modal"]')).toHaveAttribute('open', /.*/);` — they require BOTH (a) the modal mounted somewhere in app/layout.tsx AND (b) the Nav `Contact` link with `href="#contact"` to actually open the modal. Plan 02 does NOT touch app/layout.tsx (intentionally — that's Plan 03's atomic D-05 mount + href-swap territory).
- **Fix:** Documented the verification-scope correction here in the SUMMARY. The Plan 02 deliverable (the source file + atomic spec update) is correct; only the plan body's claim of which specs flip when was off. Run-result against the worktree dev server:

| Spec | Plan 02 expected (per plan body) | Plan 02 actual | Plan 03 flips |
|------|----------------------------------|----------------|---------------|
| `tests/single-client-island.spec.ts` | RED → GREEN | RED → GREEN ✓ | n/a (already GREEN) |
| `tests/no-client-components.spec.ts` | GREEN (atomic update) | GREEN (atomic update) ✓ | n/a (stays GREEN) |
| `tests/contact-modal-states.spec.ts` | RED → GREEN | RED (no mount yet) | will flip GREEN |
| `tests/contact-modal-honeypot.spec.ts` | RED → GREEN | RED (no mount yet) | will flip GREEN |
| `tests/contact-modal-min-time.spec.ts` | RED → GREEN | RED (no mount yet) | will flip GREEN |
| `tests/contact-modal-mailto-fallback.spec.ts` | RED → GREEN | RED (no mount yet) | will flip GREEN |
| `tests/contact-modal-opens-from-nav.spec.ts` | RED (Plan 03) | RED ✓ | will flip GREEN |
| `tests/contact-modal-opens-from-about.spec.ts` | RED (Plan 03) | RED ✓ | will flip GREEN |
| `tests/contact-modal-esc-closes.spec.ts` | RED (Plan 03) | RED ✓ | will flip GREEN |
| `tests/contact-trigger-rewire.spec.ts` | RED (Plan 03) | RED ✓ | will flip GREEN |

Final tally: Plan 02 flips 2 of 9 RED specs. Plan 03 flips 8 of 9 (all the remaining modal-behavior specs + the trigger-rewire spec). The total over Phase 5 Plans 02+03 is 9/9 RED → GREEN as designed; the only change is which plan owns each flip. No source code change required from this correction — just hand-off-clarity for Plan 03.
- **Rule:** Rule 1 — plan body's verification scope was off by one wave. The plan's BUILD instructions (Action step 1-12) are correct; only the verification.4 + must_haves.truths line 32 mis-attributed which specs flip in which plan.

### Architectural Changes Encountered

None. The plan body's component contract is implementable as-described after applying the 5 Rule-1 fixes above. No new tables, no new services, no library swaps.

### Authentication Gates

None encountered.

### Out-of-scope discoveries

None new — Plan 01 already logged the pre-existing HeroPhoto.tsx typecheck error + ProjectCard.tsx `_staggerIndex` lint warning to `.planning/phases/05-contact-modal/deferred-items.md`. Both unchanged by Plan 02.

## Bundle-Size Sanity Check (informational, not a gate)

`npm run build` (Turbopack) succeeded with all 7 routes prerendered as static content. The new client-island chunk for `components/contact/ContactModal.tsx` will lazy-load when the modal is mounted (Plan 03 mounts it in `app/layout.tsx`). Per plan's PERF-03 target of ≤50KB total client JS, the `useForm`+`ValidationError`+ContactModal graph should be well under. Exact gzip measurement deferred to Plan 03 post-mount (the chunk only gets generated when something imports/mounts it).

## Verification Run Summary

All verifications against the worktree dev server (Next 16 on port 3001):

| Gate | Command | Result |
|------|---------|-------:|
| Source-level locked checks | Custom Node script (21 regexes) | 21/21 PASS |
| Typecheck (Plan 02 scope) | `npm run typecheck` | 0 errors caused by Plan 02 (HeroPhoto pre-existing) |
| Lint (Plan 02 scope) | `npm run lint` | 0 errors, 0 new warnings (ProjectCard pre-existing) |
| Build | `npm run build` | PASS — `✓ Compiled successfully in 2.6s`, 7 static routes |
| FOUND-07 directive scan | Custom Node script | exactly 1 file = `components/contact/ContactModal.tsx` |
| `data/site.ts.email` literal | regex on source | PASS — `email: 'fakegoat1@gmail.com'` present |
| Filesystem specs (2) | Playwright | 2/2 GREEN — single-client-island + no-client-components |
| Chrome canaries (4) | Playwright | 4/4 GREEN — focus-ring + no-bare-outline-none + reduced-motion + (companion FOUND-07) |
| Phase 2/3/4 regression canaries (6) | Playwright | 6/6 GREEN — about-renders + footer-socials-render×3 + work-grid-renders×3 + no regressions caused |
| Modal-behavior specs (15 tests across 8 files) | Playwright | 15/15 RED (expected — Plan 03 mount+rewire flips them all) |

## Hand-off Note to Plan 05-03

**Plan 03 wakes up to:**

1. **`components/contact/ContactModal.tsx` exists** with all required behaviors implemented: hash-driven open (`window.location.hash === '#contact'`), useForm wired to Formspree `xqeypnkw`, 4-state render with verbatim copy, honeypot + min-time silent rejection, char counter, aria regions. Plan 03 does NOT touch this file.

2. **`data/site.ts.email` is set** to `fakegoat1@gmail.com`. The component reads it via `site.email`. Plan 03 does NOT touch this file.

3. **`tests/no-client-components.spec.ts` is atomically updated** to allow exactly `components/contact/ContactModal.tsx`. Plan 03 does NOT touch this file.

4. **Plan 03's atomic D-05 mission (single commit, single Wave):**
   - **a)** `app/layout.tsx` — add `import { ContactModal } from '@/components/contact/ContactModal'` and mount `<ContactModal />` as a sibling of `<main>` + `<Footer />` (after them is fine — top-layer via showModal() doesn't depend on DOM position).
   - **b)** `components/layout/Nav.tsx` line 15 — flip `{ href: '/', label: 'Contact' }` to `{ href: '#contact', label: 'Contact' }`.
   - **c)** `app/about/page.tsx` line 75 — flip `<CTAArrowLink href="/" staggerIndex={4}>Get in touch</CTAArrowLink>` to `<CTAArrowLink href="#contact" staggerIndex={4}>Get in touch</CTAArrowLink>`.
   - **d)** `tests/about-renders.spec.ts` — flip the assertion that the /about "Get in touch" CTA has `href="/"` to `href="#contact"`. The plan-checker WARNING about this assertion update is binding — without it, this spec goes RED.

5. **After Plan 03's atomic commit:** the modal becomes openable from Nav + /about. All 8 currently-RED modal-behavior specs flip GREEN (the 4 that this plan body claimed Plan 02 would flip + the 4 the plan body said Plan 03 would flip). Plan 03 will own all 8 flips by virtue of being the wave that brings the modal into the DOM.

6. **Anti-pattern guards from `.continue-here.md` already honored by Plan 02 — Plan 03 doesn't need to re-check them in source** (Plan 02's ContactModal.tsx is locked GREEN against `_gotcha`, `transition-colors`, `location.hash = ''`, `fade-in-up` reuse, 2nd `'use client'`). Plan 03's edits to Nav.tsx + about/page.tsx + layout.tsx + about-renders.spec.ts are atomic-trigger-swap territory — they do NOT touch styling or client directives.

7. **D-05 atomicity is mandatory** — Plan 03 MUST commit all 4 file edits in a single commit. Per CONTEXT.md D-05 ("the trigger placeholders MUST swap atomically in a single commit (or single Wave)") + Phase 3 `.continue-here.md` carry-forward + Phase 4 `tests/about-renders.spec.ts` cliché-scrub spec relationship. Splitting across commits leaves Nav pointing at `/` while /about points at `#contact` (or vice versa) — a half-rewired state that fails the trigger-rewire spec.

## Self-Check: PASSED

Files claimed:
- `components/contact/ContactModal.tsx` — FOUND (387 lines, exists at expected path)
- `.planning/phases/05-contact-modal/05-02-SUMMARY.md` — FOUND (this file)

Files modified:
- `data/site.ts` — modified, line `email: 'fakegoat1@gmail.com',` present
- `tests/no-client-components.spec.ts` — modified, `ALLOWED_CLIENT_ISLANDS` constant present, test name updated

Commit claimed:
- `859a6fd` (feat(phase-5/w1): ContactModal client island...) — FOUND in `git log --oneline -3`

Verification outcomes:
- All 21 source-level regex checks PASS
- typecheck PASS (relative to Plan 02 scope)
- lint PASS (0 errors, 0 new warnings)
- build PASS (Turbopack ✓ Compiled successfully)
- FOUND-07 directive scan: exactly 1 file = `components/contact/ContactModal.tsx`
- 2 of 9 Plan 01 RED specs flipped GREEN (correctly counted vs. plan body's miscount of 6 — documented as Deviation 5)
- Chrome canaries + Phase 2/3/4 regression canaries all GREEN (12/12 PASS)

No discrepancies between claims and disk state.
