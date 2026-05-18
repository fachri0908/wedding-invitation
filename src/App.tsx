import React, {
  CSSProperties,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const COUPLE = {
  bride: 'Aria',
  groom: 'Daniel',
  date: 'Saturday, 12 September 2026',
  location: 'Glacier Pavilion, Bali',
};

const SECTIONS = [
  'hero',
  'couple',
  'story',
  'event',
  'gallery',
  'rsvp',
  'closing',
] as const;

const SCROLL_DURATION_MS = 1400;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const RevealContext = createContext<Set<string>>(new Set());

function useSmoothSnapScroll(ref: React.RefObject<HTMLElement | null>) {
  const goRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let animating = false;

    const getSections = () =>
      Array.from(el.querySelectorAll<HTMLElement>('[data-section]'));

    const currentIndex = () => {
      const secs = getSections();
      const center = el.scrollTop + el.clientHeight / 2;
      let best = 0;
      let bd = Infinity;
      secs.forEach((s, i) => {
        const c = s.offsetTop + s.clientHeight / 2;
        const d = Math.abs(c - center);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      return best;
    };

    const tweenTo = (target: number, duration = SCROLL_DURATION_MS) => {
      cancelAnimationFrame(raf);
      const start = el.scrollTop;
      const change = target - start;
      if (Math.abs(change) < 0.5) return;
      const t0 = performance.now();
      animating = true;
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        el.scrollTop = start + change * easeInOutCubic(t);
        if (t < 1) raf = requestAnimationFrame(tick);
        else animating = false;
      };
      raf = requestAnimationFrame(tick);
    };

    const goToIndex = (i: number) => {
      const secs = getSections();
      const clamped = Math.max(0, Math.min(secs.length - 1, i));
      tweenTo(secs[clamped].offsetTop);
    };

    goRef.current = goToIndex;

    const advance = (dir: 1 | -1) => {
      if (animating) return;
      goToIndex(currentIndex() + dir);
    };

    let wheelLock = false;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelLock || animating || Math.abs(e.deltaY) < 4) return;
      wheelLock = true;
      window.setTimeout(() => {
        wheelLock = false;
      }, 220);
      advance(e.deltaY > 0 ? 1 : -1);
    };

    let touchStartY = 0;
    let touchActive = false;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchActive = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchActive || animating) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) > 40) {
        touchActive = false;
        advance(dy > 0 ? 1 : -1);
      }
    };
    const onTouchEnd = () => {
      touchActive = false;
    };

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        advance(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        advance(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToIndex(getSections().length - 1);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, [ref]);

  return goRef;
}

function useParallax(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;
    let ticking = false;
    const update = () => {
      const sections = scroller.querySelectorAll<HTMLElement>('[data-section]');
      const sRect = scroller.getBoundingClientRect();
      const vh = scroller.clientHeight;
      sections.forEach((s) => {
        const rect = s.getBoundingClientRect();
        const center = rect.top - sRect.top + rect.height / 2;
        const p = (center - vh / 2) / (vh / 2);
        const clamped = Math.max(-1.2, Math.min(1.2, p));
        s.style.setProperty('--p', clamped.toFixed(3));
      });
      const totalScroll = scroller.scrollHeight - scroller.clientHeight;
      const sp = totalScroll > 0 ? scroller.scrollTop / totalScroll : 0;
      document.documentElement.style.setProperty('--scroll', sp.toFixed(4));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, [ref]);
}

function useActiveSection(
  ref: React.RefObject<HTMLElement | null>,
  ids: readonly string[],
) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.55) {
            setActive(e.target.id);
          }
        });
      },
      { root: scroller, threshold: [0.55, 0.75] },
    );
    ids.forEach((id) => {
      const el = scroller.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ref, ids]);
  return active;
}

function useRevealed(
  ref: React.RefObject<HTMLElement | null>,
  ids: readonly string[],
) {
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.25) {
            setRevealed((prev) => {
              if (prev.has(e.target.id)) return prev;
              const next = new Set(prev);
              next.add(e.target.id);
              return next;
            });
          }
        });
      },
      { root: scroller, threshold: [0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = scroller.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ref, ids]);
  return revealed;
}

type SectionProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

