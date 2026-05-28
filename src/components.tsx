import {
  CSSProperties,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { COUPLE } from './constants';
import { RevealContext } from './RevealContext';

// ───── primitives ───────────────────────────────────────────────────────

export function Section({
  id,
  className = '',
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const revealed = useContext(RevealContext);
  return (
    <section
      id={id}
      data-section
      data-revealed={revealed.has(id) ? 'true' : 'false'}
      className={`relative flex h-[100dvh] w-full items-center justify-center overflow-hidden preserve-3d ${className}`}
      style={{ ['--p' as any]: 0 } as CSSProperties}
    >
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
            <stop offset="0%" stopColor="#7CC3DC" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#2C6E88" />
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
              stroke="#3B8FAE"
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

// ───── flora ────────────────────────────────────────────────────────────

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
    far: ['#CCE9F5', '#A8D8EA', '#7CC3DC', '#7CC3DC'],
    mid: ['#A8D8EA', '#7CC3DC', '#4FAECF', '#3B8FAE'],
    near: ['#7CC3DC', '#4FAECF', '#3B8FAE', '#2C6E88'],
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

export function Flower({
  left,
  top,
  size = 22,
  delay = 0,
  duration = 18,
}: {
  left: string;
  top?: string;
  size?: number;
  delay?: number;
  duration?: number;
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
        filter: 'drop-shadow(0 2px 4px rgba(60,120,160,0.25))',
      }}
      aria-hidden
    >
      <g>
        <circle cx="12" cy="6" r="4" fill="#A8D8EA" />
        <circle cx="6" cy="12" r="4" fill="#7CC3DC" />
        <circle cx="18" cy="12" r="4" fill="#7CC3DC" />
        <circle cx="12" cy="18" r="4" fill="#A8D8EA" />
        <circle cx="12" cy="12" r="3" fill="#fff" />
      </g>
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
        fill="#4FAECF"
        opacity="0.85"
      />
      <path d="M2 12 L22 12" stroke="#1E4E62" strokeWidth="0.6" />
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
      <PineTree left="6%" size={70} variant="far" opacity={0.45} delay={0} />
      <PineTree left="18%" size={60} variant="far" opacity={0.45} delay={1.2} />
      <PineTree left="32%" size={80} variant="far" opacity={0.5} delay={0.6} />
      <PineTree left="48%" size={65} variant="far" opacity={0.5} delay={2.0} />
      <PineTree left="62%" size={75} variant="far" opacity={0.5} delay={0.9} />
      <PineTree left="78%" size={68} variant="far" opacity={0.45} delay={1.5} />
      <PineTree left="92%" size={72} variant="far" opacity={0.45} delay={0.3} />

      <PineTree left="10%" size={110} variant="mid" opacity={0.7} delay={0.4} />
      <PineTree left="28%" size={130} variant="mid" opacity={0.75} delay={1.7} />
      <PineTree left="55%" size={120} variant="mid" opacity={0.7} delay={0.8} />
      <PineTree left="80%" size={115} variant="mid" opacity={0.72} delay={2.3} />

      <PineTree left="-4%" size={180} variant="near" opacity={0.95} delay={0.2} />
      <PineTree left="40%" size={170} variant="near" opacity={0.95} delay={1.1} />
      <PineTree left="100%" size={190} variant="near" opacity={0.95} delay={0.6} />
    </div>
  );
}

function AmbientPetals() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-10] overflow-hidden"
    >
      <Flower left="8%" delay={0} duration={20} size={22} />
      <Flower left="22%" delay={6} duration={24} size={18} />
      <Flower left="38%" delay={3} duration={22} size={26} />
      <Flower left="55%" delay={9} duration={26} size={20} />
      <Flower left="70%" delay={1.5} duration={21} size={24} />
      <Flower left="85%" delay={11} duration={25} size={18} />
      <Leaf left="14%" delay={2} duration={26} size={20} rotate={20} />
      <Leaf left="48%" delay={7} duration={24} size={22} rotate={-15} />
      <Leaf left="78%" delay={4} duration={28} size={24} rotate={35} />
      <Leaf left="92%" delay={10} duration={23} size={18} rotate={-25} />
    </div>
  );
}

function AuroraGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-30] overflow-hidden"
    >
      <div className="absolute left-[15%] top-[10%] h-[45vh] w-[45vh] rounded-full bg-[#7CC3DC] opacity-40 blur-3xl animate-aurora" />
      <div
        className="absolute right-[8%] top-[40%] h-[55vh] w-[55vh] rounded-full bg-[#A8D8EA] opacity-30 blur-3xl animate-aurora"
        style={{ animationDelay: '-9s' }}
      />
      <div
        className="absolute bottom-[10%] left-[28%] h-[40vh] w-[40vh] rounded-full bg-[#CCE9F5] opacity-40 blur-3xl animate-aurora"
        style={{ animationDelay: '-15s' }}
      />
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
        className="pointer-events-none fixed inset-0 z-[-40] bg-[linear-gradient(180deg,#F5FBFD_0%,#E6F4FA_18%,#CCE9F5_36%,#A8D8EA_55%,#7CC3DC_72%,#A8D8EA_88%,#E6F4FA_100%)]"
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
            'radial-gradient(ellipse at center, transparent 55%, rgba(30,60,90,0.18) 100%)',
        }}
      />
    </>
  );
}

// ───── opening gate ─────────────────────────────────────────────────────

function PetalBurst() {
  const petals = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 160 + Math.random() * 160;
        return {
          bx: Math.cos(angle) * dist,
          by: Math.sin(angle) * dist,
          br: (Math.random() * 540 - 270).toFixed(0),
          delay: Math.random() * 120,
          hue: i % 2 === 0 ? '#A8D8EA' : '#7CC3DC',
          size: 10 + Math.random() * 10,
        };
      }),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0">
      {petals.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute left-1/2 top-1/2 animate-petalBurst"
          style={
            {
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}ms`,
              ['--bx' as any]: `${p.bx}px`,
              ['--by' as any]: `${p.by}px`,
              ['--br' as any]: `${p.br}deg`,
            } as CSSProperties
          }
          aria-hidden
        >
          <g>
            <circle cx="12" cy="6" r="4" fill={p.hue} />
            <circle cx="6" cy="12" r="4" fill={p.hue} opacity="0.85" />
            <circle cx="18" cy="12" r="4" fill={p.hue} opacity="0.85" />
            <circle cx="12" cy="18" r="4" fill={p.hue} />
            <circle cx="12" cy="12" r="3" fill="#fff" />
          </g>
        </svg>
      ))}
    </div>
  );
}

export function OpeningGate({ onOpen }: { onOpen: () => void }) {
  const [state, setState] = useState<'idle' | 'breaking' | 'opening' | 'closed'>(
    'idle',
  );
  if (state === 'closed') return null;
  const start = () => {
    if (state !== 'idle') return;
    setState('breaking');
    window.setTimeout(() => {
      setState('opening');
      onOpen();
    }, 700);
    window.setTimeout(() => {
      setState('closed');
    }, 1500);
  };
  const breaking = state === 'breaking';
  const opening = state === 'opening';
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[linear-gradient(180deg,#F5FBFD_0%,#CCE9F5_50%,#7CC3DC_100%)] ${
        opening ? 'animate-gateOut pointer-events-none' : ''
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
        <div
          className={`mt-6 ${breaking ? 'animate-sealBreak' : 'animate-sealIdle'}`}
        >
          <Monogram size={150} animated />
        </div>
        {breaking && <PetalBurst />}
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
          disabled={state !== 'idle'}
          className="group relative mt-12 overflow-hidden rounded-full bg-ice-800 px-10 py-3.5 font-body text-xs uppercase tracking-[0.4em] text-white shadow-ice transition-all active:scale-95 hover:bg-ice-900 disabled:opacity-60"
        >
          <span className="relative z-10">Open Invitation</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </button>
      </div>
    </div>
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
              style={{ filter: 'drop-shadow(0 0 4px #A8D8EA)' }}
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
