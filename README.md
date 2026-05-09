# Braeden Site (braehods.com)

A credibility-forward personal site at braehods.com — built so anyone arriving from Instagram, GitHub, an investor intro, or a recruiter search walks away thinking "that's a nice website" first and "I want to follow up with him" second. Built on Next.js 16 (App Router) + MDX + TypeScript + Tailwind v4, deployed to Vercel.

## Development

```bash
npm run dev         # local dev server (Turbopack)
npm run build       # production build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Playwright (chromium-mobile project)
npm run test:full   # Playwright (all projects)
```

## Deploy

Vercel — preview on every branch; production on `main` (when launched).
