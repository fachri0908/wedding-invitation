import { CSSProperties } from 'react';
import { Floret, LITE } from './components';

// ───── origami bird ───────────────────────────────────────────────────────

export function OrigamiBird({ size = 46 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 46 30"
      width={size}
      height={(size * 30) / 46}
      aria-hidden
      style={{ overflow: 'visible' }}
    >
      {/* tail */}
      <path d="M2 13 L15 9 L15 19 Z" fill="#0B7A75" />
      {/* body (folded paper) */}
      <path d="M15 7 L35 14 L15 23 L19 14 Z" fill="#1BB7A6" />
      {/* head + beak */}
      <path d="M35 14 L44 11 L37 17 Z" fill="#129E8F" />
      {/* upper wing — flaps */}
      <g
        className="animate-wingFlap"
        style={{ transformOrigin: '20px 14px', transformBox: 'fill-box' } as CSSProperties}
      >
        <path d="M18 13 L31 1 L27 15 Z" fill="#A6F0E6" />
        <path d="M18 13 L31 1 L27 15 Z" fill="#5FDDCB" opacity="0.5" />
      </g>
      {/* fold/spine line */}
      <path d="M15 7 L19 14 L15 23" stroke="#0B7A75" strokeWidth="0.6" fill="none" opacity="0.6" />
    </svg>
  );
}

// staggered flock that arcs across the viewport once
function BirdsTransition({ dir }: { dir: 1 | -1 }) {
  const n = LITE ? 3 : 6;
  const birds = Array.from({ length: n }).map((_, i) => {
    const t = n > 1 ? i / (n - 1) : 0;
    return {
      by0: `${20 + t * 50}vh`,
      bymid: `${14 + t * 46}vh`,
      by1: `${24 + t * 48}vh`,
      bs: 0.55 + ((i * 37) % 60) / 100, // 0.55–1.15, deterministic
      brot: dir > 0 ? `${6 + (i % 3) * 4}deg` : `${-6 - (i % 3) * 4}deg`,
      delay: i * 120,
      size: 38 + ((i * 53) % 26),
    };
  });
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
      style={{ transform: dir < 0 ? 'scaleX(-1)' : undefined }}
    >
      {birds.map((b, i) => (
        <div
          key={i}
          className="absolute left-0 top-0 animate-birdCross"
          style={
            {
              '--by0': b.by0,
              '--bymid': b.bymid,
              '--by1': b.by1,
              '--bs': b.bs,
              '--brot': b.brot,
              '--bx0': '-30vw',
              '--bx1': '130vw',
              animationDelay: `${b.delay}ms`,
              filter: 'drop-shadow(0 6px 10px rgba(6,42,59,0.25))',
            } as CSSProperties
          }
        >
          <OrigamiBird size={b.size} />
        </div>
      ))}
    </div>
  );
}

// ───── petal / leaf sweep ──────────────────────────────────────────────────

const SWEEP_COLORS = ['#1BB7A6', '#5FDDCB', '#A6F0E6', '#0B7A75'];

function Petal({ color }: { color: string }) {
  // a single teardrop petal
  return (
    <svg viewBox="0 0 16 22" width="16" height="22" aria-hidden>
      <path
        d="M8 0 C 1 7, 1 16, 8 22 C 15 16, 15 7, 8 0 Z"
        fill={color}
        opacity="0.92"
      />
      <path d="M8 3 L8 19" stroke="#062A3B" strokeWidth="0.5" opacity="0.3" fill="none" />
    </svg>
  );
}

function PetalSweep({ dir }: { dir: 1 | -1 }) {
  const n = LITE ? 9 : 16;
  const items = Array.from({ length: n }).map((_, i) => {
    const t = i / n;
    const flower = i % 4 === 0;
    return {
      sy0: `${(t * 110 - 5).toFixed(0)}vh`,
      sy1: `${(t * 110 - 5 + dir * (18 + (i % 3) * 8)).toFixed(0)}vh`,
      srot: `${(dir > 0 ? 1 : -1) * (220 + (i % 5) * 60)}deg`,
      delay: i * 70,
      scale: 0.6 + ((i * 29) % 70) / 100,
      color: SWEEP_COLORS[i % SWEEP_COLORS.length],
      flower,
    };
  });
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      {items.map((s, i) => (
        <div
          key={i}
          className="absolute left-0 top-0 animate-sweepAcross"
          style={
            {
              '--sx0': '-15vw',
              '--sx1': '120vw',
              '--sy0': s.sy0,
              '--sy1': s.sy1,
              '--srot': s.srot,
              animationDelay: `${s.delay}ms`,
              transform: `scale(${s.scale})`,
            } as CSSProperties
          }
        >
          {s.flower ? (
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
              <Floret cx={12} cy={12} r={10} petal={s.color} core="#A6F0E6" petals={6} id={`sw${i}`} />
            </svg>
          ) : (
            <Petal color={s.color} />
          )}
        </div>
      ))}
    </div>
  );
}

// ───── dispatcher ───────────────────────────────────────────────────────────

export type Trigger = { key: number; dir: 1 | -1; kind: 'birds' | 'petals' } | null;

export function SectionTransition({ trigger }: { trigger: Trigger }) {
  if (!trigger) return null;
  // keyed so each advance remounts and replays the one-shot animation
  return trigger.kind === 'birds' ? (
    <BirdsTransition key={trigger.key} dir={trigger.dir} />
  ) : (
    <PetalSweep key={trigger.key} dir={trigger.dir} />
  );
}
