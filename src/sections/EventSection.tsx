import { memo } from 'react';
import { Content, Layer, Section, SectionLabel } from '../components';
import { COUPLE, revealStyle } from '../constants';
import { useCountdown } from '../hooks';

function Countdown() {
  const { days, hours, mins, secs, over } = useCountdown(COUPLE.weddingDate);
  if (over) {
    return (
      <p className="font-display text-lg italic text-ice-800">
        Hari yang dinanti telah tiba.
      </p>
    );
  }
  const units: Array<[string, number]> = [
    ['Hari', days],
    ['Jam', hours],
    ['Menit', mins],
    ['Detik', secs],
  ];
  return (
    <div className="grid w-full grid-cols-4 gap-2">
      {units.map(([label, val]) => (
        <div
          key={label}
          className="glass-card flex flex-col items-center rounded-2xl px-2 py-3"
        >
          <div className="font-display text-2xl tabular-nums text-ice-800">
            {String(val).padStart(2, '0')}
          </div>
          <div className="mt-1 text-[9px] uppercase tracking-[0.3em] text-ice-700">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function EventCard({
  title,
  time,
  place,
}: {
  title: string;
  time: string;
  place: string;
}) {
  return (
    <div className="glass-card w-full rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div className="font-display text-2xl text-ice-800">{title}</div>
        <span className="font-script text-2xl text-ice-400">❋</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-ice-700">
        <span className="font-display italic">{time}</span>
        <span className="text-[11px] uppercase tracking-[0.3em]">{place}</span>
      </div>
    </div>
  );
}

export const EventSection = memo(function EventSection() {
  return (
    <Section id="event">
      <Layer depth={1.3} className="opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#fff_0%,transparent_60%)]" />
      </Layer>
      <Content className="gap-4">
        <div className="reveal-swing" style={revealStyle(80)}>
          <SectionLabel numeral="III" title="Simpan Tanggal" />
        </div>
        <div className="reveal-flip w-full" style={revealStyle(240)}>
          <Countdown />
        </div>
        <div className="reveal-left w-full" style={revealStyle(480)}>
          <EventCard
            title="Akad Nikah"
            time="10.00 WITA"
            place="St. Glacier Chapel"
          />
        </div>
        <div className="reveal-right w-full" style={revealStyle(640)}>
          <EventCard
            title="Resepsi"
            time="18.00 WITA"
            place="Glacier Pavilion Ballroom"
          />
        </div>
        <button
          className="reveal-zoom mt-2 rounded-full bg-ice-700 px-6 py-3 font-body text-xs uppercase tracking-[0.3em] text-white shadow-ice transition-transform active:scale-95 hover:bg-ice-800"
          style={revealStyle(820)}
        >
          Buka Peta
        </button>
      </Content>
    </Section>
  );
});
