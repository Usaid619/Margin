import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfDay, subDays } from 'date-fns';
import type { WritingSession } from '../../types/writing';
import { dayKey } from '../../utils/date';
import { Counter } from '../ui/Counter';

interface StreakConstellationProps {
  sessions: WritingSession[];
  streak: number;
  longest: number;
  days?: number;
}

const W = 1000;
const H = 170;

/** Each day is a point; days you wrote become stars, and consecutive stars join into constellations. */
export function StreakConstellation({ sessions, streak, longest, days = 63 }: StreakConstellationProps) {
  const points = useMemo(() => {
    const byDay = new Map<string, number>();
    sessions.forEach((s) => {
      const key = dayKey(s.startedAt);
      byDay.set(key, (byDay.get(key) ?? 0) + s.words);
    });
    const today = startOfDay(new Date());
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - 1 - i);
      const words = byDay.get(format(date, 'yyyy-MM-dd')) ?? 0;
      return {
        key: format(date, 'yyyy-MM-dd'),
        date,
        words,
        x: 20 + i * (W - 40) / (days - 1),
        y: 85 + Math.sin(i * 0.45) * 26 + (i * 53 % 17 - 8) * 2.2,
        written: words > 0,
        today: i === days - 1
      };
    });
  }, [sessions, days]);

  const segments = points.slice(1).flatMap((p, i) => p.written && points[i].written ? [[points[i], p] as const] : []);
  const writtenCount = points.filter((p) => p.written).length;

  return (
    <figure>
      <div className="no-scrollbar -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full min-w-[640px] overflow-visible text-ink"
          role="img"
          aria-label={`The last ${days} days: you wrote on ${writtenCount} of them. Current run: ${streak} days.`}>
          
          {segments.map(([a, b], i) =>
          <motion.path
            key={`${a.key}-${b.key}`}
            d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
            stroke="currentColor"
            strokeOpacity={0.4}
            strokeWidth={1}
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.03 }} />

          )}
          {points.map((p) =>
          p.written ?
          <g key={p.key}>
                <circle cx={p.x} cy={p.y} r={2.4 + Math.min(4, p.words / 220)} className={p.today ? 'fill-amber' : 'fill-ink'} />
                <title>{`${format(p.date, 'EEEE, MMM d')} — ${p.words} words`}</title>
              </g> :

          <circle key={p.key} cx={p.x} cy={p.y} r={1.6} fill="none" stroke="currentColor" strokeOpacity={0.3}>
                <title>{`${format(p.date, 'EEEE, MMM d')} — a quiet day`}</title>
              </circle>

          )}
          {points[points.length - 1] &&
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={11} fill="none" stroke="#B5762F" strokeOpacity={0.6} />
          }
        </svg>
      </div>
      <figcaption className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
        <p className="font-display text-4xl md:text-5xl">
          <Counter value={streak} /> {streak === 1 ? 'day' : 'days'} in a row.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-label text-mute">
          {writtenCount} of the last {days} days · Longest run {longest}
        </p>
      </figcaption>
    </figure>);

}