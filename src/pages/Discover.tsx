import React from 'react';
import { Link } from 'react-router-dom';
import { format, getDayOfYear } from 'date-fns';
import { prompts } from '../data/prompts';
import { writingModes } from '../data/modes';
import { communityPieces, objectOfTheDay, wordOfTheDay, writingExercise } from '../data/discover';
import { MagneticButton } from '../components/ui/MagneticButton';
import { RevealText } from '../components/animations/RevealText';

export function Discover() {
  const today = new Date();
  const prompt = prompts[getDayOfYear(today) % prompts.length];
  const label = 'font-mono text-[10px] uppercase tracking-label';

  return (
    <div className="bg-paper pb-32">
      <header className="px-6 pt-32 md:px-10 md:pt-40">
        <p className={`${label} text-mute`}>{format(today, 'EEEE, d MMMM')}</p>
        <RevealText as="h1" show delay={0.3} text="Today's small provocations." className="mt-5 max-w-5xl font-display text-6xl leading-[0.9] tracking-tight md:text-[7.5vw]" />
      </header>

      <div className="mt-16 grid gap-px border-y border-ink/10 bg-ink/10 md:mt-24 md:grid-cols-12">
        <section aria-labelledby="d-prompt" className="flex min-h-[30rem] flex-col justify-between gap-12 bg-navy p-8 text-paper md:col-span-8 md:p-12">
          <h2 id="d-prompt" className={`${label} text-paper/60`}>
            Today's prompt
          </h2>
          <p className="font-display text-4xl italic leading-[1.06] tracking-tight md:text-7xl">“{prompt.text}”</p>
          <div className="flex flex-wrap items-center gap-8">
            <MagneticButton tone="paper" to={`/write/focused?prompt=${encodeURIComponent(prompt.text)}`}>
              Write this
            </MagneticButton>
            <span className={`${label} text-glow`}>{prompt.category}</span>
          </div>
        </section>

        <section aria-labelledby="d-object" className="flex flex-col bg-cream md:col-span-4">
          <img src={objectOfTheDay.image} alt={objectOfTheDay.imageAlt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-64" />
          <div className="flex flex-1 flex-col justify-between gap-8 p-8">
            <h2 id="d-object" className={`${label} text-mute`}>
              Object of the day
            </h2>
            <div>
              <p className="font-display text-5xl uppercase leading-none tracking-tight">{objectOfTheDay.name}</p>
              <p className="mt-4 font-writing italic leading-relaxed text-ink/70">{objectOfTheDay.note}</p>
            </div>
            <Link to={`/write/object?object=${encodeURIComponent(objectOfTheDay.name)}`} className="link-line self-start text-[0.68rem] font-medium uppercase tracking-label">
              Look closer →
            </Link>
          </div>
        </section>

        <section aria-labelledby="d-word" className="bg-paper p-8 md:col-span-5 md:p-12">
          <h2 id="d-word" className={`${label} text-mute`}>
            Word of the day
          </h2>
          <p className="mt-10 font-display text-7xl italic leading-none tracking-tight md:text-8xl">{wordOfTheDay.word}</p>
          <p className={`mt-4 ${label} text-mute`}>
            {wordOfTheDay.pronunciation} · {wordOfTheDay.partOfSpeech}
          </p>
          <p className="mt-6 font-writing text-xl leading-relaxed">{wordOfTheDay.definition}</p>
          <div aria-hidden className="my-8 h-px w-12 bg-ink/20" />
          <p className="text-sm leading-relaxed text-ink/70">{wordOfTheDay.history}</p>
        </section>

        <section aria-labelledby="d-exercise" className="flex flex-col justify-between gap-10 bg-forest p-8 text-paper md:col-span-7 md:p-12">
          <h2 id="d-exercise" className={`${label} text-paper/65`}>
            Writing exercise · {writingExercise.minutes} minutes
          </h2>
          <div>
            <p className="font-display text-5xl leading-none tracking-tight md:text-6xl">{writingExercise.title}</p>
            <p className="mt-6 max-w-xl font-writing text-xl leading-relaxed">{writingExercise.instruction}</p>
            <p className="mt-3 max-w-xl font-writing italic text-paper/75">{writingExercise.constraint}</p>
          </div>
          <div>
            <MagneticButton
              variant="outline"
              tone="paper"
              to={`/write/focused?prompt=${encodeURIComponent(`${writingExercise.instruction} ${writingExercise.constraint}`)}&minutes=${writingExercise.minutes}`}>
              
              Try it
            </MagneticButton>
          </div>
        </section>
      </div>

      <section aria-labelledby="community" className="px-6 pt-28 md:px-10 md:pt-36">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <h2 id="community" className="font-display text-5xl leading-none tracking-tight md:col-span-7 md:text-7xl">
            From the <em>community.</em>
          </h2>
          <p className="text-ink/70 md:col-span-5">Selected by the editors, shared with permission. Short excerpts from people writing in small rooms everywhere.</p>
        </div>
        <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-10">
          {communityPieces.map((piece) =>
          <article key={piece.id} className="flex flex-col border-t border-ink/15 pt-6">
              <p className={`${label} text-mute`}>{writingModes.find((m) => m.id === piece.mode)?.title}</p>
              <h3 className="mt-4 font-display text-3xl leading-tight">{piece.title}</h3>
              <p className="mt-4 flex-1 font-writing italic leading-relaxed text-ink/80">“{piece.excerpt}”</p>
              <p className={`mt-6 ${label} text-mute`}>
                {piece.author} — {piece.location}
              </p>
            </article>
          )}
        </div>
      </section>
    </div>);

}