// components/home/ChannelButtonRow.tsx
// Source: PLAN.md 02-03-T2; UI-SPEC § ChannelButton "Layout" subsection.
//
// Server Component (NO 'use client' — FOUND-07 / D-25). Single combined
// "channels" block per D-13 (NOT two separate Channel-A / Channel-B
// surfaces — PROJECT.md hard constraint). flex-wrap row of ChannelButton
// items so the row stays single-line on tablet+ but wraps cleanly on
// 320px viewport (CD-04). Per-button stagger lives on the wrapper <div>
// so the keyframe does NOT collide with the button's own hover translate
// (02-PATTERNS.md line 353-356).
//
// v1 scope (per 02-SCOPE-AMENDMENT.md, 2026-05-11): channels array is a
// 1-entry IG-only list, so this row renders exactly 1 ChannelButton with
// stagger(3) = 240ms (since i=0). The `stagger(3 + i)` pattern is
// preserved for any future channel count without code change.

import { ChannelButton } from '@/components/home/ChannelButton';
import { fadeInUp, stagger } from '@/lib/motion';
import type { Channel } from '@/data/channels';

interface ChannelButtonRowProps {
  channels: Channel[];
}

export function ChannelButtonRow({ channels }: ChannelButtonRowProps) {
  return (
    <div className="mt-8 flex flex-row flex-wrap gap-3">
      {channels.map((channel, i) => (
        <div key={channel.platform} className={fadeInUp} style={stagger(3 + i)}>
          <ChannelButton channel={channel} />
        </div>
      ))}
    </div>
  );
}
