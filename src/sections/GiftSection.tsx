import { memo, useRef, useState } from 'react';
import { Content, Layer, Section, SectionLabel } from '../components';
import { COUPLE, GIFT, revealStyle } from '../constants';

type Account = (typeof GIFT)[number];

// group digits in fours, e.g. 1234567890 → 1234 5678 90
const group = (n: string) => n.replace(/(.{4})/g, '$1 ').trim();

// copy with a graceful fallback for non-secure contexts (clipboard API needs https)
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function GiftCard({
  acc,
  delay,
  onCopied,
}: {
  acc: Account;
  delay: number;
  onCopied: (ok: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const ok = await copyToClipboard(acc.accountNumber);
    onCopied(ok);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };
  return (
    // single ATM-style card holding all the account info + copy button
    <div
      className="reveal-up w-full max-w-[320px]"
      style={revealStyle(delay)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0A5A56_0%,#0B7A75_45%,#1BB7A6_100%)] p-5 text-left text-white shadow-ice">
        <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
        {/* bank + couple monogram */}
        <div className="relative flex items-center justify-between">
          <span className="font-body text-[10px] uppercase tracking-[0.35em] text-white/80">
            {acc.bank}
          </span>
          <span className="font-script text-xl leading-none text-white/90">
            {COUPLE.brideInitial}
            {COUPLE.groomInitial}
          </span>
        </div>
        {/* chip */}
        <div className="relative mt-4 h-7 w-10 rounded-md bg-[linear-gradient(135deg,#E3F3F0,#A6F0E6,#5FDDCB)]" />
        {/* account number */}
        <p className="relative mt-4 font-display text-xl tabular-nums tracking-[0.2em] text-white">
          {group(acc.accountNumber)}
        </p>
        {/* holder + owner */}
        <div className="relative mt-3 flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/60">
              {acc.owner}
            </p>
            <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-white/90">
              {acc.accountName}
            </p>
          </div>
          <button
            onClick={copy}
            className="shrink-0 rounded-full border border-white/40 bg-white/20 px-4 py-2 font-body text-[10px] uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-all active:scale-95 hover:bg-white/30"
          >
            {copied ? 'Tersalin ✓' : 'Salin'}
          </button>
        </div>
      </div>
    </div>
  );
}

export const GiftSection = memo(function GiftSection() {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const notify = (ok: boolean) => {
    setToast(ok ? 'Nomor rekening tersalin ✓' : 'Gagal menyalin, salin manual');
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };
  return (
    <>
    <Section id="gift">
      <Layer depth={1.2} className="opacity-40">
        <div className="h-64 w-64 rounded-full bg-white/60 blur-3xl" />
      </Layer>
      <Content className="gap-5">
        <div className="reveal-down" style={revealStyle(80)}>
          <SectionLabel numeral="V" title="Hadiah" />
        </div>
        <h3
          className="reveal-zoomout shimmer-text font-display text-3xl italic"
          style={revealStyle(240)}
        >
          Tanda Kasih
        </h3>
        <p
          className="reveal-blur max-w-xs text-sm italic text-ice-700"
          style={revealStyle(380)}
        >
          Doa restu Anda adalah hadiah terindah. Bagi yang ingin memberi tanda
          kasih, dapat melalui rekening berikut.
        </p>
        {GIFT.map((acc, i) => (
          <GiftCard
            key={acc.accountNumber}
            acc={acc}
            delay={520 + i * 200}
            onCopied={notify}
          />
        ))}
      </Content>
    </Section>

    {/* copy-success toast — sibling of the section so it isn't clipped by the
        section's overflow-hidden / 3D transform */}
    <div
      className={`pointer-events-none fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 transition-all duration-300 ${
        toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div className="rounded-full bg-ice-800/90 px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] text-white shadow-ice backdrop-blur">
        {toast ?? ''}
      </div>
    </div>
    </>
  );
});
