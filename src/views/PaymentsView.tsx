/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  Building,
  QrCode,
  ArrowUpRight,
} from 'lucide-react';
import { AgencySettings, PaymentRecord, Project } from '../types';
import { Modal } from '../components/Modal';
import { deletePayment, savePayment } from '../services/storage';
import { formatCurrency, formatDate, maskPhone } from '../utils/formatters';

interface PaymentsViewProps {
  payments: PaymentRecord[];
  projects: Project[];
  settings: AgencySettings;
  privacyMode: boolean;
  onSendPaymentReminderWhatsApp: (project: Project, isAdvance: boolean) => void;
  preSelectedProjectForPayment?: Project | null;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  projects,
  settings,
  privacyMode,
  onSendPaymentReminderWhatsApp,
  preSelectedProjectForPayment,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('all');
  const [search, setSearch] = useState('');

  // Modals
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    preSelectedProjectForPayment?.id || projects[0]?.id || ''
  );
  const [paymentAmount, setPaymentAmount] = useState<number>(2500);
  const [paymentType, setPaymentType] = useState<'Advance' | 'Remaining' | 'Full' | 'Milestone'>('Advance');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Bank Transfer' | 'Cash' | 'Card' | 'Cheque'>('UPI');
  const [utrOrRef, setUtrOrRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Totals calculations
  const totalReceivables = projects.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalCollected = payments.reduce((sum, pay) => sum + (pay.amount || 0), 0);
  const totalPending = projects.reduce((sum, p) => sum + (p.remainingAmount || 0), 0);

  const pendingProjects = projects.filter((p) => (p.remainingAmount || 0) > 0);

  const handleOpenRecord = (proj?: Project) => {
    if (proj) {
      setSelectedProjectId(proj.id);
      setPaymentAmount(proj.remainingAmount > 0 ? proj.remainingAmount : Math.round(proj.totalAmount * 0.5));
      setPaymentType(proj.advancePaid === 0 ? 'Advance' : 'Remaining');
    } else {
      setSelectedProjectId(projects[0]?.id || '');
      setPaymentAmount(2500);
    }
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setUtrOrRef('');
    setNotes('');
    setIsRecordOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === selectedProjectId);
    if (!proj) {
      alert('Please select a valid project.');
      return;
    }

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      projectId: proj.id,
      clientName: proj.clientName,
      projectName: proj.projectName,
      amount: Number(paymentAmount) || 0,
      paymentType,
      paymentMethod,
      paymentDate,
      utrOrRef: utrOrRef.trim() || undefined,
      notes: notes.trim() || `${paymentType} payment via ${paymentMethod}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    savePayment(newPayment);
    setIsRecordOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this payment transaction record?')) {
      deletePayment(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-400" />
            Payment Management & Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Track 50% advances, milestone payments, remaining balances and send WhatsApp payment reminders.
          </p>
        </div>

        <button
          onClick={() => handleOpenRecord()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Record Payment</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#0b1224] p-5">
          <p className="text-xs font-medium text-slate-400">Total Billed Projects</p>
          <h3 className="mt-2 text-2xl font-mono font-extrabold text-white">
            {formatCurrency(totalReceivables, privacyMode)}
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">Across {projects.length} website projects</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-emerald-300">Total Collected</p>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="mt-2 text-2xl font-mono font-extrabold text-emerald-400">
            {formatCurrency(totalCollected, privacyMode)}
          </h3>
          <p className="mt-1 text-[11px] text-emerald-300/70">Verified in agency account</p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-amber-300">Pending Receivables</p>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="mt-2 text-2xl font-mono font-extrabold text-amber-400">
            {formatCurrency(totalPending, privacyMode)}
          </h3>
          <p className="mt-1 text-[11px] text-amber-300/70">From {pendingProjects.length} pending clients</p>
        </div>
      </div>

      {/* Pending Balances Action List (Alert Banner) */}
      {pendingProjects.length > 0 && (
        <div className="rounded-3xl border border-amber-500/30 bg-[#0d1627] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Pending Client Payments & Reminders</h3>
                <p className="text-xs text-slate-400">
                  {pendingProjects.length} clients have an outstanding advance or final balance due.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
              Pending: {formatCurrency(totalPending, privacyMode)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingProjects.map((proj) => {
              const isAdvancePending = proj.advancePaid === 0;
              return (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {isAdvancePending ? '50% Advance Due' : 'Final Balance Due'}
                      </span>
                      <span className="font-mono font-extrabold text-white text-sm">
                        {formatCurrency(proj.remainingAmount, privacyMode)}
                      </span>
                    </div>

                    <h4 className="mt-2 text-sm font-bold text-white">{proj.projectName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {proj.clientBusiness} ({proj.clientName})
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {maskPhone(proj.clientPhone, privacyMode)}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenRecord(proj)}
                      className="flex-1 rounded-xl bg-slate-800 py-1.5 px-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      Record Payment
                    </button>
                    <button
                      onClick={() => onSendPaymentReminderWhatsApp(proj, isAdvancePending)}
                      className="flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/15 py-1.5 px-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-colors"
                      title="Send WhatsApp Reminder"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Transaction Ledger */}
      <div className="rounded-3xl border border-slate-800 bg-[#0b1224] overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-cyan-400" />
            Transaction History ({payments.length} Payments)
          </h3>
          <span className="text-xs text-slate-400">
            Agency UPI: <strong className="text-slate-200 font-mono">{settings.upiId}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client & Project</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {formatDate(pay.paymentDate)}
                  </td>
                  <td className="py-3 px-4">
                    <strong className="text-white block text-sm">{pay.clientName}</strong>
                    <span className="text-slate-400 text-xs">{pay.projectName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                      {pay.paymentType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{pay.paymentMethod}</div>
                    {pay.utrOrRef && (
                      <div className="font-mono text-[10px] text-slate-500">{pay.utrOrRef}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                    +{formatCurrency(pay.amount, privacyMode)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(pay.id)}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/15 p-1.5 text-rose-400 hover:bg-rose-500/25 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordOpen && (
        <Modal
          isOpen={isRecordOpen}
          onClose={() => setIsRecordOpen(false)}
          title="Record Client Payment"
          subtitle="Add advance or balance payment received via UPI, Bank Transfer or Cash"
          maxWidth="2xl"
        >
          <form onSubmit={handleSavePayment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Website Project <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  const proj = projects.find((p) => p.id === e.target.value);
                  if (proj) {
                    setPaymentAmount(proj.remainingAmount > 0 ? proj.remainingAmount : Math.round(proj.totalAmount * 0.5));
                  }
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName} — {p.clientName} ({p.clientBusiness}) [Due: ₹{p.remainingAmount}]
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Amount Received (₹) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Type
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="Advance">50% Advance</option>
                  <option value="Remaining">Final Balance</option>
                  <option value="Full">Full 100% Payment</option>
                  <option value="Milestone">Milestone Installment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (IMPS / NEFT)</option>
                  <option value="Cash">Cash in Hand</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Transaction ID / UTR / Reference Number
              </label>
              <input
                type="text"
                value={utrOrRef}
                onChange={(e) => setUtrOrRef(e.target.value)}
                placeholder="e.g. UPI/429810398412 or Bank Ref 990184"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Notes / Reference
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. GPay screenshot received on WhatsApp"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsRecordOpen(false)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all"
              >
                Save Payment Entry
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
