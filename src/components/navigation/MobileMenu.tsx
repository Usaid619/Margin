import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { primaryNav } from '../../data/navigation';
import { useStudio } from '../../contexts/StudioContext';
import { easeInOut, easeOut } from '../../utils/motion';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
}

const LINKS = [...primaryNav, { label: 'Journal', to: '/journal' }, { label: 'About', to: '/about' }];

export function MobileMenu({ open, onClose, onSearch }: MobileMenuProps) {
  const { user } = useStudio();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed inset-0 z-50 flex flex-col bg-ink px-6 pb-10 pt-5 text-paper"
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        exit={{ clipPath: 'inset(0 0 100% 0)' }}
        transition={{ duration: 0.3, ease: easeInOut }}>
        
          <div className="flex h-11 items-center justify-between">
            <span className="font-display text-[1.75rem] italic">Margin</span>
            <button ref={closeRef} type="button" onClick={onClose} className="text-[0.68rem] font-medium uppercase tracking-label">
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-14 flex-1">
            <ul className="space-y-1">
              {LINKS.map((item, i) =>
            <motion.li
              key={item.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.04, duration: 0.3, ease: easeOut }}>
              
                  <Link to={item.to} onClick={onClose} className="block font-display text-5xl leading-tight">
                    {item.label}
                  </Link>
                </motion.li>
            )}
            </ul>
          </nav>
          <div className="flex items-center justify-between border-t border-paper/15 pt-6 text-[0.68rem] font-medium uppercase tracking-label">
            <button
            type="button"
            onClick={() => {
              onClose();
              onSearch();
            }}>
            
              Search
            </button>
            {user ?
          <Link to="/profile" onClick={onClose}>
                {user.name}
              </Link> :

          <Link to="/login" onClick={onClose}>
                Sign in
              </Link>
          }
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}