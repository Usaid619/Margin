export interface Block {
  type: 'paragraph' | 'heading' | 'quote';
  text: string;
}

export interface Segment {
  text: string;
  bold: boolean;
  italic: boolean;
}

export function parseBlocks(text: string): Block[] {
  return text.
  split(/\n{2,}/).
  map((chunk) => chunk.trim()).
  filter(Boolean).
  map((chunk) => {
    if (/^#{1,3}\s/.test(chunk)) return { type: 'heading', text: chunk.replace(/^#{1,3}\s+/, '') };
    if (/^>\s?/.test(chunk)) {
      return {
        type: 'quote',
        text: chunk.
        split('\n').
        map((line) => line.replace(/^>\s?/, '')).
        join('\n')
      };
    }
    return { type: 'paragraph', text: chunk };
  });
}

export function parseInline(text: string): Segment[] {
  const out: Segment[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null = pattern.exec(text);
  while (match) {
    if (match.index > last) out.push({ text: text.slice(last, match.index), bold: false, italic: false });
    const token = match[0];
    if (token.startsWith('**')) out.push({ text: token.slice(2, -2), bold: true, italic: false });else
    out.push({ text: token.slice(1, -1), bold: false, italic: true });
    last = match.index + token.length;
    match = pattern.exec(text);
  }
  if (last < text.length) out.push({ text: text.slice(last), bold: false, italic: false });
  return out;
}