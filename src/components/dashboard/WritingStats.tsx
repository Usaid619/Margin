import React from 'react';
import type { WritingStatistics } from '../../types/writing';
import { Counter } from '../ui/Counter';

interface WritingStatsProps {
  statistics: WritingStatistics;
  size?: 'large' | 'medium';
}

/** Statistics written as a sentence, not a dashboard. */
export function WritingStats({ statistics, size = 'medium' }: WritingStatsProps) {
  const text = size === 'large' ? 'text-4xl md:text-6xl' : 'text-[2.1rem] md:text-[2.75rem]';
  return (
    <p className={`font-display leading-[1.1] tracking-tight ${text}`}>
      <Counter value={statistics.words} /> words<span className="text-ink/50">, across </span>
      <Counter value={statistics.pieces} /> {statistics.pieces === 1 ? 'piece' : 'pieces'}
      <span className="text-ink/50"> and </span>
      <Counter value={statistics.sessions} /> writing {statistics.sessions === 1 ? 'session' : 'sessions'}
      <span className="text-ink/50">. Currently </span>
      <em>
        <Counter value={statistics.streak} /> {statistics.streak === 1 ? 'day' : 'days'}
      </em>
      <span className="text-ink/50"> in a row.</span>
    </p>);

}