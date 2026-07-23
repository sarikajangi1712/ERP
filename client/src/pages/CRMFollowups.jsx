import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PhoneCall, Calendar, Clock, CheckCircle2, User } from 'lucide-react';
import { customerApi } from '../api/customerApi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const CRMFollowups = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['followupsList'],
    queryFn: async () => {
      const res = await customerApi.getCustomers({ limit: 100 });
      return res.data.data;
    },
  });

  const customers = data || [];
  
  // Extract all follow-up notes with scheduled dates
  const followups = [];
  customers.forEach((c) => {
    if (c.notes && c.notes.length) {
      c.notes.forEach((n) => {
        if (n.nextFollowUp) {
          followups.push({
            ...n,
            customerName: c.companyName,
            contactPerson: c.contactPerson,
            phone: c.phone,
            email: c.email,
          });
        }
      });
    }
  });

  // Sort by date ascending
  followups.sort((a, b) => new Date(a.nextFollowUp) - new Date(b.nextFollowUp));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">CRM Follow-ups & Reminders</h1>
        <p className="text-xs text-slate-500 mt-1">Scheduled call logs, client outreach reminders & lead nurture pipeline</p>
      </div>

      {isLoading ? (
        <Card><Skeleton className="h-64" /></Card>
      ) : followups.length === 0 ? (
        <EmptyState title="No pending follow-ups" message="There are no scheduled follow-up calls due today or upcoming." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followups.map((f) => {
            const isPast = new Date(f.nextFollowUp) < new Date();
            return (
              <Card key={f.id} className="flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500 block">
                      {f.customerName}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{f.contactPerson}</h3>
                    <p className="text-xs text-slate-500">{f.phone} | {f.email}</p>
                  </div>
                  <Badge variant={isPast ? 'danger' : 'warning'}>
                    {isPast ? 'OVERDUE' : 'SCHEDULED'}
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800/50">
                  <p className="italic">"{f.note}"</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    Due: {new Date(f.nextFollowUp).toLocaleDateString()}
                  </span>
                  <Button size="sm" variant="success" icon={CheckCircle2}>Complete Call</Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
