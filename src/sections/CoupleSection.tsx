import { memo } from 'react';
import { CardFlora, Content, Layer, Section, SectionLabel } from '../components';
import { COUPLE, revealStyle } from '../constants';

function PersonCard({
  name,
  role,
  parents,
  flora,
  floraRotate,
  floraClassName = '',
}: {
  name: string;
  role: string;
  parents: string;
  flora: string;
  floraRotate?: number;
  floraClassName?: string;
}) {
  return (
    <div className="glass-card relative w-full overflow-hidden rounded-3xl px-6 py-6">
      <CardFlora
        src={flora}
        size={96}
        op={0.2}
        rotate={floraRotate}
        className={`-right-5 -top-5 ${floraClassName}`}
      />
      <p className="relative text-[10px] uppercase tracking-[0.4em] text-ice-700">{role}</p>
      <h2 className="relative mt-2 font-display text-3xl text-ice-800">{name}</h2>
      <div className="relative mt-2 h-px w-12 bg-ice-700/40" />
      <p className="relative mt-2 text-sm italic text-ice-700">{parents}</p>
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
        <p
          dir="rtl"
          lang="ar"
          className="reveal-blur max-w-sm font-arabic text-xl leading-[2] text-ice-800"
          style={revealStyle(160)}
        >
          وَمِنْ كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُوْنَ 
        </p>
        <p
          className="reveal-blur max-w-xs text-[13px] italic leading-relaxed text-ice-700"
          style={revealStyle(200)}
        >
          “Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu
          mengingat (kebesaran Allah).”
        </p>
        <p
          className="reveal-blur text-[10px] uppercase tracking-[0.3em] text-ice-600"
          style={revealStyle(240)}
        >
          QS. Adz-Dzariyat: 49
        </p>
        <p
          className="reveal-blur mt-1 max-w-xs text-[13px] text-ice-700"
          style={revealStyle(300)}
        >
          Dengan memohon rahmat dan restu-Nya, kami bermaksud menyelenggarakan
          pernikahan putra-putri kami:
        </p>

        <div className="reveal-tilt-l w-full" style={revealStyle(260)}>
          <PersonCard
            name={COUPLE.brideFull}
            role="Mempelai Wanita"
            parents={COUPLE.brideParents}
            flora="green1"
            floraClassName='rotate-[210deg]'
          />
        </div>
        
        <div className="reveal-zoom" style={revealStyle(520)}>
          <span className="font-script text-5xl text-ice-600 drop-shadow">&</span>
        </div>

        <div className="reveal-tilt-r w-full" style={revealStyle(720)}>
          <PersonCard
            name={COUPLE.groomFull}
            role="Mempelai Pria"
            parents={COUPLE.groomParents}
            flora="green3"
          />
        </div>
      </Content>
    </Section>
  );
});
