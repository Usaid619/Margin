import type { WritingFont } from '../types/user';

export const writingFonts: {id: WritingFont;label: string;note: string;family: string;}[] = [
{ id: 'literata', label: 'Literata', note: 'Book', family: 'Literata, Georgia, serif' },
{ id: 'newsreader', label: 'Newsreader', note: 'Journal', family: 'Newsreader, Georgia, serif' },
{ id: 'plex', label: 'Plex Mono', note: 'Typewriter', family: '"IBM Plex Mono", ui-monospace, monospace' }];