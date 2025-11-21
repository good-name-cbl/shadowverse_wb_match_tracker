import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder = '選択してください',
  className = '',
  ...props
}) => {
  const selectClasses = [
    'w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl shadow-sm text-slate-100 transition-all duration-200 appearance-none',
    'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500',
    'hover:border-slate-600',
    'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2394a3b8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E")] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.75rem_center]',
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
      <select className={selectClasses} {...props}>
        <option value="" className="bg-slate-900 text-slate-400">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
