import { memo, useMemo, useState } from 'react';
import { CardFlora, Content, Layer, Section, SectionLabel } from '../components';
import { revealStyle } from '../constants';

function ConfettiBurst() {
  const items = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2 + Math.random() * 0.3;
        const r = 120 + Math.random() * 120;
        return {
          cx: Math.cos(a) * r,
          cy: Math.sin(a) * r,
          delay: Math.random() * 220,
          size: 14 + Math.random() * 10,
          kind: i % 2 === 0 ? 'flower' : 'leaf',
        };
      }),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {items.map((it, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute left-1/2 top-1/2 animate-confettiOut"
          style={
            {
              width: it.size,
              height: it.size,
              '--cx': `${it.cx}px`,
              '--cy': `${it.cy}px`,
              animationDelay: `${it.delay}ms`,
            } as any
          }
          aria-hidden
        >
          {it.kind === 'flower' ? (
            <g>
              <circle cx="12" cy="6" r="4" fill="#1BB7A6" />
              <circle cx="6" cy="12" r="4" fill="#1BB7A6" opacity="0.85" />
              <circle cx="18" cy="12" r="4" fill="#1BB7A6" opacity="0.85" />
              <circle cx="12" cy="18" r="4" fill="#1BB7A6" />
              <circle cx="12" cy="12" r="3" fill="#A6F0E6" />
            </g>
          ) : (
            <path
              d="M2 12 C2 4, 22 4, 22 12 C22 20, 2 20, 2 12 Z"
              fill="#129E8F"
            />
          )}
        </svg>
      ))}
    </div>
  );
}

export const RsvpSection = memo(function RsvpSection() {
  const [name, setName] = useState('');
  const [attend, setAttend] = useState<'yes' | 'no' | null>(null);
  const [sent, setSent] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  return (
    <Section id="rsvp">
      <Layer depth={1.2} className="opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#fff_0%,transparent_50%)]" />
      </Layer>
      {sent && <ConfettiBurst key={burstKey} />}
      <Content className="gap-3">
        <div className="reveal-down" style={revealStyle(80)}>
          <SectionLabel numeral="IV" title="RSVP" />
        </div>
        <h3
          className="reveal-zoomout shimmer-text font-display text-3xl italic"
          style={revealStyle(280)}
        >
Mohon doa & kehadiran Anda
        </h3>
        {sent ? (
          <div
            className="reveal-zoom mt-4 flex flex-col items-center gap-3"
            style={revealStyle(0)}
          >
            <div className="glass-card relative overflow-hidden rounded-2xl px-6 py-5 text-center">
              <CardFlora src="blue2" size={88} op={0.18} className="-right-5 -top-5" />
              <CardFlora src="green1" size={80} op={0.16} className="-left-5 -bottom-5" />
              <p className="relative font-display text-2xl italic text-ice-800">
                Terima kasih, {name || 'Sahabat'}
              </p>
              <p className="relative mt-2 text-xs uppercase tracking-[0.3em] text-ice-700">
                {attend === 'yes'
                  ? 'Semoga Tuhan memudahkan langkah Anda untuk hadir'
                  : 'Terima kasih atas doa restu yang Anda panjatkan'}
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setBurstKey((k) => k + 1);
            }}
            className="mt-2 flex w-full flex-col gap-3"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              className="reveal-left glass-card w-full rounded-full px-5 py-3 text-ice-900 placeholder:text-ice-700/70 focus:outline-none focus:ring-2 focus:ring-white"
              style={revealStyle(480)}
            />
            <div className="reveal-right flex gap-3" style={revealStyle(640)}>
              {(['yes', 'no'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAttend(v)}
                  className={`flex-1 rounded-full px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-all ${
                    attend === v
                      ? 'bg-ice-800 text-white shadow-ice'
                      : 'glass-card text-ice-900'
                  }`}
                >
                  {v === 'yes' ? 'Dengan Senang Hati' : 'Mohon Maaf Berhalangan'}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={!name || !attend}
              className="reveal-zoom group relative mt-2 overflow-hidden rounded-full bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.3em] text-ice-800 shadow-ice disabled:opacity-50"
              style={revealStyle(820)}
            >
              <span className="relative z-10">Kirim Konfirmasi</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ice-200 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </button>
          </form>
        )}
      </Content>
    </Section>
  );
});
