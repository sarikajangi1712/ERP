import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';

import { LandingPage } from '../pages/LandingPage';
import { ApiDocs } from '../pages/ApiDocs';
import { Login } from '../pages/Login';
import { Unauthorized } from '../pages/Unauthorized';
import { NotFound } from '../pages/NotFound';
import { Dashboard } from '../pages/Dashboard';
import { Customers } from '../pages/Customers';
import { CustomerDetail } from '../pages/CustomerDetail';
import { Products } from '../pages/Products';
import { Inventory } from '../pages/Inventory';
import { SalesChallans } from '../pages/SalesChallans';
import { CreateChallan } from '../pages/CreateChallan';
import { Invoices } from '../pages/Invoices';
import { CRMFollowups } from '../pages/CRMFollowups';
import { Reports } from '../pages/Reports';
import { AuditLogs } from '../pages/AuditLogs';
import { Settings } from '../pages/Settings';
import { Users } from '../pages/Users';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page & API Docs */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/api-docs" element={<ApiDocs />} />
      <Route path="/docs" element={<ApiDocs />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/challans" element={<SalesChallans />} />
          <Route path="/challans/new" element={<CreateChallan />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/followups" element={<CRMFollowups />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />

          {/* Admin Only Routes */}
          <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
            <Route path="/users" element={<Users />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};
