import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { easeInOut, easeOut } from '../../utils/motion';

/** An ink curtain lifts on every route — fast, functional, never browser-like. */
export function PageTransition({ children }: {children: React.ReactNode;}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const t = window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 380);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={{ initial: {}, enter: {}, exit: { transition: { duration: reduce ? 0.12 : 0.3 } } }}>
      
      {!reduce &&
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] bg-ink"
        variants={{
          initial: { scaleY: 1, originY: 0 },
          enter: { scaleY: 0, originY: 0, transition: { duration: 0.3, ease: easeInOut, delay: 0.05 } },
          exit: { scaleY: 1, originY: 1, transition: { duration: 0.28, ease: easeInOut } }
        }} />

      }
      <motion.div
        variants={{
          initial: { opacity: 0, y: reduce ? 0 : 16 },
          enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut, delay: reduce ? 0 : 0.2 } },
          exit: { opacity: 0, transition: { duration: 0.15 } }
        }}>
        
        {children}
      </motion.div>
    </motion.div>);

}