import React from 'react';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div className="p-4 rounded-3xl bg-blue-500/10 text-blue-500 mb-4">
        <HelpCircle className="w-16 h-16" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">404 - Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        The requested screen or document URI does not exist in the ERP system.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={ArrowLeft}>Back to Dashboard</Button>
      </Link>
    </div>
  );
};
