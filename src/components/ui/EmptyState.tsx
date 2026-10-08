import React from 'react';
import { MagneticButton } from './MagneticButton';

interface EmptyStateProps {
  title?: string;
  line?: string;
  ctaLabel?: string;
  to?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'There are no words here yet.',
  line = "That's what you're here to change.",
  ctaLabel = 'Write something',
  to = '/write/free',
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-8 py-20 md:py-28">
      <span aria-hidden className="block h-10 w-[2px] animate-caret bg-amber" />
      <div>
        <p className="font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">{title}</p>
        <p className="mt-4 font-display text-2xl italic text-ink/60 md:text-3xl">{line}</p>
      </div>
      {onAction ? <MagneticButton onClick={onAction}>{ctaLabel}</MagneticButton> : <MagneticButton to={to}>{ctaLabel}</MagneticButton>}
    </div>);

}