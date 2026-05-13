// app/about/page.tsx
// Source: PLAN.md 03-01-T2; UI-SPEC § Page Composition + § HeroPhoto Reuse Contract + § Motion Choreography.
//
// Server Component (NO 'use client' — FOUND-07 / D-25 inherited). Replaces
// the Plan 02-05 'Coming soon.' stub with the Phase 3 bio + photo + CTA
// composition. Reuses components/home/HeroPhoto (D-08 Option A) so the
// view-transition-name: hero-photo seam matches the home side, and reuses
// components/home/CTAArrowLink for the 'Get in touch →' nudge (D-12).
// Bio prose drafted in this commit per D-01; user edits in place at Task 3
// review BEFORE the final commit lands. NO new components, NO new tokens.
//
// Layout per D-07 / CD-04: photo on top mobile (flex-col-reverse), photo
// right desktop (md:flex-row + md:items-center). NO max-w-5xl wrapper per
// D-10 — the page deliberately inherits max-w-3xl from app/layout.tsx so
// the prose column reads tighter than the home hero.
//
// Stagger sequence (D-24 inherited LCP discipline): photo carries NO
// animation; bio paragraphs animate fadeInUp at stagger(1)/(2)/(3); CTA
// animates last at staggerIndex={4}.

import { HeroPhoto } from '@/components/home/HeroPhoto';
import { CTAArrowLink } from '@/components/home/CTAArrowLink';
import { fadeInUp, stagger } from '@/lib/motion';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <section
      data-test="about-section"
      aria-labelledby="about-heading"
      className="py-8 md:py-12"
    >
      <div
        data-test="about-flex"
        className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:gap-16"
      >
        <div className="flex flex-col items-start">
          <h1 id="about-heading" className="sr-only">
            About
          </h1>
          <p
            className={`max-w-[44ch] font-sans text-base leading-relaxed ${fadeInUp}`}
            style={{ color: 'var(--color-text)', ...stagger(1) }}
          >
            Hi, I&apos;m Braeden — a mechanical engineering student in LA, building
            software in the margins around markets, content, and AI tooling. The site
            you&apos;re reading is one of those margin projects; the rest of them sit
            a tab over from this one.
          </p>
          <p
            className={`mt-4 max-w-[44ch] font-sans text-base leading-relaxed ${fadeInUp}`}
            style={{ color: 'var(--color-text)', ...stagger(2) }}
          >
            Right now most of my time goes to CapitolLens, a paper-traded strategy
            that turns Form 4 insider-buy clusters into entry signals (a cluster of
            MEDIUM-tier insider purchases, hold 180 days, no early exits). I&apos;m
            also running a small content studio under @braehods on Instagram — two
            YouTube Shorts channels, one wholesome POV stories, one deadpan
            single-meme reactions — plus a handful of dev tools that keep the studio
            running: a Remotion-based shorts renderer and a Streamlit dashboard for
            backtesting meme formats.
          </p>
          <p
            className={`mt-4 max-w-[44ch] font-sans text-base leading-relaxed ${fadeInUp}`}
            style={{ color: 'var(--color-text)', ...stagger(3) }}
          >
            I&apos;m open to trading-desk internships, content collabs with people
            building in finance or AI, and roughly any conversation about what is
            actually working in algorithmic strategy or short-form right now. If any
            of that sounds like you, the link below is the friendliest way to reach
            me.
          </p>
          <div className="mt-6">
            <CTAArrowLink href="/" staggerIndex={4}>
              Get in touch
            </CTAArrowLink>
          </div>
        </div>
        <HeroPhoto />
      </div>
    </section>
  );
}
