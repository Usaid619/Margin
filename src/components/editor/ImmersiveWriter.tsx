import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { SessionConfig, WritingMode } from '../../types/writing';
import { useStudio } from '../../contexts/StudioContext';
import { useMusic } from '../../contexts/MusicContext';
import { useSessionDraft } from '../../hooks/useSessionDraft';
import { useWritingTimer } from '../../hooks/useWritingTimer';
import { writingFonts } from '../../data/writingFonts';
import { writingPalette } from '../../utils/writingPalette';
import { pad } from '../../utils/text';
import { QuietError } from '../ui/QuietError';
import { WritingTimer } from './WritingTimer';
import { SessionBar } from './SessionBar';
import { FontPanel } from './FontPanel';
import { TimeUpOverlay } from './TimeUpOverlay';

interface ImmersiveWriterProps {
  config: SessionConfig;
  mode: WritingMode;
  active: boolean;
  firstTime: boolean;
}

/** The writing world: background, words, and almost nothing else. */
export function ImmersiveWriter({ config, mode, active, firstTime }: ImmersiveWriterProps) {
  const navigate = useNavigate();
  const { preferences, updatePreferences } = useStudio();
  const { expanded: musicOpen, setExpanded: setMusicOpen } = useMusic();
  const draft = useSessionDraft(config);
  const timer = useWritingTimer(config.minutes, active);
  const [showTimer, setShowTimer] = useState(true);
  const [fontOpen, setFontOpen] = useState(false);
  const [keepGoing, setKeepGoing] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const palette = writingPalette(preferences.writingTheme, timer.isFinalMinute);
  const font = writingFonts.find((f) => f.id === preferences.writingFont) ?? writingFonts[0];
  const timeUpOpen = timer.isUp && !keepGoing;

  useEffect(() => {
    if (active) areaRef.current?.focus({ preventScroll: true });
  }, [active]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [draft.text, preferences.writingSize, preferences.writingLeading, preferences.writingFont]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        draft.saveNow();
      }
      if (e.key === 'Escape') setFontOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [draft]);

  useEffect(() => () => setMusicOpen(false), [setMusicOpen]);

  const exit = () => {
    draft.saveNow();
    navigate('/dashboard');
  };

  const finish = () => {
    const id = draft.finish(timer.elapsed);
    navigate(id ? `/library/${id}` : '/dashboard');
  };

  const remaining = timer.remaining;
  const timerSeconds = remaining === null ? timer.elapsed : Math.abs(remaining);
  const timerLabel = remaining === null ? 'elapsed' : remaining > 0 ? 'remaining' : 'over';
  const progress = timer.total ? Math.min(1, timer.elapsed / timer.total) : 0;
  const PromptTag = config.object ? 'p' : 'h1';

  return (
    <div
      className="fixed inset-0 z-30 flex flex-col transition-colors duration-300"
      style={{ backgroundColor: palette.bg, color: palette.fg, '--w-mute': palette.mute } as React.CSSProperties}
      onPointerMove={() => quiet && setQuiet(false)}>
      
      {timer.total &&
      <div aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: palette.line }}>
          <motion.div
          className="h-full origin-left"
          style={{ background: palette.accent }}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.25, ease: 'linear' }} />
        
        </div>
      }

      <header className={`flex items-center justify-between px-5 pt-5 transition-opacity duration-300 md:px-10 md:pt-6 ${quiet ? 'opacity-20' : 'opacity-100'}`}>
        <button type="button" onClick={exit} className="link-line text-[0.68rem] font-medium uppercase tracking-label">
          ← Exit
        </button>
        <div className={`transition-opacity duration-300 ${showTimer ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!showTimer}>
          <WritingTimer seconds={timerSeconds} label={timerLabel} accent={palette.accent} mute={palette.mute} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-label" style={{ color: palette.mute }}>
          No. {pad(config.number, 3)}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[42rem] px-6 pb-48 pt-10 md:pt-16">
          <p className="font-mono text-[10px] uppercase tracking-label" style={{ color: palette.mute }}>
            {mode.title}
          </p>
          {config.object && <h1 className="mt-5 font-display text-5xl uppercase leading-[0.9] tracking-tight md:text-7xl">{config.object.name}</h1>}
          {config.prompt &&
          <PromptTag className="mt-5 font-display text-2xl italic leading-snug md:text-3xl" style={{ color: config.object ? palette.mute : palette.fg }}>
              “{config.prompt}”
            </PromptTag>
          }
          {!config.prompt && !config.object && <h1 className="sr-only">{mode.title}</h1>}
          <div aria-hidden className="my-10 h-px w-12" style={{ background: palette.line }} />

          {draft.status === 'error' &&
          <div className="mb-8">
              <QuietError message="We couldn't save that piece. Your words are safe locally. Let's try again." actionLabel="Try again" onAction={draft.saveNow} />
            </div>
          }

          <label htmlFor="session-text" className="sr-only">
            Your writing
          </label>
          <textarea
            id="session-text"
            ref={areaRef}
            value={draft.text}
            onChange={(e) => draft.setText(e.target.value)}
            onKeyDown={() => !quiet && setQuiet(true)}
            placeholder={firstTime ? '' : 'Start anywhere.'}
            spellCheck
            className="writing-area block min-h-[45vh] w-full resize-none overflow-hidden bg-transparent outline-none focus-visible:outline-none"
            style={{
              fontFamily: font.family,
              fontSize: `${preferences.writingSize}px`,
              lineHeight: preferences.writingLeading,
              caretColor: '#B5762F',
              color: palette.fg
            }} />
          
        </div>
      </div>

      {firstTime && !draft.text &&
      <p className="pointer-events-none fixed inset-x-0 bottom-24 text-center font-display text-2xl italic md:bottom-28 md:text-3xl" style={{ color: palette.mute }}>
          Your turn.
        </p>
      }

      <SessionBar
        words={draft.words}
        status={draft.status}
        palette={palette}
        quiet={quiet}
        timeVisible={showTimer}
        onToggleTime={() => setShowTimer((v) => !v)}
        musicOpen={musicOpen}
        onMusic={() => {
          setFontOpen(false);
          setMusicOpen(!musicOpen);
        }}
        fontOpen={fontOpen}
        onFont={() => {
          setMusicOpen(false);
          setFontOpen((v) => !v);
        }}
        onSave={draft.saveNow}
        onFinish={finish}
        canFinish={draft.words > 0} />
      

      <FontPanel open={fontOpen} onClose={() => setFontOpen(false)} palette={palette} preferences={preferences} onChange={updatePreferences} />

      <TimeUpOverlay
        open={timeUpOpen}
        words={draft.words}
        palette={palette}
        theme={preferences.writingTheme}
        onKeep={() => {
          setKeepGoing(true);
          window.setTimeout(() => areaRef.current?.focus(), 50);
        }}
        onFinish={finish} />
      
    </div>);

}