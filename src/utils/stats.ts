import { differenceInCalendarDays, format, parseISO, subDays } from 'date-fns';
import type { Writing, WritingModeId, WritingSession, WritingStatistics } from '../types/writing';
import { countWords } from './text';
import { dayKey } from './date';

export function computeStatistics(writings: Writing[], sessions: WritingSession[]): WritingStatistics {
  const words = writings.reduce((sum, w) => sum + countWords(w.body), 0);
  const days = new Set(sessions.map((s) => dayKey(s.startedAt)));

  let streak = 0;
  let cursor = new Date();
  if (!days.has(format(cursor, 'yyyy-MM-dd'))) cursor = subDays(cursor, 1);
  while (days.has(format(cursor, 'yyyy-MM-dd'))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  const sorted = [...days].sort();
  let longest = 0;
  let run = 0;
  sorted.forEach((key, i) => {
    if (i > 0 && differenceInCalendarDays(parseISO(key), parseISO(sorted[i - 1])) === 1) run += 1;else
    run = 1;
    longest = Math.max(longest, run);
  });

  return {
    pieces: writings.length,
    words,
    sessions: sessions.length,
    streak,
    longestStreak: Math.max(longest, streak),
    activeDays: days.size
  };
}

export function modeShare(writings: Writing[]): {mode: WritingModeId;count: number;share: number;}[] {
  const counts = new Map<WritingModeId, number>();
  writings.forEach((w) => counts.set(w.mode, (counts.get(w.mode) ?? 0) + 1));
  const total = writings.length || 1;
  return [...counts.entries()].
  map(([mode, count]) => ({ mode, count, share: count / total })).
  sort((a, b) => b.count - a.count);
}

export function monthlyHistory(writings: Writing[]): {key: string;month: string;pieces: number;words: number;}[] {
  const map = new Map<string, {month: string;pieces: number;words: number;}>();
  writings.forEach((w) => {
    const date = new Date(w.createdAt);
    const key = format(date, 'yyyy-MM');
    const entry = map.get(key) ?? { month: format(date, 'MMMM yyyy'), pieces: 0, words: 0 };
    entry.pieces += 1;
    entry.words += countWords(w.body);
    map.set(key, entry);
  });
  return [...map.entries()].
  sort((a, b) => b[0].localeCompare(a[0])).
  map(([key, value]) => ({ key, ...value }));
}