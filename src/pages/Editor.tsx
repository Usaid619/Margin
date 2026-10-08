import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { AutosaveState } from '../types/writing';
import { useStudio } from '../contexts/StudioContext';
import { useTextHistory } from '../hooks/useTextHistory';
import { writingModes } from '../data/modes';
import { writingFonts } from '../data/writingFonts';
import { writingPalette } from '../utils/writingPalette';
import { countChars, countWords, formatNumber, titleFromText } from '../utils/text';
import { formatLong } from '../utils/date';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { FontPanel } from '../components/editor/FontPanel';
import { QuietError } from '../components/ui/QuietError';

const STATUS_TEXT: Record<AutosaveState, string> = { idle: '', saving: 'Saving…', saved: 'Saved', error: 'Kept on this device' };

function autosize(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

/** A notebook, not a word processor. */
export function Editor() {
  const { id } = useParams<{id: string;}>();
  const { getWriting, saveWriting, preferences, updatePreferences, storageHealthy } = useStudio();
  const existing = id && id !== 'new' ? getWriting(id) : undefined;
  const missing = id !== 'new' && !existing;

  const history = useTextHistory(existing?.body ?? '');
  const [title, setTitle] = useState(existing?.title ?? '');
  const [status, setStatus] = useState<AutosaveState>('idle');
  const [focusMode, setFocusMode] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [sitting, setSitting] = useState(0);
  const idRef = useRef<string | null>(existing?.id ?? null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const firstRun = useRef(true);

  const palette = writingPalette(preferences.writingTheme);
  const font = writingFonts.find((f) => f.id === preferences.writingFont) ?? writingFonts[0];
  const mode = writingModes.find((m) => m.id === (existing?.mode ?? 'free'));

  const persist = () => {
    const savedId = saveWriting({
      id: idRef.current ?? undefined,
      title: title.trim() || titleFromText(history.value, 'Untitled'),
      body: history.value,
      ...(idRef.current ? {} : { mode: 'free' as const, status: 'draft' as const })
    });
    if (!idRef.current) {
      idRef.current = savedId;
      window.history.replaceState(window.history.state, '', `/editor/${savedId}`);
    }
    setStatus('saved');
  };
  const persistRef = useRef(persist);
  persistRef.current = persist;

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!history.value.trim() && !title.trim() && !idRef.current) return;
    setStatus('saving');
    const t = window.setTimeout(() => persistRef.current(), 900);
    return () => window.clearTimeout(t);
  }, [history.value, title]);

  useEffect(() => {
    if (!storageHealthy) setStatus('error');
  }, [storageHealthy]);

  useEffect(() => {
    const started = Date.now();
    const t = window.setInterval(() => setSitting(Math.floor((Date.now() - started) / 60000)), 15000);
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      window.clearInterval(t);
      document.removeEventListener('fullscreenchange', onFs);
    };
  }, []);

  useEffect(() => autosize(bodyRef.current), [history.value, preferences.writingSize, preferences.writingLeading, preferences.writingFont]);
  useEffect(() => autosize(titleRef.current), [title]);

  if (missing) {
    return (
      <QuietError
        variant="page"
        title="This page went quiet."
        message="We couldn't find that piece. It may have been deleted. Your other words are safe."
        actionLabel="Back to the library"
        to="/library" />);


  }

  const wrap = (marker: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || 'text';
    history.set(`${value.slice(0, s)}${marker}${selected}${marker}${value.slice(e)}`, { checkpoint: true });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + marker.length, s + marker.length + selected.length);
    });
  };

  const prefixLine = (prefix: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: s, value } = el;
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    const has = value.startsWith(prefix, lineStart);
    const next = has ? value.slice(0, lineStart) + value.slice(lineStart + prefix.length) : value.slice(0, lineStart) + prefix + value.slice(lineStart);
    history.set(next, { checkpoint: true });
    const caret = Math.max(lineStart, s + (has ? -prefix.length : prefix.length));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();else
    void document.documentElement.requestFullscreen?.();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape' && focusMode) {
      setFocusMode(false);
      return;
    }
    if (!(e.metaKey || e.ctrlKey)) return;
    const k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) {
      e.preventDefault();
      history.undo();
    } else if (k === 'z' && e.shiftKey || k === 'y') {
      e.preventDefault();
      history.redo();
    } else if (k === 'b') {
      e.preventDefault();
      wrap('**');
    } else if (k === 'i') {
      e.preventDefault();
      wrap('*');
    } else if (k === 's') {
      e.preventDefault();
      persist();
    } else if (k === '.') {
      e.preventDefault();
      setFocusMode((v) => !v);
    }
  };

  const chrome = `transition-opacity duration-300 ${focusMode ? 'opacity-0 hover:opacity-100 focus-within:opacity-100' : 'opacity-100'}`;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: palette.bg, color: palette.fg, '--w-mute': palette.mute } as React.CSSProperties}>
      <header className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-4 py-3 md:px-10 md:py-4 ${chrome}`} style={{ backgroundColor: palette.bg }}>
        <Link to={idRef.current ? `/library/${idRef.current}` : '/library'} className="link-line shrink-0 text-[0.68rem] font-medium uppercase tracking-label">
          ← {idRef.current ? 'Back' : 'Library'}
        </Link>
        <EditorToolbar
          onBold={() => wrap('**')}
          onItalic={() => wrap('*')}
          onHeading={() => prefixLine('## ')}
          onQuote={() => prefixLine('> ')}
          onUndo={history.undo}
          onRedo={history.redo}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          focusMode={focusMode}
          onFocus={() => setFocusMode((v) => !v)}
          fullscreen={fullscreen}
          onFullscreen={toggleFullscreen}
          fontOpen={fontOpen}
          onFont={() => setFontOpen((v) => !v)} />
        
        <span aria-live="polite" className="hidden min-w-[6rem] text-right font-mono text-[10px] uppercase tracking-label sm:block" style={{ color: palette.mute }}>
          {STATUS_TEXT[status]}
        </span>
      </header>

      <div className="mx-auto max-w-[42rem] px-6 pb-48 pt-32 md:pt-40">
        <p className={`font-mono text-[10px] uppercase tracking-label ${chrome}`} style={{ color: palette.mute }}>
          {mode?.title} · {existing ? formatLong(existing.createdAt) : 'New page'}
        </p>
        <label htmlFor="editor-title" className="sr-only">
          Title
        </label>
        <textarea
          id="editor-title"
          ref={titleRef}
          rows={1}
          value={title}
          onChange={(e) => setTitle(e.target.value.replace(/\n/g, ''))}
          placeholder="Untitled"
          className="writing-area mt-5 block w-full resize-none overflow-hidden bg-transparent font-display text-5xl leading-[1] tracking-tight outline-none focus-visible:outline-none md:text-7xl" />
        
        <div aria-hidden className="my-10 h-px w-12" style={{ background: palette.line }} />

        {status === 'error' &&
        <div className="mb-8">
            <QuietError message="We couldn't save that piece. Your words are safe locally. Let's try again." actionLabel="Try again" onAction={persist} />
          </div>
        }

        <label htmlFor="editor-body" className="sr-only">
          Body
        </label>
        <textarea
          id="editor-body"
          ref={bodyRef}
          value={history.value}
          onChange={(e) => history.set(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Start anywhere."
          spellCheck
          className="writing-area block min-h-[50vh] w-full resize-none overflow-hidden bg-transparent outline-none focus-visible:outline-none"
          style={{ fontFamily: font.family, fontSize: `${preferences.writingSize}px`, lineHeight: preferences.writingLeading, caretColor: '#B5762F' }} />
        
      </div>

      <footer
        className={`fixed inset-x-0 bottom-0 z-30 flex justify-between gap-4 border-t px-4 py-3 font-mono text-[10px] uppercase tracking-label md:px-10 md:py-4 ${chrome}`}
        style={{ backgroundColor: palette.bg, borderColor: palette.line, color: palette.mute }}>
        
        <span>
          {formatNumber(countWords(history.value))} words · {formatNumber(countChars(history.value))} characters
        </span>
        <span>
          {sitting < 1 ? 'Just sat down' : `${sitting} min this sitting`}
          {focusMode && ' · Esc to leave focus'}
        </span>
      </footer>

      <FontPanel open={fontOpen} onClose={() => setFontOpen(false)} palette={palette} preferences={preferences} onChange={updatePreferences} position="top" />
    </div>);

}