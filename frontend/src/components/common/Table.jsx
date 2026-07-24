import React from 'react';

export const Table = ({ headers, children }) => {
  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800/90 rounded-2xl bg-white dark:bg-[#0E131F]/90 backdrop-blur-xl shadow-lg">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100/80 dark:bg-[#07090E]/80 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800/90">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`px-4 py-3.5 ${h.className || ''}`}>
                {h.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-800 dark:text-slate-200">
          {children}
        </tbody>
      </table>
    </div>
  );
};
