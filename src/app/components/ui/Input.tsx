import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-text-secondary text-base font-medium mb-3">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-surface border border-border text-text-primary px-5 py-4 rounded-xl text-lg
          focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20
          placeholder:text-text-muted transition-all ${error ? 'border-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-base text-error">{error}</p>
      )}
    </div>
  );
}
