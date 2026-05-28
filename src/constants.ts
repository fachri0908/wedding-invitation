import type { CSSProperties } from 'react';

export const COUPLE = {
  bride: 'Aria',
  groom: 'Daniel',
  brideInitial: 'A',
  groomInitial: 'D',
  date: 'Saturday, 12 September 2026',
  dateShort: '12 . 09 . 2026',
  location: 'Glacier Pavilion, Bali',
  weddingDate: new Date('2026-09-12T10:00:00+08:00'),
};

export const SECTIONS = [
  'hero',
  'couple',
  'story',
  'event',
  'gallery',
  'rsvp',
  'closing',
] as const;

export type SectionId = (typeof SECTIONS)[number];

export const SCROLL_DURATION_MS = 1400;

export function revealStyle(
  delay: number,
  extra: CSSProperties = {},
): CSSProperties {
  return { ['--reveal-delay' as any]: `${delay}ms`, ...extra };
}
