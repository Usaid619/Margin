import React from "react";
import { AudioLinesIcon, BookmarkIcon, ClockIcon, FeatherIcon, TypeIcon, BoxIcon } from "lucide-react";
import { AutosaveState } from "../../types/writing";
import { WritingPalette } from "../../utils/writingPalette";
import { formatNumber } from "../../utils/text";
interface SessionBarProps {
  words: number;
  status: AutosaveState;
  palette: WritingPalette;
  quiet: boolean;
  timeVisible: boolean;
  onToggleTime: () => void;
  musicOpen: boolean;
  onMusic: () => void;
  fontOpen: boolean;
  onFont: () => void;
  onSave: () => void;
  onFinish: () => void;
  canFinish: boolean;
}
const STATUS_TEXT: Record<AutosaveState, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Kept on this device'
};
export function SessionBar(props: SessionBarProps) {
  const {
    words,
    status,
    palette,
    quiet
  } = props;
  const items: {
    id: string;
    label: string;
    icon: BoxIcon;
    onClick: () => void;
    pressed?: boolean;
    disabled?: boolean;
  }[] = [{
    id: 'time',
    label: 'Time',
    icon: ClockIcon,
    onClick: props.onToggleTime,
    pressed: props.timeVisible
  }, {
    id: 'music',
    label: 'Music',
    icon: AudioLinesIcon,
    onClick: props.onMusic,
    pressed: props.musicOpen
  }, {
    id: 'font',
    label: 'Font',
    icon: TypeIcon,
    onClick: props.onFont,
    pressed: props.fontOpen
  }, {
    id: 'save',
    label: 'Save',
    icon: BookmarkIcon,
    onClick: props.onSave
  }, {
    id: 'finish',
    label: 'Finish',
    icon: FeatherIcon,
    onClick: props.onFinish,
    disabled: !props.canFinish
  }];
  return <div role="toolbar" aria-label="Writing controls" className={`fixed inset-x-0 bottom-0 z-40 border-t px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 transition-opacity duration-300 md:px-10 md:pb-5 md:pt-4 ${quiet ? 'opacity-20 focus-within:opacity-100 hover:opacity-100' : 'opacity-100'}`} style={{
    backgroundColor: palette.bg,
    borderColor: palette.line,
    color: palette.fg
  }}>
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-baseline gap-3 pl-1 font-mono text-[11px] uppercase tracking-[0.16em]">
          <span>
            Words: <span className="tabular-nums">{formatNumber(words)}</span>
          </span>
          <span aria-live="polite" className="hidden sm:inline" style={{
          color: palette.mute
        }}>
            {STATUS_TEXT[status]}
          </span>
        </p>
        <div className="flex items-center md:gap-4">
          {items.map((item) => <button key={item.id} type="button" onClick={item.onClick} disabled={item.disabled} aria-pressed={item.pressed} className="flex min-w-[3rem] flex-col items-center gap-1 px-1.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em] transition-opacity duration-200 hover:opacity-100 disabled:opacity-30 md:min-w-0 md:flex-row md:px-2 md:text-[10px] md:tracking-label" style={{
          opacity: item.disabled ? undefined : item.pressed ? 1 : 0.72
        }}>
              <item.icon aria-hidden className="h-4 w-4 md:hidden" strokeWidth={1.5} />
              {item.label}
            </button>)}
        </div>
      </div>
    </div>;
}