import { memo } from 'react';
import { CardFlora, Content, Layer, Section, SectionLabel } from '../components';
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
          className="glass-card flex flex-col items-center rounded-2xl p-2"
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
  flora,
  floraRotate,
  floraClassName = '',
  mapUrl,
}: {
  title: string;
  time: string;
  place: string;
  flora: string;
  floraRotate?: number;
  floraClassName?: string;
  mapUrl?: string;
}) {
  const href =
    mapUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  return (
    <div className="glass-card relative w-full overflow-hidden rounded-3xl p-3">
      <CardFlora
        src={flora}
        size={88}
        op={0.2}
        rotate={floraRotate}
        className={`-right-5 -top-5 ${floraClassName}`}
      />
      <div className="relative font-display text-2xl text-ice-800">{title}</div>
      <div className="relative flex flex-col items-center justify-between text-sm text-ice-700">
        <span className="font-display italic">{time}</span>
        <span className="text-[11px] uppercase tracking-[0.3em]">{place}</span>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-ice-700 px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.3em] text-white shadow-ice transition-all active:scale-95 hover:bg-ice-800"
      >
        📍 Buka Peta
      </a>
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
          <SectionLabel numeral="II" title="Simpan Tanggal" />
        </div>
        <div className="reveal-flip w-full" style={revealStyle(240)}>
          <Countdown />
        </div>
        <div className="reveal-left w-full" style={revealStyle(480)}>
          <EventCard
            title="Akad Nikah"
            time="Sabtu, 4 Juli 2026, 13.00 WIB"
            place="Kediaman Mempelai Wanita, Alai Gelombang"
            flora="blue1"
            floraClassName='rotate-180 mr-3 mt-3'
            mapUrl="https://maps.app.goo.gl/mnwBhbHkVrPzXmyg8?g_st=aw"
          />
        </div>
        <div className="reveal-right w-full" style={revealStyle(640)}>
          <EventCard
            title="Resepsi 1"
            time="Minggu, 5 Juli 2026, 10.00 WIB"
            place="Kediaman Mempelai Wanita, Alai Gelombang"
            flora="blue3"
            floraClassName='rotate-180 mr-3 mt-3'
            mapUrl="https://maps.app.goo.gl/mnwBhbHkVrPzXmyg8?g_st=aw"
          />
        </div>
        <div className="reveal-right w-full" style={revealStyle(640)}>
          <EventCard
            title="Resepsi 2"
            time="Senin, 6 Juli 2026, 10.00 WIB"
            place="Kediaman Mempelai Pria, Bulaan, Kp Baru Padusunan"
            flora="blue3"
            floraClassName='rotate-180 mr-3 mt-3'
            mapUrl="https://maps.app.goo.gl/ieyk3EVAEPBzzMCh8"
          />
        </div>
      </Content>
    </Section>
  );
});
