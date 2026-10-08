import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { WritingMode } from '../../types/writing';
import { formatClock } from '../../utils/text';
import { easeOut } from '../../utils/motion';

const LENS_LINES = [
'A red head on worn sandpaper.',
'A rasp, then a held breath.',
'Sulphur and old kitchen drawers.',
'Something metallic, almost.',
'Lighter than it should be.',
'Power cuts. Birthday candles.',
'The feeling before a beginning.'];

const STREAM = [
'the kettle clicks off and nobody moves',
'I keep thinking about the word almost',
'there was a blue door, or I want there to have been',
'my hands are cold and the sentence is warm',
'what if I just kept going',
'the train is late again and I am glad'];

const MOMENTS = [
{ label: 'Before you could read', x: 8 },
{ label: 'Ten years ago', x: 36 },
{ label: 'Last spring', x: 64 },
{ label: 'Yesterday', x: 90 }];

const NOTES = [
{ t: '14:02', text: 'a dog waits outside the bakery', x: 18, y: 26 },
{ t: '14:03', text: 'someone checks the same pocket twice', x: 50, y: 56 },
{ t: '14:05', text: 'the light turns amber on the glass', x: 24, y: 78 }];


function useTicker(length: number, ms: number) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % length), ms);
    return () => window.clearInterval(id);
  }, [length, ms, reduce]);
  return index;
}

function ObjectVisual({ lenses, accent }: {lenses: string[];accent: string;}) {
  const active = useTicker(lenses.length, 1500);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem]">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
        <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="1 5" />
      </svg>
      {lenses.map((lens, i) => {
        const angle = i / lenses.length * Math.PI * 2 - Math.PI / 2;
        return (
          <span
            key={lens}
            style={{ left: `${50 + Math.cos(angle) * 44}%`, top: `${50 + Math.sin(angle) * 44}%`, color: i === active ? accent : undefined }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-label transition-[color,opacity] duration-300 ${i === active ? 'opacity-100' : 'opacity-70'}`}>
            
            {lens}
          </span>);

      })}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center">
        <span className="font-display text-4xl italic">a matchbox</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="mt-3 font-writing text-sm italic opacity-80">
            
            {LENS_LINES[active % LENS_LINES.length]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>);

}

function FocusedVisual({ accent }: {accent: string;}) {
  const reduce = useReducedMotion();
  const [left, setLeft] = useState(583);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setLeft((l) => l <= 540 ? 600 : l - 1), 1000);
    return () => window.clearInterval(id);
  }, [reduce]);
  const circumference = 2 * Math.PI * 80;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[18rem]">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - left / 600)}
          style={{ transition: 'stroke-dashoffset 1s linear' }} />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl tabular-nums">{formatClock(left)}</span>
        <span className="mt-2 font-mono text-[10px] uppercase tracking-label opacity-70">remaining</span>
      </div>
    </div>);

}

function FreeVisual() {
  return (
    <div className="relative h-72 w-full max-w-sm overflow-hidden">
      <div className="animate-stream space-y-5">
        {[...STREAM, ...STREAM].map((line, i) =>
        <p key={i} className="font-writing text-lg italic" style={{ opacity: 0.45 + i * 7 % 5 / 9 }}>
            {line}
          </p>
        )}
      </div>
    </div>);

}

function ReflectionVisual({ accent }: {accent: string;}) {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full max-w-md py-24">
      <p className="absolute left-0 top-2 font-writing text-lg italic">Go back. Stay longer.</p>
      <div className="h-px w-full bg-current opacity-30" />
      {MOMENTS.map((m) =>
      <div key={m.label} style={{ left: `${m.x}%` }} className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <span className="h-2 w-2 rounded-full bg-current" />
          <span className="absolute top-5 whitespace-nowrap font-mono text-[10px] uppercase tracking-label opacity-80">{m.label}</span>
        </div>
      )}
      <motion.div
        className="absolute top-1/2 h-12 w-px -translate-y-1/2"
        style={{ background: accent }}
        animate={reduce ? undefined : { left: ['92%', '6%', '92%'] }}
        transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }} />
      
    </div>);

}

function ObservationVisual({ accent }: {accent: string;}) {
  const active = useTicker(NOTES.length, 2000);
  const corner = 'absolute h-6 w-6 border-current opacity-60';
  return (
    <div className="relative aspect-[4/3] w-full max-w-md">
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
      <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-current opacity-50" />
      <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-current opacity-50" />
      {NOTES.map((note, i) =>
      <div key={note.t} className="absolute" style={{ left: `${note.x}%`, top: `${note.y}%` }}>
          <span className="block h-1.5 w-1.5 rounded-full transition-opacity duration-300" style={{ background: accent, opacity: i === active ? 1 : 0.35 }} />
          <AnimatePresence>
            {i === active &&
          <motion.p
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="absolute left-4 top-[-7px] w-56 font-writing text-sm italic">
            
                <span className="mr-2 font-mono text-[10px] not-italic opacity-70">{note.t}</span>
                {note.text}
              </motion.p>
          }
          </AnimatePresence>
        </div>
      )}
    </div>);

}

/** Each mode's own small visual personality. Decorative only. */
export function ModeVisual({ mode }: {mode: WritingMode;}) {
  switch (mode.id) {
    case 'object':
      return <ObjectVisual lenses={mode.lenses} accent={mode.theme.hex} />;
    case 'focused':
      return <FocusedVisual accent={mode.theme.hex} />;
    case 'free':
      return <FreeVisual />;
    case 'reflection':
      return <ReflectionVisual accent={mode.theme.hex} />;
    default:
      return <ObservationVisual accent={mode.theme.hex} />;
  }
}