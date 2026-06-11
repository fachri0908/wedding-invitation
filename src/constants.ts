import type { CSSProperties } from 'react';

export const COUPLE = {
  bride: 'Annisa',
  groom: 'Fachri',
  brideFull: 'Annisa Rahmah, S.Sos.',
  groomFull: 'Fachri Ahmad Zulkarnain, S.Kom',
  brideInitial: 'A',
  groomInitial: 'F',
  brideParents: 'Putri dari Bapak Hosaini & Ibu Tina Guswati',
  groomParents: 'Putra dari Bapak Masril & Ibu Yulianis',
  date: 'Sabtu, 4 Juli 2026',
  dateShort: '04 . 07 . 2026',
  location: 'Alai Gelombang, Pariaman',
  weddingDate: new Date('2026-07-04T10:00:00+07:00'),
};

// TODO: replace with the real bank details before sending the invitation.
export const GIFT = [
  {
    owner: 'Mempelai Pria',
    bank: 'Bank BCA',
    accountName: 'Fachri Ahmad Zulkarnain',
    accountNumber: '2180236751',
  },
  {
    owner: 'Mempelai Wanita',
    bank: 'Bank BNI',
    accountName: 'Annisa Rahmah',
    accountNumber: '1181675821',
  },
];

// Dana e-wallet — groom only. TODO: replace phone with the real Dana number.
export const DANA = {
  name: 'Annisa Rahmah',
  phone: '081298759334',
};

export const SECTIONS = [
  'hero',
  'couple',
  'story',
  'story-2',
  'event',
  'rsvp',
  'gift',
  'comments',
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
