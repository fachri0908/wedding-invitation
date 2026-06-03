import {
  CSSProperties,
  ReactNode,
  Suspense,
  lazy,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { COUPLE } from './constants';
import { RevealContext } from './RevealContext';

const CrystalTransition = lazy(() =>
  import('./three/CrystalTransition').then((m) => ({
    default: m.CrystalTransition,
  })),
);

// Coarse-pointer / small screens get a lighter background (fewer flowers, blurs
// and trees) so scrolling stays smooth on phones.
const LITE =
  typeof window !== 'undefined' &&
  ((typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches) ||
    window.innerWidth <= 820);

// ───── primitives ───────────────────────────────────────────────────────

// Per-section ornaments, scattered around the edge bands (clear of the centred
// content) — each its own motif, position, entrance transition and idle drift.
const SECTION_DECOR: Record<string, Decoration[]> = {
  hero: [
    { layers: [{ v: 'bloom' }], pos: { top: 0, left: 0 }, size: 116, flip: 'scale(1,1)', reveal: 'reveal-left', idle: 'animate-sway', delay: 200 },
    { layers: [{ v: 'tulip' }], pos: { top: '4%', right: '3%' }, size: 80, flip: 'scale(-1,1)', reveal: 'reveal-right', idle: 'animate-sway', delay: 360 },
    { layers: [{ v: 'pine' }], pos: { bottom: 0, left: '4%' }, size: 78, flip: 'scale(1,-1)', reveal: 'reveal-up', idle: 'animate-swayslow', delay: 520 },
    { layers: [{ v: 'vine' }], pos: { bottom: 0, right: 0 }, size: 96, flip: 'scale(-1,-1)', reveal: 'reveal-down', idle: 'animate-sway', delay: 680 },
  ],
  couple: [
    { layers: [{ v: 'rosette' }], pos: { top: '3%', left: '2%' }, size: 104, flip: 'scale(1,1)', reveal: 'reveal-scale', idle: 'animate-float', delay: 200 },
    { layers: [{ v: 'vine' }], pos: { top: 0, right: 0 }, size: 96, flip: 'scale(-1,1)', reveal: 'reveal-tilt-r', idle: 'animate-swayslow', delay: 360 },
    { layers: [{ v: 'berry' }], pos: { bottom: '2%', left: 0 }, size: 88, flip: 'scale(1,-1)', reveal: 'reveal-drop', idle: 'animate-sway', delay: 520 },
    { layers: [{ v: 'bloom' }], pos: { bottom: 0, right: '3%' }, size: 92, flip: 'scale(-1,-1)', reveal: 'reveal-rotate', idle: 'animate-drift', delay: 680 },
  ],
  story: [
    { layers: [{ v: 'pine' }], pos: { top: 0, left: 0 }, size: 100, flip: 'scale(1,1)', reveal: 'reveal-down', idle: 'animate-sway', delay: 200 },
    { layers: [{ v: 'tulip' }], pos: { top: '2%', left: '50%' }, size: 64, flip: 'translateX(-50%)', reveal: 'reveal-drop', idle: 'animate-sway', delay: 360 },
    { layers: [{ v: 'fern' }], pos: { bottom: 0, left: '3%' }, size: 92, flip: 'scale(1,-1)', reveal: 'reveal-left', idle: 'animate-swayslow', delay: 520 },
    { layers: [{ v: 'berry' }], pos: { bottom: '3%', right: 0 }, size: 90, flip: 'scale(-1,-1)', reveal: 'reveal-right', idle: 'animate-drift', delay: 680 },
  ],
  event: [
    { layers: [{ v: 'tulip' }], pos: { top: 0, left: 0 }, size: 104, flip: 'scale(1,1)', reveal: 'reveal-zoom', idle: 'animate-sway', delay: 200 },
    { layers: [{ v: 'fern' }], pos: { top: '4%', right: '2%' }, size: 92, flip: 'scale(-1,1)', reveal: 'reveal-tilt-l', idle: 'animate-swayslow', delay: 360 },
    { layers: [{ v: 'rosette' }], pos: { bottom: 0, left: 0 }, size: 86, flip: 'scale(1,-1)', reveal: 'reveal-scale', idle: 'animate-float', delay: 520 },
    { layers: [{ v: 'tulip' }], pos: { bottom: '3%', right: '3%' }, size: 72, flip: 'scale(-1,-1)', reveal: 'reveal-rotate', idle: 'animate-sway', delay: 680 },
  ],
  gallery: [
    { layers: [{ v: 'berry' }], pos: { top: '2%', left: '2%' }, size: 100, flip: 'scale(1,1)', reveal: 'reveal-left', idle: 'animate-drift', delay: 200 },
    { layers: [{ v: 'bloom' }], pos: { top: 0, right: 0 }, size: 94, flip: 'scale(-1,1)', reveal: 'reveal-right', idle: 'animate-sway', delay: 360 },
    { layers: [{ v: 'vine' }], pos: { bottom: 0, left: 0 }, size: 92, flip: 'scale(1,-1)', reveal: 'reveal-up', idle: 'animate-swayslow', delay: 520 },
    { layers: [{ v: 'fern' }], pos: { bottom: '2%', right: '2%' }, size: 92, flip: 'scale(-1,-1)', reveal: 'reveal-blur', idle: 'animate-drift', delay: 680 },
  ],
  rsvp: [
    { layers: [{ v: 'fern' }], pos: { top: 0, left: 0 }, size: 100, flip: 'scale(1,1)', reveal: 'reveal-tilt-l', idle: 'animate-swayslow', delay: 200 },
    { layers: [{ v: 'vine' }], pos: { top: '3%', right: 0 }, size: 92, flip: 'scale(-1,1)', reveal: 'reveal-tilt-r', idle: 'animate-sway', delay: 360 },
    { layers: [{ v: 'rosette' }], pos: { bottom: '2%', left: '3%' }, size: 90, flip: 'scale(1,-1)', reveal: 'reveal-drop', idle: 'animate-float', delay: 520 },
    { layers: [{ v: 'berry' }], pos: { bottom: 0, right: 0 }, size: 88, flip: 'scale(-1,-1)', reveal: 'reveal-scale', idle: 'animate-drift', delay: 680 },
  ],
  closing: [
    { layers: [{ v: 'rosette' }], pos: { top: 0, left: 0 }, size: 102, flip: 'scale(1,1)', reveal: 'reveal-zoomout', idle: 'animate-float', delay: 200 },
    { layers: [{ v: 'pine' }], pos: { top: '4%', right: '3%' }, size: 84, flip: 'scale(-1,1)', reveal: 'reveal-down', idle: 'animate-sway', delay: 360 },
    { layers: [{ v: 'tulip' }], pos: { bottom: '3%', left: 0 }, size: 80, flip: 'scale(1,-1)', reveal: 'reveal-zoom', idle: 'animate-sway', delay: 520 },
    { layers: [{ v: 'berry' }], pos: { bottom: 0, right: 0 }, size: 92, flip: 'scale(-1,-1)', reveal: 'reveal-up', idle: 'animate-drift', delay: 680 },
    { layers: [{ v: 'bloom' }], pos: { top: '2%', left: '50%' }, size: 60, flip: 'translateX(-50%)', reveal: 'reveal-blur', idle: 'animate-sway', delay: 820 },
  ],
};

export function Section({
  id,
  className = '',
  frame = true,
  children,
}: {
  id: string;
  className?: string;
  frame?: boolean;
  children: ReactNode;
}) {
  const revealed = useContext(RevealContext);
  const decor = SECTION_DECOR[id] ?? [];
  return (
    <section
      id={id}
      data-section
      data-revealed={revealed.has(id) ? 'true' : 'false'}
      className={`relative flex h-[100dvh] w-full items-center justify-center overflow-hidden preserve-3d ${className}`}
      style={{ ['--p' as any]: 0 } as CSSProperties}
    >
      {frame && decor.length > 0 && <SectionDecor items={decor} />}
      {children}
    </section>
  );
}

export function Layer({
  depth = 0,
  className = '',
  children,
}: {
  depth?: number;
  className?: string;
  children: ReactNode;
}) {
  const translateY = depth * 60;
  const translateZ = depth * 40;
  const scale = 1 + Math.abs(depth) * 0.03;
  const style: CSSProperties = {
    transform: `translate3d(0, calc(var(--p, 0) * ${translateY}px), ${translateZ}px) scale(${scale})`,
    willChange: 'transform',
  };
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function Content({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative z-20 mx-auto flex w-full max-w-md flex-col items-center justify-center px-6 text-center ${className}`}
      style={{
        transform: 'translate3d(0, calc(var(--p, 0) * -20px), 80px)',
      }}
    >
      {children}
    </div>
  );
}

// ───── ornaments ────────────────────────────────────────────────────────

export function Monogram({
  size = 120,
  animated = false,
}: {
  size?: number;
  animated?: boolean;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {animated && (
        <span
          className="absolute inset-0 rounded-full border border-ice-700/40 animate-pulseRing"
          aria-hidden
        />
      )}
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className={animated ? 'animate-spinSlow' : ''}
        style={animated ? { animationDuration: '90s' } : undefined}
        aria-hidden
      >
        <defs>
          <linearGradient id="mgStroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#1BB7A6" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#0A5A56" />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="none"
          stroke="url(#mgStroke)"
          strokeWidth="0.8"
        />
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="url(#mgStroke)"
          strokeWidth="0.4"
          strokeDasharray="2 3"
        />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 60 + Math.cos(a) * 56;
          const y1 = 60 + Math.sin(a) * 56;
          const x2 = 60 + Math.cos(a) * 52;
          const y2 = 60 + Math.sin(a) * 52;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#0B7A75"
              strokeWidth="0.6"
              opacity="0.7"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-baseline gap-1 font-display text-ice-800">
          <span className="text-4xl italic">{COUPLE.brideInitial}</span>
          <span className="font-script text-3xl text-ice-600">&</span>
          <span className="text-4xl italic">{COUPLE.groomInitial}</span>
        </div>
      </div>
    </div>
  );
}

// Corner flourishes — each anchored at the top-left corner (0,0 origin),
// radiating inward. SectionDecor places & orients them around the section.
export type FlourishVariant =
  | 'bloom'
  | 'vine'
  | 'pine'
  | 'tulip'
  | 'berry'
  | 'fern'
  | 'rosette';

function motifBody(variant: FlourishVariant) {
  switch (variant) {
      // floral sprig — sweeping stem, leaves, a bloom + berries
      case 'bloom':
        return (
          <>
            <path
              d="M4 4 C 50 8, 92 26, 110 92"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M4 4 C 30 30, 38 60, 36 104"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeLinecap="round"
              opacity="0.55"
            />
            <g fill="#129E8F" opacity="0.8">
              <path d="M40 12 C 52 6, 64 10, 70 20 C 58 22, 46 20, 40 12 Z" />
              <path d="M78 30 C 92 28, 102 36, 104 48 C 92 46, 82 40, 78 30 Z" />
            </g>
            <g fill="#1BB7A6" opacity="0.75">
              <path d="M16 30 C 8 42, 10 56, 18 64 C 22 52, 22 40, 16 30 Z" />
              <path d="M96 60 C 108 60, 116 70, 116 82 C 104 80, 96 72, 96 60 Z" />
            </g>
            <g stroke="#062A3B" strokeWidth="0.4" opacity="0.5" fill="none">
              <path d="M44 14 L66 19" />
              <path d="M80 32 L101 45" />
              <path d="M17 33 L17 61" />
            </g>
            <g>
              <circle cx="14" cy="14" r="3.6" fill="#1BB7A6" />
              <circle cx="22" cy="13" r="3" fill="#1BB7A6" />
              <circle cx="14" cy="22" r="3" fill="#1BB7A6" />
              <circle cx="20" cy="20" r="2.4" fill="#5FDDCB" />
              <circle cx="17" cy="17" r="2" fill="#A6F0E6" />
            </g>
            <g fill="#5FDDCB" opacity="0.95">
              <circle cx="58" cy="50" r="2.4" />
              <circle cx="64" cy="56" r="2" />
              <circle cx="52" cy="58" r="1.8" />
            </g>
          </>
        );
      // heart-leaf vine — meandering stem with alternating heart leaves
      case 'vine':
        return (
          <>
            <path
              d="M4 4 C 44 18, 24 52, 58 66 C 86 78, 78 104, 110 110"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.8"
            />
            <g fill="#1BB7A6" opacity="0.85">
              <path d="M30 22 C 26 16, 34 14, 36 20 C 38 14, 46 16, 42 22 C 40 27, 36 30, 36 30 C 36 30, 32 27, 30 22 Z" />
              <path d="M56 60 C 52 54, 60 52, 62 58 C 64 52, 72 54, 68 60 C 66 65, 62 68, 62 68 C 62 68, 58 65, 56 60 Z" />
            </g>
            <g fill="#129E8F" opacity="0.8">
              <path d="M40 40 C 50 36, 56 42, 54 50 C 46 50, 40 46, 40 40 Z" />
              <path d="M82 84 C 92 80, 98 86, 96 94 C 88 94, 82 90, 82 84 Z" />
            </g>
            <g fill="#0B7A75" opacity="0.85">
              <circle cx="12" cy="12" r="2.4" />
              <circle cx="74" cy="74" r="2.2" />
              <circle cx="100" cy="100" r="2" />
            </g>
          </>
        );
      // fir / pine sprig — diagonal stalk with needle pairs + berries
      case 'pine':
        return (
          <>
            <path
              d="M3 3 L96 96"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.85"
            />
            <g stroke="#129E8F" strokeWidth="0.8" strokeLinecap="round" opacity="0.8">
              {Array.from({ length: 9 }).map((_, i) => {
                const t = 12 + i * 9;
                return (
                  <g key={i}>
                    <path d={`M${t} ${t} L${t - 16} ${t + 2}`} />
                    <path d={`M${t} ${t} L${t + 2} ${t - 16}`} />
                  </g>
                );
              })}
            </g>
            <g fill="#0B7A75" opacity="0.9">
              <circle cx="20" cy="20" r="2.6" />
              <circle cx="14" cy="26" r="2.2" />
              <circle cx="26" cy="14" r="2.2" />
            </g>
          </>
        );
      // tulip spray — stems from the corner with tulip blooms + leaves
      case 'tulip':
        return (
          <>
            <path
              d="M6 6 C 22 22, 30 44, 26 72"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M14 16 C 34 26, 50 30, 64 44"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* leaves */}
            <g fill="#129E8F" opacity="0.8">
              <path d="M10 30 C 2 44, 6 60, 16 68 C 18 54, 16 40, 10 30 Z" />
              <path d="M38 36 C 50 32, 60 38, 58 48 C 48 48, 40 43, 38 36 Z" />
            </g>
            {/* tulip bloom 1 */}
            <g>
              <path
                d="M18 72 C 18 64, 22 60, 26 60 C 30 60, 34 64, 34 72 C 30 76, 22 76, 18 72 Z"
                fill="#1BB7A6"
              />
              <path
                d="M26 60 L26 72 M22 61 C 20 66, 20 70, 22 73 M30 61 C 32 66, 32 70, 30 73"
                stroke="#062A3B"
                strokeWidth="0.5"
                fill="none"
                opacity="0.5"
              />
            </g>
            {/* tulip bloom 2 */}
            <g>
              <path
                d="M58 44 C 58 38, 61 35, 64 35 C 67 35, 70 38, 70 44 C 67 47, 61 47, 58 44 Z"
                fill="#5FDDCB"
              />
              <path
                d="M64 35 L64 44"
                stroke="#062A3B"
                strokeWidth="0.4"
                fill="none"
                opacity="0.5"
              />
            </g>
          </>
        );
      // berry branch — arched bough with berry clusters + small leaves
      case 'berry':
        return (
          <>
            <path
              d="M3 3 C 40 30, 70 50, 108 70"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M30 22 C 34 36, 30 50, 22 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeLinecap="round"
              opacity="0.55"
            />
            <g fill="#1BB7A6">
              <circle cx="14" cy="12" r="3" />
              <circle cx="21" cy="16" r="3" />
              <circle cx="17" cy="22" r="2.6" />
              <circle cx="58" cy="40" r="2.8" />
              <circle cx="64" cy="44" r="2.6" />
              <circle cx="60" cy="48" r="2.4" />
              <circle cx="96" cy="62" r="2.6" />
              <circle cx="102" cy="66" r="2.4" />
            </g>
            <g fill="#129E8F" opacity="0.8">
              <path d="M40 26 C 52 22, 60 28, 58 38 C 48 38, 40 33, 40 26 Z" />
              <path d="M74 50 C 86 46, 94 52, 92 62 C 82 62, 74 57, 74 50 Z" />
            </g>
          </>
        );
      // fern frond — curved spine with many paired leaflets
      case 'fern':
        return (
          <>
            <path
              d="M3 3 C 30 28, 44 64, 50 110"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.8"
            />
            <g stroke="#129E8F" strokeWidth="0.7" strokeLinecap="round" opacity="0.8" fill="none">
              {Array.from({ length: 10 }).map((_, i) => {
                const x = 5 + i * 4.6;
                const y = 6 + i * 10.4;
                const len = 22 - i * 1.4;
                return (
                  <g key={i}>
                    <path d={`M${x} ${y} q ${len * 0.6} ${-len * 0.5} ${len} ${-len * 0.2}`} />
                    <path d={`M${x} ${y} q ${-len * 0.5} ${len * 0.6} ${-len * 0.2} ${len}`} />
                  </g>
                );
              })}
            </g>
            <circle cx="10" cy="9" r="2.4" fill="#0B7A75" />
          </>
        );
      // peony rosette — layered petal arcs forming a bloom + a leaf
      case 'rosette':
        return (
          <>
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              opacity="0.8"
            >
              {[10, 18, 26].map((r) => (
                <circle key={r} cx="18" cy="18" r={r} />
              ))}
            </g>
            <g fill="#5FDDCB" opacity="0.85">
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                const cx = 18 + Math.cos(a) * 14;
                const cy = 18 + Math.sin(a) * 14;
                return <circle key={i} cx={cx} cy={cy} r="4.2" />;
              })}
            </g>
            <g fill="#5FDDCB">
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i / 6) * Math.PI * 2;
                const cx = 18 + Math.cos(a) * 7;
                const cy = 18 + Math.sin(a) * 7;
                return <circle key={i} cx={cx} cy={cy} r="3" />;
              })}
            </g>
            <circle cx="18" cy="18" r="3.4" fill="#A6F0E6" />
            <path
              d="M40 40 C 64 48, 84 70, 96 104 C 70 92, 50 70, 40 40 Z"
              fill="#129E8F"
              opacity="0.5"
            />
            <path
              d="M44 46 C 64 60, 80 80, 92 100"
              stroke="#062A3B"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
          </>
        );
  }
}

// A single corner ornament built from layered motifs. Each layer carries an
// optional transform (t) and opacity (o) so motifs fan out into one bouquet.
export type FlourishLayer = { v: FlourishVariant; t?: string; o?: number };

function CornerFlourish({ layers }: { layers: FlourishLayer[] }) {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      {layers.map((l, i) => (
        <g key={i} transform={l.t} opacity={l.o}>
          {motifBody(l.v)}
        </g>
      ))}
    </svg>
  );
}

// A single ornament scattered somewhere in a section. `pos` anchors it (edge
// offsets), `flip` orients the motif, `reveal` is its entrance transition and
// `idle` its resting drift. Each one animates independently.
export type Decoration = {
  layers: FlourishLayer[];
  pos: CSSProperties;
  size: number;
  flip?: string;
  reveal: string;
  idle?: string;
  delay?: number;
};

export function SectionDecor({ items }: { items: Decoration[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 text-ice-700"
    >
      {items.map((d, i) => (
        // outer: position + entrance transition (transform cleared on reveal)
        <div
          key={i}
          className={`absolute ${d.reveal}`}
          style={{ ...d.pos, ['--reveal-delay' as any]: `${d.delay ?? 0}ms` }}
        >
          {/* middle: static flip — kept off the reveal/idle layers so their
              transforms don't clobber it */}
          <div style={{ width: d.size, height: d.size, transform: d.flip }}>
            {/* inner: idle drift */}
            <div
              className={d.idle}
              style={{ width: '100%', height: '100%' }}
            >
              <CornerFlourish layers={d.layers} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrnamentDivider({ width = 220 }: { width?: number }) {
  return (
    <svg viewBox="0 0 220 16" width={width} className="text-ice-700" aria-hidden>
      <line x1="2" x2="88" y1="8" y2="8" stroke="currentColor" strokeWidth="0.5" />
      <line x1="132" x2="218" y1="8" y2="8" stroke="currentColor" strokeWidth="0.5" />
      <path
        d="M88 8 L98 4 M88 8 L98 12"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
      />
      <path
        d="M132 8 L122 4 M132 8 L122 12"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
      />
      <circle cx="110" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="110" cy="8" r="1.3" fill="currentColor" />
      <circle cx="98" cy="8" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="122" cy="8" r="1" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function SectionLabel({
  numeral,
  title,
}: {
  numeral: string;
  title: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 text-ice-700">
      <span className="h-px w-10 bg-ice-700/40" />
      <span className="font-script text-xl text-ice-600">{numeral}</span>
      <span className="font-body text-[10px] uppercase tracking-[0.5em]">{title}</span>
      <span className="h-px w-10 bg-ice-700/40" />
    </div>
  );
}

export function ScrollCue() {
  return (
    <div className="flex flex-col items-center gap-2 text-ice-700/80">
      <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
      <div className="relative h-9 w-5 rounded-full border border-ice-700/50">
        <span className="absolute left-1/2 top-2 block h-1.5 w-1 -translate-x-1/2 rounded-full bg-ice-700 animate-scrollDot" />
      </div>
    </div>
  );
}

export function Snowflake({
  delay = 0,
  left = '50%',
  size = 8,
}: {
  delay?: number;
  left?: string;
  size?: number;
}) {
  return (
    <span
      className="absolute top-1/4 block rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-float"
      style={{
        left,
        width: size,
        height: size,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export function PineTree({
  left = '50%',
  bottom = '0%',
  size = 90,
  opacity = 0.5,
  delay = 0,
  variant = 'mid',
}: {
  left?: string;
  bottom?: string;
  size?: number;
  opacity?: number;
  delay?: number;
  variant?: 'far' | 'mid' | 'near';
}) {
  const palette: Record<string, [string, string, string, string]> = {
    far: ['#A6F0E6', '#5FDDCB', '#1BB7A6', '#0A5A56'],
    mid: ['#5FDDCB', '#1BB7A6', '#129E8F', '#062A3B'],
    near: ['#1BB7A6', '#129E8F', '#0B7A75', '#041A26'],
  };
  const [c1, c2, c3, trunk] = palette[variant];
  return (
    <svg
      viewBox="0 0 60 100"
      className={variant === 'near' ? 'animate-sway' : 'animate-swayslow'}
      style={{
        position: 'absolute',
        left,
        bottom,
        width: size,
        height: size * 1.6,
        transform: 'translateX(-50%)',
        transformOrigin: 'bottom center',
        opacity,
        animationDelay: `${delay}s`,
      }}
      aria-hidden
    >
      <rect x="27" y="80" width="6" height="20" rx="1" fill={trunk} />
      <polygon points="30,8 10,48 50,48" fill={c1} />
      <polygon points="30,28 8,62 52,62" fill={c2} />
      <polygon points="30,48 5,85 55,85" fill={c3} />
    </svg>
  );
}

// Darker companion shade per petal colour — used as the petal-tip / canopy-base
// gradient stop so flowers read with depth instead of looking flat.
const EDGE: Record<string, string> = {
  '#A6F0E6': '#5FDDCB',
  '#5FDDCB': '#1BB7A6',
  '#1BB7A6': '#0B7A75',
  '#129E8F': '#0A5A56',
  '#0B7A75': '#0A5A56',
  '#FFFFFF': '#A6F0E6',
};
const edgeOf = (c: string) => EDGE[c] ?? c;
// safe SVG id from arbitrary prop strings (left "8%" → "8")
const idOf = (s: string) => s.replace(/[^a-z0-9]/gi, '');

// A single realistic flower: teardrop petals with a white→colour→tip gradient
// (so the centre looks lit and the rim saturated) around a stamen cluster.
function Floret({
  cx,
  cy,
  r,
  petal,
  edge,
  core = '#A6F0E6',
  petals = 6,
  id,
}: {
  cx: number;
  cy: number;
  r: number;
  petal: string;
  edge?: string;
  core?: string;
  petals?: number;
  id: string;
}) {
  const L = r;
  const W = r * 0.44;
  const path = `M0 0 C ${-W} ${-L * 0.45} ${-W * 0.55} ${-L} 0 ${-L} C ${W * 0.55} ${-L} ${W} ${-L * 0.45} 0 0 Z`;
  const tip = edge ?? edgeOf(petal);
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
          <stop offset="42%" stopColor={petal} />
          <stop offset="100%" stopColor={tip} />
        </linearGradient>
      </defs>
      {Array.from({ length: petals }).map((_, i) => (
        <path
          key={i}
          d={path}
          fill={`url(#${id})`}
          transform={`rotate(${(i / petals) * 360})`}
          opacity="0.96"
        />
      ))}
      <circle r={r * 0.26} fill={core} />
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={Math.cos(a) * r * 0.13}
            cy={Math.sin(a) * r * 0.13}
            r={r * 0.05}
            fill="#062A3B"
          />
        );
      })}
    </g>
  );
}

