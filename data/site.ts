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
  socials: {},
};
