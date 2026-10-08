import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { primaryNav } from '../../data/navigation';
import { useStudio } from '../../contexts/StudioContext';
import { easeOut } from '../../utils/motion';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';

export function SiteNav() {
  const { user } = useStudio();
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 160);
  });

  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? 'border-ink/10 bg-paper' : 'border-transparent bg-transparent'}`
        }
        animate={{ y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: easeOut }}>
        
        <nav aria-label="Primary" className="flex h-16 items-center justify-between px-5 md:h-20 md:px-10">
          <Link to="/" aria-label="Margin — home" className="flex items-center gap-3">
            <span aria-hidden className="h-6 w-px bg-ink" />
            <span className="font-display text-[1.75rem] italic leading-none">Margin</span>
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {primaryNav.map((item) =>
            <li key={item.to}>
                <NavLink
                to={item.to}
                className={({ isActive }) =>
                `link-line text-[0.68rem] font-medium uppercase tracking-label transition-colors duration-200 ${
                isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'}`

                }>
                
                  {item.label}
                </NavLink>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search (Command K)"
              className="flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-label text-ink/70 transition-colors duration-200 hover:text-ink">
              
              <SearchIcon aria-hidden className="h-4 w-4" strokeWidth={1.5} />
              <span className="hidden md:inline">Search</span>
            </button>
            {user ?
            <Link
              to="/profile"
              aria-label="Your profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-lg italic leading-none text-paper">
              
                {user.name.charAt(0)}
              </Link> :

            <Link to="/login" className="link-line text-[0.68rem] font-medium uppercase tracking-label">
                Sign in
              </Link>
            }
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="text-[0.68rem] font-medium uppercase tracking-label lg:hidden">
              
              Menu
            </button>
          </div>
        </nav>
      </motion.header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSearch={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>);

}