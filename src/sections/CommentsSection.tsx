import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { Content, Layer, Section, SectionLabel } from '../components';
import { revealStyle } from '../constants';

const COMMENTS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbz6gy5SC-7c83vzr67-ifp6fBvEd5Xe53pnTJB1hvw7BuODYA5dkc2FLBwrs6N8G3lmPQ/exec';

type Comment = { name: string; comment: string, type: string };

export const CommentsSection = memo(function CommentsSection() {
  const [name, setName] = useState(
    () => new URLSearchParams(window.location.search).get('to')?.trim() || '',
  );
  const [text, setText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  // GET must read the response, so a normal (cors) request — Apps Script's
  // googleusercontent redirect serves GET JSON with permissive CORS.
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(COMMENTS_ENDPOINT, { method: 'GET', mode: "no-cors" });
      const data = await res.json();
      // console.log(data)
      const list: any[] = Array.isArray(data)
        ? data
        : data?.comments ?? data?.data ?? [];
      setComments(
        list
          .map((c) => ({
            name: (c.name ?? '').toString(),
            comment: (c.comment ?? '').toString(),
            type: "comment",
          }))
          .filter((c) => c.comment),
      );
    } catch {
      // leave list as-is on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !text || submitting) return;
    setSubmitting(true);
    setError(false);
    const optimistic: Comment = { name, comment: text , type: "comment" };
    try {
      // Same no-cors POST shape as the RSVP form; type distinguishes the row.
      await fetch(COMMENTS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ name, comment: text, type: 'comment' }),
      });
      setComments((prev) => [optimistic, ...prev]);
      setText('');
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  // The page navigates via a custom snap-scroll hook that listens for
  // wheel/touchmove on the main scroller. Those native listeners fire on the
  // ancestor during the bubble phase before any React handler, so we stop the
  // events natively on this list — keeping its scroll from snapping the page.
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const stop = (ev: Event) => ev.stopPropagation();
    el.addEventListener('wheel', stop, { passive: false });
    el.addEventListener('touchstart', stop, { passive: true });
    el.addEventListener('touchmove', stop, { passive: false });
    return () => {
      el.removeEventListener('wheel', stop);
      el.removeEventListener('touchstart', stop);
      el.removeEventListener('touchmove', stop);
    };
  }, []);

  return (
    <Section id="comments">
      <Layer depth={1.2} className="opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#fff_0%,transparent_50%)]" />
      </Layer>
      <Content className="gap-3">
        <div className="reveal-down" style={revealStyle(80)}>
          <SectionLabel numeral="VI" title="Ucapan" />
        </div>
        <h3
          className="reveal-zoomout shimmer-text font-display text-3xl italic"
          style={revealStyle(280)}
        >
          Ucapan &amp; Doa
        </h3>

        <form onSubmit={handleSubmit} className="mt-1 flex w-full flex-col gap-2.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            className="reveal-left glass-card w-full rounded-full px-5 py-2.5 text-ice-900 placeholder:text-ice-700/70 focus:outline-none focus:ring-2 focus:ring-white"
            style={revealStyle(420)}
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis ucapan & doa Anda…"
            rows={3}
            className="reveal-right glass-card w-full resize-none rounded-2xl px-5 py-3 text-sm text-ice-900 placeholder:text-ice-700/70 focus:outline-none focus:ring-2 focus:ring-white"
            style={revealStyle(560)}
          />
          <button
            type="submit"
            disabled={!name || !text || submitting}
            className="reveal-zoom group relative overflow-hidden rounded-full bg-white px-6 py-2.5 text-xs font-medium uppercase tracking-[0.3em] text-ice-800 shadow-ice disabled:opacity-50"
            style={revealStyle(700)}
          >
            <span className="relative z-10">
              {submitting ? 'Mengirim…' : 'Kirim Ucapan'}
            </span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ice-200 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </button>
          {error && (
            <p className="text-center text-xs text-rose-600">
              Maaf, ucapan gagal terkirim. Silakan coba lagi.
            </p>
          )}
        </form>

        <div
          ref={listRef}
          className="no-scrollbar mt-2 flex max-h-44 w-full flex-col gap-2 overflow-y-auto"
          style={
            {
              overscrollBehavior: 'contain',
              touchAction: 'pan-y',
            } as CSSProperties
          }
        >
          {loading ? (
            <p className="py-4 text-center text-xs italic text-ice-700">
              Memuat ucapan…
            </p>
          ) : comments.length === 0 ? (
            <p className="py-4 text-center text-xs italic text-ice-700">
              Jadilah yang pertama memberi ucapan.
            </p>
          ) : (
            comments.map((c, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl px-4 py-3 text-left"
              >
                <p className="font-display text-sm italic text-ice-900">
                  {c.name || 'Tamu Undangan'}
                </p>
                <p className="mt-0.5 whitespace-pre-line break-words text-xs leading-relaxed text-ice-700">
                  {c.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </Content>
    </Section>
  );
});
