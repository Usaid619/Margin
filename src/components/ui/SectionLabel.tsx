import React from 'react';

interface SectionLabelProps {
  id?: string;
  children: React.ReactNode;
  tone?: 'ink' | 'paper';
}

export function SectionLabel({ id, children, tone = 'ink' }: SectionLabelProps) {
  return (
    <h2 id={id} className={`flex items-center gap-4 font-mono text-[10px] uppercase tracking-label ${tone === 'ink' ? 'text-mute' : 'text-paper/60'}`}>
      <span className="shrink-0">{children}</span>
      <span aria-hidden className={`h-px flex-1 ${tone === 'ink' ? 'bg-ink/10' : 'bg-paper/15'}`} />
    </h2>);

}