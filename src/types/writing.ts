export type WritingModeId = 'object' | 'focused' | 'free' | 'reflection' | 'observation';

export type WritingStatus = 'draft' | 'finished';

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'error';

export interface ModeTheme {
  panel: string;
  muted: string;
  accent: string;
  rule: string;
  hex: string;
}

export interface WritingMode {
  id: WritingModeId;
  name: string;
  title: string;
  lines: [string, string];
  summary: string;
  lenses: string[];
  details: {label: string;value: string;}[];
  defaultMinutes: number | null;
  ritual: string;
  hasSetup: boolean;
  prompts: string[];
  theme: ModeTheme;
}

export interface Writing {
  id: string;
  title: string;
  body: string;
  mode: WritingModeId;
  prompt?: string;
  object?: string;
  createdAt: string;
  updatedAt: string;
  durationMinutes?: number;
  favorite: boolean;
  status: WritingStatus;
}

export interface WritingSession {
  id: string;
  writingId: string | null;
  mode: WritingModeId;
  startedAt: string;
  durationSeconds: number;
  words: number;
}

export interface Favorite {
  writingId: string;
  addedAt: string;
}

export interface WritingObject {
  name: string;
  prompt: string;
}

export type PromptCategory =
'Memory' |
'People' |
'Places' |
'Objects' |
'Fear' |
'Love' |
'Childhood' |
'Dreams' |
'Nature' |
'Identity' |
'Observation' |
'Random';

export interface Prompt {
  id: string;
  text: string;
  category: Exclude<PromptCategory, 'Random'>;
}

export interface WritingStatistics {
  pieces: number;
  words: number;
  sessions: number;
  streak: number;
  longestStreak: number;
  activeDays: number;
}

export interface SessionConfig {
  mode: WritingModeId;
  minutes: number | null;
  prompt: string | null;
  object: WritingObject | null;
  number: number;
}