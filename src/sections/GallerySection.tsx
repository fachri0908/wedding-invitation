import { memo } from 'react';
import { Content, Layer, Section, SectionLabel } from '../components';
import { revealStyle } from '../constants';

const TILE_COUNT = 6;

export const GallerySection = memo(function GallerySection() {
  return (
    <Section id="gallery">
      <Layer depth={1.2} className="opacity-40">
        <div className="h-64 w-64 rounded-full bg-white/60 blur-2xl" />
      </Layer>
      <Content className="gap-3">
        <div className="reveal-down" style={revealStyle(80)}>
          <SectionLabel numeral="IV" title="Momen" />
        </div>
        <h3
          className="reveal-blur font-display text-3xl italic text-ice-800"
          style={revealStyle(240)}
        >
          Kenangan Terindah
        </h3>
        <div className="mt-2 grid w-full grid-cols-2 gap-3">
          {Array.from({ length: TILE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="reveal-drop glass-card aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-ice-200 to-ice-400"
              style={revealStyle(420 + i * 140)}
            >
              <div className="flex h-full w-full items-center justify-center">
                <svg
                  viewBox="0 0 40 40"
                  className="h-10 w-10 text-ice-700/40"
                  aria-hidden
                >
                  <circle cx="14" cy="16" r="4" fill="currentColor" opacity="0.5" />
                  <path
                    d="M4 32 L16 20 L24 28 L30 22 L36 32 Z"
                    fill="currentColor"
                    opacity="0.4"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </Content>
    </Section>
  );
});
