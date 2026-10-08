import type { WritingTheme } from '../types/user';

export interface WritingPalette {
  bg: string;
  fg: string;
  mute: string;
  line: string;
  accent: string;
}

export function writingPalette(theme: WritingTheme, finalMinute = false): WritingPalette {
  if (theme === 'paper') {
    return {
      bg: finalMinute ? '#EDE2CC' : '#F2EDE3',
      fg: '#12110F',
      mute: '#6E685F',
      line: 'rgba(18,17,15,0.12)',
      accent: finalMinute ? '#8A5520' : '#12110F'
    };
  }
  return {
    bg: finalMinute ? '#1D1711' : '#151410',
    fg: '#E6DDCB',
    mute: '#9A9284',
    line: 'rgba(230,221,203,0.14)',
    accent: finalMinute ? '#D39A55' : '#E6DDCB'
  };
}