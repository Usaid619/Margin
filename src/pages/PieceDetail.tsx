import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useStudio } from '../contexts/StudioContext';
import { writingModes } from '../data/modes';
import { formatLong } from '../utils/date';
import { countWords, formatNumber, readingMinutes, slugify } from '../utils/text';
import { easeOut } from '../utils/motion';
import { ProseRenderer } from '../components/library/ProseRenderer';
import { QuietError } from '../components/ui/QuietError';

export function PieceDetail() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const { getWriting, toggleFavorite, duplicateWriting, deleteWriting, writings } = useStudio();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const writing = id ? getWriting(id) : undefined;

  if (!writing) {
    return (
      <QuietError
        variant="page"
        title="This piece went quiet."
        message="We couldn't find it in your library. It may have been deleted, or never quite saved."
        actionLabel="Back to the library"
        to="/library" />);


  }

  const mode = writingModes.find((m) => m.id === writing.mode);
  const words = countWords(writing.body);
  const ordered = [...writings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const index = ordered.findIndex((w) => w.id === writing.id);
  const newer = index > 0 ? ordered[index - 1] : null;
  const older = index < ordered.length - 1 ? ordered[index + 1] : null;

  const exportPiece = () => {
    const content = `# ${writing.title}\n\n_${mode?.title ?? ''} · ${formatLong(writing.createdAt)}_\n\n${writing.body}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(writing.title)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice('Exported as a Markdown file.');
  };

  const duplicate = () => {
    const newId = duplicateWriting(writing.id);
    if (newId) navigate(`/editor/${newId}`);
  };

  const action = 'link-line text-[0.68rem] font-medium uppercase tracking-label';

  return (
    <article className="bg-paper pb-32">
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-amber" style={{ scaleX: progress }} />

      <div className="flex flex-col gap-6 px-6 pt-24 md:flex-row md:items-center md:justify-between md:px-10 md:pt-28">
        <Link to="/library" className={action}>
          ← Library
        </Link>
        <div role="toolbar" aria-label="Piece actions" className="flex flex-wrap gap-x-6 gap-y-3">
          <Link to={`/editor/${writing.id}`} className={action}>
            Edit
          </Link>
          <button type="button" aria-pressed={writing.favorite} onClick={() => toggleFavorite(writing.id)} className={action}>
            {writing.favorite ? 'Favorite ✦' : 'Favorite'}
          </button>
          <button type="button" onClick={duplicate} className={action}>
            Duplicate
          </button>
          <button type="button" onClick={exportPiece} className={action}>
            Export
          </button>
          <button type="button" onClick={() => setConfirming(true)} className={`${action} text-ember`}>
            Delete
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(confirming || notice) &&
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: easeOut }}
          className="mx-6 mt-6 flex flex-col gap-4 border-y border-ink/10 py-5 md:mx-10 md:flex-row md:items-center md:justify-between"
          role={confirming ? 'alertdialog' : 'status'}
          aria-label={confirming ? 'Confirm delete' : undefined}>
          
            {confirming ?
          <>
                <p className="font-display text-2xl italic">Let this one go? It can't be brought back.</p>
                <div className="flex gap-6">
                  <button type="button" onClick={() => setConfirming(false)} className={action}>
                    Keep it
                  </button>
                  <button
                type="button"
                onClick={() => {
                  deleteWriting(writing.id);
                  navigate('/library');
                }}
                className={`${action} text-ember`}>
                
                    Delete for good
                  </button>
                </div>
              </> :

          <>
                <p className="font-display text-xl italic">{notice}</p>
                <button type="button" onClick={() => setNotice(null)} className={action}>
                  Dismiss
                </button>
              </>
          }
          </motion.div>
        }
      </AnimatePresence>

      <header className="mx-auto max-w-[48rem] px-6 pt-20 text-center md:pt-28">
        <p className="font-mono text-[10px] uppercase tracking-label text-mute">
          {mode?.title}
          {writing.durationMinutes ? ` · ${writing.durationMinutes} min` : ''}
          {writing.status === 'draft' ? ' · Draft' : ''}
        </p>
        <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight md:text-8xl">{writing.title}</h1>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-label text-mute">
          {formatLong(writing.createdAt)} · {formatNumber(words)} words · {readingMinutes(writing.body)} min read
        </p>
        {writing.object && <p className="mt-12 font-display text-xl uppercase tracking-wide">{writing.object}</p>}
        {writing.prompt && <p className="mx-auto mt-4 max-w-md font-display text-xl italic leading-snug text-ink/60">“{writing.prompt}”</p>}
      </header>

      <div aria-hidden className="mx-auto my-16 h-px w-16 bg-ink/20" />

      <div className="mx-auto max-w-[38rem] px-6">
        {writing.body.trim() ? <ProseRenderer text={writing.body} dropCap /> : <p className="font-display text-2xl italic text-ink/60">This page is still blank.</p>}
      </div>

      <footer className="mx-auto mt-24 max-w-[38rem] px-6">
        <p aria-hidden className="text-center font-display text-3xl text-mute">⁂</p>
        <nav aria-label="More writing" className="mt-16 grid gap-10 border-t border-ink/10 pt-10 sm:grid-cols-2">
          {older &&
          <Link to={`/library/${older.id}`} className="group">
              <span className="font-mono text-[10px] uppercase tracking-label text-mute">← Earlier</span>
              <span className="mt-2 block font-display text-2xl leading-tight transition-transform duration-300 ease-quiet group-hover:-translate-x-1">{older.title}</span>
            </Link>
          }
          {newer &&
          <Link to={`/library/${newer.id}`} className="group sm:col-start-2 sm:text-right">
              <span className="font-mono text-[10px] uppercase tracking-label text-mute">Later →</span>
              <span className="mt-2 block font-display text-2xl leading-tight transition-transform duration-300 ease-quiet group-hover:translate-x-1">{newer.title}</span>
            </Link>
          }
        </nav>
      </footer>
    </article>);

}