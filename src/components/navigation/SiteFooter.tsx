import React from 'react';
import { Link } from 'react-router-dom';
import type { NavItem } from '../../types/content';
import { footerElsewhere, footerSmallPrint, footerStudio } from '../../data/navigation';

function FooterLink({ item }: {item: NavItem;}) {
  const external = /^(https?:|mailto:)/.test(item.to);
  const className = 'link-line text-sm text-paper/80 transition-colors duration-200 hover:text-paper';
  if (external) {
    return (
      <a href={item.to} className={className} {...item.to.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {}}>
        {item.label}
        {item.to.startsWith('http') && <span aria-hidden> ↗</span>}
      </a>);

  }
  return (
    <Link to={item.to} className={className}>
      {item.label}
    </Link>);

}

export function SiteFooter() {
  const columns: {title: string;items: NavItem[];}[] = [
  { title: 'Studio', items: footerStudio },
  { title: 'Small print', items: footerSmallPrint },
  { title: 'Elsewhere', items: footerElsewhere }];


  return (
    <footer className="bg-ink text-paper">
      <div className="px-6 pb-10 pt-28 md:px-10 md:pt-40">
        <p className="font-mono text-[10px] uppercase tracking-label text-paper/60">Margin — a studio for writers</p>
        <p className="mt-8 max-w-[14ch] font-display text-[14vw] leading-[0.9] tracking-tight md:text-[8.5vw]">
          Write something worth <em className="text-glow">remembering.</em>
        </p>

        <div className="mt-24 grid gap-12 border-t border-paper/15 pt-12 md:grid-cols-12">
          <p className="max-w-sm font-writing text-base italic leading-relaxed text-paper/75 md:col-span-5">
            A quiet place to notice, write, and return. Made in small rooms, for people who love words.
          </p>
          {columns.map((col) =>
          <nav key={col.title} aria-label={col.title} className="md:col-span-2">
              <h2 className="font-mono text-[10px] uppercase tracking-label text-paper/60">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.items.map((item) =>
              <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
              )}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-24 flex flex-col justify-between gap-4 font-mono text-[10px] uppercase tracking-label text-paper/60 sm:flex-row">
          <span>© 2026 Margin Studio. Made slowly.</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="link-line self-start uppercase">
            Back to the top ↑
          </button>
        </div>
      </div>
    </footer>);

}