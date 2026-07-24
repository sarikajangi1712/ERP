import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Building, Mail, Phone, MapPin, FileText, Plus, Clock } from 'lucide-react';
import { customerApi } from '../api/customerApi';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';

export const CustomerDetail = () => {
  const { id } = useParams();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');

  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  const { data, isLoading } = useQuery({
    queryKey: ['customerDetail', id],
    queryFn: async () => {
      const res = await customerApi.getCustomerById(id);
      return res.data.customer;
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: (payload) => customerApi.addNote(id, payload),
    onSuccess: () => {
      showToast('Follow-up note logged', 'success');
      queryClient.invalidateQueries(['customerDetail', id]);
      setIsNoteModalOpen(false);
      setNoteText('');
      setNextFollowUp('');
    },
  });

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    addNoteMutation.mutate({ note: noteText, nextFollowUp });
  };

  if (isLoading) return <Skeleton className="h-96" />;
  if (!data) return <p>Customer not found.</p>;

  return (
    <div className="space-y-6">
      <Link to="/customers">
        <Button variant="outline" size="sm" icon={ArrowLeft}>Back to Customers Directory</Button>
      </Link>

      {/* Main Profile Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 font-bold text-xl">
              {data.companyName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{data.companyName}</h2>
              <Badge variant="success" className="mt-1">{data.leadStatus}</Badge>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <span>Contact: <strong className="text-slate-900 dark:text-slate-200">{data.contactPerson}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{data.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{data.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{data.address}, {data.city}, {data.state} - {data.pincode}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs">
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">Approved Credit Limit</span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">₹{Number(data.creditLimit).toLocaleString()}</span>
          </div>
        </Card>

        {/* CRM Activity Feed & Notes */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> CRM Follow-up Timeline & Activity
            </h3>
            <Button size="sm" icon={Plus} onClick={() => setIsNoteModalOpen(true)}>Add Log Note</Button>
          </div>

          <div className="space-y-3">
            {data.notes.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No logged notes yet. Click 'Add Log Note' to start tracking interactions.</p>
            ) : (
              data.notes.map((n) => (
                <div key={n.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Logged by <strong>{n.user?.name}</strong></span>
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200">{n.note}</p>
                  {n.nextFollowUp && (
                    <span className="inline-block text-[10px] text-amber-500 font-semibold mt-1">
                      Scheduled Follow-up: {new Date(n.nextFollowUp).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Add Note Modal */}
      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Log CRM Interaction Note">
        <form onSubmit={handleNoteSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Interaction / Call Note</label>
            <textarea
              required
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Discussed bulk discount terms. Customer requested updated product catalog."
              className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Next Follow-Up Date (Optional)</label>
            <input
              type="date"
              value={nextFollowUp}
              onChange={(e) => setNextFollowUp(e.target.value)}
              className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsNoteModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={addNoteMutation.isPending}>Save CRM Note</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
