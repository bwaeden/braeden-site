# Phase 5 Deferred Items

Out-of-scope discoveries surfaced during Phase 5 execution. NOT fixed in Phase 5 plans — logged here for a follow-up plan (Phase 6 polish, or a dedicated typing-housekeeping task).

## Pre-existing typecheck error in components/home/HeroPhoto.tsx

**Discovered:** Plan 05-01 Task 1 verification, 2026-05-14

**Error:**
```
components/home/HeroPhoto.tsx(21,22): error TS2307: Cannot find module
'@/public/portrait.jpg' or its corresponding type declarations.
```

**Confirmed pre-existing:** `git stash && npm run typecheck` against the
worktree base (commit `c04061156` "wip: phase-5 paused — planning complete,
ready to execute") reproduces the same error WITHOUT any Plan 05-01 changes
applied. The error exists in the baseline planning-complete state and was not
introduced by the `@formspree/react@3.0.0` install.

**Root cause (likely):** `next-env.d.ts` declares `*.jpg` module shapes via
`<reference types="next/image-types/global" />`, but the typechecker's
`include` array or the `@/public/` path alias does not resolve `.jpg` imports
under `public/` cleanly. The `public/` directory is conventionally outside
the TS rootDir; Next.js' image-import declarations are meant to attach to
`@/*` imports from `app/`, `components/`, or `lib/`, not from `public/`.

**Suggested fix (NOT shipped in Phase 5):** Either (a) move the static import
target to `import portrait from '../../public/portrait.jpg'` plus add
`"public"` to the tsconfig `include` array, or (b) use `next/image` with a
`src="/portrait.jpg"` string + explicit `width`/`height` props (no static
import).

**Why deferred:** Out of scope for Plan 05-01 (validation infrastructure for
the contact modal). Plan 05-01 changes are scoped to `package.json`,
`app/globals.css`, and 9 new test files under `tests/`. The HeroPhoto.tsx
typecheck error is unchanged by all 3 tasks in this plan. Phase 6 polish or
a dedicated `chore(types)` task should resolve.

## Pre-existing lint warning in components/work/ProjectCard.tsx

**Discovered:** Plan 05-01 Task 1 verification, 2026-05-14

**Warning:**
```
components/work/ProjectCard.tsx
  45:54  warning  '_staggerIndex' is defined but never used
```

**Confirmed pre-existing:** Phase 4 deliverable; not introduced by Plan
05-01.

**Why deferred:** Lint exits 0 (warning, not error). Out of scope for Plan
05-01.
