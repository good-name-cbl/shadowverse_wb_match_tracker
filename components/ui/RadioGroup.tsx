import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl border transition-all duration-200 ${value === option.value
                ? 'bg-violet-500/10 border-violet-500/50'
                : 'bg-slate-900/30 border-slate-700 hover:bg-slate-800/50 hover:border-slate-600'
              }`}
          >
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="peer sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${value === option.value
                  ? 'border-violet-500 bg-violet-500'
                  : 'border-slate-500 bg-transparent'
                }`}></div>
              <div className={`absolute w-2 h-2 rounded-full bg-white transition-all duration-200 ${value === option.value ? 'scale-100' : 'scale-0'
                }`}></div>
            </div>
            <span className={`text-sm font-medium transition-colors ${value === option.value ? 'text-violet-200' : 'text-slate-300'
              }`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
