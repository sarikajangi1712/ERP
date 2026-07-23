import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({ title = 'No records found', message = 'There are no items to display at this time.', icon: Icon = PackageOpen, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl my-4">
      <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
      {action}
    </div>
  );
};
