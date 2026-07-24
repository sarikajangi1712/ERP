import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({ title = 'No records found', message = 'There are no items to display at this time.', icon: Icon = PackageOpen, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/80 dark:bg-[#0E131F]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800/90 rounded-2xl my-4 shadow-lg">
      <div className="p-4 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-4 shadow-sm">
        <Icon className="w-10 h-10" />
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">{message}</p>
      {action}
    </div>
  );
};
