import { memo } from 'react';
import { CardFlora, Content, Layer, Section, SectionLabel } from '../components';
import { revealStyle } from '../constants';

const FLORA = ['green2', 'green4', 'green1', 'green3'];

// the story, split into two pages so each fits within a viewport
const PAGE_ONE = [
  'Melalui bisikan perantara, dua nama yang asing perlahan dijahit semesta menjadi satu cerita.',
  'Merah pipi menyimpan rahasia, pesan yang tak berujung jadi candu, dan pertemuan diam-diam menjadi awal debar yang tumbuh.',
  'Allah mempertemukan kami di waktu yang mungkin tidak pernah kami rencanakan sebelumnya. Dalam langkah yang sederhana, dalam doa-doa yang diam-diam dipanjatkan, hingga akhirnya hati ini saling dipertemukan oleh cara terbaik menurut-Nya.',
  'Namun, perjalanan kami bukan tanpa ujian. Ada jarak yang memisahkan, ada ego yang harus diredam, dan ada masa di mana semuanya terasa tidak pasti. Kami pernah berada di titik lelah, mempertanyakan apakah semua ini layak untuk diperjuangkan.',
];

const PAGE_TWO = [
  'Tapi entah bagaimana, setiap kali hampir menyerah selalu ada alasan untuk kembali. Selalu ada rasa yang lebih kuat dari keraguan. Kami belajar bahwa cinta bukan hanya tentang bahagia, tapi juga tentang memilih untuk tetap tinggal bahkan di saat keadaan tidak baik-baik saja.',
  'Seiring waktu, kami semakin mengerti satu sama lain. Belajar menerima kekurangan, menguatkan di saat rapuh, dan tumbuh bersama dalam setiap prosesnya. Karena bagi kami, cinta bukan tentang siapa yang paling sempurna, tapi siapa yang tetap bertahan.',
  'Hingga akhirnya, kami sampai di titik ini bukan karena semuanya selalu mudah, tapi karena kami tidak benar-benar berhenti berjuang. Kami memilih satu sama lain, lagi dan lagi. Dan hari ini, dengan penuh keyakinan, kami melangkahkan kaki ke babak baru — mengikat janji untuk perjalanan panjang ke depan, dalam suka maupun duka.',
  'Karena pada akhirnya, rumah bukanlah sebuah tempat, melainkan seseorang yang selalu kita pilih untuk pulang.',
];

function StoryCard({
  text,
  i,
}: {
  text: string;
  i: number;
}) {
  return (
    <li
      className={`${
        i % 2 === 0 ? 'reveal-left' : 'reveal-right'
      } glass-card relative overflow-hidden rounded-2xl p-4 text-left`}
      style={revealStyle(180 + i * 180)}
    >
      <CardFlora
        src={FLORA[i % FLORA.length]}
        size={74}
        op={0.16}
        className="-bottom-4 -right-4"
      />
      <div className="absolute -left-1 top-4 h-8 w-1 rounded-r-full bg-ice-700/50" />
      <p className="relative text-[12px] italic leading-relaxed text-ice-700">
        {text}
      </p>
    </li>
  );
}

export const StorySection = memo(function StorySection() {
  return (
    <Section id="story">
      <Layer depth={1.1} className="opacity-50">
        <div className="absolute left-10 top-20 h-32 w-32 rounded-full border border-white/60" />
        <div className="absolute right-12 bottom-24 h-24 w-24 rounded-full border border-white/40" />
      </Layer>
      <Content className="gap-3">
        <div className="reveal-down" style={revealStyle(80)}>
          <SectionLabel numeral="II" title="Kisah Kami" />
        </div>
        <ol className="mt-1 flex w-full flex-col gap-3">
          {PAGE_ONE.map((text, i) => (
            <StoryCard key={i} text={text} i={i} />
          ))}
        </ol>
      </Content>
    </Section>
  );
});

export const StoryContinued = memo(function StoryContinued() {
  return (
    <Section id="story-2">
      <Layer depth={1.1} className="opacity-50">
        <div className="absolute right-10 top-24 h-28 w-28 rounded-full border border-white/60" />
        <div className="absolute left-12 bottom-20 h-24 w-24 rounded-full border border-white/40" />
      </Layer>
      <Content className="gap-3">
        <div className="reveal-down" style={revealStyle(80)}>
          <SectionLabel numeral="•" title="Kisah Kami" />
        </div>
        <ol className="mt-1 flex w-full flex-col gap-3">
          {PAGE_TWO.map((text, i) => (
            <StoryCard key={i} text={text} i={i} />
          ))}
        </ol>
      </Content>
    </Section>
  );
});
