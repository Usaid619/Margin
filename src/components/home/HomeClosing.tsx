import React from 'react';
import { useStudio } from '../../contexts/StudioContext';
import { RevealText } from '../animations/RevealText';
import { MagneticButton } from '../ui/MagneticButton';

export function HomeClosing() {
  const { user } = useStudio();
  return (
    <section aria-labelledby="closing-title" className="flex min-h-[90vh] flex-col items-center justify-center border-t border-ink/10 bg-paper px-6 py-28 text-center">
      <RevealText
        as="h2"
        id="closing-title"
        text="Give your thoughts somewhere to go."
        className="max-w-5xl font-display text-[13vw] leading-[0.92] tracking-tight md:text-[7.5vw]" />
      
      <p className="mt-8 max-w-md text-base leading-relaxed text-ink/70 md:text-lg">
        No feeds. No followers. Just a quiet room, a blinking cursor, and as much time as you want to give it.
      </p>
      <div className="mt-14">
        <MagneticButton shape="circle" to={user ? '/dashboard' : '/signup'} strength={0.4}>
          Start writing
        </MagneticButton>
      </div>
    </section>);

}