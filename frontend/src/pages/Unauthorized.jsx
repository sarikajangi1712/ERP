import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div className="p-4 rounded-3xl bg-rose-500/10 text-rose-500 mb-4">
        <ShieldAlert className="w-16 h-16" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Access Restricted</h2>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        Your user role does not have sufficient permission to access this module or operational resource.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={ArrowLeft}>Return to Dashboard</Button>
      </Link>
    </div>
  );
};
