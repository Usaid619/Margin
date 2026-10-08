import React from 'react';
import type { UserPreferences } from '../../types/user';
import { writingFonts } from '../../data/writingFonts';

interface WritingSettingsFieldsProps {
  preferences: UserPreferences;
  onChange: (patch: Partial<UserPreferences>) => void;
  mute: string;
  line: string;
}

/** Typeface, size, leading and room — shared by the writing panel and the profile. */
export function WritingSettingsFields({ preferences, onChange, mute, line }: WritingSettingsFieldsProps) {
  const legend = 'font-mono text-[10px] uppercase tracking-label';
  return (
    <div className="space-y-7">
      <fieldset>
        <legend className={legend} style={{ color: mute }}>
          Typeface
        </legend>
        <div className="mt-2">
          {writingFonts.map((font) => {
            const on = preferences.writingFont === font.id;
            return (
              <button
                key={font.id}
                type="button"
                aria-pressed={on}
                onClick={() => onChange({ writingFont: font.id })}
                className="flex w-full items-baseline justify-between border-b py-2.5 text-left"
                style={{ borderColor: line }}>
                
                <span className="text-lg" style={{ fontFamily: font.family, opacity: on ? 1 : 0.65 }}>
                  {on && <span aria-hidden className="mr-2 text-amber">●</span>}
                  {font.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-label" style={{ color: mute }}>
                  {font.note}
                </span>
              </button>);

          })}
        </div>
      </fieldset>

      <label className="block">
        <span className="flex justify-between">
          <span className={legend} style={{ color: mute }}>
            Size
          </span>
          <span className="font-mono text-[11px] tabular-nums">{preferences.writingSize}px</span>
        </span>
        <input
          type="range"
          min={16}
          max={28}
          step={1}
          value={preferences.writingSize}
          onChange={(e) => onChange({ writingSize: Number(e.target.value) })}
          className="range mt-2" />
        
      </label>

      <label className="block">
        <span className="flex justify-between">
          <span className={legend} style={{ color: mute }}>
            Line height
          </span>
          <span className="font-mono text-[11px] tabular-nums">{preferences.writingLeading.toFixed(2)}</span>
        </span>
        <input
          type="range"
          min={1.4}
          max={2.2}
          step={0.05}
          value={preferences.writingLeading}
          onChange={(e) => onChange({ writingLeading: Number(e.target.value) })}
          className="range mt-2" />
        
      </label>

      <fieldset>
        <legend className={legend} style={{ color: mute }}>
          Room
        </legend>
        <div className="mt-3 grid grid-cols-2 border" style={{ borderColor: line }}>
          {(['night', 'paper'] as const).map((theme) => {
            const on = preferences.writingTheme === theme;
            return (
              <button
                key={theme}
                type="button"
                aria-pressed={on}
                onClick={() => onChange({ writingTheme: theme })}
                className={`py-2.5 text-[0.68rem] font-medium uppercase tracking-label transition-colors duration-200 ${on ? theme === 'night' ? 'bg-night text-bone' : 'bg-paper text-ink' : ''}`}>
                
                {theme === 'night' ? 'Night' : 'Paper'}
              </button>);

          })}
        </div>
      </fieldset>
    </div>);

}