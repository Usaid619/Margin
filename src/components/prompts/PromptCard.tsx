import React from 'react';
import { Link } from 'react-router-dom';
import type { Prompt } from '../../types/writing';
import { pad } from '../../utils/text';

interface PromptCardProps {
  prompt: Prompt;
  number: number;
}

/** A prompt set like a small literary artifact. */
export function PromptCard({ prompt, number }: PromptCardProps) {
  return (
    <li className="border-b border-ink/10 md:odd:border-r md:odd:pr-10 md:even:pl-10">
      <Link
        to={`/write/focused?prompt=${encodeURIComponent(prompt.text)}`}
        data-cursor="label"
        data-cursor-label="Write"
        className="group flex min-h-[15rem] flex-col justify-between py-10">
        
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-label text-mute">
          <span>No. {pad(number, 3)}</span>
          <span>{prompt.category}</span>
        </div>
        <p className="mt-8 font-display text-3xl italic leading-[1.12] tracking-tight transition-transform duration-300 ease-quiet group-hover:-translate-y-1 md:text-[2.5rem]">
          “{prompt.text}”
        </p>
        <span className="mt-8 inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-label transition-[opacity,transform] duration-300 ease-quiet md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
          Write this →
        </span>
      </Link>
    </li>);

}