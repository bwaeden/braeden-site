// components/home/ChannelButton.tsx
// Source: PLAN.md 02-03-T1; UI-SPEC § ChannelButton (D-12..D-14, CD-01).
//
// Server Component (NO 'use client' — FOUND-07 / D-25). Single external link
// rendered as a rounded-rectangle hairline-bordered button per D-14 visual
// discretion (must be distinct from CTA text-links D-19, accessible, and
// platform-recognizable). target="_blank" rel="noopener noreferrer" per
// HOME-03 + D-12 (new tab, no embeds) + tabnabbing prevention.
//
// v1 scope (per 02-SCOPE-AMENDMENT.md, 2026-05-11): Instagram only. The
// `Channel.platform` union retains `'youtube' | 'instagram'` and the
// ICON_BY_PLATFORM / CTA_BY_PLATFORM maps stay platform-keyed for forward-
// compat, but only the Instagram branch executes — `data/channels.ts`
// carries a 1-entry IG-only array.
//
// DEVIATION — Rule 3+4 (architectural, auto-selected in auto-mode):
//   Plan body + 02-PATTERNS.md + CLAUDE.md all instruct `import { Instagram }
//   from 'lucide-react'`. The installed `lucide-react@1.14.0` does NOT export
//   `Instagram` (nor `Github`, nor `Youtube` — brand icons were dropped from
//   Lucide ~2024 over trademark concerns; `node -e "require('lucide-react').
//   Instagram"` returns undefined). Importing the symbol would fail
//   typecheck + build. Per CLAUDE.md's established "Monogram approach"
//   (inline SVG with currentColor — already in repo at
//   components/ui/MonogramMark.tsx), we ship the Instagram glyph as a tiny
//   inline-SVG component that inherits color from the parent. The
//   ICON_BY_PLATFORM map keeps its shape (platform-keyed) so Plan 04
//   (Footer) and any future YT branch can plug in the same way.
//   See 02-03-SUMMARY.md "Deviations from Plan" for the full record.
//
//   Plan 02-04 refactor: InstagramIcon was hoisted from this file into
//   components/icons/InstagramIcon.tsx so Footer.tsx can reuse the same
//   glyph. This file just imports it now.
//
// HOVER MECHANICS (Option B per plan action — group/group-hover):
//   The parent <a> carries `group` so `group-hover:text-[var(--color-text)]`
//   on the verb span fires when the parent is hovered. Tailwind utility wins
//   over inline-style ONLY when the rest-state color is ALSO a utility (not
//   inline-style — inline-style wins the cascade against non-important
//   utilities). So the verb's rest-state color uses
//   `text-[var(--color-muted)]` Tailwind arbitrary instead of inline-style.
//   This is the documented one-off deviation from Phase 1's inline-style
//   convention (see CurrentlyLine.tsx for the inline-style baseline).

import type { Channel } from '@/data/channels';
import { InstagramIcon } from '@/components/icons/InstagramIcon';

// Platform-keyed lookup tables — kept platform-keyed (rather than collapsed
// to IG-only literals) for forward-compat per 02-SCOPE-AMENDMENT.md. When
// YT is re-enabled post-v1, add one map entry on each side.
const ICON_BY_PLATFORM = {
  instagram: InstagramIcon,
} as const;

const CTA_BY_PLATFORM = {
  instagram: 'DM me',
} as const;

interface ChannelButtonProps {
  channel: Channel;
}

export function ChannelButton({ channel }: ChannelButtonProps) {
  // TS narrowing: channel.platform is 'youtube' | 'instagram' per the Channel
  // type, but the v1 maps only carry the 'instagram' key. The lookup is
  // safe at runtime because data/channels.ts ships an IG-only array. If a
  // future YT entry arrives without a corresponding map entry, this lookup
  // would yield `undefined` — surfaced as a render error rather than silent
  // empty content. Guard with `?? null` to keep TS strict happy under
  // noUncheckedIndexedAccess.
  const Icon = ICON_BY_PLATFORM[channel.platform as keyof typeof ICON_BY_PLATFORM];
  const verb = CTA_BY_PLATFORM[channel.platform as keyof typeof CTA_BY_PLATFORM];

  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-[var(--color-border)] px-4 py-3 text-sm font-sans transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-px hover:border-[var(--color-accent)]"
    >
      {Icon ? <Icon size={18} strokeWidth={1.75} /> : null}
      <span style={{ color: 'var(--color-text)' }}>@{channel.handle}</span>
      <span aria-hidden style={{ color: 'var(--color-muted)' }}>
        ·
      </span>
      <span className="text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-text)]">
        {verb}
      </span>
    </a>
  );
}
