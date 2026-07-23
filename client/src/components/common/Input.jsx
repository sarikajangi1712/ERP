import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
        )}
        <input
          ref={ref}
          className={`w-full bg-white dark:bg-[#0B0F19] border ${
            error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-800 focus:ring-blue-500'
          } rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all ${
            Icon ? 'pl-9' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
