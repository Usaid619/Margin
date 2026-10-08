import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { observations } from '../../data/observations';
import { ObservationLine } from './ObservationLine';

export function NoticeSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const headingOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.1], [30, 0]);
  const captionA = useTransform(scrollYProgress, [0.14, 0.22, 0.42, 0.5], [0, 1, 1, 0]);
  const captionB = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const caret = useTransform(scrollYProgress, [0.82, 0.88], [0, 1]);

  return (
    <section ref={ref} id="notice" aria-labelledby="notice-title" className="relative h-[340vh] bg-[#E9E0CE]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <p className="absolute left-6 top-24 font-mono text-[10px] uppercase tracking-label text-mute md:left-10 md:top-28">01 — Notice</p>
        <motion.h2
          id="notice-title"
          style={{ opacity: headingOpacity, y: headingY }}
          className="absolute inset-x-0 top-[13%] px-6 text-center font-display text-5xl leading-none tracking-tight md:text-8xl">
          
          Before you write, <em>notice.</em>
        </motion.h2>

        {observations.map((o, i) =>
        <ObservationLine key={o.text} observation={o} index={i} progress={scrollYProgress} />
        )}

        <motion.span
          aria-hidden
          style={{ opacity: caret, top: `${34 + observations.length * 7.6}%` }}
          className="absolute left-1/2 h-6 w-[2px] -translate-x-1/2 animate-caret bg-amber" />
        

        <motion.p style={{ opacity: captionA }} className="absolute inset-x-0 bottom-[7%] text-center font-mono text-[10px] uppercase tracking-label text-mute">
          Small things, in passing
        </motion.p>
        <motion.p style={{ opacity: captionB }} className="absolute inset-x-0 bottom-[6%] px-6 text-center font-display text-2xl italic md:text-3xl">
          — and slowly, they become writing.
        </motion.p>
      </div>
    </section>);

}