// Broadleaf / blossom tree — brown trunk with a rounded colourful canopy and
// scattered blossom flecks. The canopy colour is what makes the grove colourful.
export function BlossomTree({
  left = '50%',
  bottom = '0%',
  size = 90,
  opacity = 0.6,
  delay = 0,
  canopy = '#5FDDCB',
  accent = '#FFFFFF',
  trunk = '#062A3B',
}: {
  left?: string;
  bottom?: string;
  size?: number;
  opacity?: number;
  delay?: number;
  canopy?: string;
  accent?: string;
  trunk?: string;
}) {
  const cid = `can${idOf(left)}${idOf(String(size))}`;
  // blossom positions across the canopy [cx, cy] — thinned on mobile
  const blossoms = (
    [
      [22, 30],
      [38, 27],
      [30, 40],
      [14, 46],
      [46, 45],
      [27, 21],
      [41, 55],
      [18, 57],
      [33, 52],
    ] as [number, number][]
  ).slice(0, LITE ? 4 : 9);
  return (
    <svg
      viewBox="0 0 60 100"
      className="animate-swayslow"
      style={{
        position: 'absolute',
        left,
        bottom,
        width: size,
        height: size * 1.5,
        transform: 'translateX(-50%)',
        transformOrigin: 'bottom center',
        opacity,
        animationDelay: `${delay}s`,
      }}
      aria-hidden
    >
      <defs>
        <radialGradient id={cid} cx="42%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="38%" stopColor={canopy} />
          <stop offset="100%" stopColor={edgeOf(canopy)} />
        </radialGradient>
      </defs>
      <rect x="27.5" y="58" width="5" height="42" rx="2.5" fill={trunk} />
      <path
        d="M30 78 C 26 70, 22 66, 18 62 M30 74 C 34 68, 39 65, 43 62"
        stroke={trunk}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* layered canopy with a soft top-lit gradient */}
      <g fill={`url(#${cid})`}>
        <circle cx="30" cy="32" r="21" />
        <circle cx="14" cy="46" r="15" />
        <circle cx="46" cy="46" r="15" />
        <circle cx="30" cy="50" r="18" />
      </g>
      {/* realistic blossoms dotted across the foliage */}
      {blossoms.map(([cx, cy], i) => (
        <Floret
          key={i}
          cx={cx}
          cy={cy}
          r={3.4}
          petal={accent}
          core="#A6F0E6"
          petals={5}
          id={`${cid}b${i}`}
        />
      ))}
    </svg>
  );
}

