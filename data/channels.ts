export interface Channel {
  platform: 'youtube' | 'instagram';
  handle: string;
  url: string;
}

// v1 ships Instagram only — YouTube channel does not yet exist
// (per 02-SCOPE-AMENDMENT.md, 2026-05-11). The `Channel.platform` union
// retains `'youtube' | 'instagram'` for forward-compat; re-enabling YT
// post-v1 is a single-entry edit to this array.
export const channels: Channel[] = [
  { platform: 'instagram', handle: 'braehods', url: 'https://instagram.com/braehods' },
];
