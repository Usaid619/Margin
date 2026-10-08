import React from 'react';
import { writingModes } from '../data/modes';
import { RevealText } from '../components/animations/RevealText';
import { ModeFeature } from '../components/writing-modes/ModeFeature';

export function Modes() {
  return (
    <div className="bg-paper">
      <header className="px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-48">
        <p className="font-mono text-[10px] uppercase tracking-label text-mute">Writing modes</p>
        <RevealText
          as="h1"
          text="Five kinds of attention."
          show
          delay={0.3}
          className="mt-6 max-w-5xl font-display text-6xl leading-[0.92] tracking-tight md:text-[8.5vw]" />
        
        <p className="mt-8 max-w-lg text-ink/70 md:text-lg">Hover to look closer. Choose one, and the room will go quiet.</p>
      </header>
      {writingModes.map((mode, i) =>
      <ModeFeature key={mode.id} mode={mode} index={i} />
      )}
    </div>);

}