// Low flowering shrub for the foreground — a green mound dotted with blooms.
export function FlowerBush({
  left = '50%',
  bottom = '0%',
  size = 48,
  opacity = 0.75,
  delay = 0,
  leaf = '#129E8F',
  bloom = '#1BB7A6',
  bloom2 = '#A6F0E6',
}: {
  left?: string;
  bottom?: string;
  size?: number;
  opacity?: number;
  delay?: number;
  leaf?: string;
  bloom?: string;
  bloom2?: string;
}) {
  const bid = `bush${idOf(left)}${idOf(String(size))}`;
  const flowers = (
    [
      [10, 15, bloom],
      [22, 9, bloom2],
      [30, 16, bloom],
      [16, 21, bloom2],
      [27, 23, bloom],
    ] as [number, number, string][]
  ).slice(0, LITE ? 3 : 5);
  return (
    <svg
      viewBox="0 0 40 30"
      className="animate-sway"
      style={{
        position: 'absolute',
        left,
        bottom,
        width: size,
        height: size * 0.75,
        transform: 'translateX(-50%)',
        transformOrigin: 'bottom center',
        opacity,
        animationDelay: `${delay}s`,
      }}
      aria-hidden
    >
      <g fill={leaf}>
        <circle cx="12" cy="22" r="10" />
        <circle cx="24" cy="22" r="11" />
        <circle cx="32" cy="24" r="8" />
        <circle cx="6" cy="26" r="7" />
      </g>
      <g fill={edgeOf(leaf)} opacity="0.4">
        <circle cx="14" cy="26" r="6" />
        <circle cx="27" cy="27" r="6" />
      </g>
      <g>
        {flowers.map(([cx, cy, c], i) => (
          <Floret
            key={i}
            cx={cx}
            cy={cy}
            r={3.6}
            petal={c}
            core="#A6F0E6"
            petals={6}
            id={`${bid}f${i}`}
          />
        ))}
      </g>
    </svg>
  );
}

