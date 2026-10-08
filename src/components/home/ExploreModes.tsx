import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { WritingModeId } from '../../types/writing';
import { writingModes } from '../../data/modes';
import { toRoman } from '../../utils/text';
import { easeOut } from '../../utils/motion';
import { ModeVisual } from '../writing-modes/ModeVisual';

export function ExploreModes() {
  const [activeId, setActiveId] = useState<WritingModeId>('object');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = writingModes.find((m) => m.id === activeId) ?? writingModes[0];

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = (index + (e.key === 'ArrowDown' ? 1 : -1) + writingModes.length) % writingModes.length;
    tabRefs.current[next]?.focus();
  };

  return (
    <section aria-labelledby="explore-title" className="bg-paper px-6 py-28 md:px-10 md:py-40">
      <div className="grid gap-6 md:grid-cols-12">
        <p className="font-mono text-[10px] uppercase tracking-label text-mute md:col-span-3">02 — Explore</p>
        <div className="md:col-span-9">
          <h2 id="explore-title" className="font-display text-5xl leading-[0.95] tracking-tight md:text-8xl">
            Five ways <em>in.</em>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">
            Every mode is a different kind of attention. Some hand you something to look at. Some take everything away. All of them end on the page.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:gap-6">
        <div role="tablist" aria-label="Writing modes" aria-orientation="vertical" className="md:col-span-5">
          {writingModes.map((m, i) => {
            const on = m.id === activeId;
            return (
              <div key={m.id} className="border-t border-ink/10 last:border-b">
                <button
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${m.id}`}
                  aria-selected={on}
                  aria-controls="mode-preview"
                  tabIndex={on ? 0 : -1}
                  onMouseEnter={() => setActiveId(m.id)}
                  onFocus={() => setActiveId(m.id)}
                  onClick={() => setActiveId(m.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="group flex w-full items-baseline gap-5 py-5 text-left md:py-6">
                  
                  <span className="w-8 shrink-0 font-mono text-[10px] tracking-label text-mute">{toRoman(i + 1)}</span>
                  <span
                    className={`font-display text-4xl leading-none tracking-tight transition-[color,transform] duration-300 ease-quiet md:text-6xl ${
                    on ? 'translate-x-2 italic text-ink' : 'text-ink/45 group-hover:text-ink/75'}`
                    }>
                    
                    {m.name}
                  </span>
                  <span className={`ml-auto shrink-0 text-[10px] font-medium uppercase tracking-label transition-opacity duration-200 ${on ? 'opacity-100' : 'opacity-0'}`}>
                    {m.defaultMinutes ? `${m.defaultMinutes} min` : 'Untimed'}
                  </span>
                </button>
              </div>);

          })}
        </div>

        <div className="md:col-span-7 md:pl-6">
          <div className="md:sticky md:top-28">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                id="mode-preview"
                role="tabpanel"
                aria-labelledby={`tab-${active.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                transition={{ duration: 0.25, ease: easeOut }}
                className={`relative flex min-h-[34rem] flex-col p-7 md:p-10 ${active.theme.panel}`}>
                
                <div className={`flex items-center justify-between font-mono text-[10px] uppercase tracking-label ${active.theme.muted}`}>
                  <span>{active.title}</span>
                  <span>{active.lenses.length > 3 ? `${active.lenses.length} lenses` : active.lenses.join(' · ')}</span>
                </div>
                <div aria-hidden className="flex flex-1 items-center justify-center py-10">
                  <ModeVisual mode={active} />
                </div>
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                  <p className="font-display text-3xl leading-tight md:text-4xl">
                    {active.lines[0]}
                    <br />
                    <em className={active.theme.muted}>{active.lines[1]}</em>
                  </p>
                  <Link to={`/write/${active.id}`} className="link-line self-start text-[0.7rem] font-medium uppercase tracking-label md:self-end">
                    Begin →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>);

}