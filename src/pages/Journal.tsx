import React from 'react';
import { Link } from 'react-router-dom';
import { journalArticles } from '../data/journal';
import { formatLong } from '../utils/date';
import { pad } from '../utils/text';
import { ParallaxImage } from '../components/ui/ParallaxImage';

export function Journal() {
  const [feature, ...rest] = journalArticles;

  return (
    <div className="bg-paper pb-32">
      <header className="flex flex-col justify-between gap-8 border-b border-ink/10 px-6 pb-10 pt-32 md:flex-row md:items-end md:px-10 md:pt-40">
        <h1 className="font-display text-[24vw] leading-[0.8] tracking-tight md:text-[13vw]">Journal</h1>
        <p className="max-w-xs leading-relaxed text-ink/70">Essays on attention, memory, and the long practice of writing things down. New pieces on Sundays.</p>
      </header>

      <Link to={`/journal/${feature.slug}`} className="group grid gap-10 border-b border-ink/10 px-6 py-16 md:grid-cols-12 md:px-10 md:py-20">
        {feature.image && <ParallaxImage src={feature.image} alt={feature.imageAlt ?? ''} className="aspect-[4/3] md:col-span-7 md:aspect-auto md:min-h-[32rem]" eager />}
        <div className="flex flex-col justify-between gap-10 md:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-label text-mute">
            Feature · {feature.category}
          </p>
          <div>
            <h2 className="font-display text-5xl leading-[0.95] tracking-tight transition-transform duration-300 ease-quiet group-hover:translate-x-2 md:text-7xl">{feature.title}</h2>
            <p className="mt-6 font-writing text-xl italic leading-relaxed text-ink/70">{feature.dek}</p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-label text-mute">
            {feature.author} · {formatLong(feature.date)} · {feature.readMinutes} min read
          </p>
        </div>
      </Link>

      <ol className="px-6 md:px-10">
        {rest.map((a, i) =>
        <li key={a.slug} className="border-b border-ink/10">
            <Link to={`/journal/${a.slug}`} className="group grid gap-3 py-10 md:grid-cols-12 md:items-baseline md:gap-6">
              <span className="font-mono text-[10px] uppercase tracking-label text-mute md:col-span-1">{pad(i + 2)}</span>
              <span className="font-mono text-[10px] uppercase tracking-label text-mute md:col-span-2">{a.category}</span>
              <span className="md:col-span-6">
                <span className="block font-display text-4xl leading-tight tracking-tight transition-transform duration-300 ease-quiet group-hover:translate-x-2 md:text-5xl">{a.title}</span>
                <span className="mt-3 block max-w-xl leading-relaxed text-ink/65">{a.dek}</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-label text-mute md:col-span-3 md:text-right">
                {a.author} · {a.readMinutes} min
              </span>
            </Link>
          </li>
        )}
      </ol>
    </div>);

}