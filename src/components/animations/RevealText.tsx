import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { easeOut } from '../../utils/motion';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

interface RevealTextProps {
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
  show?: boolean;
  id?: string;
}

/** Words rise one by one out of a mask — lines revealing themselves. */
export function RevealText({ text, as = 'p', className = '', delay = 0, stagger = 0.06, show, id }: RevealTextProps) {
  const reduce = useReducedMotion();
  const Component = motion[as] as typeof motion.p;
  const words = text.split(' ');
  const trigger =
  show === undefined ?
  { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-10% 0px' } } :
  { initial: 'hidden', animate: show ? 'visible' : 'hidden' };

  return (
    <Component
      id={id}
      aria-label={text}
      className={className}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...trigger}>
      
      {words.map((word, i) =>
      <React.Fragment key={`${word}-${i}`}>
          <span aria-hidden className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
            className="inline-block"
            variants={{
              hidden: reduce ? { opacity: 0 } : { y: '110%' },
              visible: reduce ? { opacity: 1 } : { y: '0%', transition: { duration: 0.3, ease: easeOut } }
            }}>
            
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </React.Fragment>
      )}
    </Component>);

}