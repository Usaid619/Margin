import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PromptCategory } from '../types/writing';
import { promptCategories, prompts } from '../data/prompts';
import { shuffled } from '../utils/random';
import { PromptShuffle } from '../components/prompts/PromptShuffle';
import { PromptCard } from '../components/prompts/PromptCard';

export function Prompts() {
  const [category, setCategory] = useState<PromptCategory>('Memory');
  const [seed, setSeed] = useState(0);

  const list = useMemo(
    () => category === 'Random' ? shuffled(prompts).slice(0, 8) : prompts.filter((p) => p.category === category),
    // seed intentionally reshuffles the Random category
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, seed]
  );

  return (
    <div className="bg-paper pb-32">
      <header className="grid gap-8 px-6 pt-32 md:grid-cols-12 md:items-end md:px-10 md:pt-40">
        <div className="md:col-span-8">
          <p className="font-mono text-[10px] uppercase tracking-label text-mute">Prompts</p>
          <h1 className="mt-5 font-display text-7xl leading-[0.88] tracking-tight md:text-[8.5vw]">
            Small <em>doors.</em>
          </h1>
        </div>
        <p className="leading-relaxed text-ink/70 md:col-span-4">
          Each one is an invitation, not an assignment. Walk through any of them and see where it opens.
        </p>
      </header>

      <PromptShuffle />

      <nav aria-label="Prompt categories" className="mt-24 px-6 md:px-10">
        <ul className="no-scrollbar flex gap-7 overflow-x-auto border-b border-ink/10 pb-4">
          {promptCategories.map((c) => {
            const on = c === category;
            return (
              <li key={c} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={on}
                  data-active={on}
                  onClick={() => {
                    setCategory(c);
                    if (c === 'Random') setSeed((s) => s + 1);
                  }}
                  className={`link-line whitespace-nowrap text-[0.68rem] font-medium uppercase tracking-label transition-colors duration-200 ${on ? 'text-ink' : 'text-ink/55 hover:text-ink'}`}>
                  
                  {c}
                </button>
              </li>);

          })}
        </ul>
      </nav>

      <AnimatePresence mode="wait">
        <motion.ol
          key={`${category}-${seed}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid px-6 md:grid-cols-2 md:px-10">
          
          {list.map((p) =>
          <PromptCard key={p.id} prompt={p} number={prompts.indexOf(p) + 1} />
          )}
        </motion.ol>
      </AnimatePresence>

      {category === 'Random' &&
      <div className="mt-12 px-6 md:px-10">
          <button type="button" onClick={() => setSeed((s) => s + 1)} className="link-line text-[0.68rem] font-medium uppercase tracking-label">
            Shuffle the deck again
          </button>
        </div>
      }
    </div>);

}