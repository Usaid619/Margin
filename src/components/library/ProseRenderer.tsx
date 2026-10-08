import React from 'react';
import { parseBlocks, parseInline } from '../../utils/markdown';

interface ProseRendererProps {
  text: string;
  dropCap?: boolean;
  style?: React.CSSProperties;
}

function renderInline(text: string) {
  return parseInline(text).map((seg, i) => {
    if (seg.bold) return <strong key={i} className="font-semibold">{seg.text}</strong>;
    if (seg.italic) return <em key={i}>{seg.text}</em>;
    return <React.Fragment key={i}>{seg.text}</React.Fragment>;
  });
}

export function ProseRenderer({ text, dropCap = false, style }: ProseRendererProps) {
  const blocks = parseBlocks(text);
  const firstParagraph = blocks.findIndex((b) => b.type === 'paragraph');

  return (
    <div className="font-writing text-[1.15rem] leading-[1.85] text-ink md:text-[1.25rem]" style={style}>
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          return (
            <h2 key={i} className="mb-6 mt-14 font-display text-3xl leading-tight md:text-4xl">
              {renderInline(block.text)}
            </h2>);

        }
        if (block.type === 'quote') {
          return (
            <blockquote key={i} className="my-10 whitespace-pre-line border-l border-ink/30 pl-6 font-display text-2xl italic leading-snug text-ink/80 md:text-3xl">
              {renderInline(block.text)}
            </blockquote>);

        }
        const cap =
        dropCap && i === firstParagraph ?
        'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.8rem] first-letter:leading-[0.78] first-letter:text-forest' :
        '';
        return (
          <p key={i} className={`mb-7 whitespace-pre-line ${cap}`}>
            {renderInline(block.text)}
          </p>);

      })}
    </div>);

}