export function Flower({
  left,
  top,
  size = 22,
  delay = 0,
  duration = 18,
  petal = '#1BB7A6',
  core = '#A6F0E6',
  petals = 6,
}: {
  left: string;
  top?: string;
  size?: number;
  delay?: number;
  duration?: number;
  petal?: string;
  core?: string;
  petals?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="animate-fall"
      style={{
        position: 'absolute',
        left,
        top: top ?? '-10vh',
        width: size,
        height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        filter: 'drop-shadow(0 2px 4px rgba(6,42,59,0.28))',
      }}
      aria-hidden
    >
      <Floret
        cx={12}
        cy={12}
        r={10}
        petal={petal}
        core={core}
        petals={petals}
        id={`fall${idOf(left)}${idOf(String(delay))}`}
      />
    </svg>
  );
}

export function Leaf({
  left,
  top,
  size = 18,
  delay = 0,
  duration = 22,
  rotate = 0,
}: {
  left: string;
  top?: string;
  size?: number;
  delay?: number;
  duration?: number;
  rotate?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="animate-fall"
      style={{
        position: 'absolute',
        left,
        top: top ?? '-10vh',
        width: size,
        height: size * 0.7,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        transform: `rotate(${rotate}deg)`,
      }}
      aria-hidden
    >
      <path
        d="M2 12 C2 4, 22 4, 22 12 C22 20, 2 20, 2 12 Z"
        fill="#129E8F"
        opacity="0.85"
      />
      <path d="M2 12 L22 12" stroke="#062A3B" strokeWidth="0.6" />
    </svg>
  );
}

