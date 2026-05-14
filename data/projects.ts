import { z } from 'zod';

export const ProjectStatus = z.enum(['shipped', 'paper-trading', 'in-dev', 'archived']);
export const ProjectTag = z.enum(['trading', 'content', 'tools', 'archived']);

export const Project = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().max(140),
  tags: z.array(ProjectTag),
  status: ProjectStatus,
  href: z.string().url(),
});
export type Project = z.infer<typeof Project>;

// Source: 04-01-PLAN.md Task 1 (Wave 0b); 04-CONTEXT.md D-14 + D-15 + D-16.
//
// Order rationale (D-14): Manual array order, archived last.
//   CapitolLens leads (the headline current trading work), then the active
//   in-dev stack (shorts-factory, meme-dashboard, prediction-market-bot,
//   no-more-short-form, mc-packet-client), then archived braehods. The 7th
//   entry sits as the orphan card on row 4 of the 2-col md grid (D-06).
//
// href waterfall (D-16): live URL > demo (Streamlit Cloud, YT playlist) >
//   public GitHub repo. Wave-0a checkpoint resolved each href with the user;
//   defaults adopted at github.com/bwaeden/<slug> for the projects without a
//   live demo. Three entries (prediction-market-bot, no-more-short-form,
//   mc-packet-client) carry inline TODO markers above their entries — Plan
//   04-02 Task 5 deploy gate enforces marker count = 0 before
//   deploy approval; user supplies real URLs or accepts the GitHub-repo
//   placeholders by clearing the markers manually at that gate.
//
// archived braehods carry-forward: href is the OLD braehods.com (current
//   GitHub Pages site at https://braehods.com) UNTIL Phase 6 DNS swap.
//   Post-Phase-6, this swaps to a Wayback Machine snapshot or the archived
//   GitHub repo URL — Phase 6 decides at the cutover.
//
// Honesty contract (D-15): warm + concrete; no emoji; no `!`; no cliché-ban
//   phrases (passionate, I love to learn, driven by, innovative, cutting-edge,
//   lifelong learner, wear many hats, results-oriented, outcome-driven).
//   CapitolLens MUST contain `paper-only` or `paper-traded` (memory
//   feedback_capitollens_auto_follow.md). Every in-dev entry's description
//   MUST NOT contain `live` or `shipped` (case-insensitive — symmetric
//   counterpart to the CapitolLens positive check).
export const projects: Project[] = [
  {
    slug: 'capitollens',
    title: 'CapitolLens',
    description:
      'Form 4 insider-buy signal scanner — paper-only, 180-day hold, +18%/yr Sharpe 0.93 backtest.',
    tags: ['trading', 'tools'],
    status: 'paper-trading',
    href: 'https://github.com/bwaeden/capitollens',
  },
  {
    slug: 'shorts-factory',
    title: 'shorts-factory',
    description:
      'Remotion-based CLI that renders Dam-style YT Shorts from a single script — no Studio, no GUI.',
    tags: ['content', 'tools'],
    status: 'in-dev',
    href: 'https://github.com/bwaeden/shorts-factory',
  },
  {
    slug: 'meme-dashboard',
    title: 'meme-dashboard',
    description:
      'Streamlit backtest scorer for meme formats across YT Shorts, IG Reels, and TikTok.',
    tags: ['content', 'tools'],
    status: 'in-dev',
    href: 'https://github.com/bwaeden/meme-dashboard',
  },
  {
    slug: 'prediction-market-bot',
    title: 'prediction-market-bot',
    description:
      'Personal trading bot for prediction markets — in-development.',
    tags: ['trading', 'tools'],
    status: 'in-dev',
    href: 'https://github.com/bwaeden/prediction-market-bot',
  },
  {
    slug: 'no-more-short-form',
    title: 'no-more-short-form',
    description:
      'Self-imposed short-form-feed blocker — in-development tooling for focus and attention.',
    tags: ['content', 'tools'],
    status: 'in-dev',
    href: 'https://github.com/bwaeden/no-more-slop',
  },
  {
    slug: 'mc-packet-client',
    title: 'mc-packet-client',
    description:
      'Minecraft protocol packet client — in-development network-layer tooling.',
    tags: ['tools'],
    status: 'in-dev',
    href: 'https://github.com/bwaeden/mc-packet-client',
  },
  {
    slug: 'braehods-archive',
    title: 'braehods.com (v0)',
    description:
      'The original braehods.com — minimal Geist-font landing page on GitHub Pages, archived for v1.',
    tags: ['archived'],
    status: 'archived',
    href: 'https://braehods.com',
  },
];
