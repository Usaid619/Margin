import { useCallback, useRef, useState } from 'react';

interface HistoryState {
  past: string[];
  present: string;
  future: string[];
}

/** Undo/redo for a text value, grouping keystrokes into checkpoints. */
export function useTextHistory(initial: string) {
  const [state, setState] = useState<HistoryState>({ past: [], present: initial, future: [] });
  const lastCheckpoint = useRef(0);

  const set = useCallback((next: string, options?: {checkpoint?: boolean;}) => {
    const now = Date.now();
    const checkpoint = options?.checkpoint || now - lastCheckpoint.current > 800;
    if (checkpoint) lastCheckpoint.current = now;
    setState((s) => {
      if (next === s.present) return s;
      if (checkpoint) return { past: [...s.past.slice(-99), s.present], present: next, future: [] };
      return { ...s, present: next, future: [] };
    });
  }, []);

  const undo = useCallback(() => {
    lastCheckpoint.current = 0;
    setState((s) => {
      if (!s.past.length) return s;
      return { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future] };
    });
  }, []);

  const redo = useCallback(() => {
    lastCheckpoint.current = 0;
    setState((s) => {
      if (!s.future.length) return s;
      return { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1) };
    });
  }, []);

  return {
    value: state.present,
    set,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0
  };
}