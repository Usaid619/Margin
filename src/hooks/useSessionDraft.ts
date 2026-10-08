import { useCallback, useEffect, useRef, useState } from 'react';
import type { AutosaveState, SessionConfig, Writing } from '../types/writing';
import { useStudio } from '../contexts/StudioContext';
import { writingModes } from '../data/modes';
import { countWords, titleFromText } from '../utils/text';

/** Owns the text of a writing session and autosaves it quietly. */
export function useSessionDraft(config: SessionConfig) {
  const { saveWriting, logSession, storageHealthy } = useStudio();
  const [text, setText] = useState('');
  const [status, setStatus] = useState<AutosaveState>('idle');
  const idRef = useRef<string | null>(null);
  const startedAt = useRef(new Date().toISOString());

  const persist = useCallback(
    (body: string, extra?: Partial<Writing>) => {
      if (!body.trim() && !idRef.current) return null;
      const mode = writingModes.find((m) => m.id === config.mode);
      const fallback = config.object ?
      `The ${config.object.name.replace(/^(a|an)\s+/i, '')}` :
      mode?.title ?? 'Untitled';
      idRef.current = saveWriting({
        id: idRef.current ?? undefined,
        title: titleFromText(body, fallback),
        body,
        mode: config.mode,
        prompt: config.prompt ?? undefined,
        object: config.object?.name,
        durationMinutes: config.minutes ?? undefined,
        status: 'draft',
        ...extra
      });
      return idRef.current;
    },
    [config, saveWriting]
  );

  useEffect(() => {
    if (!text) return;
    setStatus('saving');
    const t = window.setTimeout(() => {
      persist(text);
      setStatus('saved');
    }, 1000);
    return () => window.clearTimeout(t);
  }, [text, persist]);

  useEffect(() => {
    if (!storageHealthy) setStatus('error');
  }, [storageHealthy]);

  const saveNow = useCallback(() => {
    if (persist(text)) setStatus('saved');
  }, [persist, text]);

  const finish = useCallback(
    (elapsedSeconds: number) => {
      const id = persist(text, { status: 'finished' });
      if (id) {
        logSession({
          writingId: id,
          mode: config.mode,
          startedAt: startedAt.current,
          durationSeconds: elapsedSeconds,
          words: countWords(text)
        });
      }
      return id;
    },
    [persist, text, logSession, config.mode]
  );

  return { text, setText, status, saveNow, finish, words: countWords(text) };
}