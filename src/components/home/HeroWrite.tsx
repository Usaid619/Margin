import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useStudio } from '../../contexts/StudioContext';
import { easeOut } from '../../utils/motion';
import { RevealText } from '../animations/RevealText';
import { MagneticButton } from '../ui/MagneticButton';
import { DriftLetter } from './DriftLetter';

const LETTERS = ['W', 'R', 'I', 'T', 'E', '.'];
const STAGE_TIMES = [400, 1900, 3300, 4300];

export function HeroWrite() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { user } = useStudio();
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const mx = useSpring(pointerX, { stiffness: 40, damping: 18 });
  const my = useSpring(pointerY, { stiffness: 40, damping: 18 });

  useEffect(() => {
    if (reduce) {
      setStage(4);
      return;
    }
    const timers = STAGE_TIMES.map((ms, i) => window.setTimeout(() => setStage(i + 1), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduce]);

  const background = useTransform(scrollYProgress, [0, 1], ['#F2EDE3', '#E9E0CE']);
  const introOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const writeOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0]);
  const thinkOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.62, 0.7], [0, 1, 1, 0]);
  const thinkY = useTransform(scrollYProgress, [0.4, 0.7], [40, -40]);
  const noticeOpacity = useTransform(scrollYProgress, [0.7, 0.82], [0, 1]);
  const noticeY = useTransform(scrollYProgress, [0.7, 1], [40, -20]);
  const footOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const footPointer = useTransform(footOpacity, (v) => v < 0.2 ? 'none' : 'auto');

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    pointerX.set(e.clientX / window.innerWidth - 0.5);
    pointerY.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section ref={ref} aria-label="Introduction" className="relative h-[300vh]" onPointerMove={onPointerMove}>
      <motion.div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden" style={{ backgroundColor: background }}>
        <motion.div className="absolute inset-x-0 top-[21%] px-6 text-center" style={{ opacity: introOpacity }}>
          <motion.p
            className="font-display text-2xl italic md:text-[2rem]"
            initial={{ opacity: 0, y: 8 }}
            animate={stage >= 1 ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.3, ease: easeOut }}>
            
            You have something to say.
          </motion.p>
          <motion.p
            className="mt-1 font-display text-2xl italic text-mute md:text-[2rem]"
            initial={{ opacity: 0, y: 8 }}
            animate={stage >= 2 ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.3, ease: easeOut }}>
            
            You just haven't written it yet.
          </motion.p>
        </motion.div>

        <motion.h1
          aria-label="Write."
          className="relative select-none whitespace-nowrap font-display text-[23vw] leading-[0.8] tracking-[-0.03em] text-ink md:text-[21vw]"
          style={{ opacity: writeOpacity }}>
          
          {LETTERS.map((char, i) =>
          <DriftLetter key={char} char={char} index={i} progress={scrollYProgress} mx={mx} my={my} show={stage >= 3} />
          )}
        </motion.h1>

        <motion.p aria-hidden className="pointer-events-none absolute font-display text-[18vw] italic leading-none text-forest md:text-[14vw]" style={{ opacity: thinkOpacity, y: thinkY }}>
          think.
        </motion.p>
        <motion.p aria-hidden className="pointer-events-none absolute font-display text-[18vw] italic leading-none text-ink md:text-[14vw]" style={{ opacity: noticeOpacity, y: noticeY }}>
          notice<span className="text-amber">.</span>
        </motion.p>

        <motion.div className="absolute inset-x-0 bottom-[8%] flex flex-col items-center gap-8 px-6 text-center" style={{ opacity: footOpacity, pointerEvents: footPointer }}>
          <RevealText
            as="p"
            show={stage >= 4}
            text="A place to think, write, and become better at both."
            className="max-w-xl font-display text-2xl leading-snug md:text-4xl" />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={stage >= 4 ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.3, delay: 0.55, ease: easeOut }}
            className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
            
            <MagneticButton to={user ? '/dashboard' : '/signup'}>Start writing</MagneticButton>
            <Link to="/modes" className="link-line text-[0.7rem] font-medium uppercase tracking-label">
              Explore the studio
            </Link>
          </motion.div>
        </motion.div>

        <motion.p style={{ opacity: footOpacity }} className="absolute bottom-6 left-10 hidden font-mono text-[10px] uppercase tracking-label text-mute md:block">
          No. 001 — A studio for writers
        </motion.p>
        <div className="absolute bottom-6 right-10 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-label text-mute md:flex">
          <span>Scroll, slowly</span>
          <span aria-hidden className="relative h-10 w-px overflow-hidden bg-ink/15">
            <span className="absolute inset-0 animate-hint bg-ink" />
          </span>
        </div>
      </motion.div>
    </section>);

}