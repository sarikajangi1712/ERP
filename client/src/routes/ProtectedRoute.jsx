import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/common/Skeleton';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 min-h-screen flex items-center justify-center"><Skeleton className="w-64 h-32" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
