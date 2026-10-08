import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import type { Writing } from '../../types/writing';
import { writingModes } from '../../data/modes';
import { countWords, excerpt, formatNumber } from '../../utils/text';
import { formatShort } from '../../utils/date';

interface PieceRowProps {
  writing: Writing;
  to?: string;
}

export function PieceRow({ writing, to }: PieceRowProps) {
  const mode = writingModes.find((m) => m.id === writing.mode);
  const words = countWords(writing.body);

  return (
    <li className="cv-auto border-b border-ink/10">
      <Link to={to ?? `/library/${writing.id}`} className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 py-6 md:grid-cols-12 md:py-7">
        <span className="order-2 col-span-2 font-mono text-[10px] uppercase tracking-label text-mute md:order-none md:col-span-2">
          {formatShort(writing.createdAt)}
          <span className="md:hidden"> · {mode?.title}</span>
        </span>
        <span className="md:col-span-6">
          <span className="block font-display text-3xl leading-tight tracking-tight transition-transform duration-300 ease-quiet group-hover:translate-x-2 md:text-4xl">
            {writing.title}
            {writing.favorite &&
            <span className="ml-3 align-middle text-base text-amber" aria-label="Favorite">
                ✦
              </span>
            }
          </span>
          <span className="mt-2 line-clamp-1 block max-w-xl text-sm leading-relaxed text-ink/60">{excerpt(writing.body, 130)}</span>
        </span>
        <span className="hidden text-sm text-ink/70 md:col-span-2 md:block">
          {mode?.title}
          {writing.status === 'draft' && <em className="ml-2 font-display text-base text-ember">draft</em>}
        </span>
        <span className="flex items-center justify-end gap-2 text-right font-mono text-[11px] tabular-nums text-ink/70 md:col-span-2">
          {formatNumber(words)} words
          <ArrowUpRightIcon aria-hidden className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" strokeWidth={1.5} />
        </span>
      </Link>
    </li>);

}