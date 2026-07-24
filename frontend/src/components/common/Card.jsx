import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-[#0E131F]/90 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-xl transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
