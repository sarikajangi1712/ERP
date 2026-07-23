import React from 'react';

export const Table = ({ headers, children }) => {
  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 dark:bg-slate-800/60 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`px-4 py-3.5 ${h.className || ''}`}>
                {h.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
          {children}
        </tbody>
      </table>
    </div>
  );
};
