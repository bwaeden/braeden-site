// components/layout/SocialIconLink.tsx
// Source: PLAN.md 02-04-T1; UI-SPEC § FooterSocials (D-15..D-16, HOME-06).
//
// Server Component (NO 'use client' — FOUND-07 / D-25). Icon-only external
// link inheriting --color-muted from the parent <footer> (D-16 currentColor
// pattern matches the monogram). Icon passed as a component prop so the
// import lives at the call site (per-icon, tree-shakeable). Touch-target
// ~34×34 (UI-SPEC line 469 acknowledges editorial-restraint trade-off below
// WCAG 44×44 ideal; Phase 6 audit may revisit).
//
// `Icon` prop is typed permissively as a component that accepts
// `{ size?: number; strokeWidth?: number }` + SVGProps so it works equally
// with lucide-react icons (when/if Lucide ships brand glyphs again) and
// with the project's inline-SVG icon modules at components/icons/*
// (current v1 source — see components/icons/InstagramIcon.tsx and
// components/icons/GithubIcon.tsx; both share the lucide signature).
//
// DEVIATION — Rule 1 (bug fix) caught at verification time:
//   The original plan body specified `transition-colors duration-200` here.
//   Tailwind v4's `transition-colors` shorthand includes `outline-color` in
//   the transitioned-property list (verified in the served CSS bundle:
//   `.transition-colors { transition-property: color,...,outline-color,... }`).
//   Because the parent <footer> sets `color: var(--color-muted)` and
//   `outline-color` defaults to `currentcolor`, the rest-state outline-color
//   on this <a> resolves to muted — and when `*:focus-visible` fires
//   (`outline: 2px solid var(--color-accent)`), the 200ms transition makes
//   `getComputedStyle(el).outline` report the muted-tinted in-flight value
//   on the first frame after Tab. This regressed tests/focus-ring.spec.ts.
//   Narrowing the transition to `transition-[color]` (only the `color`
//   property — not the full v4 colors group) leaves outline-color untouched
//   so the focus ring renders the locked accent immediately. Same fix
//   pattern applies to the Footer.tsx "View source" link.

import type { ComponentType, SVGProps } from 'react';

interface SocialIconLinkProps {
  href: string;
  label: string; // e.g. "GitHub profile", "Instagram profile"
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>;
}

export function SocialIconLink({ href, label, Icon }: SocialIconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center p-2 transition-[color] duration-200 hover:text-[var(--color-text)]"
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden />
    </a>
  );
}
