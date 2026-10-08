import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { formatClock } from '../../utils/text';
import { easeOut } from '../../utils/motion';

interface WritingTimerProps {
  seconds: number;
  label: 'remaining' | 'elapsed' | 'over';
  accent: string;
  mute: string;
}

/** Each digit rolls quietly into the next. */
export function WritingTimer({ seconds, label, accent, mute }: WritingTimerProps) {
  const reduce = useReducedMotion();
  const text = `${label === 'over' ? '+' : ''}${formatClock(seconds)}`;

  return (
    <div role="timer" aria-label={`${formatClock(seconds)} ${label}`} className="flex items-baseline gap-2">
      <span aria-hidden className="flex font-mono text-sm tabular-nums md:text-base" style={{ color: accent }}>
        {text.split('').map((char, i) =>
        /\d/.test(char) && !reduce ?
        <span key={i} className="relative inline-block h-[1.35em] w-[0.62em] overflow-hidden text-center">
              <AnimatePresence initial={false}>
                <motion.span
              key={char}
              className="absolute inset-0"
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.18, ease: easeOut }}>
              
                  {char}
                </motion.span>
              </AnimatePresence>
            </span> :

        <span key={i} className="inline-block h-[1.35em] w-[0.62em] text-center">
              {char}
            </span>

        )}
      </span>
      <span aria-hidden className="font-mono text-[10px] uppercase tracking-label" style={{ color: mute }}>
        {label}
      </span>
    </div>);

}