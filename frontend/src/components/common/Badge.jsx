import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-500/10 text-slate-400 border-slate-500/20 font-bold',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 font-bold',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider font-bold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
