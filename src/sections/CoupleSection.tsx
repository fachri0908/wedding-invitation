import { memo } from 'react';
import { Content, Layer, Section, SectionLabel } from '../components';
import { COUPLE, revealStyle } from '../constants';

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
    <div className="glass-card relative w-full overflow-hidden rounded-3xl px-6 py-6">
      <span className="absolute right-4 top-4 font-script text-3xl text-ice-300/80">
        ❋
      </span>
      <p className="text-[10px] uppercase tracking-[0.4em] text-ice-700">{role}</p>
      <h2 className="mt-2 font-display text-3xl text-ice-800">{name}</h2>
      <div className="mt-2 h-px w-12 bg-ice-700/40" />
      <p className="mt-2 text-sm italic text-ice-700">{parents}</p>
    </div>
  );
}

export const CoupleSection = memo(function CoupleSection() {
  return (
    <Section id="couple">
      <Layer depth={1.2} className="opacity-40">
        <div className="h-72 w-72 rounded-full bg-white/60 blur-3xl" />
      </Layer>
      <Content className="gap-5">
        <div className="reveal-down" style={revealStyle(80)}>
          <SectionLabel numeral="I" title="Mempelai" />
        </div>
        
        <div className="reveal-tilt-r w-full" style={revealStyle(720)}>
          <PersonCard
            name={COUPLE.groomFull}
            role="Mempelai Pria"
            parents={COUPLE.groomParents}
          />
        </div>
        
        <div className="reveal-zoom" style={revealStyle(520)}>
          <span className="font-script text-5xl text-ice-600 drop-shadow">&</span>
        </div>
        
        <div className="reveal-tilt-l w-full" style={revealStyle(260)}>
          <PersonCard
            name={COUPLE.brideFull}
            role="Mempelai Wanita"
            parents={COUPLE.brideParents}
          />
        </div>
      </Content>
    </Section>
  );
});
