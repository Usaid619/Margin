import React from 'react';
import { Link } from 'react-router-dom';
import { imagery } from '../../data/imagery';
import { RevealText } from '../animations/RevealText';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  quote: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Entering a quiet studio: a lamp-lit desk on one side, the door on the other. */
export function AuthLayout({ title, subtitle, quote, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-ink text-paper lg:block">
        <img src={imagery.authDesk.src} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div aria-hidden className="absolute inset-0 bg-ink/35" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3">
            <span aria-hidden className="h-6 w-px bg-paper" />
            <span className="font-display text-3xl italic">Margin</span>
          </Link>
          <p className="max-w-md font-display text-4xl leading-tight">{quote}</p>
        </div>
      </aside>

      <div className="flex flex-col px-6 py-6 md:px-16 md:py-8">
        <div className="flex items-center justify-between lg:justify-end">
          <Link to="/" className="font-display text-2xl italic lg:hidden">
            Margin
          </Link>
          <Link to="/" className="link-line text-[0.68rem] font-medium uppercase tracking-label">
            Back to the studio
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-16">
          <RevealText as="h1" text={title} show className="font-display text-6xl leading-[0.95] tracking-tight md:text-7xl" />
          <p className="mt-4 font-display text-2xl italic text-ink/60">{subtitle}</p>
          <div className="mt-12">{children}</div>
        </div>
        {footer && <div className="mx-auto w-full max-w-md pb-4 text-sm text-ink/70">{footer}</div>}
      </div>
    </div>);

}