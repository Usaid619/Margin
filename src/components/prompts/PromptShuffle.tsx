import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShuffleIcon } from 'lucide-react';
import { prompts } from '../../data/prompts';
import { useScramble } from '../../hooks/useScramble';
import { pick } from '../../utils/random';
import { easeOut } from '../../utils/motion';
import { MagneticButton } from '../ui/MagneticButton';

export function PromptShuffle() {
  const [current, setCurrent] = useState(() => pick(prompts));
  const [turns, setTurns] = useState(0);
  const text = useScramble(current.text, 620);

  const another = () => {
    setCurrent((c) => pick(prompts, c));
    setTurns((t) => t + 1);
  };

  return (
    <section aria-labelledby="shuffle-label" className="mt-20 bg-ink px-6 py-20 text-paper md:px-10 md:py-28">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <h2 id="shuffle-label" className="font-mono text-[10px] uppercase tracking-label text-paper/60">
            A prompt, at random
          </h2>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-label text-glow">{current.category}</p>
        </div>
        <div className="md:col-span-9">
          <p aria-live="polite" className="min-h-[3.3em] font-display text-4xl italic leading-[1.08] tracking-tight md:min-h-[2.3em] md:text-7xl">
            <span className="sr-only">{current.text}</span>
            <span aria-hidden>“{text}”</span>
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <MagneticButton tone="paper" to={`/write/focused?prompt=${encodeURIComponent(current.text)}`}>
              Write this
            </MagneticButton>
            <button type="button" onClick={another} className="link-line inline-flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-label">
              <motion.span animate={{ rotate: turns * 180 }} transition={{ duration: 0.3, ease: easeOut }} className="inline-flex">
                <ShuffleIcon aria-hidden className="h-4 w-4" strokeWidth={1.5} />
              </motion.span>
              Give me another
            </button>
          </div>
        </div>
      </div>
    </section>);

}