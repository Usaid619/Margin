import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import type { UserPreferences } from '../../types/user';
import type { WritingPalette } from '../../utils/writingPalette';
import { easeOut } from '../../utils/motion';
import { WritingSettingsFields } from './WritingSettingsFields';

interface FontPanelProps {
  open: boolean;
  onClose: () => void;
  palette: WritingPalette;
  preferences: UserPreferences;
  onChange: (patch: Partial<UserPreferences>) => void;
  position?: 'bottom' | 'top';
}

export function FontPanel({ open, onClose, palette, preferences, onChange, position = 'bottom' }: FontPanelProps) {
  return (
    <AnimatePresence>
      {open &&
      <motion.div
        role="dialog"
        aria-label="Writing settings"
        initial={{ opacity: 0, y: position === 'bottom' ? 8 : -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: position === 'bottom' ? 6 : -6 }}
        transition={{ duration: 0.2, ease: easeOut }}
        className={`fixed left-4 right-4 z-50 border p-6 md:left-auto md:right-10 md:w-80 ${position === 'bottom' ? 'bottom-24' : 'top-20'}`}
        style={{ backgroundColor: palette.bg, borderColor: palette.line, color: palette.fg }}>
        
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-label" style={{ color: palette.mute }}>
              Writing
            </span>
            <button type="button" onClick={onClose} aria-label="Close writing settings">
              <XIcon aria-hidden className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <WritingSettingsFields preferences={preferences} onChange={onChange} mute={palette.mute} line={palette.line} />
        </motion.div>
      }
    </AnimatePresence>);

}