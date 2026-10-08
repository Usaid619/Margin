import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Phase = 'blink' | 'label' | 'typing' | 'hold' | 'erasing' | 'turn';

const LINE = 'The room is quiet.';

interface FirstVisitRitualProps {
  onEnter: () => void;
  onSkip: () => void;
}

/** The first time in the studio: an empty room, a cursor, a sentence that leaves — then your turn. */
export function FirstVisitRitual({ onEnter, onSkip }: FirstVisitRitualProps) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? 'hold' : 'blink');
  const [count, setCount] = useState(reduce ? LINE.length : 0);

  useEffect(() => {
    let t = 0;
    if (phase === 'blink') t = window.setTimeout(() => setPhase('label'), 1300);else
    if (phase === 'label') t = window.setTimeout(() => setPhase('typing'), 1500);else
    if (phase === 'typing') {
      t = count < LINE.length ? window.setTimeout(() => setCount((c) => c + 1), 70 + Math.random() * 70) : window.setTimeout(() => setPhase('hold'), 0);
    } else if (phase === 'hold') t = window.setTimeout(() => setPhase(reduce ? 'turn' : 'erasing'), 1400);else
    if (phase === 'erasing') {
      t = count > 0 ? window.setTimeout(() => setCount((c) => c - 1), 32) : window.setTimeout(() => setPhase('turn'), 450);
    } else if (phase === 'turn') t = window.setTimeout(onEnter, 300);
    return () => window.clearTimeout(t);
  }, [phase, count, onEnter, reduce]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to your studio"
      className="fixed inset-0 z-[75] flex items-center justify-center bg-paper"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}>
      
      <div className="w-full max-w-[40rem] px-6">
        <motion.p
          animate={{ opacity: phase === 'blink' ? 0 : 1, y: phase === 'blink' ? 8 : 0 }}
          transition={{ duration: 0.3 }}
          className="mb-10 font-display text-4xl italic text-ink md:text-5xl">
          
          Start anywhere.
        </motion.p>
        <p className="min-h-[1.5em] font-writing text-2xl text-ink md:text-3xl" aria-live="polite">
          <span>{LINE.slice(0, count)}</span>
          <span aria-hidden className="ml-[2px] inline-block h-[1.05em] w-[2px] translate-y-[0.18em] animate-caret bg-amber" />
        </p>
      </div>
      <button
        type="button"
        onClick={onSkip}
        className="absolute bottom-8 right-8 font-mono text-[10px] uppercase tracking-label text-mute transition-colors duration-200 hover:text-ink">
        
        Skip
      </button>
    </motion.div>);

}