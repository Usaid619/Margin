import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AtmosphereId, MusicAtmosphere } from '../types/music';
import { atmospheres } from '../data/atmospheres';
import { AtmosphereEngine } from '../utils/audio';

interface MusicContextValue {
  atmosphere: MusicAtmosphere;
  playing: boolean;
  volume: number;
  expanded: boolean;
  unavailable: boolean;
  setExpanded: (open: boolean) => void;
  toggle: () => void;
  select: (id: AtmosphereId) => void;
  next: () => void;
  setVolume: (value: number) => void;
  getAnalyser: () => AnalyserNode | null;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: {children: React.ReactNode;}) {
  const engineRef = useRef<AtmosphereEngine | null>(null);
  const [atmosphereId, setAtmosphereId] = useState<AtmosphereId>('rain');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const [expanded, setExpanded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const engine = useCallback(() => {
    if (!engineRef.current) engineRef.current = new AtmosphereEngine();
    return engineRef.current;
  }, []);

  const play = useCallback(
    async (id: AtmosphereId) => {
      if (id === 'silence') {
        engineRef.current?.pause();
        setPlaying(false);
        return;
      }
      try {
        await engine().play(id, volume);
        setPlaying(true);
        setUnavailable(false);
      } catch {
        setPlaying(false);
        setUnavailable(true);
      }
    },
    [engine, volume]
  );

  const toggle = useCallback(() => {
    if (playing) {
      engineRef.current?.pause();
      setPlaying(false);
    } else {
      void play(atmosphereId);
    }
  }, [playing, play, atmosphereId]);

  const select = useCallback(
    (id: AtmosphereId) => {
      setAtmosphereId(id);
      void play(id);
    },
    [play]
  );

  const next = useCallback(() => {
    const index = atmospheres.findIndex((a) => a.id === atmosphereId);
    select(atmospheres[(index + 1) % atmospheres.length].id);
  }, [atmosphereId, select]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    engineRef.current?.setVolume(value);
  }, []);

  const getAnalyser = useCallback(() => engineRef.current?.analyser ?? null, []);

  useEffect(() => () => engineRef.current?.dispose(), []);

  const atmosphere = atmospheres.find((a) => a.id === atmosphereId) ?? atmospheres[0];

  const value = useMemo(
    () => ({ atmosphere, playing, volume, expanded, unavailable, setExpanded, toggle, select, next, setVolume, getAnalyser }),
    [atmosphere, playing, volume, expanded, unavailable, toggle, select, next, setVolume, getAnalyser]
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider');
  return ctx;
}