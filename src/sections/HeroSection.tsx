import {
  Content,
  Layer,
  Monogram,
  OrnamentDivider,
  ScrollCue,
  Section,
  Snowflake,
  SparkleTrail,
} from '../components';
import { COUPLE, revealStyle } from '../constants';

export function HeroSection() {
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
      <SparkleTrail />
      <Content>
        <div className="reveal-zoom" style={revealStyle(80)}>
          <Monogram size={90} />
        </div>
        <p
          className="reveal-blur mt-6 font-body text-xs uppercase tracking-[0.5em] text-ice-700"
          style={revealStyle(260)}
        >
          The Wedding of
        </p>
        <h1
          className="reveal-blur shimmer-text mt-4 font-script text-7xl leading-none drop-shadow-sm"
          style={revealStyle(420)}
        >
          {COUPLE.bride}
          <span className="mx-2 font-display italic">&</span>
          {COUPLE.groom}
        </h1>
        <div className="reveal-scale mt-6" style={revealStyle(620)}>
          <OrnamentDivider width={220} />
        </div>
        <p
          className="reveal-up mt-4 font-display text-lg tracking-wide text-ice-800"
          style={revealStyle(780)}
        >
          {COUPLE.date}
        </p>
        <p
          className="reveal-up mt-1 text-[11px] uppercase tracking-[0.3em] text-ice-700"
          style={revealStyle(900)}
        >
          {COUPLE.location}
        </p>
        <div className="reveal-up mt-10" style={revealStyle(1100)}>
          <ScrollCue />
        </div>
      </Content>
    </Section>
  );
}
