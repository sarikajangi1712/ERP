import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