// ───── background layers ────────────────────────────────────────────────

function AmbientForest() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[-15] h-[55vh]"
      style={{
        transform: 'translate3d(0, calc(var(--scroll, 0) * -6vh), 0)',
        willChange: 'transform',
      }}
    >
      {/* far layer — distant pines + soft blossom trees (skipped on mobile) */}
      {!LITE && (
        <>
          <PineTree left="6%" size={70} variant="far" opacity={0.4} delay={0} />
          <BlossomTree left="18%" size={66} opacity={0.35} delay={1.2} canopy="#A6F0E6" accent="#FFFFFF" />
          <PineTree left="32%" size={80} variant="far" opacity={0.45} delay={0.6} />
          <BlossomTree left="48%" size={70} opacity={0.4} delay={2.0} canopy="#5FDDCB" accent="#A6F0E6" />
          <PineTree left="62%" size={75} variant="far" opacity={0.45} delay={0.9} />
          <BlossomTree left="78%" size={64} opacity={0.35} delay={1.5} canopy="#5FDDCB" accent="#FFFFFF" />
          <PineTree left="92%" size={72} variant="far" opacity={0.4} delay={0.3} />
        </>
      )}

      {/* mid layer — colourful flowering trees */}
      <BlossomTree left="10%" size={120} opacity={0.7} delay={0.4} canopy="#1BB7A6" accent="#A6F0E6" />
      <PineTree left="28%" size={130} variant="mid" opacity={0.72} delay={1.7} />
      <BlossomTree left="55%" size={128} opacity={0.7} delay={0.8} canopy="#5FDDCB" accent="#FFFFFF" />
      {!LITE && (
        <BlossomTree left="80%" size={118} opacity={0.7} delay={2.3} canopy="#5FDDCB" accent="#A6F0E6" />
      )}

      {/* near layer — bold canopy + a couple of pines for depth */}
      <BlossomTree left="-4%" size={188} opacity={0.95} delay={0.2} canopy="#1BB7A6" accent="#A6F0E6" />
      <PineTree left="40%" size={170} variant="near" opacity={0.95} delay={1.1} />
      <BlossomTree left="100%" size={196} opacity={0.95} delay={0.6} canopy="#5FDDCB" accent="#FFFFFF" />

      {/* foreground flowering shrubs */}
      <FlowerBush left="14%" size={58} opacity={0.9} delay={0.5} bloom="#1BB7A6" bloom2="#A6F0E6" />
      <FlowerBush left="60%" size={62} opacity={0.9} delay={0.9} bloom="#5FDDCB" bloom2="#5FDDCB" />
      {!LITE && (
        <>
          <FlowerBush left="34%" size={48} opacity={0.85} delay={1.4} bloom="#1BB7A6" bloom2="#A6F0E6" />
          <FlowerBush left="86%" size={52} opacity={0.85} delay={1.8} bloom="#1BB7A6" bloom2="#A6F0E6" />
        </>
      )}
    </div>
  );
}

