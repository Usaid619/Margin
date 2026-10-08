import React from 'react';
import { motion, useReducedMotion, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { easeOut } from '../../utils/motion';

const DRIFT = [
{ x: -60, y: -170, r: -10 },
{ x: -20, y: 120, r: 6 },
{ x: 0, y: -80, r: -4 },
{ x: 30, y: 190, r: 9 },
{ x: 50, y: -140, r: 5 },
{ x: 90, y: 70, r: -14 }];

const PULL = [22, -14, 28, -18, 16, -30];

interface DriftLetterProps {
  char: string;
  index: number;
  progress: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  show: boolean;
}

/** One letter of the hero word: rises in, follows the cursor, drifts loose as you scroll. */
export function DriftLetter({ char, index, progress, mx, my, show }: DriftLetterProps) {
  const reduce = useReducedMotion();
  const drift = DRIFT[index % DRIFT.length];
  const pull = PULL[index % PULL.length];
  const x = useTransform(progress, [0.04, 0.55], [0, reduce ? 0 : drift.x]);
  const y = useTransform(progress, [0.04, 0.55], [0, reduce ? 0 : drift.y]);
  const rotate = useTransform(progress, [0.04, 0.55], [0, reduce ? 0 : drift.r]);
  const px = useTransform(mx, (v) => v * pull);
  const py = useTransform(my, (v) => v * pull * 0.6);

  return (
    <motion.span aria-hidden className="inline-block" style={{ x: px, y: py }}>
      <motion.span className="inline-block" style={{ x, y, rotate }}>
        <span className="inline-block overflow-hidden pb-[0.04em] pt-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${char === '.' ? 'text-amber' : ''}`}
            initial={reduce ? { opacity: 0 } : { y: '105%' }}
            animate={show ? reduce ? { opacity: 1 } : { y: '0%' } : undefined}
            transition={{ duration: 0.3, ease: easeOut, delay: index * 0.08 }}>
            
            {char}
          </motion.span>
        </span>
      </motion.span>
    </motion.span>);

}