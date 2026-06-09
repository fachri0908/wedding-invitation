import {
  CSSProperties,
  ReactNode,
  memo,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { COUPLE } from './constants';
import { RevealContext } from './RevealContext';

// Coarse-pointer / small screens get a lighter background (fewer flowers, blurs
// and trees) so scrolling stays smooth on phones.
export const LITE =
  typeof window !== 'undefined' &&
  ((typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches) ||
    window.innerWidth <= 820);

// ───── primitives ───────────────────────────────────────────────────────

// Fixed corner ornaments — the same four floral image assets in every section,
// each with its own entrance transition and idle drift. The flip points each
// bouquet inward toward its corner.
const CORNER_DECOR: Decoration[] = [
  { src: 'blue1', pos: { top: 5, left: -8 }, size: 116, flip: 'scale(-1,-1)', reveal: 'reveal-left', idle: 'animate-sway', delay: 200 },
  { src: 'colorful2', pos: { top: 5, right: 5 }, size: 96, flip: 'scale(-1,1)', reveal: 'reveal-right', idle: 'animate-sway', delay: 360 },
];

export const Section = memo(function Section({
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
});

// Fixed viewport-corner decorations, mounted once (in App) — stay put on scroll.
export const CornerDecor = memo(function CornerDecor() {
  return <SectionDecor items={CORNER_DECOR} />;
});

export const Layer = memo(function Layer({
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
});

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
          <span className="font-script text-3xl text-ice-600">|</span>
          <span className="text-4xl italic">{COUPLE.groomInitial}</span>
        </div>
      </div>
    </div>
  );
}

// A wreath of flower assets circling the couple's initials — drop-in for the
// Monogram. Blooms are placed evenly around a circle and the whole ring drifts
// in a very slow spin so it feels alive without distracting.
export function FloralRing({
  size = 150,
  count = 9,
  // blue3 is the bluest asset; kept semi-transparent and spaced out so the ring
  // blends into the gradient rather than standing out
  bloom = ['blue1'],
  spin = true,
}: {
  size?: number;
  count?: number;
  bloom?: string[];
  spin?: boolean;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        aria-hidden
        className={`absolute inset-0`}
      >
        <img src='/frame.png' className='w-45 h-35 opacity-30' alt="frame"/>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-baseline gap-1 font-display text-ice-800">
          <span className="text-4xl italic">{COUPLE.brideInitial}</span>
          <span className="font-script text-3xl text-ice-600">&amp;</span>
          <span className="text-4xl italic">{COUPLE.groomInitial}</span>
        </div>
      </div>
    </div>
  );
}

// A single corner ornament — a floral image asset. `pos` anchors it (edge
// offsets), `flip` orients it toward the corner, `reveal` is its entrance
// transition and `idle` its resting drift. Each one animates independently.
export type Decoration = {
  src: string;
  pos: CSSProperties;
  size: number;
  op?: number;
  flip?: string;
  reveal: string;
  idle?: string;
  delay?: number;
};

export const SectionDecor = memo(function SectionDecor({
  items,
}: {
  items: Decoration[];
}) {
  return (
    // fixed to the viewport so the corners stay put while sections scroll;
    // data-revealed='true' lets the reveal entrance play once on mount.
    <div
      aria-hidden
      data-revealed="true"
      className="pointer-events-none fixed inset-0 z-1 opacity-55"
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
            <div className={d.idle} style={{ width: '100%', height: '100%' }}>
              <img
                src={`${process.env.PUBLIC_URL}/${d.src}.png`}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full select-none object-contain"
                style={{ opacity: d.op ?? 0.85 }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

// Small floral accent for inside glass-cards. Rendered as the first child so
// card text paints over it; fades in with the card's reveal and gently sways.
export function CardFlora({
  src = 'green2',
  size = 72,
  op = 0.22,
  rotate,
  className = '',
}: {
  src?: string;
  size?: number;
  op?: number;
  rotate?: number;
  className?: string;
}) {
  return (
    // outer: position + transforms via `className` (e.g. "rotate-45 scale-x-[-1]").
    // `rotate` is an optional inline shortcut — omit it to use Tailwind transform
    // classes instead (an inline transform would override them). Kept off the
    // swaying img so static transforms and the sway animation don't clobber each other.
    <div
      aria-hidden
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{
        width: size,
        height: size,
        ...(rotate != null ? { transform: `rotate(${rotate}deg)` } : {}),
      }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/${src}.png`}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full select-none object-contain animate-sway"
        style={{ opacity: op }}
      />
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
      <span className="text-[10px] uppercase tracking-[0.4em]">Geser</span>
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
// The five petal colours used everywhere; each gets one shared gradient (below)
// instead of every Floret declaring its own <defs> (was ~100 dup gradients).
const PETALS = ['#1BB7A6', '#5FDDCB', '#A6F0E6', '#FFFFFF', '#0B7A75'];
const floretFill = (petal: string) => `url(#flo-${petal.replace('#', '')})`;

// Mounted once (in ContinuousBackground) — the shared petal gradients.
export function FloretGradients() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0 }}
    >
      <defs>
        {PETALS.map((petal) => (
          <linearGradient
            key={petal}
            id={`flo-${petal.replace('#', '')}`}
            x1="0"
            y1="1"
            x2="0"
            y2="0"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="42%" stopColor={petal} />
            <stop offset="100%" stopColor={edgeOf(petal)} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

export const Floret = memo(function Floret({
  cx,
  cy,
  r,
  petal,
  core = '#A6F0E6',
  petals = 6,
}: {
  cx: number;
  cy: number;
  r: number;
  petal: string;
  edge?: string;
  core?: string;
  petals?: number;
  id?: string;
}) {
  const L = r;
  const W = r * 0.44;
  const path = `M0 0 C ${-W} ${-L * 0.45} ${-W * 0.55} ${-L} 0 ${-L} C ${W * 0.55} ${-L} ${W} ${-L * 0.45} 0 0 Z`;
  const fill = floretFill(petal);
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {Array.from({ length: petals }).map((_, i) => (
        <path
          key={i}
          d={path}
          fill={fill}
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
});

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

// Bottom-anchored grove built from floral image assets (replaces the old SVG
// trees), layered far→near for depth and swaying gently.
type Grove = { src: string; left?: string; right?: string; size: number; op: number };
function AmbientForest() {
  // grove = one cohesive GREEN family, spaced across the width so pieces don't
  // collide; sizes grow far→near for depth.
  // const far: Grove[] = [
  //   { src: 'green2', left: '20%', size: 92, op: 0.26 },
  //   { src: 'green3', left: '50%', size: 96, op: 0.26 },
  //   { src: 'green1', left: '80%', size: 92, op: 0.26 },
  // ];
  // const mid: Grove[] = [
  //   // { src: 'green1', left: '24%', size: 150, op: 0.5 },
  //   // { src: 'green4', left: '74%', size: 156, op: 0.5 },
  // ];
  const near: Grove[] = [
    { src: 'green3', left: '0%', size: 140, op: 0.5 },
    { src: 'green2', right: '0%', size: 140, op: 0.5 },
    // { src: 'green1', left: '98%', size: 214, op: 0.8 },
  ];
  const tree = (g: Grove, key: string, idx: number, anim: string) => (
    <img
      key={key}
      src={`${process.env.PUBLIC_URL}/${g.src}.png`}
      alt=""
      loading="lazy"
      decoding="async"
      className={`absolute -bottom-4 select-none object-contain ${anim}`}
      style={{
        left: g.left,
        right: g.right,
        width: g.size,
        opacity: g.op,
        transform: 'translateX(-50%)',
        transformOrigin: 'bottom center',
        animationDelay: `${idx * 0.5}s`,
      }}
    />
  );
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[-15] h-[55vh]"
      style={{
        transform: 'translate3d(0, calc(var(--scroll, 0) * -6vh), 0)',
        willChange: 'transform',
      }}
    >
      {/* far layer — distant, faint (skipped on mobile) */}
      {/* {!LITE && far.map((g, i) => tree(g, `far${i}`, i, 'animate-swayslow'))} */}
      {/* mid layer */}
      {/* {mid.map((g, i) => tree(g, `mid${i}`, i + 5, 'animate-sway'))} */}
      {/* near layer — bold foreground grove */}
      {near.map((g, i) => tree(g, `near${i}`, i + 8, 'animate-swayslow'))}

      {/* foreground flowering shrubs (SVG) */}
      {/* <FlowerBush left="14%" size={58} opacity={0.9} delay={0.5} bloom="#1BB7A6" bloom2="#A6F0E6" />
      <FlowerBush left="60%" size={62} opacity={0.9} delay={0.9} bloom="#5FDDCB" bloom2="#5FDDCB" /> */}
      {/* {!LITE && (
        <>
          <FlowerBush left="34%" size={48} opacity={0.85} delay={1.4} bloom="#1BB7A6" bloom2="#A6F0E6" />
          <FlowerBush left="86%" size={52} opacity={0.85} delay={1.8} bloom="#1BB7A6" bloom2="#A6F0E6" />
        </>
      )} */}
    </div>
  );
}

// Decorative accents = one cohesive BLUE family, parked at the top + side edges
// (clear of the bottom green grove and the centred content), spaced so they
// don't overlap each other.
function AmbientFlora() {
  const all = [
    { src: 'blue1', style: { top: '5%', left: '-4%' }, size: 150, op: 0.18, anim: 'animate-swayslow' },
    { src: 'blue2', style: { top: '11%', right: '-4%' }, size: 158, op: 0.16, anim: 'animate-sway' },
    { src: 'blue3', style: { top: '46%', left: '-5%' }, size: 150, op: 0.14, anim: 'animate-sway' },
    { src: 'blue1', style: { top: '40%', right: '-5%' }, size: 146, op: 0.14, anim: 'animate-swayslow' },
  ];
  const items = LITE ? all.slice(0, 2) : all;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-12] overflow-hidden"
      style={{
        transform: 'translate3d(0, calc(var(--scroll, 0) * -4vh), 0)',
        willChange: 'transform',
      }}
    >
      {items.map((f, i) => (
        <img
          key={`${f.src}-${i}`}
          src={`${process.env.PUBLIC_URL}/${f.src}.png`}
          alt=""
          loading="lazy"
          decoding="async"
          className={`absolute select-none object-contain ${f.anim}`}
          style={{
            ...f.style,
            width: f.size,
            opacity: f.op,
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}
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

export const ContinuousBackground = memo(function ContinuousBackground() {
  return (
    <>
      <FloretGradients />
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
      <AmbientFlora />
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
});

// ───── opening gate ─────────────────────────────────────────────────────

// Decorative floral frame for the opening gate. Deliberately bolder than the
// ambient flora in regular sections (bigger, higher opacity, layered corners)
// so the gate reads as the showpiece. Animated entrance + idle sway/float.
type GateBloom = {
  src: string;
  style: React.CSSProperties;
  size: number;
  op: number;
  flip?: string;
  anim: string;
  delay: number;
  // inward vector to center (negated by gatePart to drift outward); rotation
  // gives each bloom its own gentle spin as it parts away
  tx: string;
  ty: string;
  rot: string;
};

const GATE_BLOOMS: GateBloom[] = [
  { src: 'colorful2', style: { top: '-3%', right: '-4%' }, size: 240, op: 0.92, anim: 'animate-swayslow', delay: 120, tx: '-42vw', ty: '40vh', rot: '16deg' },
  { src: 'blue3', style: { bottom: '-4%', left: '-5%' }, size: 300, op: 0.85, flip: 'scaleX(-1)', anim: 'animate-sway', delay: 240, tx: '44vw', ty: '-40vh', rot: '-14deg' },
  { src: 'blue1', style: { top: '38%', left: '-7%' }, size: 150, op: 0.45, anim: 'animate-float', delay: 600, tx: '46vw', ty: '8vh', rot: '-18deg' },
  { src: 'green2', style: { top: '34%', right: '-7%' }, size: 150, op: 0.42, flip: 'scaleX(-1)', anim: 'animate-float', delay: 720, tx: '-46vw', ty: '10vh', rot: '20deg' },
];

const GateFlora = memo(function GateFlora({
  converging,
}: {
  converging: boolean;
}) {
  return (
    // framing the envelope from behind (z-0) until the envelope has opened; then
    // the blooms lift in front (z-[60]) and part outward to reveal the page.
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        converging ? 'z-[60]' : 'z-0'
      }`}
    >
      {GATE_BLOOMS.map((b, i) => (
        <div
          key={i}
          // idle entrance while the envelope opens; part away once it's open,
          // lightly staggered so the blooms clear the frame one after another
          className={`absolute ${converging ? 'animate-gatePart' : 'animate-gateBloomIn'}`}
          style={
            {
              ...b.style,
              animationDelay: converging ? `${i * 110}ms` : `${b.delay}ms`,
              willChange: 'transform, opacity',
              '--tx': b.tx,
              '--ty': b.ty,
              '--rot': b.rot,
            } as React.CSSProperties
          }
        >
          {/* freeze the idle sway/float during the part so the two transforms
              don't fight and cause jitter */}
          <div className={converging ? '' : b.anim} style={{ transform: b.flip }}>
            <img
              src={`${process.env.PUBLIC_URL}/${b.src}.png`}
              alt=""
              loading="eager"
              decoding="async"
              className="select-none object-contain drop-shadow-[0_8px_18px_rgba(6,42,59,0.18)]"
              style={{ width: b.size, height: b.size, opacity: b.op }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

// Recipient name comes from the share link, e.g. ?to=Budi%20%26%20Keluarga
function getRecipientName(): string {
  const raw = new URLSearchParams(window.location.search).get('to');
  return raw?.trim() || 'Tamu Undangan';
}

export function OpeningGate({ onOpen }: { onOpen: () => void }) {
  const [state, setState] = useState<'idle' | 'opening' | 'closed'>('idle');
  const [converging, setConverging] = useState(false);
  const recipient = getRecipientName();
  if (state === 'closed') return null;
  const opening = state !== 'idle';
  const start = () => {
    if (state !== 'idle') return;
    setState('opening');
    // sequence: flap opens (0–900ms) → letter rises (900–2300ms) →
    // flowers lift in front + converge to center (2300–3800ms) →
    // gate fades to reveal the first section (~3400ms+)
    window.setTimeout(() => setConverging(true), 2300);
    window.setTimeout(onOpen, 3700);
    window.setTimeout(() => setState('closed'), 4600);
  };
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#F2F7F6_0%,#A6F0E6_50%,#1BB7A6_100%)] ${
        opening ? 'pointer-events-none animate-envFade' : ''
      }`}
      style={opening ? { animationDelay: '3700ms' } : undefined}
    >
      <div className="pointer-events-none absolute inset-0">
        <Snowflake left="12%" size={4} delay={0} />
        <Snowflake left="32%" size={6} delay={1.2} />
        <Snowflake left="54%" size={5} delay={0.7} />
        <Snowflake left="76%" size={4} delay={1.9} />
        <Snowflake left="90%" size={6} delay={0.3} />
      </div>

      {/* ───── floral frame — richer than other sections to make the gate the
          most attractive screen. Big layered corner bouquets + side accents.
          On open they converge to the envelope center, then the gate reveals. */}
      <GateFlora converging={converging} />

      <p className="font-body text-[10px] uppercase tracking-[0.5em] px-10 text-ice-800 text-center">
        Atas berkat rahmat Tuhan Yang Maha Kuasa
      </p>

      {/* ───── envelope ───── */}
      <div
        className="relative mt-5"
        style={{ width: 300, height: 200, perspective: '1100px' }}
      >
        {/* back panel */}
        <div
          className="absolute inset-0 rounded-lg shadow-ice"
          style={{
            background: 'linear-gradient(160deg, #0C6E54 0%, #0A5A56 100%)',
          }}
        />

        {/* letter card — rises out AFTER the flap has opened */}
        <div
          className={opening ? 'animate-letterRise' : ''}
          style={{
            position: 'absolute',
            left: 18,
            right: 18,
            top: 16,
            zIndex: 2,
            animationDelay: opening ? '900ms' : undefined,
            borderRadius: 12,
            padding: '18px 16px',
            background:
              'linear-gradient(155deg, #FFFFFF 0%, #F2F7F6 60%, #E3F3F0 100%)',
            boxShadow: '0 14px 30px -12px rgba(6,42,59,0.5)',
          }}
        >
          <div className="flex flex-col items-center text-center">
            <Monogram size={62} />
            <p className="mt-2 font-script text-3xl leading-none text-ice-800">
              {COUPLE.bride} &amp; {COUPLE.groom}
            </p>
            <div className="mt-1">
              <OrnamentDivider width={150} />
            </div>
            <p className="mt-1 font-display text-[11px] tracking-[0.35em] text-ice-700">
              {COUPLE.dateShort}
            </p>
            <p className="text-[9px] tracking-[0.3em] text-ice-700/80">
              {COUPLE.location}
            </p>
          </div>
        </div>

        {/* envelope front pocket (covers the letter's lower half) */}
        <div
          className="absolute inset-x-0 bottom-0 rounded-b-lg"
          style={{
            top: '46%',
            zIndex: 3,
            background: 'linear-gradient(160deg, #0F8A63 0%, #0B7A75 100%)',
            clipPath: 'polygon(0 38%, 50% 100%, 100% 38%, 100% 100%, 0 100%)',
          }}
        />
        {/* side body fill so the V reads cleanly */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            zIndex: 1,
            background: 'linear-gradient(160deg, #0C6E54 0%, #0A5A56 100%)',
            clipPath: 'polygon(0 0, 0 100%, 50% 56%, 100% 100%, 100% 0)',
          }}
        />

        {/* top flap — swings open */}
        <div
          className={opening ? 'animate-flapOpen' : ''}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '56%',
            zIndex: 4,
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(165deg, #129E8F 0%, #0F8A63 100%)',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {/* wax seal */}
          <div
            className="absolute left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full"
            style={{
              top: '34%',
              background:
                'radial-gradient(circle at 35% 30%, #A6F0E6 0%, #1BB7A6 55%, #0B7A75 100%)',
              boxShadow: '0 2px 6px rgba(6,42,59,0.4)',
            }}
          >
            <span className="font-script text-sm text-ice-900">
              {COUPLE.brideInitial}
              {COUPLE.groomInitial}
            </span>
          </div>
        </div>
      </div>

      {/* ───── recipient ───── */}
      <div className="mt-9 flex flex-col items-center px-8 text-center">
        <p className=" text-[10px] uppercase tracking-[0.45em] text-ice-700">
          Kepada Yth.
        </p>
        <p className="mt-2 font-script text-2xl leading-tight text-ice-900">
          {recipient}
        </p>
      </div>

      <button
        onClick={start}
        disabled={opening}
        className="group relative mt-7 overflow-hidden rounded-full bg-ice-800 px-10 py-3.5 font-body text-xs uppercase tracking-[0.4em] text-white shadow-ice transition-all hover:bg-ice-900 active:scale-95 disabled:opacity-0"
      >
        <span className="relative z-10">Buka Undangan</span>
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </button>
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
              style={{ filter: 'drop-shadow(0 0 4px #5FDDCB)' }}
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

// ───── nav ──────────────────────────────────────────────────────────────

export const Nav = memo(function Nav({
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
});