function AmbientPetals() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-10] overflow-hidden"
    >
      <Flower left="8%" delay={0} duration={20} size={22} petal="#1BB7A6" core="#A6F0E6" />
      <Flower left="38%" delay={3} duration={22} size={26} petal="#5FDDCB" core="#A6F0E6" />
      <Flower left="70%" delay={1.5} duration={21} size={24} petal="#1BB7A6" core="#FFFFFF" />
      <Leaf left="14%" delay={2} duration={26} size={20} rotate={20} />
      <Leaf left="78%" delay={4} duration={28} size={24} rotate={35} />
      {!LITE && (
        <>
          <Flower left="22%" delay={6} duration={24} size={18} petal="#5FDDCB" core="#FFFFFF" />
          <Flower left="55%" delay={9} duration={26} size={20} petal="#1BB7A6" core="#A6F0E6" />
          <Flower left="85%" delay={11} duration={25} size={18} petal="#A6F0E6" core="#FFFFFF" />
          <Leaf left="48%" delay={7} duration={24} size={22} rotate={-15} />
          <Leaf left="92%" delay={10} duration={23} size={18} rotate={-25} />
        </>
      )}
    </div>
  );
}

function AuroraGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-30] overflow-hidden"
    >
      <div
        className={`absolute left-[15%] top-[10%] h-[45vh] w-[45vh] rounded-full bg-[#1BB7A6] opacity-40 animate-aurora ${
          LITE ? 'blur-2xl' : 'blur-3xl'
        }`}
      />
      <div
        className={`absolute right-[8%] top-[36%] h-[55vh] w-[55vh] rounded-full bg-[#A6F0E6] opacity-35 animate-aurora ${
          LITE ? 'blur-2xl' : 'blur-3xl'
        }`}
        style={{ animationDelay: '-9s' }}
      />
      {!LITE && (
        <>
          <div
            className="absolute bottom-[8%] left-[26%] h-[42vh] w-[42vh] rounded-full bg-[#A6F0E6] opacity-35 blur-3xl animate-aurora"
            style={{ animationDelay: '-15s' }}
          />
          <div
            className="absolute right-[24%] bottom-[28%] h-[34vh] w-[34vh] rounded-full bg-[#5FDDCB] opacity-30 blur-3xl animate-aurora"
            style={{ animationDelay: '-5s' }}
          />
        </>
      )}
    </div>
  );
}

