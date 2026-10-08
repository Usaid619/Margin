import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShuffleIcon } from 'lucide-react';
import type { WritingMode } from '../../types/writing';
import { prompts } from '../../data/prompts';
import { useScramble } from '../../hooks/useScramble';
import { pick, shuffled } from '../../utils/random';
import { easeOut } from '../../utils/motion';
import { MagneticButton } from '../ui/MagneticButton';

const DURATIONS = [5, 10, 15, 25, 45];

interface FocusedSetupProps {
  mode: WritingMode;
  initialPrompt: string | null;
  initialMinutes: number | null;
  onBegin: (minutes: number, prompt: string) => void;
}

export function FocusedSetup({ mode, initialPrompt, initialMinutes, onBegin }: FocusedSetupProps) {
  const navigate = useNavigate();
  const pool = useMemo(() => shuffled(prompts).slice(0, 8), []);
  const isOwn = Boolean(initialPrompt) && !prompts.some((p) => p.text === initialPrompt);
  const [minutes, setMinutes] = useState(initialMinutes && initialMinutes > 0 ? initialMinutes : 15);
  const [source, setSource] = useState<'pick' | 'own'>(isOwn ? 'own' : 'pick');
  const [selected, setSelected] = useState(initialPrompt && !isOwn ? initialPrompt : pool[0].text);
  const [own, setOwn] = useState(isOwn && initialPrompt ? initialPrompt : '');
  const [turns, setTurns] = useState(0);
  const display = useScramble(selected);
  const durations = DURATIONS.includes(minutes) ? DURATIONS : [...DURATIONS, minutes].sort((a, b) => a - b);

  const randomize = () => {
    setSelected((current) => pick(prompts, prompts.find((p) => p.text === current)).text);
    setSource('pick');
    setTurns((t) => t + 1);
  };

  const finalPrompt = source === 'own' ? own.trim() : selected;
  const canBegin = finalPrompt.length > 3;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between px-5 py-5 md:px-10">
        <button type="button" onClick={() => navigate(-1)} className="link-line text-[0.68rem] font-medium uppercase tracking-label">
          ← Exit
        </button>
        <span className="font-mono text-[10px] uppercase tracking-label text-mute">{mode.title}</span>
      </header>

      <div className="grid gap-16 px-6 pb-32 pt-8 md:grid-cols-12 md:gap-10 md:px-10 md:pt-16">
        <div className="md:col-span-12">
          <h1 className="font-display text-6xl leading-[0.9] tracking-tight md:text-[8rem]">
            Focused <em>writing.</em>
          </h1>
          <p className="mt-6 max-w-md text-ink/70 md:text-lg">
            Choose a duration and a prompt. When the clock starts, don't stop — not to fix, not to reread, not to doubt.
          </p>
        </div>

        <section aria-labelledby="duration-label" className="md:col-span-3">
          <h2 id="duration-label" className="font-mono text-[10px] uppercase tracking-label text-mute">
            Duration
          </h2>
          <div role="radiogroup" aria-labelledby="duration-label" className="mt-6 flex flex-wrap gap-x-7 gap-y-3 md:flex-col">
            {durations.map((d) =>
            <button key={d} type="button" role="radio" aria-checked={minutes === d} onClick={() => setMinutes(d)} className="group flex items-baseline gap-3 text-left">
                <span
                className={`font-display text-5xl leading-none transition-colors duration-200 md:text-6xl ${
                minutes === d ? 'italic text-ink' : 'text-ink/45 group-hover:text-ink/75'}`
                }>
                
                  {d}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-label text-mute">min</span>
              </button>
            )}
          </div>
        </section>

        <section aria-labelledby="prompt-label" className="md:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="prompt-label" className="font-mono text-[10px] uppercase tracking-label text-mute">
              Prompt
            </h2>
            <div className="flex gap-6 text-[0.68rem] font-medium uppercase tracking-label">
              <button type="button" aria-pressed={source === 'pick'} data-active={source === 'pick'} onClick={() => setSource('pick')} className="link-line">
                Choose one
              </button>
              <button type="button" aria-pressed={source === 'own'} data-active={source === 'own'} onClick={() => setSource('own')} className="link-line">
                Write your own
              </button>
            </div>
          </div>

          {source === 'pick' ?
          <>
              <p aria-live="polite" className="mt-8 min-h-[2.4em] font-display text-3xl italic leading-[1.1] tracking-tight md:text-6xl">
                <span className="sr-only">{selected}</span>
                <span aria-hidden>“{display}”</span>
              </p>
              <button type="button" onClick={randomize} className="link-line mt-6 inline-flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-label">
                <motion.span animate={{ rotate: turns * 180 }} transition={{ duration: 0.3, ease: easeOut }} className="inline-flex">
                  <ShuffleIcon aria-hidden className="h-4 w-4" strokeWidth={1.5} />
                </motion.span>
                Give me another
              </button>

              <ul className="no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-0 md:overflow-visible md:border-t md:border-ink/10 md:px-0">
                {pool.map((p) => {
                const on = selected === p.text;
                return (
                  <li key={p.id} className="w-[78vw] shrink-0 snap-center md:w-auto md:border-b md:border-ink/10 md:odd:pr-8">
                      <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSelected(p.text)}
                      className={`h-full w-full border p-5 text-left transition-colors duration-200 md:border-0 md:px-0 md:py-5 ${on ? 'border-ink' : 'border-ink/15'}`}>
                      
                        <span className="font-mono text-[10px] uppercase tracking-label text-mute">{p.category}</span>
                        <span className={`mt-2 block font-writing text-[15px] leading-snug transition-colors duration-200 ${on ? 'text-ink' : 'text-ink/70 hover:text-ink'}`}>
                          {on && <span aria-hidden className="mr-2 text-amber">●</span>}
                          {p.text}
                        </span>
                      </button>
                    </li>);

              })}
              </ul>
            </> :

          <label className="mt-8 block">
              <span className="sr-only">Your own prompt</span>
              <textarea
              value={own}
              onChange={(e) => setOwn(e.target.value)}
              rows={3}
              autoFocus
              placeholder="Write the question you want to answer…"
              className="w-full resize-none border-b border-ink/25 bg-transparent pb-3 font-display text-3xl italic leading-tight outline-none placeholder:text-ink/45 focus:border-ink focus-visible:outline-none md:text-5xl" />
            
            </label>
          }
        </section>

        <div className="flex flex-col items-start justify-between gap-6 border-t border-ink/10 pt-8 sm:flex-row sm:items-center md:col-span-12">
          <p className="text-sm text-ink/70">
            {minutes} minutes · {source === 'own' ? 'Your own prompt' : 'A chosen prompt'} · The clock starts when the room goes dark.
          </p>
          <MagneticButton onClick={() => onBegin(minutes, finalPrompt)} disabled={!canBegin}>
            Begin
          </MagneticButton>
        </div>
      </div>
    </div>);

}