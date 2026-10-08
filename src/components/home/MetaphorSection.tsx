import React from 'react';
import { motion } from 'framer-motion';
import { easeOut } from '../../utils/motion';

const FIGURES: {label: string;paths: string[];dots?: [number, number][];}[] = [
{ label: 'A word.', paths: ['M44 60 H76'] },
{ label: 'A line.', paths: ['M14 60 H106'] },
{ label: 'A paragraph.', paths: ['M14 42 H106', 'M14 54 H100', 'M14 66 H106', 'M14 78 H72'] },
{ label: 'A page.', paths: ['M32 14 H88 V106 H32 Z', 'M42 32 H78', 'M42 42 H76', 'M42 52 H78', 'M42 62 H66', 'M42 76 H78', 'M42 86 H70'] },
{
  label: 'A library.',
  paths: ['M10 100 H110', 'M18 100 V40 H28 V100', 'M30 100 V30 H38 V100', 'M40 100 V48 H52 V100', 'M56 100 V24 H64 V100', 'M66 100 V44 H76 V100', 'M80 100 L90 36 L98 38 L88 100', 'M98 100 V52 H108 V100']
},
{
  label: 'A constellation.',
  paths: ['M18 82 L42 52 L64 66 L86 30 L104 48'],
  dots: [
  [18, 82],
  [42, 52],
  [64, 66],
  [86, 30],
  [104, 48],
  [30, 28],
  [96, 92]]

}];


export function MetaphorSection() {
  return (
    <section aria-labelledby="metaphor-title" className="border-t border-ink/10 bg-paper px-6 py-28 md:px-10 md:py-40">
      <div className="grid gap-6 md:grid-cols-12">
        <p className="font-mono text-[10px] uppercase tracking-label text-mute md:col-span-3">03 — Return</p>
        <h2 id="metaphor-title" className="font-display text-5xl leading-[0.98] tracking-tight md:col-span-9 md:text-7xl">
          Words become lines. Lines become pages. Pages become <em>a life you can read back.</em>
        </h2>
      </div>

      <ol className="mt-20 grid grid-cols-2 gap-y-16 sm:grid-cols-3 md:mt-28 lg:grid-cols-6">
        {FIGURES.map((figure, i) =>
        <li key={figure.label} className="flex flex-col items-center gap-5 text-center">
            <motion.svg
            viewBox="0 0 120 120"
            className="h-28 w-28 text-ink"
            aria-hidden
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-15% 0px' }}>
            
              {figure.paths.map((d, j) =>
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { duration: 0.3, delay: i * 0.18 + j * 0.06, ease: easeOut } }
              }} />

            )}
              {figure.dots?.map(([cx, cy], j) =>
            <motion.circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={j < 5 ? 3 : 1.8}
              className={j < 5 ? 'fill-amber' : 'fill-ink'}
              variants={{
                hidden: { opacity: 0, scale: 0.96 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.25, delay: i * 0.18 + 0.2 + j * 0.05 } }
              }} />

            )}
            </motion.svg>
            <span className="font-display text-xl italic">{figure.label}</span>
          </li>
        )}
      </ol>
    </section>);

}