import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { TimeOfDay, WritingReason } from '../types/user';
import type { WritingModeId } from '../types/writing';
import { useStudio } from '../contexts/StudioContext';
import { reasonOptions, timeOptions } from '../data/onboarding';
import { writingModes } from '../data/modes';
import { easeOut } from '../utils/motion';
import { OptionRow } from '../components/ui/OptionRow';
import { MagneticButton } from '../components/ui/MagneticButton';

const QUESTIONS = ['What brings you here?', 'How do you like to write?', 'When do you usually write?'];

export function Onboarding() {
  const { user, preferences, updatePreferences } = useStudio();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState<WritingReason | null>(preferences.reason);
  const [modes, setModes] = useState<WritingModeId[]>(preferences.modes);
  const [time, setTime] = useState<TimeOfDay | null>(preferences.timeOfDay);

  const canContinue = step === 0 ? Boolean(reason) : step === 1 ? modes.length > 0 : Boolean(time);
  const firstName = user?.name.split(' ')[0] ?? 'there';

  const toggleMode = (id: WritingModeId) => setModes((m) => m.includes(id) ? m.filter((x) => x !== id) : [...m, id]);

  const finish = (skip = false) => {
    updatePreferences({
      reason: skip ? reason : reason,
      modes: modes.length ? modes : ['focused'],
      timeOfDay: time,
      hasOnboarded: true
    });
    navigate('/dashboard', { replace: true });
  };

  const next = () => step < 2 ? setStep(step + 1) : finish();

  return (
    <div className="flex min-h-screen flex-col bg-paper px-6 py-6 md:px-10 md:py-8">
      <header className="flex items-center justify-between gap-6">
        <Link to="/" className="font-display text-2xl italic">
          Margin
        </Link>
        <div aria-hidden className="flex w-40 gap-2 md:w-56">
          {QUESTIONS.map((q, i) =>
          <span key={q} className="h-px flex-1 bg-ink/15">
              <motion.span className="block h-px origin-left bg-ink" animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.3, ease: easeOut }} />
            </span>
          )}
        </div>
        <button type="button" onClick={() => finish(true)} className="link-line text-[0.68rem] font-medium uppercase tracking-label">
          Skip for now
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center py-16">
        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            aria-labelledby={`q-${step}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: easeOut }}>
            
            {step === 0 && <p className="font-mono text-[10px] uppercase tracking-label text-mute">Welcome, {firstName}.</p>}
            <h1 id={`q-${step}`} className="mt-4 font-display text-5xl leading-[0.95] tracking-tight md:text-8xl">
              {QUESTIONS[step]}
            </h1>
            {step === 1 && <p className="mt-4 text-ink/70">Choose as many as you like. The first one becomes your default.</p>}

            <div role={step === 1 ? 'group' : 'radiogroup'} aria-labelledby={`q-${step}`} className="mt-12 border-t border-ink/10">
              {step === 0 &&
              reasonOptions.map((o, i) =>
              <OptionRow key={o.id} role="radio" index={i} checked={reason === o.id} onSelect={() => setReason(o.id)} label={o.label} note={o.note} />
              )}
              {step === 1 &&
              writingModes.map((m, i) =>
              <OptionRow key={m.id} role="checkbox" index={i} checked={modes.includes(m.id)} onSelect={() => toggleMode(m.id)} label={m.title} note={m.lines.join(' ')} />
              )}
              {step === 2 &&
              timeOptions.map((o, i) =>
              <OptionRow key={o.id} role="radio" index={i} checked={time === o.id} onSelect={() => setTime(o.id)} label={o.label} note={o.note} />
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      <footer className="mx-auto flex w-full max-w-4xl items-center justify-between gap-6 pb-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="link-line text-[0.68rem] font-medium uppercase tracking-label disabled:opacity-0">
          
          ← Back
        </button>
        <MagneticButton onClick={next} disabled={!canContinue}>
          {step < 2 ? 'Continue' : 'Enter the studio'}
        </MagneticButton>
      </footer>
    </div>);

}