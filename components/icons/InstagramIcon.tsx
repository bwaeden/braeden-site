// components/icons/InstagramIcon.tsx
// Source: refactor hoisted from components/home/ChannelButton.tsx (Plan 02-03)
// into a shared module so Plan 02-04 (Footer SocialIconLink) can reuse the
// same icon without duplication.
//
// Server Component (NO 'use client' — FOUND-07 / D-25). Inline SVG with
// `stroke="currentColor"` so the parent's color cascade drives icon color
// (matches CLAUDE.md "Monogram approach" + components/ui/MonogramMark.tsx
// precedent). Prop API (`size`, `strokeWidth`) mirrors lucide-react icon
// signature so a future swap is trivial.
//
// WHY THIS LIVES HERE (not in lucide-react):
//   `lucide-react@1.14.0` does NOT export `Instagram` — brand icons were
//   dropped from Lucide ~2024 over trademark concerns (verified at runtime:
//   `node -e "require('lucide-react').Instagram"` returns undefined). See
//   .planning/phases/02-home-page/02-03-SUMMARY.md "Deviations from Plan"
//   for the full record.
//
// Geometry: rounded-square frame at <rect rx=5> + inner circle "lens" +
// upper-right "light" dot via <line>. Matches the historical Lucide
// Instagram glyph pitch (24x24 viewBox, strokeWidth 1.75 default).

interface InstagramIconProps {
  size?: number;
  strokeWidth?: number;
}

export function InstagramIcon({ size = 18, strokeWidth = 1.75 }: InstagramIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
