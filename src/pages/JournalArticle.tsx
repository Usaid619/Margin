import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { journalArticles } from '../data/journal';
import { formatLong } from '../utils/date';
import { ParallaxImage } from '../components/ui/ParallaxImage';
import { QuietError } from '../components/ui/QuietError';

export function JournalArticle() {
  const { slug } = useParams<{slug: string;}>();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const index = journalArticles.findIndex((a) => a.slug === slug);
  const article = journalArticles[index];

  if (!article) {
    return <QuietError variant="page" title="This essay went quiet." message="We couldn't find it. Perhaps it's still being written." actionLabel="Back to the journal" to="/journal" />;
  }

  const next = journalArticles[(index + 1) % journalArticles.length];

  return (
    <article className="bg-paper pb-32">
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-amber" style={{ scaleX: progress }} />

      <header className="mx-auto max-w-5xl px-6 pt-36 text-center md:pt-48">
        <p className="font-mono text-[10px] uppercase tracking-label text-mute">
          {article.category} · {formatLong(article.date)}
        </p>
        <h1 className="mt-8 font-display text-5xl leading-[0.95] tracking-tight md:text-8xl">{article.title}</h1>
        <p className="mx-auto mt-8 max-w-2xl font-writing text-xl italic leading-relaxed text-ink/70 md:text-2xl">{article.dek}</p>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-label text-mute">
          By {article.author} · {article.readMinutes} min read
        </p>
      </header>

      {article.image && <ParallaxImage src={article.image} alt={article.imageAlt ?? ''} className="mx-6 mt-16 h-[55vh] md:mx-10 md:mt-24 md:h-[75vh]" eager />}

      <div className="mx-auto mt-20 max-w-[38rem] px-6 font-writing text-[1.15rem] leading-[1.85] md:mt-28 md:text-[1.25rem]">
        {article.body.map((p, i) =>
        <React.Fragment key={p}>
            <p
            className={`mb-7 ${i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.8rem] first-letter:leading-[0.78] first-letter:text-forest' : ''}`}>
            
              {p}
            </p>
            {i === 1 && article.pullQuote &&
          <blockquote className="my-16 border-y border-ink/15 py-10 text-center font-display text-3xl italic leading-tight md:-mx-24 md:text-5xl">
                “{article.pullQuote}”
              </blockquote>
          }
          </React.Fragment>
        )}
        <p aria-hidden className="mt-16 text-center font-display text-3xl text-mute">
          ⁂
        </p>
      </div>

      <nav aria-label="Next essay" className="mx-6 mt-24 border-t border-ink/10 pt-12 md:mx-10">
        <Link to={`/journal/${next.slug}`} className="group block">
          <span className="font-mono text-[10px] uppercase tracking-label text-mute">Next essay →</span>
          <span className="mt-4 block font-display text-5xl leading-none tracking-tight transition-transform duration-300 ease-quiet group-hover:translate-x-2 md:text-7xl">{next.title}</span>
        </Link>
      </nav>
    </article>);

}