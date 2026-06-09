import { CSSProperties, useCallback, useRef, useState } from 'react';
import { ContinuousBackground, CornerDecor, Nav, OpeningGate } from './components';
import { SectionTransition, Trigger } from './transitions';
import { SECTIONS, SectionId } from './constants';
import {
  useActiveSection,
  useParallax,
  useRevealed,
  useSmoothSnapScroll,
} from './hooks';
import { RevealContext } from './RevealContext';
import { HeroSection } from './sections/HeroSection';
import { CoupleSection } from './sections/CoupleSection';
import { StorySection, StoryContinued } from './sections/StorySection';
import { EventSection } from './sections/EventSection';
import { RsvpSection } from './sections/RsvpSection';
import { GiftSection } from './sections/GiftSection';
import { ClosingSection } from './sections/ClosingSection';

export default function App() {
  const scrollerRef = useRef<HTMLElement>(null);
  const [opened, setOpened] = useState(false);
  const [trans, setTrans] = useState<Trigger>(null);
  const transCount = useRef(0);
  useParallax(scrollerRef);
  const goRef = useSmoothSnapScroll(scrollerRef, opened, (dir) => {
    transCount.current += 1;
    setTrans({
      key: transCount.current,
      dir,
      kind: transCount.current % 2 ? 'birds' : 'petals',
    });
  });
  const active = useActiveSection(scrollerRef, SECTIONS);
  const revealed = useRevealed(scrollerRef, SECTIONS, opened);

  // stable identities so memoized Nav / ClosingSection don't re-render on `trans`
  const go = useCallback((id: string) => {
    const i = SECTIONS.indexOf(id as SectionId);
    if (i >= 0) goRef.current(i);
  }, [goRef]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const handleOpen = useCallback(() => {
    setOpened(true);
    // Click is the user gesture autoplay policy requires; play() buffers and
    // starts as soon as the file is ready. Swallow rejection (e.g. blocked).
    audioRef.current?.play().catch(() => {});
  }, []);
  const handleRestart = useCallback(() => go('hero'), [go]);
  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={`${process.env.PUBLIC_URL}/nuansa-romansa.mp3`}
        loop
        preload="auto"
      />
      <ContinuousBackground />
      {!opened ? <OpeningGate onOpen={handleOpen} /> : null}
      {opened && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Putar musik' : 'Senyapkan musik'}
          className="fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/30 text-ice-800 shadow-md backdrop-blur transition hover:bg-white/40"
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          )}
        </button>
      )}
      <SectionTransition trigger={trans} />
      {opened && <CornerDecor />}
      <Nav active={active} sections={SECTIONS} onGo={go} visible={opened} />
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
          <StoryContinued />
          <EventSection />
          <RsvpSection />
          <GiftSection />
          <ClosingSection onRestart={handleRestart} />
        </main>
      </RevealContext.Provider>
    </>
  );
}
