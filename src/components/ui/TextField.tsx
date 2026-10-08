import React, { useId } from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, id, className = '', ...rest }: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={fieldId} className="block font-mono text-[10px] uppercase tracking-label text-mute">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className="mt-2 w-full border-b border-ink/25 bg-transparent py-3 font-writing text-lg text-ink outline-none transition-colors duration-200 placeholder:text-ink/40 focus:border-ink focus-visible:outline-none aria-[invalid=true]:border-ember"
        {...rest} />
      
      {hint && !error &&
      <p id={`${fieldId}-hint`} className="mt-2 text-xs text-ink/60">
          {hint}
        </p>
      }
      {error &&
      <p id={`${fieldId}-error`} role="alert" className="mt-2 text-sm text-ember">
          {error}
        </p>
      }
    </div>);

}