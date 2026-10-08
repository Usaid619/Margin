import React from 'react';
import { MagneticButton } from './MagneticButton';

interface QuietErrorProps {
  variant?: 'page' | 'inline';
  title?: string;
  message: string;
  actionLabel?: string;
  to?: string;
  onAction?: () => void;
}

/** Errors, said like a person would say them. */
export function QuietError({ variant = 'inline', title = 'Something went quiet.', message, actionLabel, to, onAction }: QuietErrorProps) {
  if (variant === 'page') {
    return (
      <div className="flex min-h-[85vh] flex-col items-center justify-center bg-paper px-6 pb-20 pt-36 text-center">
        <span aria-hidden className="mb-10 block h-12 w-[2px] animate-caret bg-amber" />
        <h1 className="max-w-3xl font-display text-6xl leading-[0.95] tracking-tight md:text-8xl">{title}</h1>
        <p className="mt-6 max-w-md font-writing text-lg italic leading-relaxed text-ink/70 md:text-xl">{message}</p>
        {actionLabel &&
        <div className="mt-12">
            {to ? <MagneticButton to={to}>{actionLabel}</MagneticButton> : <MagneticButton onClick={onAction}>{actionLabel}</MagneticButton>}
          </div>
        }
      </div>);

  }

  return (
    <div role="alert" className="border-l-2 border-ember py-1 pl-4">
      <p className="font-display text-xl leading-tight">{title}</p>
      <p className="mt-1 text-sm leading-relaxed opacity-75">{message}</p>
      {actionLabel && onAction &&
      <button type="button" onClick={onAction} className="link-line mt-3 text-[0.68rem] font-medium uppercase tracking-label">
          {actionLabel}
        </button>
      }
    </div>);

}