import { memo } from 'react';
import { Content, Layer, Section, SectionLabel } from '../components';
import { revealStyle } from '../constants';

const STORY_ITEMS = [
  {
    y: '2020',
    t: 'Pertama Bertemu',
    d: 'Sebuah pertemuan tak terduga yang mengawali segalanya.',
  },
  {
    y: '2023',
    t: 'Semakin Dekat',
    d: 'Melewati banyak cerita dan tumbuh bersama.',
  },
  {
    y: '2025',
    t: 'Lamaran',
    d: 'Sebuah janji untuk melangkah ke jenjang yang lebih serius.',
  },
];

export const StorySection = memo(function StorySection() {
  return (
    <Section id="story">
      <Layer depth={1.1} className="opacity-50">
        <div className="absolute left-10 top-20 h-32 w-32 rounded-full border border-white/60" />
        <div className="absolute right-12 bottom-24 h-24 w-24 rounded-full border border-white/40" />
      </Layer>
      <Content className="gap-4">
        <div className="reveal-down" style={revealStyle(80)}>
          <SectionLabel numeral="II" title="Kisah Kami" />
        </div>
        <ol className="mt-2 flex w-full flex-col gap-4">
          {STORY_ITEMS.map((it, i) => (
            <li
              key={it.y}
              className={`${
                i % 2 === 0 ? 'reveal-left' : 'reveal-right'
              } glass-card relative rounded-2xl p-5 text-left`}
              style={revealStyle(260 + i * 240)}
            >
              <div className="absolute -left-1 top-5 h-10 w-1 rounded-r-full bg-ice-700/50" />
              <div className="font-script text-3xl text-ice-700">{it.y}</div>
              <div className="mt-1 font-display text-xl text-ice-800">{it.t}</div>
              <p className="mt-1 text-sm italic text-ice-700">{it.d}</p>
            </li>
          ))}
        </ol>
      </Content>
    </Section>
  );
});
