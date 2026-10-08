import React from 'react';
import { useLocation } from 'react-router-dom';
import { SiteNav } from './SiteNav';
import { SiteFooter } from './SiteFooter';
import { MusicPlayer } from '../music/MusicPlayer';
import { CustomCursor } from '../ui/CustomCursor';

const MINIMAL_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password', '/onboarding'];

/** The quiet world wraps every page; the writing world removes almost all of it. */
export function AppShell({ children }: {children: React.ReactNode;}) {
  const { pathname } = useLocation();
  const immersive = pathname.startsWith('/write/') || pathname.startsWith('/editor');
  const minimal = MINIMAL_ROUTES.includes(pathname);
  const chrome = !immersive && !minimal;

  return (
    <div className={`relative min-h-screen w-full ${immersive ? 'bg-night text-bone' : 'bg-paper text-ink'}`}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {chrome && <SiteNav />}
      <main id="main">{children}</main>
      {chrome && <SiteFooter />}
      <MusicPlayer immersive={immersive} />
      <CustomCursor />
      <div aria-hidden className="grain" />
    </div>);

}