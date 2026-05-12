// components/layout/Footer.tsx
// Source: PLAN.md W3-T3 (Phase 1 chrome) + 02-04-T2 (Phase 2 extension).
// UI-SPEC § FooterSocials (D-15..D-17, HOME-06).
//
// Server Component (NO 'use client' — FOUND-07 / D-25). Phase 1 ships
// monogram + © year + braehods.com. Phase 2 adds the social icon row
// (GitHub + Instagram in v1 per 02-SCOPE-AMENDMENT.md — YouTube dropped)
// and the "View source →" link (D-17 — reuses site.socials.github).
//
// Icon sourcing: components/icons/* (inline-SVG modules) instead of
// lucide-react — `lucide-react@1.14.0` does NOT export Github/Instagram
// (brand icons dropped from Lucide ~2024 over trademark concerns; the
// workaround pattern is established in 02-03-SUMMARY.md and shared via
// the components/icons/ directory introduced in Plan 04 wave 2).
//
// Color cascade: the container <div> sets `color: var(--color-muted)` and
// all descendants (monogram, copyright, social icons, source link, domain
// text) inherit it via currentColor. SocialIconLink + the source link both
// transition to var(--color-text) on hover.
//
// Conditional rendering on `site.socials.*`: defensive — Plan 01 populates
// github + instagram in v1, but the `&& (…)` guard means a future user
// removing a key won't crash the render. The `youtube` conditional is
// OMITTED entirely per 02-SCOPE-AMENDMENT.md (no dead code in source).
//
// Hover-color transition note: `transition-[color]` (arbitrary, single
// property) rather than `transition-colors` — in Tailwind v4 the latter
// shorthand also transitions `outline-color`, which would 200ms-interpolate
// the focus-visible ring from the inherited muted color to the accent token
// and regress tests/focus-ring.spec.ts. Same fix mirrored in SocialIconLink.

import { MonogramMark } from '@/components/ui/MonogramMark';
import { SocialIconLink } from '@/components/layout/SocialIconLink';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { site } from '@/data/site';

export function Footer() {
  return (
    <footer className="divider-top px-6 py-8 lg:px-12">
      <div
        className="mx-auto flex max-w-3xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ color: 'var(--color-muted)' }}
      >
        {/* Left: monogram + copyright (Phase 1 — preserved verbatim) */}
        <div className="flex items-center gap-3">
          <MonogramMark size={16} aria-hidden />
          <span className="font-sans text-sm">© 2026 Braeden Hodson</span>
        </div>

        {/* Center: social row (Phase 2 D-15..D-16 — GH + IG only per 02-SCOPE-AMENDMENT.md) */}
        <div className="flex items-center gap-4">
          {site.socials.github && (
            <SocialIconLink
              href={site.socials.github}
              label="GitHub profile"
              Icon={GithubIcon}
            />
          )}
          {site.socials.instagram && (
            <SocialIconLink
              href={site.socials.instagram}
              label="Instagram profile"
              Icon={InstagramIcon}
            />
          )}
        </div>

        {/* Right: source link + domain (Phase 2 D-17 + Phase 1 domain text) */}
        <div className="flex items-center gap-4">
          {site.socials.github && (
            <a
              href={site.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm transition-[color] duration-200 hover:text-[var(--color-text)]"
            >
              View source →
            </a>
          )}
          <span className="font-sans text-sm">braehods.com</span>
        </div>
      </div>
    </footer>
  );
}
