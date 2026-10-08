import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useStudio } from '../contexts/StudioContext';
import { writingModes } from '../data/modes';
import { achievements } from '../data/achievements';
import { reasonOptions, timeOptions } from '../data/onboarding';
import { modeShare, monthlyHistory } from '../utils/stats';
import { formatNumber } from '../utils/text';
import { writingPalette } from '../utils/writingPalette';
import { easeOut } from '../utils/motion';
import { SectionLabel } from '../components/ui/SectionLabel';
import { TextField } from '../components/ui/TextField';
import { MagneticButton } from '../components/ui/MagneticButton';
import { WritingStats } from '../components/dashboard/WritingStats';
import { WritingSettingsFields } from '../components/editor/WritingSettingsFields';

export function Profile() {
  const { user, statistics, writings, preferences, updateAccount, updatePreferences, signOut } = useStudio();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [location, setLocation] = useState(user?.location ?? '');

  if (!user) return null;

  const share = modeShare(writings);
  const history = monthlyHistory(writings).slice(0, 6);
  const light = writingPalette('paper');
  const reason = reasonOptions.find((r) => r.id === preferences.reason);
  const time = timeOptions.find((t) => t.id === preferences.timeOfDay);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateAccount({ name: name.trim(), bio: bio.trim(), location: location.trim() });
    setEditing(false);
  };

  return (
    <div className="bg-paper px-6 pb-32 pt-32 md:px-10 md:pt-40">
      <div className="grid gap-20 md:grid-cols-12 md:gap-10">
        <aside className="self-start md:sticky md:top-28 md:col-span-4">
          <div aria-hidden className="flex h-28 w-28 items-center justify-center rounded-full bg-forest font-display text-6xl italic leading-none text-paper">
            {user.name.charAt(0)}
          </div>
          {editing ?
          <form onSubmit={save} className="mt-10 space-y-8">
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <TextField label="Where you write from" value={location} onChange={(e) => setLocation(e.target.value)} />
              <label className="block">
                <span className="block font-mono text-[10px] uppercase tracking-label text-mute">A few words about you</span>
                <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="mt-2 w-full resize-none border-b border-ink/25 bg-transparent py-2 font-writing text-lg italic outline-none focus:border-ink focus-visible:outline-none" />
              
              </label>
              <div className="flex items-center gap-6">
                <MagneticButton type="submit">Save</MagneticButton>
                <button type="button" onClick={() => setEditing(false)} className="link-line text-[0.68rem] font-medium uppercase tracking-label">
                  Cancel
                </button>
              </div>
            </form> :

          <>
              <h1 className="mt-10 font-display text-5xl leading-[0.95] tracking-tight md:text-6xl">{user.name}</h1>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-label text-mute">
                Writing since {format(new Date(user.joinedAt), 'MMMM yyyy')}
                {user.location ? ` · ${user.location}` : ''}
              </p>
              <p className="mt-6 max-w-sm font-writing text-lg italic leading-relaxed text-ink/75">{user.bio || 'No bio yet. Some writers prefer it that way.'}</p>
              <div className="mt-10 flex gap-6">
                <button type="button" onClick={() => setEditing(true)} className="link-line text-[0.68rem] font-medium uppercase tracking-label">
                  Edit profile
                </button>
                <button
                type="button"
                onClick={() => {
                  signOut();
                  navigate('/');
                }}
                className="link-line text-[0.68rem] font-medium uppercase tracking-label text-ember">
                
                  Sign out
                </button>
              </div>
            </>
          }
        </aside>

        <div className="space-y-24 md:col-span-7 md:col-start-6">
          <section aria-labelledby="p-numbers">
            <SectionLabel id="p-numbers">In numbers</SectionLabel>
            <div className="mt-8">
              <WritingStats statistics={statistics} size="large" />
            </div>
          </section>

          <section aria-labelledby="p-modes">
            <SectionLabel id="p-modes">Favourite ways in</SectionLabel>
            {share.length ?
            <ul className="mt-8 space-y-6">
                {share.map((s) =>
              <li key={s.mode} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-4 md:grid-cols-[11rem_1fr_3rem]">
                    <span className="font-display text-2xl">{writingModes.find((m) => m.id === s.mode)?.name}</span>
                    <span aria-hidden className="h-px bg-ink/10">
                      <motion.span
                    className="block h-px origin-left bg-ink"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: s.share }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, ease: easeOut }} />
                  
                    </span>
                    <span className="text-right font-mono text-[11px] tabular-nums text-ink/70">{Math.round(s.share * 100)}%</span>
                  </li>
              )}
              </ul> :

            <p className="mt-8 font-display text-2xl italic text-ink/60">Nothing yet — every mode is still a door.</p>
            }
          </section>

          <section aria-labelledby="p-history">
            <SectionLabel id="p-history">History</SectionLabel>
            <dl className="mt-4">
              {history.map((h) =>
              <div key={h.key} className="flex items-baseline justify-between border-b border-ink/10 py-4">
                  <dt className="font-display text-2xl">{h.month}</dt>
                  <dd className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/70">
                    {h.pieces} {h.pieces === 1 ? 'piece' : 'pieces'} · {formatNumber(h.words)} words
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section aria-labelledby="p-marks">
            <SectionLabel id="p-marks">Marks along the way</SectionLabel>
            <ul className="mt-4">
              {achievements.map((a) => {
                const earned = statistics[a.metric] >= a.threshold;
                return (
                  <li key={a.id} className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-4">
                    <span>
                      <span className={`block font-display text-2xl ${earned ? 'text-ink' : 'text-ink/45'}`}>{a.title}</span>
                      <span className="mt-1 block text-sm text-ink/60">{a.description}</span>
                    </span>
                    <span className={`shrink-0 font-mono text-[10px] uppercase tracking-label ${earned ? 'text-ember' : 'text-mute'}`}>{earned ? 'Kept' : 'Not yet'}</span>
                  </li>);

              })}
            </ul>
          </section>

          <section aria-labelledby="p-room" className="grid gap-12 md:grid-cols-2">
            <div>
              <SectionLabel id="p-room">Your writing room</SectionLabel>
              <div className="mt-8">
                <WritingSettingsFields preferences={preferences} onChange={updatePreferences} mute={light.mute} line={light.line} />
              </div>
            </div>
            <div>
              <SectionLabel>Your rhythm</SectionLabel>
              <p className="mt-8 font-display text-2xl leading-snug">
                {reason ? reason.label : 'You came here to explore.'} {time ? `You write best in the ${time.label.toLowerCase()}.` : ''}
              </p>
              <Link to="/onboarding" className="link-line mt-6 inline-block text-[0.68rem] font-medium uppercase tracking-label">
                Revisit these answers
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>);

}