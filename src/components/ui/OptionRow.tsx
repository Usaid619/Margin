import React from 'react';
import { toRoman } from '../../utils/text';

interface OptionRowProps {
  role: 'radio' | 'checkbox';
  checked: boolean;
  onSelect: () => void;
  label: string;
  note?: string;
  index: number;
}

export function OptionRow({ role, checked, onSelect, label, note, index }: OptionRowProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      onClick={onSelect}
      className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 border-b border-ink/10 py-5 text-left md:py-6">
      
      <span className="font-mono text-[10px] tracking-label text-mute">{toRoman(index + 1)}</span>
      <span>
        <span
          className={`block font-display text-3xl leading-tight tracking-tight transition-[transform,color] duration-300 ease-quiet md:text-5xl ${
          checked ? 'translate-x-2 italic text-ink' : 'text-ink/60 group-hover:text-ink'}`
          }>
          
          {label}
        </span>
        {note && <span className="mt-1 block text-sm text-ink/60">{note}</span>}
      </span>
      <span
        aria-hidden
        className={`h-3.5 w-3.5 rounded-full border transition-colors duration-200 ${checked ? 'border-ink bg-ink' : 'border-ink/40'}`} />
      
    </button>);

}