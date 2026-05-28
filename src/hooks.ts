import { RefObject, useEffect, useRef, useState } from 'react';
import { SCROLL_DURATION_MS } from './constants';

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function useSmoothSnapScroll(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const goRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

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
  }, [ref, enabled]);

  return goRef;
}

export function useParallax(ref: RefObject<HTMLElement | null>) {
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

export function useActiveSection(
  ref: RefObject<HTMLElement | null>,
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

export function useRevealed(
  ref: RefObject<HTMLElement | null>,
  ids: readonly string[],
  enabled: boolean,
) {
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    if (!enabled) return;
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
  }, [ref, ids, enabled]);
  return revealed;
}

export function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins: Math.floor((diff % 3_600_000) / 60_000),
    secs: Math.floor((diff % 60_000) / 1000),
    over: diff <= 0,
  };
}
