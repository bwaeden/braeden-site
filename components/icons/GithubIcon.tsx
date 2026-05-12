// components/icons/GithubIcon.tsx
// Source: PLAN.md 02-04 (Footer SocialIconLink — D-15..D-16, HOME-06).
//
// Server Component (NO 'use client' — FOUND-07 / D-25). Inline SVG with
// `stroke="currentColor"` so the parent's color cascade drives icon color
// (matches CLAUDE.md "Monogram approach" + components/ui/MonogramMark.tsx
// precedent). Prop API (`size`, `strokeWidth`) mirrors lucide-react icon
// signature so a future swap is trivial.
//
// WHY THIS LIVES HERE (not in lucide-react):
//   `lucide-react@1.14.0` does NOT export `Github` — brand icons were
//   dropped from Lucide ~2024 over trademark concerns (verified at runtime
//   during Plan 02-03 execution: `node -e "require('lucide-react').Github"`
//   returns undefined). See .planning/phases/02-home-page/02-03-SUMMARY.md
//   "Deviations from Plan" for the full record.
//
// Geometry: the canonical "Octocat-silhouette" GitHub glyph that Lucide
// shipped pre-removal — single <path> capturing the octopus-cat outline,
// stroked at 1.75 from a 24x24 viewBox. Stroke pitch matches the IG icon
// and lucide-react's house style so the Footer row reads as one set.

interface GithubIconProps {
  size?: number;
  strokeWidth?: number;
}

export function GithubIcon({ size = 18, strokeWidth = 1.75 }: GithubIconProps) {
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
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}
