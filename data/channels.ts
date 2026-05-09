export interface Channel {
  platform: 'youtube' | 'instagram';
  handle: string;
  url: string;
}

export const channels: Channel[] = [];
