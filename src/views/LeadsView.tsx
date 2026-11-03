/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Calendar,
  Mail,
  MapPin,
  Tag,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  FileSpreadsheet,
  FolderPlus,
  Plus,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { BusinessCategory, Lead, LeadNote, LeadStatus } from '../types';
import { Modal } from '../components/Modal';
import { addLeadNote, deleteLead, saveLead } from '../services/storage';
import { cleanPhoneForWhatsApp, formatDate, getFollowUpStatus, getLeadStatusBadge, maskPhone } from '../utils/formatters';

interface LeadsViewProps {
  leads: Lead[];
  privacyMode: boolean;
  onSelectLeadForWhatsApp: (lead: Lead) => void;
  onOpenCreateQuoteForLead: (lead: Lead) => void;
  onConvertLeadToProject: (lead: Lead) => void;
  searchQuery: string;
}

const CATEGORIES: BusinessCategory[] = [
  'Coaching Institute',
  'Restaurant & Cafe',
  'Healthcare & Clinic',
  'Retail & Shop',
  'E-Commerce',
  'Real Estate',
  'Professional Services',
  'Manufacturing',
  'Salon & Beauty',
  'Portfolio / Personal',
  'Other',
];

const STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Interested',
  'Follow-up',
  'Converted',
  'Not Interested',
];

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  privacyMode,
  onSelectLeadForWhatsApp,
  onOpenCreateQuoteForLead,
  onConvertLeadToProject,
  searchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [internalSearch, setInternalSearch] = useState<string>('');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  // Form fields
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    businessName: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    category: 'Coaching Institute',
    status: 'New',
    followUpDate: '',
    followUpTime: '',
    estimatedBudget: 4999,
  });

  // Note form inside detail drawer/modal
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteType, setNewNoteType] = useState<'call' | 'whatsapp' | 'meeting' | 'general'>('call');

  const combinedSearch = (searchQuery || internalSearch).toLowerCase();

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !combinedSearch ||
        lead.name.toLowerCase().includes(combinedSearch) ||
        lead.businessName.toLowerCase().includes(combinedSearch) ||
        lead.phone.includes(combinedSearch) ||
        lead.category.toLowerCase().includes(combinedSearch) ||
        lead.address.toLowerCase().includes(combinedSearch);

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || lead.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [leads, combinedSearch, statusFilter, categoryFilter]);

  const handleOpenAdd = () => {
    setEditingLead(null);
    setFormData({
      name: '',
      businessName: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      category: 'Coaching Institute',
      status: 'New',
      followUpDate: '',
      followUpTime: '',
      estimatedBudget: 4999,
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      businessName: lead.businessName,
      phone: lead.phone,
      whatsapp: lead.whatsapp || lead.phone,
      email: lead.email,
      address: lead.address,
      category: lead.category,
      status: lead.status,
      followUpDate: lead.followUpDate || '',
      followUpTime: lead.followUpTime || '',
      estimatedBudget: lead.estimatedBudget || 4999,
    });
    setIsAddEditOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill in Customer Name and Phone Number');
      return;
    }

    const payload: Lead = {
      id: editingLead ? editingLead.id : 'lead-' + Date.now(),
      name: formData.name || '',
      businessName: formData.businessName || formData.name || '',
      phone: formData.phone || '',
      whatsapp: formData.whatsapp || formData.phone || '',
      email: formData.email || '',
      address: formData.address || '',
      category: (formData.category as BusinessCategory) || 'Other',
      status: (formData.status as LeadStatus) || 'New',
      followUpDate: formData.followUpDate || undefined,
      followUpTime: formData.followUpTime || undefined,
      estimatedBudget: Number(formData.estimatedBudget) || 4999,
      notesHistory: editingLead ? editingLead.notesHistory : [],
      createdAt: editingLead ? editingLead.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    saveLead(payload);
    setIsAddEditOpen(false);

    // If viewing lead is the one being updated, refresh
    if (viewingLead && viewingLead.id === payload.id) {
      setViewingLead(payload);
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
      if (viewingLead?.id === id) {
        setViewingLead(null);
      }
    }
  };

  const handleAddNote = (leadId: string) => {
    if (!newNoteText.trim()) return;
    addLeadNote(leadId, newNoteText.trim(), newNoteType);
    setNewNoteText('');
    // Refresh viewing lead state
    const updated = leads.find((l) => l.id === leadId);
    if (updated) {
      setViewingLead({ ...updated });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-400" />
            Lead & Customer Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Total {leads.length} contacts ({filteredLeads.length} matching filters)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-[#0b1224] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder="Search by name, business, phone or area..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900/80 py-2 px-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-900/80 py-2 px-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick status counters */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-800/80 pt-2 lg:border-t-0 lg:pt-0">
          <button
            onClick={() => setStatusFilter('Follow-up')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              statusFilter === 'Follow-up'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Follow-ups ({leads.filter((l) => l.status === 'Follow-up').length})
          </button>
          <button
            onClick={() => setStatusFilter('Interested')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              statusFilter === 'Interested'
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Interested ({leads.filter((l) => l.status === 'Interested').length})
          </button>
        </div>
      </div>

      {/* Leads Table / Grid */}
      {filteredLeads.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-[#0b1224] p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-3 text-base font-bold text-white">No Leads Found</h3>
          <p className="mt-1 text-xs text-slate-400">
            {combinedSearch || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Add your first customer enquiry to start tracking leads.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
          >
            + Add First Lead
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-[#0b1224] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer & Business</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Follow-up Due</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map((lead) => {
                  const statusBadge = getLeadStatusBadge(lead.status);
                  const followUpInfo = getFollowUpStatus(lead.followUpDate);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                      onClick={() => setViewingLead(lead)}
                    >
                      {/* Name & Business */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                          {lead.name}
                        </div>
                        <div className="text-slate-400 text-xs font-medium mt-0.5">
                          {lead.businessName}
                        </div>
                        {lead.address && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            <span>{lead.address}</span>
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="font-mono text-slate-200">
                          {maskPhone(lead.phone, privacyMode)}
                        </div>
                        {lead.email && (
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[160px]">
                            {lead.email}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300 border border-slate-700/60">
                          {lead.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as LeadStatus;
                            saveLead({ ...lead, status: newStatus });
                          }}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${statusBadge.bg} focus:outline-hidden`}
                        >
                          {STATUSES.map((st) => (
                            <option key={st} value={st} className="bg-slate-900 text-white">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Follow-up Date */}
                      <td className="py-3 px-4">
                        {lead.followUpDate ? (
                          <div>
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${followUpInfo.colorClass}`}>
                              <Calendar className="h-3 w-3" />
                              {followUpInfo.label}
                            </span>
                            {lead.followUpTime && (
                              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                                {lead.followUpTime}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Not scheduled</span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectLeadForWhatsApp(lead)}
                            className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 p-2 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                            title="Open WhatsApp Centre for this lead"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </button>

                          <a
                            href={`tel:${lead.phone}`}
                            className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:text-white transition-colors"
                            title="Direct Phone Call"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>

                          <button
                            onClick={() => onOpenCreateQuoteForLead(lead)}
                            className="rounded-lg border border-blue-500/30 bg-blue-500/15 p-2 text-blue-400 hover:bg-blue-500/25 transition-colors"
                            title="Generate Quotation for this client"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(lead)}
                            className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:text-white transition-colors"
                            title="Edit Lead"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="rounded-lg border border-rose-500/30 bg-rose-500/15 p-2 text-rose-400 hover:bg-rose-500/25 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Lead Details & Conversation History Drawer/Modal */}
      {viewingLead && (
        <Modal
          isOpen={!!viewingLead}
          onClose={() => setViewingLead(null)}
          title={viewingLead.name}
          subtitle={`${viewingLead.businessName} • ${viewingLead.category}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <button
                onClick={() => {
                  onSelectLeadForWhatsApp(viewingLead);
                  setViewingLead(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Personalized WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  onOpenCreateQuoteForLead(viewingLead);
                  setViewingLead(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Create Quotation</span>
              </button>

              {viewingLead.status !== 'Converted' && (
                <button
                  onClick={() => {
                    onConvertLeadToProject(viewingLead);
                    setViewingLead(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-500 transition-colors"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Convert to Project</span>
                </button>
              )}

              <button
                onClick={() => handleOpenEdit(viewingLead)}
                className="ml-auto flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Client Details
                </h4>
                <div className="text-xs space-y-1.5">
                  <p className="text-slate-300 flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-cyan-400" />
                    <strong className="text-white font-mono">{viewingLead.phone}</strong>
                  </p>
                  <p className="text-slate-300 flex items-center gap-2">
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-slate-400">WhatsApp:</span>{' '}
                    <span className="font-mono">{viewingLead.whatsapp || viewingLead.phone}</span>
                  </p>
                  {viewingLead.email && (
                    <p className="text-slate-300 flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-blue-400" />
                      <span>{viewingLead.email}</span>
                    </p>
                  )}
                  {viewingLead.address && (
                    <p className="text-slate-300 flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-rose-400" />
                      <span>{viewingLead.address}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Lead Status & Follow-Up
                </h4>
                <div className="text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Current Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getLeadStatusBadge(viewingLead.status).bg}`}>
                      {viewingLead.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Follow-up Date:</span>
                    <span className="font-semibold text-white">
                      {formatDate(viewingLead.followUpDate)} {viewingLead.followUpTime || ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Estimated Budget:</span>
                    <span className="font-mono font-bold text-cyan-400">
                      ₹{viewingLead.estimatedBudget?.toLocaleString('en-IN') || '4,999'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Added on: {formatDate(viewingLead.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation History & Notes Log */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  Conversation History & Notes ({viewingLead.notesHistory?.length || 0})
                </h4>
              </div>

              {/* Add Note Form */}
              <div className="rounded-xl border border-slate-800 bg-[#090f1e] p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-400">Log new interaction:</span>
                  <div className="flex items-center gap-1.5">
                    {(['call', 'whatsapp', 'meeting', 'general'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewNoteType(type)}
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          newNoteType === type
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNote(viewingLead.id);
                      }
                    }}
                    placeholder="Enter call notes, requirements discussed, follow-up promise..."
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleAddNote(viewingLead.id)}
                    className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 shrink-0"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes Timeline */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {(!viewingLead.notesHistory || viewingLead.notesHistory.length === 0) ? (
                  <p className="text-center py-4 text-xs text-slate-500">
                    No notes recorded yet. Add your first conversation note above.
                  </p>
                ) : (
                  viewingLead.notesHistory.map((noteItem) => (
                    <div
                      key={noteItem.id}
                      className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold capitalize text-cyan-400">
                          {noteItem.type} Interaction
                        </span>
                        <span>{formatDate(noteItem.date)}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{noteItem.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Lead Modal */}
      {isAddEditOpen && (
        <Modal
          isOpen={isAddEditOpen}
          onClose={() => setIsAddEditOpen(false)}
          title={editingLead ? 'Edit Lead Information' : 'Add New Client Enquiry'}
          subtitle="Record client details, business category and follow-up reminders"
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveLead} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Customer / Owner Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sachin Patil"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business / Brand Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Patil Classes & Science Academy"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98221 44550"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WhatsApp Number (if different)
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="e.g. +91 98221 44550"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. patilclasses@gmail.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City / Location</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Kothrud, Pune"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as BusinessCategory })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lead Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Follow-up Time
                </label>
                <input
                  type="text"
                  value={formData.followUpTime}
                  onChange={(e) => setFormData({ ...formData, followUpTime: e.target.value })}
                  placeholder="e.g. 11:30 AM"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estimated Budget (₹)
                </label>
                <input
                  type="number"
                  value={formData.estimatedBudget}
                  onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddEditOpen(false)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                {editingLead ? 'Update Lead' : 'Save Lead'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
