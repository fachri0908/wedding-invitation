import type { CSSProperties } from 'react';

export const COUPLE = {
  bride: 'Annisa',
  groom: 'Fachri',
  brideFull: 'Annisa Rahmah, S.Sos',
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

// Which side the invitation is addressed to. Read from the `?side=` query param:
// `groom` puts the groom's name first, anything else (default) keeps bride first.
export type Side = 'bride' | 'groom';

export function getSide(): Side {
  if (typeof window === 'undefined') return 'bride';
  const v = new URLSearchParams(window.location.search).get('side');
  return v === 'groom' ? 'groom' : 'bride';
}

export const SIDE: Side = getSide();
const groomFirst = SIDE === 'groom';

// Couple names/initials ordered per invited side. Bride-first by default,
// groom-first when `?side=groom`.
export const ORDER = {
  groomFirst,
  firstName: groomFirst ? COUPLE.groom : COUPLE.bride,
  secondName: groomFirst ? COUPLE.bride : COUPLE.groom,
  firstFull: groomFirst ? COUPLE.groomFull : COUPLE.brideFull,
  secondFull: groomFirst ? COUPLE.brideFull : COUPLE.groomFull,
  firstInitial: groomFirst ? COUPLE.groomInitial : COUPLE.brideInitial,
  secondInitial: groomFirst ? COUPLE.brideInitial : COUPLE.groomInitial,
};

// Reception shown on the hero depends on the invited side: bride sees Resepsi 1
// (mempelai wanita), groom sees Resepsi 2 (mempelai pria). Keep in sync with
// the EventCard entries in EventSection.tsx.
export const RECEPTION = groomFirst
  ? {
      label: 'Resepsi 2',
      date: 'Senin, 6 Juli 2026, 10.00 WIB',
      dateShort: '06 . 07 . 2026',
      address: 'Kediaman Mempelai Pria, Bulaan, Kp Baru Padusunan',
    }
  : {
      label: 'Resepsi 1',
      date: 'Minggu, 5 Juli 2026, 10.00 WIB',
      dateShort: '05 . 07 . 2026',
      address: 'Kediaman Mempelai Wanita, Alai Gelombang',
    };

// TODO: replace with the real bank details before sending the invitation.
// `side` matches the invited side so each guest sees the matching account.
export const GIFT = [
  {
    side: 'groom' as Side,
    owner: 'Mempelai Pria',
    bank: 'Bank BCA',
    accountName: 'Fachri Ahmad Zulkarnain',
    accountNumber: '2180236751',
  },
  {
    side: 'bride' as Side,
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
