import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, Search } from 'lucide-react';
import { auditApi } from '../api/auditApi';
import { Card } from '../components/common/Card';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const AuditLogs = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['auditLogsList', page],
    queryFn: async () => {
      const res = await auditApi.getAuditLogs({ page, limit: 15 });
      return res.data;
    },
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination || {};

  const headers = [
    { title: 'Timestamp' },
    { title: 'User / Actor' },
    { title: 'Action Type' },
    { title: 'Target Entity' },
    { title: 'Details' },
    { title: 'IP Address' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">System Security Audit Log</h1>
        <p className="text-xs text-slate-500 mt-1">Immutable audit trail tracking login events, stock changes & operational actions</p>
      </div>

      {isLoading ? (
        <Card><Skeleton className="h-64" /></Card>
      ) : logs.length === 0 ? (
        <EmptyState title="No audit logs" message="No audit records registered." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table headers={headers}>
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-slate-100">{l.user?.name || 'System / Guest'}</td>
                <td className="px-4 py-3.5 text-xs font-bold text-blue-500">{l.action}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{l.entity}</td>
                <td className="px-4 py-3.5 text-xs text-slate-400 max-w-sm truncate">{l.details}</td>
                <td className="px-4 py-3.5 text-xs font-mono text-slate-500">{l.ipAddress}</td>
              </tr>
            ))}
          </Table>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Pagination currentPage={page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />
          </div>
        </Card>
      )}
    </div>
  );
};
