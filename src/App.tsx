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
import { StorySection } from './sections/StorySection';
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
  const handleOpen = useCallback(() => setOpened(true), []);
  const handleRestart = useCallback(() => go('hero'), [go]);

  return (
    <>
      <ContinuousBackground />
      {!opened ? <OpeningGate onOpen={handleOpen} /> : null}
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
          <EventSection />
          <RsvpSection />
          <GiftSection />
          <ClosingSection onRestart={handleRestart} />
        </main>
      </RevealContext.Provider>
    </>
  );
}