function BokehLights() {
  const orbs = useMemo(
    () => [
      { x: '10%', y: '20%', s: 60, d: 0, dur: 9 },
      { x: '80%', y: '30%', s: 40, d: 2, dur: 11 },
      { x: '25%', y: '70%', s: 50, d: 4, dur: 12 },
      { x: '70%', y: '80%', s: 80, d: 1, dur: 10 },
      { x: '50%', y: '15%', s: 30, d: 3, dur: 13 },
      { x: '90%', y: '60%', s: 35, d: 5, dur: 14 },
      { x: '15%', y: '45%', s: 45, d: 6, dur: 12 },
      { x: '60%', y: '50%', s: 28, d: 7, dur: 10 },
    ],
    [],
  );
  if (LITE) return null; // bokeh blur is a paint hog on phones
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-20] overflow-hidden"
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/60 blur-2xl animate-bokeh"
          style={{
            left: o.x,
            top: o.y,
            width: o.s,
            height: o.s,
            animationDelay: `-${o.d}s`,
            animationDuration: `${o.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ContinuousBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[-40] bg-[linear-gradient(180deg,#F2F7F6_0%,#E3F3F0_18%,#A6F0E6_36%,#5FDDCB_55%,#1BB7A6_72%,#5FDDCB_88%,#E3F3F0_100%)]"
      />
      <AuroraGlow />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[-25]"
        style={{
          background:
            'radial-gradient(ellipse at 50% calc(50% - var(--scroll, 0) * 60vh), rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)',
          transform: 'translate3d(0, calc(var(--scroll, 0) * -8vh), 0)',
          willChange: 'transform',
        }}
      />
      <BokehLights />
      <AmbientForest />
      <AmbientPetals />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(6,42,59,0.22) 100%)',
        }}
      />
    </>
  );
}

// ───── opening gate ─────────────────────────────────────────────────────

export function OpeningGate({ onOpen }: { onOpen: () => void }) {
  const [state, setState] = useState<'idle' | 'breaking' | 'closed'>('idle');
  if (state === 'closed') return null;
  const start = () => {
    if (state !== 'idle') return;
    setState('breaking');
    onOpen();
  };
  const breaking = state === 'breaking';
  return (
    <>
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[linear-gradient(180deg,#F2F7F6_0%,#A6F0E6_50%,#1BB7A6_100%)] transition-opacity duration-[1200ms] ${
          breaking ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Snowflake left="12%" size={4} delay={0} />
          <Snowflake left="28%" size={6} delay={1.2} />
          <Snowflake left="48%" size={5} delay={0.7} />
          <Snowflake left="68%" size={4} delay={1.9} />
          <Snowflake left="86%" size={6} delay={0.3} />
        </div>

        <div className="relative flex flex-col items-center px-8 text-center">
          <p className="font-body text-[10px] uppercase tracking-[0.5em] text-ice-700">
            You are cordially invited
          </p>
          <div className="mt-6 animate-sealIdle">
            <Monogram size={150} animated />
          </div>
          <p className="mt-6 font-script text-5xl leading-none text-ice-800">
            {COUPLE.bride} & {COUPLE.groom}
          </p>
          <div className="mt-4">
            <OrnamentDivider width={200} />
          </div>
          <p className="mt-4 font-display text-sm tracking-[0.4em] text-ice-700">
            {COUPLE.dateShort}
          </p>
          <p className="mt-1 text-[11px] tracking-[0.3em] text-ice-700/80">
            {COUPLE.location}
          </p>
          <button
            onClick={start}
            disabled={breaking}
            className="group relative mt-12 overflow-hidden rounded-full bg-ice-800 px-10 py-3.5 font-body text-xs uppercase tracking-[0.4em] text-white shadow-ice transition-all active:scale-95 hover:bg-ice-900 disabled:opacity-60"
          >
            <span className="relative z-10">Open Invitation</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </button>
        </div>
      </div>
      {breaking && (
        <Suspense fallback={null}>
          <CrystalTransition onDone={() => setState('closed')} />
        </Suspense>
      )}
    </>
  );
}

// ───── interactive sparkle trail ────────────────────────────────────────

type Sparkle = { id: number; x: number; y: number };

export function SparkleTrail() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef(0);
  const hostRef = useRef<HTMLDivElement>(null);

  const spawn = (clientX: number, clientY: number) => {
    const host = hostRef.current;
    if (!host) return;
    const now = performance.now();
    if (now - lastRef.current < 45) return;
    lastRef.current = now;
    const rect = host.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = idRef.current++;
    setSparkles((prev) => [...prev.slice(-14), { id, x, y }]);
    window.setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 950);
  };

  return (
    <div
      ref={hostRef}
      className="pointer-events-auto absolute inset-0 z-[1]"
      onPointerMove={(e) => spawn(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) spawn(t.clientX, t.clientY);
      }}
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="pointer-events-none absolute animate-sparkle"
          style={{
            left: s.x,
            top: s.y,
            width: 10,
            height: 10,
          }}
          aria-hidden
        >
          <svg viewBox="0 0 20 20" width="10" height="10">
            <path
              d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
              fill="#fff"
              opacity="0.95"
              style={{ filter: 'drop-shadow(0 0 4px #5FDDCB)' }}
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

// ───── nav ──────────────────────────────────────────────────────────────

export function Nav({
  active,
  sections,
  onGo,
  visible,
}: {
  active: string;
  sections: readonly string[];
  onGo: (id: string) => void;
  visible: boolean;
}) {
  return (
    <nav
      className={`pointer-events-none fixed right-4 top-1/2 z-50 -translate-y-1/2 transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <ul className="pointer-events-auto flex flex-col gap-3">
        {sections.map((id) => (
          <li key={id}>
            <button
              aria-label={`Go to ${id}`}
              onClick={() => onGo(id)}
              className={`block h-2 w-2 rounded-full transition-all duration-500 ease-in-out ${
                active === id
                  ? 'h-6 bg-ice-700 shadow-ice'
                  : 'bg-ice-400/70 hover:bg-ice-600'
              }`}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
