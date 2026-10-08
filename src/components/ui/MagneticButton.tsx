import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

type Variant = 'solid' | 'outline';
type Shape = 'rect' | 'circle';
type Tone = 'ink' | 'paper' | 'amber';

interface MagneticButtonProps {
  children: string;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  shape?: Shape;
  tone?: Tone;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  strength?: number;
}

const SURFACE: Record<Variant, Record<Tone, {base: string;fill: string;hoverText: string;}>> = {
  solid: {
    ink: { base: 'bg-ink text-paper', fill: 'bg-forest', hoverText: '' },
    paper: { base: 'bg-paper text-ink', fill: 'bg-cream', hoverText: '' },
    amber: { base: 'bg-amber text-ink', fill: 'bg-glow', hoverText: '' }
  },
  outline: {
    ink: { base: 'border border-ink/40 text-ink', fill: 'bg-ink', hoverText: 'group-hover:text-paper' },
    paper: { base: 'border border-paper/40 text-paper', fill: 'bg-paper', hoverText: 'group-hover:text-ink' },
    amber: { base: 'border border-amber text-amber', fill: 'bg-amber', hoverText: 'group-hover:text-ink' }
  }
};

export function MagneticButton({
  children,
  to,
  onClick,
  type = 'button',
  variant = 'solid',
  shape = 'rect',
  tone = 'ink',
  disabled = false,
  className = '',
  ariaLabel,
  strength = 0.3
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  const handleMove = (e: React.PointerEvent) => {
    if (reduce || disabled || e.pointerType !== 'mouse') return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const surface = SURFACE[variant][tone];
  const shapeClass = shape === 'circle' ? 'h-36 w-36 rounded-full px-4 text-center md:h-44 md:w-44' : 'px-8 py-4';
  const classes = `group relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap font-sans text-[0.7rem] font-medium uppercase tracking-label transition-colors duration-300 ease-quiet disabled:pointer-events-none disabled:opacity-40 ${shapeClass} ${surface.base} ${surface.hoverText}`;

  const inner =
  <>
      <span
      aria-hidden
      className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-300 ease-quiet group-hover:scale-y-100 ${surface.fill}`} />
    
      <span className="relative block overflow-hidden leading-[1.3]">
        <span className="block transition-transform duration-300 ease-quiet group-hover:-translate-y-full">{children}</span>
        <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-quiet group-hover:translate-y-0">
          {children}
        </span>
      </span>
    </>;


  return (
    <motion.div ref={ref} className={`inline-block ${className}`} style={{ x: sx, y: sy }} onPointerMove={handleMove} onPointerLeave={reset}>
      {to ?
      <Link to={to} className={classes} aria-label={ariaLabel} data-cursor="magnetic">
          {inner}
        </Link> :

      <button type={type} onClick={onClick} disabled={disabled} className={classes} aria-label={ariaLabel} data-cursor="magnetic">
          {inner}
        </button>
      }
    </motion.div>);

}