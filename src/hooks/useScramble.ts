import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';

/** Letters shuffle, then settle left to right into the new text. */
export function useScramble(text: string, duration = 560): string {
  const reduce = useReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (reduce) {
      setOutput(text);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * text.length);
      let next = '';
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        next += i < settled || !/[a-zA-Z]/.test(ch) ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setOutput(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, duration, reduce]);

  return output;
}