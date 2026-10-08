import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PauseIcon, PlayIcon, SkipForwardIcon, XIcon } from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';
import { atmospheres } from '../../data/atmospheres';
import { easeOut } from '../../utils/motion';
import { MiniBars } from './MiniBars';
import { Waveform } from './Waveform';

export function MusicPlayer({ immersive }: {immersive: boolean;}) {
  const { atmosphere, playing, volume, expanded, unavailable, setExpanded, toggle, select, next, setVolume } = useMusic();

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded, setExpanded]);

  return (
    <div className={`fixed right-4 z-[45] flex flex-col items-end md:right-6 ${immersive ? 'bottom-20 md:bottom-24' : 'bottom-4 md:bottom-6'}`}>
      <AnimatePresence>
        {expanded &&
        <motion.div
          id="music-panel"
          role="dialog"
          aria-label="Atmosphere"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 6 }}
          transition={{ duration: 0.22, ease: easeOut }}
          style={{ transformOrigin: 'bottom right' }}
          className="mb-3 w-[min(92vw,20rem)] bg-ink p-5 text-paper shadow-[0_30px_60px_-30px_rgba(18,17,15,0.7)]">
          
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-label text-paper/60">Atmosphere</span>
              <button type="button" onClick={() => setExpanded(false)} aria-label="Close atmosphere" className="text-paper/70 hover:text-paper">
                <XIcon aria-hidden className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <p className="mt-5 font-display text-4xl italic leading-none">{atmosphere.name}</p>
            <p className="mt-2 text-sm text-paper/70">{atmosphere.note}</p>

            <Waveform className="mt-5 h-12 w-full" />

            <div className="mt-4 flex items-center gap-3">
              <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pause' : 'Play'}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/30 transition-colors duration-200 hover:bg-paper hover:text-ink">
              
                {playing ? <PauseIcon aria-hidden className="h-4 w-4" strokeWidth={1.5} /> : <PlayIcon aria-hidden className="ml-0.5 h-4 w-4" strokeWidth={1.5} />}
              </button>
              <button type="button" onClick={next} aria-label="Next atmosphere" className="flex h-11 w-9 items-center justify-center text-paper/70 hover:text-paper">
                <SkipForwardIcon aria-hidden className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <label className="flex flex-1 items-center gap-3">
                <span className="sr-only">Volume</span>
                <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="range" />
              </label>
            </div>

            {unavailable && <p className="mt-3 text-xs text-glow">Sound isn't available in this browser. The room is quiet instead.</p>}

            <ul className="mt-5 grid grid-cols-2 gap-x-4 border-t border-paper/15 pt-4">
              {atmospheres.map((a) => {
              const active = a.id === atmosphere.id;
              return (
                <li key={a.id}>
                    <button
                    type="button"
                    onClick={() => select(a.id)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-2 py-1.5 text-left text-sm transition-colors duration-200 ${active ? 'text-paper' : 'text-paper/65 hover:text-paper'}`}>
                    
                      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-glow' : 'bg-paper/25'}`} />
                      {a.name}
                    </button>
                  </li>);

            })}
            </ul>
            {!playing && <p className="mt-4 font-mono text-[10px] uppercase tracking-label text-paper/50">Sound begins only when you press play</p>}
          </motion.div>
        }
      </AnimatePresence>

      {!immersive &&
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls="music-panel"
        className="flex items-center gap-3 rounded-full bg-ink px-4 py-2.5 text-paper transition-colors duration-200 hover:bg-charcoal">
        
          <MiniBars playing={playing} />
          <span className="text-[10px] font-medium uppercase tracking-label">{playing ? atmosphere.name : 'Atmosphere'}</span>
        </button>
      }
    </div>);

}