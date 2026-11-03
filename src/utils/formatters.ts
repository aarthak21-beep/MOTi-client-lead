/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectStage } from '../types';

export function formatCurrency(amount: number, privacyMode = false): string {
  if (privacyMode) return '₹••,•••';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cleanPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  // Remove non-digit characters
  let digits = phone.replace(/\D/g, '');
  // If 10 digits (standard Indian mobile without country code), prepend 91
  if (digits.length === 10) {
    digits = '91' + digits;
  }
  return digits;
}

export function maskPhone(phone: string, privacyMode: boolean): string {
  if (!phone) return '';
  if (!privacyMode) return phone;
  if (phone.length <= 4) return '••••';
  return phone.slice(0, 4) + ' ••••• ' + phone.slice(-3);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getFollowUpStatus(dateStr?: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  colorClass: string;
} {
  if (!dateStr) {
    return { label: 'No date', isOverdue: false, isToday: false, colorClass: 'text-slate-400 bg-slate-800/40' };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (dateStr === todayStr) {
    return { label: 'Due Today', isOverdue: false, isToday: true, colorClass: 'text-amber-300 bg-amber-500/20 border border-amber-500/30' };
  }

  if (dateStr < todayStr) {
    return { label: 'Overdue', isOverdue: true, isToday: false, colorClass: 'text-rose-400 bg-rose-500/20 border border-rose-500/30' };
  }

  return { label: formatDate(dateStr), isOverdue: false, isToday: false, colorClass: 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/40' };
}

export function getStageBadge(stage: ProjectStage): { label: string; bg: string; text: string; dot: string } {
  switch (stage) {
    case 'Enquiry':
      return { label: 'Enquiry', bg: 'bg-slate-800/80', text: 'text-slate-300', dot: 'bg-slate-400' };
    case 'Discussion':
      return { label: 'Discussion', bg: 'bg-indigo-950/70', text: 'text-indigo-300', dot: 'bg-indigo-400' };
    case 'Advance Received':
      return { label: 'Advance Received', bg: 'bg-emerald-950/70', text: 'text-emerald-300', dot: 'bg-emerald-400' };
    case 'Design':
      return { label: 'Design UI/UX', bg: 'bg-sky-950/70', text: 'text-sky-300', dot: 'bg-sky-400' };
    case 'Development':
      return { label: 'Development', bg: 'bg-blue-950/70', text: 'text-blue-300', dot: 'bg-blue-400' };
    case 'Client Review':
      return { label: 'Client Review', bg: 'bg-amber-950/70', text: 'text-amber-300', dot: 'bg-amber-400' };
    case 'Final Payment':
      return { label: 'Final Payment Due', bg: 'bg-purple-950/70', text: 'text-purple-300', dot: 'bg-purple-400' };
    case 'Delivered':
      return { label: 'Delivered & Live', bg: 'bg-teal-950/70', text: 'text-teal-300', dot: 'bg-teal-400' };
    default:
      return { label: stage, bg: 'bg-slate-800', text: 'text-slate-300', dot: 'bg-slate-400' };
  }
}

export function getLeadStatusBadge(status: string): { bg: string; text: string } {
  switch (status) {
    case 'New':
      return { bg: 'bg-blue-500/15 border-blue-500/30 text-blue-300', text: 'text-blue-300' };
    case 'Contacted':
      return { bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300', text: 'text-purple-300' };
    case 'Interested':
      return { bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300', text: 'text-amber-300' };
    case 'Follow-up':
      return { bg: 'bg-orange-500/15 border-orange-500/30 text-orange-300', text: 'text-orange-300' };
    case 'Converted':
      return { bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', text: 'text-emerald-300' };
    case 'Not Interested':
      return { bg: 'bg-slate-500/15 border-slate-500/30 text-slate-400', text: 'text-slate-400' };
    default:
      return { bg: 'bg-slate-800 text-slate-300', text: 'text-slate-300' };
  }
}
