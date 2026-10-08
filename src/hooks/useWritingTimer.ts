import { useEffect, useRef, useState } from 'react';

export function useWritingTimer(minutes: number | null, active: boolean) {
  const total = minutes ? minutes * 60 : null;
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const start = Date.now() - elapsedRef.current * 1000;
    const id = window.setInterval(() => {
      const next = Math.floor((Date.now() - start) / 1000);
      if (next !== elapsedRef.current) {
        elapsedRef.current = next;
        setElapsed(next);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [active]);

  const remaining = total === null ? null : total - elapsed;

  return {
    elapsed,
    total,
    remaining,
    isUp: remaining !== null && remaining <= 0,
    isFinalMinute: remaining !== null && remaining <= 60 && remaining > 0
  };
}