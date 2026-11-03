/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Send,
  ExternalLink,
  Globe,
  Server,
  Key,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Edit2,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Project } from '../types';
import { Modal } from '../components/Modal';
import { saveProject } from '../services/storage';
import { formatDate } from '../utils/formatters';

interface DeliveryViewProps {
  projects: Project[];
  privacyMode: boolean;
  onSendHandoverMessageWhatsApp: (project: Project) => void;
  preSelectedProjectForDelivery?: Project | null;
}

export const DeliveryView: React.FC<DeliveryViewProps> = ({
  projects,
  privacyMode,
  onSendHandoverMessageWhatsApp,
  preSelectedProjectForDelivery,
}) => {
  const [editingProject, setEditingProject] = useState<Project | null>(preSelectedProjectForDelivery || null);
  const [showCredentialsId, setShowCredentialsId] = useState<string | null>(null);

  // Editable Form fields
  const [liveUrl, setLiveUrl] = useState('');
  const [domainInfo, setDomainInfo] = useState('');
  const [hostingPlatform, setHostingPlatform] = useState('');
  const [handoverStatus, setHandoverStatus] = useState<'Pending' | 'Credentials Sent' | 'Training Provided' | 'Delivered'>('Pending');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [supportNotes, setSupportNotes] = useState('');
  const [credentialsSecure, setCredentialsSecure] = useState('');

  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setLiveUrl(proj.liveUrl || '');
    setDomainInfo(proj.domainInfo || '');
    setHostingPlatform(proj.hostingPlatform || 'Hostinger Cloud');
    setHandoverStatus(proj.handoverStatus || (proj.stage === 'Delivered' ? 'Delivered' : 'Pending'));
    setDeliveryDate(proj.deliveryDate || new Date().toISOString().split('T')[0]);
    setSupportNotes(proj.supportNotes || '30 days complimentary technical support active.');
    setCredentialsSecure(proj.credentialsSecure || '');
  };

  const handleSaveDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const updated: Project = {
      ...editingProject,
      liveUrl,
      domainInfo,
      hostingPlatform,
      handoverStatus,
      deliveryDate: handoverStatus === 'Delivered' ? deliveryDate : editingProject.deliveryDate,
      supportNotes,
      credentialsSecure,
      stage: handoverStatus === 'Delivered' ? 'Delivered' : editingProject.stage,
      progress: handoverStatus === 'Delivered' ? 100 : editingProject.progress,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    saveProject(updated);
    setEditingProject(null);
  };

  const deliveredCount = projects.filter((p) => p.stage === 'Delivered' || p.handoverStatus === 'Delivered').length;
  const readyForHandoverCount = projects.filter((p) => p.stage === 'Client Review' || p.stage === 'Final Payment').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="h-5 w-5 text-teal-400" />
            Website Delivery & Client Handover
          </h2>
          <p className="text-xs text-slate-400">
            Maintain live URLs, hosting platforms, domain expiry, admin credential logs, and generate handover messages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-teal-500/30 bg-teal-950/30 px-3.5 py-1.5 text-xs text-teal-300 font-semibold">
            Delivered: <strong className="text-white font-mono">{deliveredCount}</strong>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-3.5 py-1.5 text-xs text-amber-300 font-semibold">
            Ready for Handover: <strong className="text-white font-mono">{readyForHandoverCount}</strong>
          </div>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const isDelivered = proj.stage === 'Delivered' || proj.handoverStatus === 'Delivered';
          const isCredentialsRevealed = showCredentialsId === proj.id;

          return (
            <div
              key={proj.id}
              className={`rounded-3xl border p-5 flex flex-col justify-between transition-all ${
                isDelivered
                  ? 'border-teal-500/30 bg-[#09151e]'
                  : 'border-slate-800 bg-[#0b1224]'
              }`}
            >
              <div>
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isDelivered
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {proj.handoverStatus || 'Handover Pending'}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400">
                    {proj.remainingAmount === 0 ? (
                      <span className="text-emerald-400 font-bold">✓ Fully Paid</span>
                    ) : (
                      <span className="text-rose-400 font-bold">₹{proj.remainingAmount} Due</span>
                    )}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-white">{proj.projectName}</h3>
                <p className="text-xs text-slate-400">{proj.clientBusiness} • {proj.clientName}</p>

                {/* Live URL */}
                <div className="mt-4 rounded-xl bg-slate-900/80 p-3 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <Globe className="h-3.5 w-3.5 text-cyan-400" />
                      Live Website:
                    </span>
                    {proj.liveUrl ? (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold text-[11px]"
                      >
                        <span className="truncate max-w-[130px]">{proj.liveUrl.replace('https://', '')}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Not configured</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-1.5">
                    <span className="flex items-center gap-1">
                      <Server className="h-3 w-3 text-slate-400" />
                      Hosting:
                    </span>
                    <span className="text-slate-200 font-semibold">{proj.hostingPlatform || 'Hostinger'}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Domain:</span>
                    <span className="text-slate-300 font-mono">{proj.domainInfo || 'Not specified'}</span>
                  </div>
                </div>

                {/* Handover Checklist summary */}
                <div className="mt-3 text-[11px] space-y-1 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${proj.liveUrl ? 'text-teal-400' : 'text-slate-600'}`} />
                    <span>SSL Certificate & HTTPS active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`h-3.5 w-3.5 ${isDelivered ? 'text-teal-400' : 'text-slate-600'}`} />
                    <span>Admin login credentials dispatched</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEdit(proj)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2 px-3 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Update Handover</span>
                </button>

                <button
                  onClick={() => onSendHandoverMessageWhatsApp(proj)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/15 py-2 px-3.5 text-xs font-bold text-teal-300 hover:bg-teal-500/25 transition-colors"
                  title="Send Official Handover WhatsApp Message"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Send Handover WA</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Handover Modal */}
      {editingProject && (
        <Modal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          title={`Update Delivery: ${editingProject.projectName}`}
          subtitle={`${editingProject.clientBusiness} • Technical Handover & Domain Setup`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveDelivery} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Live Website URL
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://patilclasses.in"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Domain Registrar & Info
                </label>
                <input
                  type="text"
                  value={domainInfo}
                  onChange={(e) => setDomainInfo(e.target.value)}
                  placeholder="e.g. GoDaddy (Expires Oct 2027)"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hosting Platform
                </label>
                <select
                  value={hostingPlatform}
                  onChange={(e) => setHostingPlatform(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                >
                  <option value="Hostinger Cloud">Hostinger Cloud</option>
                  <option value="Hostinger Shared">Hostinger Shared</option>
                  <option value="cPanel Hosting">cPanel Web Hosting</option>
                  <option value="Vercel / Cloudflare">Vercel / Cloudflare</option>
                  <option value="VPS / DigitalOcean">VPS / DigitalOcean</option>
                  <option value="Client Own Server">Client Own Server</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Handover Status
                </label>
                <select
                  value={handoverStatus}
                  onChange={(e) => setHandoverStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                >
                  <option value="Pending">Pending Review</option>
                  <option value="Credentials Sent">Credentials Sent via Email</option>
                  <option value="Training Provided">Training Call Completed</option>
                  <option value="Delivered">Delivered & Completed (100% Live)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Credentials & FTP Notes (Encrypted Storage)
              </label>
              <textarea
                rows={2}
                value={credentialsSecure}
                onChange={(e) => setCredentialsSecure(e.target.value)}
                placeholder="WordPress / Admin URL: https://site.com/wp-admin | User: admin | Pass: •••"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Support Notes & Warranty Period
              </label>
              <input
                type="text"
                value={supportNotes}
                onChange={(e) => setSupportNotes(e.target.value)}
                placeholder="e.g. 30 days free support valid until Dec 2026. Annual renewal due next year."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-cyan-400 transition-all"
              >
                Save Handover Status
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
