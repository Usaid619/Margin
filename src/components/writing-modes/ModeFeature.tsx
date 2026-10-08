import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { WritingMode } from '../../types/writing';
import { toRoman } from '../../utils/text';

interface ModeFeatureProps {
  mode: WritingMode;
  index: number;
}

/** A full-bleed gallery section per mode. Hover reveals the details; click begins. */
export function ModeFeature({ mode, index }: ModeFeatureProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : index % 2 ? ['-5%', '5%'] : ['5%', '-5%']);
  const size = `min(19vw, ${(128 / mode.name.length).toFixed(1)}vw)`;

  return (
    <Link
      ref={ref}
      to={`/write/${mode.id}`}
      data-cursor="label"
      data-cursor-label="Begin"
      aria-label={`${mode.title}. ${mode.lines.join(' ')} Begin a session.`}
      className={`group relative block min-h-[88vh] overflow-hidden px-6 py-14 md:px-10 md:py-16 ${mode.theme.panel}`}>
      
      <div className={`flex justify-between font-mono text-[10px] uppercase tracking-label ${mode.theme.muted}`}>
        <span>
          {toRoman(index + 1)} — {mode.title}
        </span>
        <span>{mode.defaultMinutes ? `${mode.defaultMinutes} minutes` : 'Untimed'}</span>
      </div>

      <motion.p aria-hidden style={{ x, fontSize: size }} className="mt-14 whitespace-nowrap font-display uppercase leading-[0.82] tracking-[-0.02em]">
        {mode.name}
      </motion.p>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 className="font-display text-3xl leading-tight md:text-5xl">{mode.lines[0]}</h2>
          <p className={`mt-2 font-display text-3xl italic leading-tight md:text-5xl ${mode.theme.muted}`}>{mode.lines[1]}</p>
        </div>
        <div className="transition-[opacity,transform] duration-300 ease-quiet md:col-span-5 md:col-start-8 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
          <p className="text-base leading-relaxed md:text-lg">{mode.summary}</p>
          <dl className={`mt-8 border-t ${mode.theme.rule}`}>
            {mode.details.map((d) =>
            <div key={d.label} className={`flex justify-between gap-6 border-b py-3 text-sm ${mode.theme.rule}`}>
                <dt className={mode.theme.muted}>{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            )}
          </dl>
          <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-label">
            {mode.lenses.map((lens) =>
            <span key={lens}>{lens}</span>
            )}
          </p>
          <span className="link-line mt-8 inline-block text-[0.7rem] font-medium uppercase tracking-label">Begin {mode.title.toLowerCase()} →</span>
        </div>
      </div>
    </Link>);

}