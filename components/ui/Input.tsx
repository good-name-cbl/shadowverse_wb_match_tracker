import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl shadow-sm placeholder-slate-500 text-slate-100 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500',
    'hover:border-slate-600',
    error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
