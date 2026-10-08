import React, { useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import type { SessionConfig } from '../types/writing';
import { writingModes } from '../data/modes';
import { useStudio } from '../contexts/StudioContext';
import { buildSessionConfig } from '../utils/session';
import { FocusedSetup } from '../components/writing-modes/FocusedSetup';
import { ImmersiveWriter } from '../components/editor/ImmersiveWriter';
import { RitualOverlay } from '../components/editor/RitualOverlay';
import { NotFound } from './NotFound';

type Phase = 'setup' | 'ritual' | 'writing';

export function WriteSession() {
  const { mode: modeParam } = useParams<{mode: string;}>();
  const mode = writingModes.find((m) => m.id === modeParam);
  const location = useLocation();
  const [params] = useSearchParams();
  const { writings } = useStudio();
  const firstTime = (location.state as {firstTime?: boolean;} | null)?.firstTime === true;

  const [config, setConfig] = useState<SessionConfig | null>(() =>
  mode && !mode.hasSetup ? buildSessionConfig(mode, writings.length, { objectName: params.get('object') }) : null
  );
  const [phase, setPhase] = useState<Phase>(() => !mode || mode.hasSetup ? 'setup' : firstTime ? 'writing' : 'ritual');

  if (!mode) return <NotFound />;

  if (phase === 'setup' || !config) {
    return (
      <FocusedSetup
        mode={mode}
        initialPrompt={params.get('prompt')}
        initialMinutes={Number(params.get('minutes')) || null}
        onBegin={(minutes, prompt) => {
          setConfig(buildSessionConfig(mode, writings.length, { minutes, prompt }));
          setPhase('ritual');
        }} />);


  }

  return (
    <>
      <ImmersiveWriter config={config} mode={mode} active={phase === 'writing'} firstTime={firstTime} />
      <AnimatePresence>{phase === 'ritual' && <RitualOverlay key="ritual" mode={mode} onDone={() => setPhase('writing')} />}</AnimatePresence>
    </>);

}