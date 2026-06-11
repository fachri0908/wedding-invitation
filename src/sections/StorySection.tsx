import { memo } from 'react';
import { CardFlora, Content, Layer, Section, SectionLabel } from '../components';
import { revealStyle } from '../constants';

// the story, split into two pages so each fits within a viewport
const PAGE_ONE = [
  'Melalui bisikan perantara, dua nama yang asing perlahan dijahit semesta menjadi satu cerita. Merah pipi menyimpan rahasia, pesan yang tak berujung jadi candu, dan pertemuan diam-diam menjadi awal debar yang tumbuh.',
  'Allah mempertemukan kami di waktu yang mungkin tidak pernah kami rencanakan sebelumnya. Dalam langkah yang sederhana, dalam doa-doa yang diam-diam dipanjatkan, hingga akhirnya hati ini saling dipertemukan oleh cara terbaik menurut-Nya.',
  'Namun, perjalanan kami bukan tanpa ujian. Ada jarak yang memisahkan, ada ego yang harus diredam, dan ada masa di mana semuanya terasa tidak pasti. Kami pernah berada di titik lelah, mempertanyakan apakah semua ini layak untuk diperjuangkan.',
  'Tapi entah bagaimana, setiap kali hampir menyerah selalu ada alasan untuk kembali. Selalu ada rasa yang lebih kuat dari keraguan. Kami belajar bahwa cinta bukan hanya tentang bahagia, tapi juga tentang memilih untuk tetap tinggal bahkan di saat keadaan tidak baik-baik saja.',
];

const PAGE_TWO = [
  'Seiring waktu, kami semakin mengerti satu sama lain. Belajar menerima kekurangan, menguatkan di saat rapuh, dan tumbuh bersama dalam setiap prosesnya. Karena bagi kami, cinta bukan tentang siapa yang paling sempurna, tapi siapa yang tetap bertahan.',
  'Hingga akhirnya, kami sampai di titik ini bukan karena semuanya selalu mudah, tapi karena kami tidak benar-benar berhenti berjuang. Kami memilih satu sama lain, lagi dan lagi. Dan hari ini, dengan penuh keyakinan, kami melangkahkan kaki ke babak baru — mengikat janji untuk perjalanan panjang ke depan, dalam suka maupun duka.',
  'Karena pada akhirnya, rumah bukanlah sebuah tempat, melainkan seseorang yang selalu kita pilih untuk pulang.',
];

// one glass-card holding a page's paragraphs; internal scroll guards short screens
function StoryPageCard({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div
      className="reveal-up glass-card relative overflow-hidden rounded-2xl p-5 text-left"
      style={revealStyle(180)}
    >
      <CardFlora src="green2" size={86} op={0.16} className="-bottom-5 -right-5" />
      <CardFlora src="green3" size={70} op={0.14} className="-left-4 -top-4" />
      <div className="absolute -left-1 top-5 h-10 w-1 rounded-r-full bg-ice-700/50" />
      <div className="no-scrollbar relative max-h-[68vh] space-y-3 overflow-y-auto pr-1">
        {paragraphs.map((text, i) => (
          <p key={i} className="text-[12px] italic leading-relaxed text-ice-700">
            {text}
          </p>
        ))}
      </div>
    </div>
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
        <StoryPageCard paragraphs={PAGE_ONE} />
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
          <SectionLabel numeral="II" title="Kisah Kami" />
        </div>
        <StoryPageCard paragraphs={PAGE_TWO} />
      </Content>
    </Section>
  );
});
