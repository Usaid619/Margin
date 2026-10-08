import React from 'react';

export function MiniBars({ playing }: {playing: boolean;}) {
  return (
    <span aria-hidden className="flex h-3 items-end gap-[3px]">
      {[0, 0.18, 0.36].map((delay) =>
      <span
        key={delay}
        className={`block h-full w-[2px] origin-bottom bg-current ${playing ? 'animate-bar' : 'scale-y-[0.35]'}`}
        style={{ animationDelay: `${delay}s` }} />

      )}
    </span>);

}