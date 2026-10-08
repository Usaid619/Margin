import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useStudio } from '../contexts/StudioContext';
import { writingModes } from '../data/modes';
import { reasonLines, timeLines } from '../data/onboarding';
import { greeting, formatRelative } from '../utils/date';
import { countWords, excerpt, formatNumber } from '../utils/text';
import { RevealText } from '../components/animations/RevealText';
import { MagneticButton } from '../components/ui/MagneticButton';
import { SectionLabel } from '../components/ui/SectionLabel';
import { EmptyState } from '../components/ui/EmptyState';
import { PieceRow } from '../components/library/PieceRow';
import { WritingStats } from '../components/dashboard/WritingStats';
import { StreakConstellation } from '../components/dashboard/StreakConstellation';
import { FirstVisitRitual } from '../components/dashboard/FirstVisitRitual';

export function Dashboard() {
  const { user, preferences, writings, sessions, statistics, updatePreferences } = useStudio();
  const navigate = useNavigate();
  const [ritual, setRitual] = useState(!preferences.hasSeenStudio);

  const firstName = user?.name.split(' ')[0] ?? 'friend';
  const primaryMode = preferences.modes[0] ?? 'focused';
  const otherModes = [
  ...preferences.modes.slice(1).map((id) => writingModes.find((m) => m.id === id)),
  ...writingModes.filter((m) => !preferences.modes.includes(m.id))].
  filter((m): m is (typeof writingModes)[number] => Boolean(m));
  const drafts = writings.
  filter((w) => w.status === 'draft').
  sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).
  slice(0, 3);
  const recent = [...writings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const personalLine = [preferences.reason ? reasonLines[preferences.reason] : null, preferences.timeOfDay ? timeLines[preferences.timeOfDay] : null].
  filter(Boolean).
  join(' ');

  const enterStudio = useCallback(() => {
    updatePreferences({ hasSeenStudio: true });
    setRitual(false);
    navigate('/write/free', { state: { firstTime: true } });
  }, [navigate, updatePreferences]);

  const skipRitual = useCallback(() => {
    updatePreferences({ hasSeenStudio: true });
    setRitual(false);
  }, [updatePreferences]);

  return (
    <div className="bg-paper px-6 pb-32 pt-32 md:px-10 md:pt-40">
      <AnimatePresence>{ritual && <FirstVisitRitual onEnter={enterStudio} onSkip={skipRitual} />}</AnimatePresence>

      <section aria-labelledby="greeting" className="grid gap-14 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="font-mono text-[10px] uppercase tracking-label text-mute">{format(new Date(), 'EEEE, MMMM d')}</p>
          <h1 id="greeting" className="mt-6 font-display text-[3.4rem] leading-[0.92] tracking-tight md:text-[7vw]">
            {greeting()}, <em>{firstName}.</em>
          </h1>
          <RevealText
            as="p"
            text="What will you write today?"
            show={!ritual}
            delay={0.3}
            className="mt-4 font-display text-3xl italic text-ink/60 md:text-5xl" />
          
          {personalLine && <p className="mt-8 max-w-md leading-relaxed text-ink/70">{personalLine}</p>}
        </div>
        <div className="flex flex-col items-start gap-10 md:col-span-4 md:items-end">
          <MagneticButton shape="circle" to={`/write/${primaryMode}`} strength={0.4}>
            Start writing
          </MagneticButton>
          <div className="md:text-right">
            <p className="font-mono text-[10px] uppercase tracking-label text-mute">Or begin with</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
              {otherModes.map((m) =>
              <li key={m.id}>
                  <Link to={`/write/${m.id}`} className="link-line font-display text-xl italic">
                    {m.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {writings.length === 0 ?
      <div className="mt-24 border-t border-ink/10">
          <EmptyState />
        </div> :

      <>
          <section aria-labelledby="consistency" className="mt-28 md:mt-36">
            <SectionLabel id="consistency">Consistency</SectionLabel>
            <div className="mt-10">
              <StreakConstellation sessions={sessions} streak={statistics.streak} longest={statistics.longestStreak} />
            </div>
          </section>

          <div className="mt-28 grid gap-24 md:mt-36 md:grid-cols-12 md:gap-10">
            <div className="space-y-24 md:col-span-7">
              <section aria-labelledby="continue">
                <SectionLabel id="continue">Continue</SectionLabel>
                {drafts.length ?
              <ul className="mt-4">
                    {drafts.map((d) =>
                <li key={d.id} className="border-b border-ink/10">
                        <Link to={`/editor/${d.id}`} className="group block py-7">
                          <span className="flex items-baseline justify-between gap-6">
                            <span className="font-display text-3xl leading-tight tracking-tight transition-transform duration-300 ease-quiet group-hover:translate-x-2 md:text-4xl">
                              {d.title}
                            </span>
                            <span className="shrink-0 text-[0.68rem] font-medium uppercase tracking-label opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                              Continue →
                            </span>
                          </span>
                          <span className="mt-3 block max-w-xl font-writing italic leading-relaxed text-ink/65">{excerpt(d.body, 140)}</span>
                          <span className="mt-3 block font-mono text-[10px] uppercase tracking-label text-mute">
                            Draft · edited {formatRelative(d.updatedAt)} · {formatNumber(countWords(d.body))} words
                          </span>
                        </Link>
                      </li>
                )}
                  </ul> :

              <p className="mt-8 font-display text-2xl italic text-ink/60">Nothing left unfinished. Rare, and rather lovely.</p>
              }
              </section>

              <section aria-labelledby="recent">
                <SectionLabel id="recent">Recent pieces</SectionLabel>
                <ul className="mt-2">
                  {recent.map((w) =>
                <PieceRow key={w.id} writing={w} />
                )}
                </ul>
                <Link to="/library" className="link-line mt-8 inline-block text-[0.7rem] font-medium uppercase tracking-label">
                  Open the library →
                </Link>
              </section>
            </div>

            <aside aria-labelledby="your-writing" className="md:col-span-4 md:col-start-9">
              <div className="md:sticky md:top-28">
                <SectionLabel id="your-writing">Your writing</SectionLabel>
                <div className="mt-8">
                  <WritingStats statistics={statistics} />
                </div>
                <p className="mt-8 max-w-xs text-sm leading-relaxed text-ink/60">
                  Numbers are kept quietly. They're here for the curious, not to keep score.
                </p>
              </div>
            </aside>
          </div>
        </>
      }
    </div>);

}