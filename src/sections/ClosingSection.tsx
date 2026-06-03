import { memo } from 'react';
import {
  Content,
  Layer,
  Monogram,
  OrnamentDivider,
  Section,
  Snowflake,
} from '../components';
import { COUPLE, revealStyle } from '../constants';

export const ClosingSection = memo(function ClosingSection({ onRestart }: { onRestart: () => void }) {
  return (
    <Section id="closing">
      <Layer depth={1.3} className="opacity-50">
        <Snowflake left="20%" delay={0.2} size={5} />
        <Snowflake left="45%" delay={1.6} size={4} />
        <Snowflake left="70%" delay={0.9} size={6} />
      </Layer>
      <Content className="gap-4">
        <div className="reveal-rotate" style={revealStyle(80)}>
          <Monogram size={100} />
        </div>
        <p
          className="reveal-blur font-body text-[10px] uppercase tracking-[0.5em] text-ice-700"
          style={revealStyle(320)}
        >
          Dengan Sukacita & Syukur
        </p>
        <h3
          className="reveal-zoomout shimmer-text font-script text-6xl leading-[1.35] px-6 py-2 overflow-visible"
          style={revealStyle(480)}
        >
          Terima Kasih
        </h3>
        <div className="reveal-scale" style={revealStyle(680)}>
          <OrnamentDivider width={180} />
        </div>
        <p
          className="reveal-up max-w-xs text-sm italic text-ice-700"
          style={revealStyle(820)}
        >
          Kehadiran Anda adalah hadiah terindah bagi kami.
        </p>
        <p
          className="reveal-up mt-1 font-display text-lg italic text-ice-800"
          style={revealStyle(960)}
        >
          — {COUPLE.bride} & {COUPLE.groom}
        </p>
        <button
          onClick={onRestart}
          className="reveal-zoom mt-4 rounded-full border border-ice-700/40 bg-white/20 px-6 py-3 text-[10px] uppercase tracking-[0.4em] text-ice-700 backdrop-blur-md transition-all hover:bg-white/40"
          style={revealStyle(1120)}
        >
          ↑ Kembali ke Atas
        </button>
      </Content>
    </Section>
  );
});