function Section({ id, className = '', children }: SectionProps) {
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

type LayerProps = {
  depth?: number;
  className?: string;
  children: ReactNode;
};

function Layer({ depth = 0, className = '', children }: LayerProps) {
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

function Content({
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

function revealStyle(delay: number, extra: CSSProperties = {}): CSSProperties {
  return { ['--reveal-delay' as any]: `${delay}ms`, ...extra };
}

function Snowflake({
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

function PineTree({
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

function Flower({
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

function Leaf({
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

function AmbientForest() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-[55vh]"
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
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
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

function ContinuousBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-30 bg-[linear-gradient(180deg,#F5FBFD_0%,#E6F4FA_18%,#CCE9F5_36%,#A8D8EA_55%,#7CC3DC_72%,#A8D8EA_88%,#E6F4FA_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            'radial-gradient(ellipse at 50% calc(50% - var(--scroll, 0) * 60vh), rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)',
          transform: 'translate3d(0, calc(var(--scroll, 0) * -8vh), 0)',
          willChange: 'transform, background',
        }}
      />
      <AmbientForest />
      <AmbientPetals />
    </>
  );
}

export default function App() {
  const scrollerRef = useRef<HTMLElement>(null);
  useParallax(scrollerRef);
  const goRef = useSmoothSnapScroll(scrollerRef);
  const active = useActiveSection(scrollerRef, SECTIONS);
  const revealed = useRevealed(scrollerRef, SECTIONS);

  const go = (id: string) => {
    const i = SECTIONS.indexOf(id as (typeof SECTIONS)[number]);
    if (i >= 0) goRef.current(i);
  };

  return (
    <>
      <ContinuousBackground />
      <Nav active={active} sections={SECTIONS} onGo={go} />
      <RevealContext.Provider value={revealed}>
        <main
          ref={scrollerRef}
          className="no-scrollbar perspective-1200 relative h-[100dvh] w-full overflow-y-scroll"
          style={
            {
              overscrollBehaviorY: 'none',
              touchAction: 'pan-y',
            } as CSSProperties
          }
        >
          <HeroSection />
          <CoupleSection />
          <StorySection />
          <EventSection />
          <GallerySection />
          <RsvpSection />
          <ClosingSection onRestart={() => go('hero')} />
        </main>
      </RevealContext.Provider>
    </>
  );
}

function Nav({
  active,
  sections,
  onGo,
}: {
  active: string;
  sections: readonly string[];
  onGo: (id: string) => void;
}) {
  return (
    <nav className="pointer-events-none fixed right-4 top-1/2 z-50 -translate-y-1/2">
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

function HeroSection() {
  return (
    <Section id="hero">
      <Layer depth={1.4} className="opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#fff_0%,transparent_45%),radial-gradient(circle_at_80%_70%,#CCE9F5_0%,transparent_55%)]" />
      </Layer>
      <Layer depth={0.9}>
        <Snowflake left="12%" delay={0} size={6} />
        <Snowflake left="28%" delay={1.4} size={4} />
        <Snowflake left="58%" delay={0.6} size={5} />
        <Snowflake left="78%" delay={2.1} size={7} />
        <Snowflake left="90%" delay={1.1} size={3} />
      </Layer>
      <Layer depth={0.5}>
        <div className="absolute inset-x-6 top-24 h-px bg-gradient-to-r from-transparent via-ice-700/40 to-transparent" />
        <div className="absolute inset-x-6 bottom-24 h-px bg-gradient-to-r from-transparent via-ice-700/40 to-transparent" />
      </Layer>
      <Content>
        <p
          className="reveal font-body text-xs uppercase tracking-[0.4em] text-ice-700"
          style={revealStyle(120)}
        >
          The Wedding of
        </p>
        <h1
          className="reveal mt-6 font-script text-6xl leading-none text-ice-800 drop-shadow-sm"
          style={revealStyle(280)}
        >
          {COUPLE.bride}
          <span className="mx-3 font-display italic text-ice-600">&</span>
          {COUPLE.groom}
        </h1>
        <div
          className="reveal mt-8 h-px w-24 bg-ice-700/50"
          style={revealStyle(480)}
        />
        <p
          className="reveal mt-6 font-display text-lg text-ice-800"
          style={revealStyle(600)}
        >
          {COUPLE.date}
        </p>
        <p
          className="reveal mt-1 text-sm text-ice-700"
          style={revealStyle(720)}
        >
          {COUPLE.location}
        </p>
        <div
          className="reveal mt-12 animate-shimmer text-ice-700"
          style={revealStyle(900)}
        >
          <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
          <div className="mx-auto mt-2 h-8 w-px bg-ice-700/60" />
        </div>
      </Content>
    </Section>
  );
}

function CoupleSection() {
  return (
    <Section id="couple">
      <Layer depth={1.2} className="opacity-40">
        <div className="h-72 w-72 rounded-full bg-white/60 blur-3xl" />
      </Layer>
      <Content className="gap-6">
        <p
          className="reveal font-body text-xs uppercase tracking-[0.4em] text-ice-700"
          style={revealStyle(100)}
        >
          The Couple
        </p>
        <div className="reveal-scale w-full" style={revealStyle(280)}>
          <PersonCard
            name={COUPLE.bride}
            role="The Bride"
            parents="Daughter of Mr. & Mrs. Hartono"
          />
        </div>
        <span
          className="reveal font-script text-4xl text-ice-600"
          style={revealStyle(500)}
        >
          &
        </span>
        <div className="reveal-scale w-full" style={revealStyle(680)}>
          <PersonCard
            name={COUPLE.groom}
            role="The Groom"
            parents="Son of Mr. & Mrs. Wijaya"
          />
        </div>
      </Content>
    </Section>
  );
}

function PersonCard({
  name,
  role,
  parents,
}: {
  name: string;
  role: string;
  parents: string;
}) {
  return (
    <div className="relative w-full rounded-3xl border border-white/60 bg-white/30 px-6 py-6 shadow-glass backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.4em] text-ice-700">{role}</p>
      <h2 className="mt-2 font-display text-3xl text-ice-800">{name}</h2>
      <p className="mt-2 text-sm text-ice-700">{parents}</p>
    </div>
  );
}

function StorySection() {
  const items = [
    { y: '2020', t: 'First Met', d: 'A winter coffee in an unexpected place.' },
    { y: '2023', t: 'First Trip', d: 'Chased auroras across icy fjords.' },
    { y: '2025', t: 'The Proposal', d: 'Under snowfall, the answer was yes.' },
  ];
  return (
    <Section id="story">
      <Layer depth={1.1} className="opacity-50">
        <div className="absolute left-10 top-20 h-32 w-32 rounded-full border border-white/60" />
        <div className="absolute right-12 bottom-24 h-24 w-24 rounded-full border border-white/40" />
      </Layer>
      <Content className="gap-4">
        <p
          className="reveal font-body text-xs uppercase tracking-[0.4em] text-ice-700"
          style={revealStyle(100)}
        >
          Our Story
        </p>
        <ol className="mt-2 flex w-full flex-col gap-4">
          {items.map((it, i) => (
            <li
              key={it.y}
              className="reveal relative rounded-2xl border border-white/60 bg-white/30 p-5 text-left shadow-glass backdrop-blur-md"
              style={revealStyle(280 + i * 220)}
            >
              <div className="font-script text-2xl text-ice-700">{it.y}</div>
              <div className="mt-1 font-display text-xl text-ice-800">{it.t}</div>
              <p className="mt-1 text-sm text-ice-700">{it.d}</p>
            </li>
          ))}
        </ol>
      </Content>
    </Section>
  );
}

function EventSection() {
  return (
    <Section id="event">
      <Layer depth={1.3} className="opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#fff_0%,transparent_60%)]" />
      </Layer>
      <Layer depth={0.7}>
        <div className="absolute inset-x-10 top-16 h-px bg-ice-700/30" />
        <div className="absolute inset-x-10 bottom-16 h-px bg-ice-700/30" />
      </Layer>
      <Content className="gap-4">
        <p
          className="reveal font-body text-xs uppercase tracking-[0.4em] text-ice-700"
          style={revealStyle(100)}
        >
          Save the Date
        </p>
        <div className="reveal-scale w-full" style={revealStyle(260)}>
          <EventCard
            title="Holy Matrimony"
            time="10:00 AM"
            place="St. Glacier Chapel"
          />
        </div>
        <div className="reveal-scale w-full" style={revealStyle(440)}>
          <EventCard
            title="Reception"
            time="6:00 PM"
            place="Glacier Pavilion Ballroom"
          />
        </div>
        <button
          className="reveal mt-2 rounded-full bg-ice-700 px-6 py-3 text-sm font-medium text-white shadow-ice transition-transform active:scale-95"
          style={revealStyle(640)}
        >
          Open in Maps
        </button>
      </Content>
    </Section>
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
    <div className="w-full rounded-3xl border border-white/60 bg-white/40 p-5 shadow-glass backdrop-blur-md">
      <div className="font-display text-2xl text-ice-800">{title}</div>
      <div className="mt-2 flex items-center justify-between text-sm text-ice-700">
        <span>{time}</span>
        <span>{place}</span>
      </div>
    </div>
  );
}

function GallerySection() {
  const items = Array.from({ length: 6 });
  return (
    <Section id="gallery">
      <Layer depth={1.2} className="opacity-40">
        <div className="h-64 w-64 rounded-full bg-white/60 blur-2xl" />
      </Layer>
      <Content className="gap-3">
        <p
          className="reveal font-body text-xs uppercase tracking-[0.4em] text-ice-700"
          style={revealStyle(80)}
        >
          Moments
        </p>
        <h3
          className="reveal font-display text-3xl text-ice-800"
          style={revealStyle(220)}
        >
          Gallery
        </h3>
        <div className="mt-2 grid w-full grid-cols-2 gap-3">
          {items.map((_, i) => (
            <div
              key={i}
              className="reveal-scale aspect-square rounded-2xl border border-white/60 bg-gradient-to-br from-ice-200 to-ice-400 shadow-glass"
              style={revealStyle(360 + i * 120, {
                transform: `translateZ(${(i % 3) * 12}px) rotate(${
                  (i % 2 ? -1 : 1) * 1.5
                }deg)`,
              })}
            />
          ))}
        </div>
      </Content>
    </Section>
  );
}

function RsvpSection() {
  const [name, setName] = useState('');
  const [attend, setAttend] = useState<'yes' | 'no' | null>(null);
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <Section id="rsvp">
      <Layer depth={1.2} className="opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#fff_0%,transparent_50%)]" />
      </Layer>
      <Content className="gap-3">
        <p
          className="reveal font-body text-xs uppercase tracking-[0.4em] text-ice-800"
          style={revealStyle(80)}
        >
          RSVP
        </p>
        <h3
          className="reveal font-display text-3xl text-white drop-shadow"
          style={revealStyle(220)}
        >
          Will you join us?
        </h3>
        {sent ? (
          <p
            className="reveal mt-4 rounded-2xl bg-white/40 px-6 py-4 text-ice-900 backdrop-blur-md"
            style={revealStyle(0)}
          >
            Thank you, {name || 'friend'}!
          </p>
        ) : (
          <form onSubmit={submit} className="mt-2 flex w-full flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="reveal w-full rounded-full border border-white/60 bg-white/40 px-5 py-3 text-ice-900 placeholder:text-ice-700/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white"
              style={revealStyle(380)}
            />
            <div
              className="reveal flex gap-3"
              style={revealStyle(540)}
            >
              {(['yes', 'no'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAttend(v)}
                  className={`flex-1 rounded-full px-5 py-3 text-sm font-medium transition-all ${
                    attend === v
                      ? 'bg-ice-800 text-white shadow-ice'
                      : 'bg-white/40 text-ice-900 backdrop-blur-md'
                  }`}
                >
                  {v === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline'}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={!name || !attend}
              className="reveal mt-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ice-800 shadow-ice disabled:opacity-50"
              style={revealStyle(720)}
            >
              Send RSVP
            </button>
          </form>
        )}
      </Content>
    </Section>
  );
}

function ClosingSection({ onRestart }: { onRestart: () => void }) {
  return (
    <Section id="closing">
      <Layer depth={1.3} className="opacity-50">
        <Snowflake left="20%" delay={0.2} size={5} />
        <Snowflake left="45%" delay={1.6} size={4} />
        <Snowflake left="70%" delay={0.9} size={6} />
      </Layer>
      <Content className="gap-4">
        <p
          className="reveal font-body text-xs uppercase tracking-[0.4em] text-ice-700"
          style={revealStyle(100)}
        >
          With Joy
        </p>
        <h3
          className="reveal font-script text-5xl text-ice-800"
          style={revealStyle(260)}
        >
          Thank You
        </h3>
        <p
          className="reveal max-w-xs text-sm text-ice-700"
          style={revealStyle(420)}
        >
          Your presence is the greatest gift we could ask for.
        </p>
        <p
          className="reveal mt-2 font-display text-lg italic text-ice-800"
          style={revealStyle(580)}
        >
          — {COUPLE.bride} & {COUPLE.groom}
        </p>
        <button
          onClick={onRestart}
          className="reveal mt-4 rounded-full border border-ice-700/40 px-6 py-3 text-xs uppercase tracking-[0.3em] text-ice-700"
          style={revealStyle(740)}
        >
          Back to Top
        </button>
      </Content>
    </Section>
  );
}
