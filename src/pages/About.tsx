import React from 'react';
import { manifesto } from '../data/manifesto';
import { imagery } from '../data/imagery';
import { useStudio } from '../contexts/StudioContext';
import { RevealText } from '../components/animations/RevealText';
import { ParallaxImage } from '../components/ui/ParallaxImage';
import { MagneticButton } from '../components/ui/MagneticButton';

export function About() {
  const { user } = useStudio();
  return (
    <div className="bg-paper">
      <header className="px-6 pb-24 pt-36 md:px-10 md:pb-32 md:pt-48">
        <p className="font-mono text-[10px] uppercase tracking-label text-mute">About — a manifesto</p>
        <RevealText
          as="h1"
          show
          delay={0.3}
          stagger={0.05}
          text="We built a quiet room for the part of writing that happens before the words."
          className="mt-8 max-w-6xl font-display text-5xl leading-[0.98] tracking-tight md:text-[6.2vw]" />
        
      </header>

      <ParallaxImage src={imagery.aboutWindow.src} alt={imagery.aboutWindow.alt} className="mx-6 h-[55vh] md:mx-10 md:h-[80vh]" eager />

      {manifesto.map((section, i) =>
      <section key={section.numeral} aria-labelledby={`manifesto-${i}`} className="grid gap-8 border-b border-ink/10 px-6 py-24 md:grid-cols-12 md:px-10 md:py-36">
          <p aria-hidden className="font-display text-6xl italic leading-none text-amber md:col-span-2">
            {section.numeral}
          </p>
          <RevealText
          as="h2"
          id={`manifesto-${i}`}
          text={section.title}
          className="font-display text-5xl leading-[0.95] tracking-tight md:col-span-6 md:text-7xl" />
        
          <div className="space-y-6 font-writing text-lg leading-[1.8] text-ink/80 md:col-span-4 md:pt-3">
            {section.body.map((p) =>
          <p key={p}>{p}</p>
          )}
          </div>
        </section>
      )}

      <section className="flex flex-col items-center px-6 py-32 text-center md:py-44">
        <RevealText as="p" text="Give your thoughts somewhere to go." className="max-w-4xl font-display text-6xl leading-[0.95] tracking-tight md:text-8xl" />
        <div className="mt-14">
          <MagneticButton shape="circle" to={user ? '/dashboard' : '/signup'}>
            Start writing
          </MagneticButton>
        </div>
      </section>

      <section aria-label="Small print" className="grid gap-12 border-t border-ink/10 px-6 py-20 md:grid-cols-12 md:px-10">
        <div id="privacy" className="scroll-mt-28 md:col-span-5">
          <h2 className="font-mono text-[10px] uppercase tracking-label text-mute">Privacy</h2>
          <p className="mt-4 font-writing text-lg leading-relaxed">
            Your writing is yours. We don't read it, sell it, or train anything on it. It stays private unless you decide otherwise.
          </p>
        </div>
        <div id="terms" className="scroll-mt-28 md:col-span-5 md:col-start-8">
          <h2 className="font-mono text-[10px] uppercase tracking-label text-mute">Terms</h2>
          <p className="mt-4 font-writing text-lg leading-relaxed">
            Be kind in shared spaces. Keep what you write. Leave whenever you like, and take every word with you.
          </p>
        </div>
      </section>
    </div>);

}