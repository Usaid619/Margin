import React, { useEffect, useMemo, useState } from 'react';
import { loadingLines } from '../../data/loading';

interface TypeLoaderProps {
  line?: string;
  className?: string;
}

/** A typographic loading state — words being written instead of a spinner. */
export function TypeLoader({ line, className = '' }: TypeLoaderProps) {
  const text = useMemo(() => line ?? loadingLines[Math.floor(Math.random() * loadingLines.length)], [line]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 45);
    return () => window.clearInterval(id);
  }, [text]);

  return (
    <div role="status" aria-live="polite" className={`flex min-h-[70vh] w-full items-center justify-center px-6 ${className}`}>
      <p className="font-display text-2xl italic text-mute md:text-3xl">
        <span className="sr-only">{text}</span>
        <span aria-hidden>{text.slice(0, count)}</span>
        <span aria-hidden className="ml-1 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-caret bg-amber" />
      </p>
    </div>);

}