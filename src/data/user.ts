import type { User, UserPreferences } from '../types/user';
import { daysAgo } from '../utils/date';

export const demoUser: User = {
  id: 'u_alex',
  name: 'Alex Morgan',
  email: 'alex@margin.studio',
  bio: 'Writes mostly at night. Collects overheard sentences and secondhand paperbacks.',
  location: 'Lisbon',
  joinedAt: daysAgo(64)
};

export const defaultPreferences: UserPreferences = {
  reason: null,
  modes: [],
  timeOfDay: null,
  hasOnboarded: false,
  hasSeenStudio: false,
  writingFont: 'literata',
  writingSize: 20,
  writingLeading: 1.8,
  writingTheme: 'night'
};

export const demoPreferences: UserPreferences = {
  ...defaultPreferences,
  reason: 'habit',
  modes: ['object', 'focused', 'reflection'],
  timeOfDay: 'evening',
  hasOnboarded: true,
  hasSeenStudio: false
};