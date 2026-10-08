import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '../../hooks/useFinePointer';
import { easeOut } from '../../utils/motion';

type CursorMode = 'default' | 'interactive' | 'magnetic' | 'label' | 'text' | 'hidden';

const SHAPES: Record<CursorMode, {width: number;height: number;borderRadius: number;backgroundColor: string;borderWidth: number;opacity: number;}> = {
  default: { width: 8, height: 8, borderRadius: 999, backgroundColor: 'rgba(242,237,227,1)', borderWidth: 0, opacity: 1 },
  interactive: { width: 40, height: 40, borderRadius: 999, backgroundColor: 'rgba(242,237,227,0)', borderWidth: 1, opacity: 1 },
  magnetic: { width: 64, height: 64, borderRadius: 999, backgroundColor: 'rgba(242,237,227,1)', borderWidth: 0, opacity: 1 },
  label: { width: 88, height: 88, borderRadius: 999, backgroundColor: 'rgba(242,237,227,1)', borderWidth: 0, opacity: 1 },
  text: { width: 2, height: 24, borderRadius: 0, backgroundColor: 'rgba(242,237,227,1)', borderWidth: 0, opacity: 1 },
  hidden: { width: 8, height: 8, borderRadius: 999, backgroundColor: 'rgba(242,237,227,1)', borderWidth: 0, opacity: 0 }
};

const TEXT_TARGETS = 'textarea, input[type="text"], input[type="email"], input[type="password"], input[type="search"], input:not([type]), [contenteditable="true"]';
const INTERACTIVE_TARGETS = 'a, button, [role="button"], select, label, input[type="range"], summary';

export function CustomCursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 700, damping: 45, mass: 0.35 });
  const [mode, setMode] = useState<CursorMode>('hidden');
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!fine) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      const tagged = target.closest<HTMLElement>('[data-cursor]');
      if (tagged) {
        setMode(tagged.dataset.cursor as CursorMode ?? 'interactive');
        setLabel(tagged.dataset.cursorLabel ?? null);
        return;
      }
      setLabel(null);
      if (target.closest(TEXT_TARGETS)) setMode('text');else
      if (target.closest(INTERACTIVE_TARGETS)) setMode('interactive');else
      setMode('default');
    };
    const leave = () => setMode('hidden');

    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    root.addEventListener('pointerleave', leave);
    return () => {
      root.classList.remove('has-custom-cursor');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      root.removeEventListener('pointerleave', leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference" style={{ x: sx, y: sy }}>
      <motion.div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border-solid border-paper ${mode === 'text' ? 'animate-caret' : ''}`}
        initial={false}
        animate={SHAPES[mode]}
        transition={{ duration: 0.2, ease: easeOut }}>
        
        {mode === 'label' && label &&
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-black">{label}</span>
        }
      </motion.div>
    </motion.div>);

}