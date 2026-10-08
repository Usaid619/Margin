import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { SearchIcon } from 'lucide-react';
import type { Writing, WritingModeId } from '../types/writing';
import { useStudio } from '../contexts/StudioContext';
import { countWords, formatNumber } from '../utils/text';
import { PieceRow } from '../components/library/PieceRow';
import { EmptyState } from '../components/ui/EmptyState';

type Filter = 'all' | WritingModeId | 'favorites' | 'drafts';
type Sort = 'newest' | 'oldest' | 'words' | 'edited';

const FILTERS: {id: Filter;label: string;}[] = [
{ id: 'all', label: 'All' },
{ id: 'object', label: 'Object' },
{ id: 'focused', label: 'Focused' },
{ id: 'free', label: 'Free' },
{ id: 'reflection', label: 'Reflection' },
{ id: 'observation', label: 'Observation' },
{ id: 'favorites', label: 'Favorites' },
{ id: 'drafts', label: 'Drafts' }];


const SORTS: {id: Sort;label: string;}[] = [
{ id: 'newest', label: 'Newest' },
{ id: 'oldest', label: 'Oldest' },
{ id: 'words', label: 'Most words' },
{ id: 'edited', label: 'Recently edited' }];


function matches(w: Writing, filter: Filter) {
  if (filter === 'all') return true;
  if (filter === 'favorites') return w.favorite;
  if (filter === 'drafts') return w.status === 'draft';
  return w.mode === filter;
}

export function Library() {
  const { writings, statistics } = useStudio();
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('newest');
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = writings.filter((w) => matches(w, filter) && (!term || `${w.title} ${w.body}`.toLowerCase().includes(term)));
    return list.sort((a, b) => {
      if (sort === 'oldest') return a.createdAt.localeCompare(b.createdAt);
      if (sort === 'words') return countWords(b.body) - countWords(a.body);
      if (sort === 'edited') return b.updatedAt.localeCompare(a.updatedAt);
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [writings, filter, sort, query]);

  const groups = useMemo(() => {
    if (sort !== 'newest' && sort !== 'oldest') return [{ label: null as string | null, items }];
    const map = new Map<string, Writing[]>();
    items.forEach((w) => {
      const label = format(new Date(w.createdAt), 'MMMM yyyy');
      map.set(label, [...(map.get(label) ?? []), w]);
    });
    return [...map.entries()].map(([label, list]) => ({ label: label as string | null, items: list }));
  }, [items, sort]);

  return (
    <div className="bg-paper px-6 pb-32 pt-32 md:px-10 md:pt-40">
      <header className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="font-mono text-[10px] uppercase tracking-label text-mute">Library</p>
          <h1 className="mt-5 font-display text-7xl leading-[0.88] tracking-tight md:text-[8.5vw]">
            Everything you've <em>kept.</em>
          </h1>
        </div>
        <p className="leading-relaxed text-ink/70 md:col-span-4">
          {formatNumber(statistics.pieces)} pieces, {formatNumber(statistics.words)} words. Start anywhere — most things are better the second time you read them.
        </p>
      </header>

      {writings.length === 0 ?
      <div className="mt-16 border-t border-ink/10">
          <EmptyState />
        </div> :

      <>
          <div className="mt-16 flex flex-col gap-6 border-b border-ink/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div role="group" aria-label="Filter writing" className="no-scrollbar -mx-6 flex gap-6 overflow-x-auto px-6 lg:mx-0 lg:px-0">
              {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  data-active={on}
                  onClick={() => setFilter(f.id)}
                  className={`link-line shrink-0 whitespace-nowrap text-[0.68rem] font-medium uppercase tracking-label transition-colors duration-200 ${on ? 'text-ink' : 'text-ink/55 hover:text-ink'}`}>
                  
                    {f.label}
                  </button>);

            })}
            </div>
            <div className="flex items-end gap-6">
              <label className="flex flex-1 items-center gap-2 border-b border-ink/20 pb-1.5 focus-within:border-ink lg:w-64 lg:flex-none">
                <SearchIcon aria-hidden className="h-4 w-4 text-mute" strokeWidth={1.5} />
                <span className="sr-only">Search your library</span>
                <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your words"
                className="w-full bg-transparent font-writing text-base italic outline-none placeholder:text-ink/45 focus-visible:outline-none" />
              
              </label>
              <label className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-label text-mute">Sort</span>
                <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="border-b border-ink/20 bg-transparent pb-1.5 text-sm outline-none focus:border-ink">
                
                  {SORTS.map((s) =>
                <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                )}
                </select>
              </label>
            </div>
          </div>

          {items.length === 0 ?
        <div className="py-24">
              <p className="font-display text-4xl italic md:text-5xl">{query ? `Nothing matches “${query}”.` : 'Nothing here yet.'}</p>
              <button
            type="button"
            onClick={() => {
              setFilter('all');
              setQuery('');
            }}
            className="link-line mt-6 text-[0.68rem] font-medium uppercase tracking-label">
            
                Show everything
              </button>
            </div> :

        groups.map((group) =>
        <section key={group.label ?? 'all'} aria-label={group.label ?? 'All pieces'} className="mt-14">
                {group.label && <h2 className="font-mono text-[10px] uppercase tracking-label text-mute">{group.label}</h2>}
                <ul className="mt-2">
                  {group.items.map((w) =>
            <PieceRow key={w.id} writing={w} />
            )}
                </ul>
              </section>
        )
        }
        </>
      }
    </div>);

}