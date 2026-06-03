import type { CSSProperties } from 'react';

export const COUPLE = {
  bride: 'Annisa',
  groom: 'Fachri',
  brideFull: 'Annisa Rahmah',
  groomFull: 'Fachri Ahmad Zulkarnain',
  brideInitial: 'A',
  groomInitial: 'F',
  brideParents: 'Putri dari Bapak Hosaini & Ibu Tina Guswati',
  groomParents: 'Putra dari Bapak Masril & Ibu Yulianis',
  date: 'Sabtu, 12 September 2026',
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
