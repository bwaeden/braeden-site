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
      className="inline-flex items-center justify-center p-2 transition-colors duration-200 hover:text-[var(--color-text)]"
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden />
    </a>
  );
}
