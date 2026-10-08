import React from "react";
import { BoldIcon, FocusIcon, HeadingIcon, ItalicIcon, Maximize2Icon, Minimize2Icon, QuoteIcon, Redo2Icon, TypeIcon, Undo2Icon, BoxIcon } from "lucide-react";
interface EditorToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onHeading: () => void;
  onQuote: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  focusMode: boolean;
  onFocus: () => void;
  fullscreen: boolean;
  onFullscreen: () => void;
  fontOpen: boolean;
  onFont: () => void;
}
interface Tool {
  label: string;
  shortcut?: string;
  icon: BoxIcon;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
}
export function EditorToolbar(p: EditorToolbarProps) {
  const groups: Tool[][] = [[{
    label: 'Bold',
    shortcut: '⌘B',
    icon: BoldIcon,
    onClick: p.onBold
  }, {
    label: 'Italic',
    shortcut: '⌘I',
    icon: ItalicIcon,
    onClick: p.onItalic
  }, {
    label: 'Heading',
    icon: HeadingIcon,
    onClick: p.onHeading
  }, {
    label: 'Quote',
    icon: QuoteIcon,
    onClick: p.onQuote
  }], [{
    label: 'Undo',
    shortcut: '⌘Z',
    icon: Undo2Icon,
    onClick: p.onUndo,
    disabled: !p.canUndo
  }, {
    label: 'Redo',
    shortcut: '⇧⌘Z',
    icon: Redo2Icon,
    onClick: p.onRedo,
    disabled: !p.canRedo
  }], [{
    label: 'Writing settings',
    icon: TypeIcon,
    onClick: p.onFont,
    pressed: p.fontOpen
  }, {
    label: 'Focus mode',
    shortcut: '⌘.',
    icon: FocusIcon,
    onClick: p.onFocus,
    pressed: p.focusMode
  }, {
    label: p.fullscreen ? 'Exit fullscreen' : 'Fullscreen',
    icon: p.fullscreen ? Minimize2Icon : Maximize2Icon,
    onClick: p.onFullscreen
  }]];
  return <div role="toolbar" aria-label="Formatting" className="no-scrollbar flex items-center overflow-x-auto">
      {groups.map((group, gi) => <div key={gi} className={`flex items-center ${gi > 0 ? 'ml-2 border-l pl-2 md:ml-3 md:pl-3' : ''}`} style={{
      borderColor: 'currentColor',
      borderLeftWidth: gi > 0 ? 1 : 0
    }}>
          {group.map((tool) => <button key={tool.label} type="button" onClick={tool.onClick} disabled={tool.disabled} aria-pressed={tool.pressed} aria-label={tool.label} title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label} className="flex h-9 w-9 items-center justify-center transition-opacity duration-200 hover:opacity-100 disabled:opacity-25" style={{
        opacity: tool.disabled ? undefined : tool.pressed ? 1 : 0.65
      }}>
              <tool.icon aria-hidden className="h-4 w-4" strokeWidth={1.5} />
            </button>)}
        </div>)}
    </div>;
}