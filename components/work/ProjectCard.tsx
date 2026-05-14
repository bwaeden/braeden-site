// components/work/ProjectCard.tsx
// Source: PLAN.md 04-01-T3; 04-UI-SPEC § ProjectCard component (D-01..D-04, D-09..D-12).
//
// Server Component invariant (FOUND-07 / D-25 inherited): zero 'use client',
// zero state, zero event handlers — plain <a> tag does the navigation. This
// keeps /work shipping zero JS for the card layer (the cards are pure HTML +
// CSS at runtime, no hydration cost).
//
// Card-scale translation of components/home/ChannelButton.tsx (line 78
// transition discipline): the home Channel pill and the Phase 4 ProjectCard
// share the hairline-tile shape, the group-hover hover treatment, and the
// `transition-[border-color,color,transform]` arbitrary-list rationale.
// ProjectCard is the block-display, content-driven-height, full-card-link
// version (D-03 entire-card-is-link + D-07 items-stretch row alignment).
//
// Token discipline (D-09): two color literals (#c8a86a paper-trading amber,
// #707070 archived deep-grey) live as inline-style on the dot only — NOT
// promoted to globals.css @theme. Keeps the locked 6-token palette pure for
// v1; Phase 6 polish revisits if status badges propagate elsewhere.
//
// Transition-discipline rationale (Phase 2 Plan 02-04 Rule 1 fix in
// components/layout/SocialIconLink.tsx lines 18-32 + components/layout/
// Footer.tsx line 76): Tailwind v4's `transition-colors` shorthand includes
// `outline-color` in the transitioned-property list, which combined with the
// parent's muted color cascade made `*:focus-visible`'s 2px accent ring
// 200ms-interpolate from muted to accent on first frame after Tab. The
// arbitrary list `transition-[border-color,color,transform]` excludes
// outline-color so the focus ring renders the locked accent immediately.
// Verified GREEN by tests/focus-ring.spec.ts.

import type { Project } from '@/data/projects';

const STATUS_DOT_COLOR: Record<Project['status'], string> = {
  shipped: 'var(--color-accent)', // #7c87ff (token)
  'paper-trading': '#c8a86a', // muted amber, inline literal (D-09 — NOT in @theme)
  'in-dev': 'var(--color-muted)', // #a8a8a8 (token)
  archived: '#707070', // deep grey, inline literal (D-09 — NOT in @theme; #7a7a7a fallback documented if WebAIM check fails on deployed preview in Plan 04-02 Task 6)
};

interface ProjectCardProps {
  project: Project;
  staggerIndex: number; // 1..N — caller (page.tsx in 04-02) owns choreography; prop currently unused inside component (animation lives on the wrapper <li> per Pitfall 5), prefix with _ but keep wired for forward-compat
}

export function ProjectCard({ project, staggerIndex: _staggerIndex }: ProjectCardProps) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full p-5 rounded border border-[var(--color-border)] transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:border-[var(--color-accent)]"
    >
      {/* 1. Status badge (D-10 — top of card; D-11 — lowercase exact schema text) */}
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: STATUS_DOT_COLOR[project.status] }}
        />
        <span className="text-sm font-sans" style={{ color: 'var(--color-muted)' }}>
          {project.status}
        </span>
      </div>

      {/* 2. Title + arrow (D-04 — inline ↗ external arrow, group-hover translate) */}
      <div className="mt-4 text-base font-sans" style={{ color: 'var(--color-text)' }}>
        {project.title}
        {' '}
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-0.5"
          style={{ color: 'var(--color-accent)' }}
        >
          ↗
        </span>
      </div>

      {/* 3. Description (D-15 — drafted at execute time, ≤140 chars per Project schema) */}
      <p className="mt-2 text-sm font-sans" style={{ color: 'var(--color-text)' }}>
        {project.description}
      </p>

      {/* 4. Tags (D-12 — plain comma-joined muted text; NO pill chips, NO color-coding) */}
      <p className="mt-2 text-sm font-sans" style={{ color: 'var(--color-muted)' }}>
        {project.tags.join(', ')}
      </p>
    </a>
  );
}
