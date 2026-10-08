import React from 'react';
import { cubicBezier, motion, useMotionTemplate, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import type { Observation } from '../../types/content';

const settle = cubicBezier(0.65, 0, 0.35, 1);

interface ObservationLineProps {
  observation: Observation;
  index: number;
  progress: MotionValue<number>;
}

/** A scattered observation that drifts into line and becomes part of a paragraph. */
export function ObservationLine({ observation, index, progress }: ObservationLineProps) {
  const start = 0.1 + index * 0.055;
  const opacity = useTransform(progress, [start, start + 0.07], [0, 1]);
  const leftValue = useTransform(progress, [0.48, 0.8], [observation.x, 50], { ease: settle });
  const topValue = useTransform(progress, [0.48, 0.8], [observation.y, 34 + index * 7.6], { ease: settle });
  const left = useMotionTemplate`${leftValue}%`;
  const top = useMotionTemplate`${topValue}%`;
  const color = useTransform(progress, [0.48, 0.8], ['#6E685F', '#12110F']);

  return (
    <motion.p
      style={{ left, top, opacity, color }}
      className="absolute w-max max-w-[78vw] -translate-x-1/2 -translate-y-1/2 text-center font-writing text-[15px] italic md:max-w-none md:text-xl">
      
      {observation.text}
    </motion.p>);

}