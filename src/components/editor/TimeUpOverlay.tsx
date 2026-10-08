import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { WritingTheme } from '../../types/user';
import type { WritingPalette } from '../../utils/writingPalette';
import { formatNumber } from '../../utils/text';
import { easeOut } from '../../utils/motion';
import { MagneticButton } from '../ui/MagneticButton';

interface TimeUpOverlayProps {
  open: boolean;
  words: number;
  palette: WritingPalette;
  theme: WritingTheme;
  onKeep: () => void;
  onFinish: () => void;
}

/** Time is up — but the writer is never cut off mid-sentence. */
export function TimeUpOverlay({ open, words, palette, theme, onKeep, onFinish }: TimeUpOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => ref.current?.querySelector('button')?.focus(), 1700);
    return () => window.clearTimeout(t);
  }, [open]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay, ease: easeOut }
  });

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="timeup-title"
        aria-describedby="timeup-words"
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: palette.bg, color: palette.fg }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}>
        
          <motion.h2 id="timeup-title" {...fade(0.2)} className="font-display text-[28vw] leading-none tracking-tight md:text-[13rem]">
            Time<span className="text-amber">.</span>
          </motion.h2>
          <motion.p id="timeup-words" {...fade(0.9)} className="mt-4 font-display text-3xl md:text-5xl">
            You wrote <span className="tabular-nums italic">{formatNumber(words)}</span> {words === 1 ? 'word' : 'words'}.
          </motion.p>
          <motion.p {...fade(1.3)} className="mt-3 text-base md:text-lg" style={{ color: palette.mute }}>
            Keep going or finish here?
          </motion.p>
          <motion.div {...fade(1.6)} className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <MagneticButton variant="outline" tone={theme === 'night' ? 'paper' : 'ink'} onClick={onKeep}>
              Keep writing
            </MagneticButton>
            <MagneticButton tone="amber" onClick={onFinish}>
              Finish
            </MagneticButton>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}