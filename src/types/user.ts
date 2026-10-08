import type { WritingModeId } from './writing';

export type WritingReason = 'more' | 'better' | 'think' | 'habit' | 'explore';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'late-night';
export type WritingFont = 'literata' | 'newsreader' | 'plex';
export type WritingTheme = 'night' | 'paper';

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  joinedAt: string;
}

export interface UserPreferences {
  reason: WritingReason | null;
  modes: WritingModeId[];
  timeOfDay: TimeOfDay | null;
  hasOnboarded: boolean;
  hasSeenStudio: boolean;
  writingFont: WritingFont;
  writingSize: number;
  writingLeading: number;
  writingTheme: WritingTheme;
}