export function stripMarks(text: string): string {
  return text.
  replace(/^#{1,3}\s+/gm, '').
  replace(/^>\s?/gm, '').
  replace(/\*\*(.+?)\*\*/g, '$1').
  replace(/\*(.+?)\*/g, '$1');
}

export function countWords(text: string): number {
  const plain = stripMarks(text).trim();
  return plain ? plain.split(/\s+/).length : 0;
}

export function countChars(text: string): number {
  return stripMarks(text).length;
}

export function excerpt(text: string, length = 160): string {
  const plain = stripMarks(text).replace(/\s+/g, ' ').trim();
  if (plain.length <= length) return plain;
  return `${plain.slice(0, length).replace(/\s+\S*$/, '')}…`;
}

export function titleFromText(text: string, fallback: string): string {
  const firstLine = stripMarks(text).trim().split('\n')[0] ?? '';
  const words = firstLine.
  split(/\s+/).
  filter(Boolean).
  slice(0, 6).
  join(' ').
  replace(/[.,;:!?…]+$/, '');
  return words || fallback;
}

export function readingMinutes(text: string): number {
  return Math.max(1, Math.round(countWords(text) / 230));
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
}

export function toRoman(value: number): string {
  const numerals: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']];

  let remaining = value;
  let out = '';
  numerals.forEach(([n, r]) => {
    while (remaining >= n) {
      out += r;
      remaining -= n;
    }
  });
  return out;
}

export function slugify(text: string): string {
  return text.
  toLowerCase().
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-+|-+$/g, '') || 'untitled';
}