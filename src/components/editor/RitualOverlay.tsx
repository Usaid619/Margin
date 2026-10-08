import React, { useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { WritingMode } from '../../types/writing';
import { easeOut } from '../../utils/motion';

interface RitualOverlayProps {
  mode: WritingMode;
  onDone: () => void;
}

/** The threshold between worlds: the room darkens and a single instruction appears. */
export function RitualOverlay({ mode, onDone }: RitualOverlayProps) {
  const reduce = useReducedMotion();
  const done = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onDoneRef.current();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(finish, reduce ? 800 : 2500);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [finish, reduce]);

  const letters = mode.ritual.toUpperCase().split('');

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`${mode.title}. ${mode.ritual}`}
      onClick={finish}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink px-6 text-paper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}>
      
      <motion.p
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="font-mono text-[10px] uppercase tracking-label text-paper/60">
        
        {mode.title}
      </motion.p>
      <p aria-hidden className="mt-8 text-center font-display text-6xl leading-none tracking-tight md:text-[9rem]">
        {letters.map((char, i) =>
        <motion.span
          key={`${char}-${i}`}
          className={`inline-block ${char === '.' ? 'text-amber' : ''}`}
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 + i * 0.06, ease: easeOut }}>
          
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        )}
      </p>
      <button type="button" onClick={finish} className="absolute bottom-8 font-mono text-[10px] uppercase tracking-label text-paper/50 transition-colors duration-200 hover:text-paper">
        Skip
      </button>
    </motion.div>);

}