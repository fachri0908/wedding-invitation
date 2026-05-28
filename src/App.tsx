import { CSSProperties, useRef, useState } from 'react';
import { ContinuousBackground, Nav, OpeningGate } from './components';
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
import { GallerySection } from './sections/GallerySection';
import { RsvpSection } from './sections/RsvpSection';
import { ClosingSection } from './sections/ClosingSection';

export default function App() {
  const scrollerRef = useRef<HTMLElement>(null);
  const [opened, setOpened] = useState(false);
  useParallax(scrollerRef);
  const goRef = useSmoothSnapScroll(scrollerRef, opened);
  const active = useActiveSection(scrollerRef, SECTIONS);
  const revealed = useRevealed(scrollerRef, SECTIONS, opened);

  const go = (id: string) => {
    const i = SECTIONS.indexOf(id as SectionId);
    if (i >= 0) goRef.current(i);
  };

  return (
    <>
      <ContinuousBackground />
      {!opened ? <OpeningGate onOpen={() => setOpened(true)} /> : null}
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
          <GallerySection />
          <RsvpSection />
          <ClosingSection onRestart={() => go('hero')} />
        </main>
      </RevealContext.Provider>
    </>
  );
}
