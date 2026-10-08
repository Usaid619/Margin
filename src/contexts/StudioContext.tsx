import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User, UserPreferences } from '../types/user';
import type { Writing, WritingSession, WritingStatistics } from '../types/writing';
import { demoPreferences, demoUser, defaultPreferences } from '../data/user';
import { seedWritings } from '../data/writings';
import { seedSessions } from '../data/sessions';
import { computeStatistics } from '../utils/stats';
import { createId } from '../utils/id';

export type WritingInput = Partial<Omit<Writing, 'id' | 'createdAt' | 'updatedAt'>> & {id?: string;};

interface StoredState {
  account: User;
  signedIn: boolean;
  preferences: UserPreferences;
  writings: Writing[];
  sessions: WritingSession[];
}

interface StudioContextValue {
  user: User | null;
  preferences: UserPreferences;
  writings: Writing[];
  sessions: WritingSession[];
  statistics: WritingStatistics;
  storageHealthy: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  updateAccount: (patch: Partial<User>) => void;
  getWriting: (id: string) => Writing | undefined;
  saveWriting: (input: WritingInput) => string;
  deleteWriting: (id: string) => void;
  duplicateWriting: (id: string) => string | null;
  toggleFavorite: (id: string) => void;
  logSession: (session: Omit<WritingSession, 'id'>) => void;
}

const STORAGE_KEY = 'margin.studio.v1';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const StudioContext = createContext<StudioContextValue | null>(null);

function initialState(): StoredState {
  return {
    account: demoUser,
    signedIn: true,
    preferences: demoPreferences,
    writings: seedWritings,
    sessions: seedSessions
  };
}

function loadState(): StoredState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState(), ...(JSON.parse(raw) as Partial<StoredState>) };
  } catch {

    /* fall back to the sample studio */}
  return initialState();
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function StudioProvider({ children }: {children: React.ReactNode;}) {
  const [state, setState] = useState<StoredState>(loadState);
  const [storageHealthy, setStorageHealthy] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setStorageHealthy(true);
      } catch {
        setStorageHealthy(false);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [state]);

  const signIn = useCallback(async (email: string, password: string) => {
    await wait(900);
    if (!EMAIL.test(email.trim())) throw new Error("That doesn't look like an email address. Check it once more?");
    if (password.length < 6) throw new Error("That email and password don't match. Take a breath and try again.");
    setState((s) => ({ ...s, signedIn: true, account: { ...s.account, email: email.trim() } }));
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    await wait(1000);
    if (!name.trim()) throw new Error('What should we call you?');
    if (!EMAIL.test(email.trim())) throw new Error("That doesn't look like an email address. Check it once more?");
    if (password.length < 8) throw new Error('Your password needs at least eight characters.');
    setState({
      account: { id: createId('u'), name: name.trim(), email: email.trim(), bio: '', location: '', joinedAt: new Date().toISOString() },
      signedIn: true,
      preferences: defaultPreferences,
      writings: [],
      sessions: []
    });
  }, []);

  const signOut = useCallback(() => setState((s) => ({ ...s, signedIn: false })), []);

  const requestPasswordReset = useCallback(async (email: string) => {
    await wait(800);
    if (!EMAIL.test(email.trim())) throw new Error("That doesn't look like an email address. Check it once more?");
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    await wait(800);
    if (password.length < 8) throw new Error('Your new password needs at least eight characters.');
  }, []);

  const updatePreferences = useCallback((patch: Partial<UserPreferences>) => {
    setState((s) => ({ ...s, preferences: { ...s.preferences, ...patch } }));
  }, []);

  const updateAccount = useCallback((patch: Partial<User>) => {
    setState((s) => ({ ...s, account: { ...s.account, ...patch } }));
  }, []);

  const getWriting = useCallback((id: string) => state.writings.find((w) => w.id === id), [state.writings]);

  const saveWriting = useCallback((input: WritingInput) => {
    const id = input.id ?? createId('w');
    const now = new Date().toISOString();
    setState((s) => {
      const exists = s.writings.some((w) => w.id === id);
      if (exists) {
        return { ...s, writings: s.writings.map((w) => w.id === id ? { ...w, ...input, id, updatedAt: now } : w) };
      }
      const created: Writing = {
        title: 'Untitled',
        body: '',
        mode: 'free',
        favorite: false,
        status: 'draft',
        ...input,
        id,
        createdAt: now,
        updatedAt: now
      };
      return { ...s, writings: [created, ...s.writings] };
    });
    return id;
  }, []);

  const deleteWriting = useCallback((id: string) => {
    setState((s) => ({ ...s, writings: s.writings.filter((w) => w.id !== id) }));
  }, []);

  const duplicateWriting = useCallback(
    (id: string) => {
      const original = state.writings.find((w) => w.id === id);
      if (!original) return null;
      const newId = createId('w');
      const now = new Date().toISOString();
      setState((s) => ({
        ...s,
        writings: [
        { ...original, id: newId, title: `${original.title} (copy)`, status: 'draft', favorite: false, createdAt: now, updatedAt: now },
        ...s.writings]

      }));
      return newId;
    },
    [state.writings]
  );

  const toggleFavorite = useCallback((id: string) => {
    setState((s) => ({ ...s, writings: s.writings.map((w) => w.id === id ? { ...w, favorite: !w.favorite } : w) }));
  }, []);

  const logSession = useCallback((session: Omit<WritingSession, 'id'>) => {
    setState((s) => ({ ...s, sessions: [{ ...session, id: createId('s') }, ...s.sessions] }));
  }, []);

  const statistics = useMemo(() => computeStatistics(state.writings, state.sessions), [state.writings, state.sessions]);

  const value = useMemo<StudioContextValue>(
    () => ({
      user: state.signedIn ? state.account : null,
      preferences: state.preferences,
      writings: state.writings,
      sessions: state.sessions,
      statistics,
      storageHealthy,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      resetPassword,
      updatePreferences,
      updateAccount,
      getWriting,
      saveWriting,
      deleteWriting,
      duplicateWriting,
      toggleFavorite,
      logSession
    }),
    [state, statistics, storageHealthy, signIn, signUp, signOut, requestPasswordReset, resetPassword, updatePreferences, updateAccount, getWriting, saveWriting, deleteWriting, duplicateWriting, toggleFavorite, logSession]
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used inside StudioProvider');
  return ctx;
}