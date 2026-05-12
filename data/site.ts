export interface SiteMeta {
  name: string;
  tagline: string;
  domain: string;
  email?: string;
  socials: { github?: string; instagram?: string; youtube?: string };
}

export const site: SiteMeta = {
  name: 'Braeden Hodson',
  tagline:
    'Business student and entrepreneur in LA, building things and running a small content brand',
  domain: 'braehods.com',
  // v1: github + instagram only. `youtube?` key intentionally omitted from
  // this literal per 02-SCOPE-AMENDMENT.md (no YT channel exists yet).
  // The optional `youtube?: string` field shape stays on the interface for
  // forward-compat; re-enabling is a one-line key add here.
  socials: {
    github: 'https://github.com/bwaeden',
    instagram: 'https://instagram.com/braehods',
  },
};
