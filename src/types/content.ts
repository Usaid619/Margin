import type { WritingModeId, WritingStatistics } from './writing';

export interface NavItem {
  label: string;
  to: string;
}

export interface JournalArticle {
  slug: string;
  title: string;
  dek: string;
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  image?: string;
  imageAlt?: string;
  pullQuote?: string;
  body: string[];
}

export interface Observation {
  text: string;
  x: number;
  y: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  metric: keyof WritingStatistics;
  threshold: number;
}

export interface WordOfTheDay {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  history: string;
}

export interface WritingExercise {
  title: string;
  instruction: string;
  constraint: string;
  minutes: number;
}

export interface CommunityPiece {
  id: string;
  author: string;
  location: string;
  title: string;
  mode: WritingModeId;
  excerpt: string;
}

export interface FeaturedObject {
  name: string;
  note: string;
  image: string;
  imageAlt: string;
}

export interface ChoiceOption<T> {
  id: T;
  label: string;
  note: string;
}

export interface ManifestoSection {
  numeral: string;
  title: string;
  body: string[];
}