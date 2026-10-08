import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStudio } from '../../contexts/StudioContext';
import { prompts } from '../../data/prompts';
import { journalArticles } from '../../data/journal';
import { formatShort } from '../../utils/date';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const { writings } = useStudio();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const term = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (term.length < 2) return null;
    return {
      writing: writings.filter((w) => `${w.title} ${w.body}`.toLowerCase().includes(term)).slice(0, 5),
      prompts: prompts.filter((p) => p.text.toLowerCase().includes(term)).slice(0, 4),
      journal: journalArticles.filter((a) => `${a.title} ${a.dek}`.toLowerCase().includes(term)).slice(0, 3)
    };
  }, [term, writings]);

  const total = results ? results.writing.length + results.prompts.length + results.journal.length : 0;
  const groupTitle = 'font-mono text-[10px] uppercase tracking-label text-mute';
  const row = 'group flex items-baseline justify-between gap-6 border-b border-ink/10 py-4';

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="fixed inset-0 z-[60] overflow-y-auto bg-paper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}>
        
          <div className="mx-auto max-w-4xl px-6 pb-24 pt-8 md:pt-12">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-label text-mute">Search the studio</span>
              <button type="button" onClick={onClose} className="link-line text-[0.68rem] font-medium uppercase tracking-label">
                Close
              </button>
            </div>
            <label htmlFor="site-search" className="sr-only">
              Search your writing, prompts and the journal
            </label>
            <input
            id="site-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="A word you remember writing…"
            className="mt-12 w-full border-b border-ink/20 bg-transparent pb-4 font-display text-4xl italic outline-none placeholder:text-ink/40 focus:border-ink focus-visible:outline-none md:text-6xl" />
          

            {!results && <p className="mt-10 text-sm text-ink/60">Try “rain”, “keys” or “grandmother”.</p>}
            {results && total === 0 &&
          <p className="mt-12 font-display text-3xl italic text-ink/70">Nothing by that name. Not yet, anyway.</p>
          }

            {results && results.writing.length > 0 &&
          <section className="mt-14">
                <h2 className={groupTitle}>Your writing</h2>
                <ul className="mt-3">
                  {results.writing.map((w) =>
              <li key={w.id}>
                      <Link to={`/library/${w.id}`} onClick={onClose} className={row}>
                        <span className="font-display text-2xl md:text-3xl">{w.title}</span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-label text-mute">{formatShort(w.createdAt)}</span>
                      </Link>
                    </li>
              )}
                </ul>
              </section>
          }
            {results && results.prompts.length > 0 &&
          <section className="mt-14">
                <h2 className={groupTitle}>Prompts</h2>
                <ul className="mt-3">
                  {results.prompts.map((p) =>
              <li key={p.id}>
                      <Link to={`/write/focused?prompt=${encodeURIComponent(p.text)}`} onClick={onClose} className={row}>
                        <span className="font-display text-2xl italic md:text-3xl">“{p.text}”</span>
                        <span className="shrink-0 text-[0.68rem] font-medium uppercase tracking-label">Write this →</span>
                      </Link>
                    </li>
              )}
                </ul>
              </section>
          }
            {results && results.journal.length > 0 &&
          <section className="mt-14">
                <h2 className={groupTitle}>Journal</h2>
                <ul className="mt-3">
                  {results.journal.map((a) =>
              <li key={a.slug}>
                      <Link to={`/journal/${a.slug}`} onClick={onClose} className={row}>
                        <span className="font-display text-2xl md:text-3xl">{a.title}</span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-label text-mute">{a.category}</span>
                      </Link>
                    </li>
              )}
                </ul>
              </section>
          }
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}