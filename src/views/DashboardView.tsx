/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  UserPlus,
  Calendar,
  FolderKanban,
  CheckCircle2,
  Clock,
  IndianRupee,
  Plus,
  ArrowRight,
  PhoneCall,
  MessageSquare,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  FileSpreadsheet,
  CheckSquare,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ActiveTab } from '../components/Sidebar';
import { Lead, PaymentRecord, Project, AgencyTask } from '../types';
import { formatCurrency, formatDate, getFollowUpStatus, getStageBadge, maskPhone } from '../utils/formatters';

interface DashboardViewProps {
  leads: Lead[];
  projects: Project[];
  payments: PaymentRecord[];
  tasks: AgencyTask[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickAction: (action: 'lead' | 'quote' | 'whatsapp' | 'project' | 'task') => void;
  privacyMode: boolean;
  onSelectLeadForWhatsApp: (lead: Lead) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  projects,
  payments,
  tasks,
  setActiveTab,
  onOpenQuickAction,
  privacyMode,
  onSelectLeadForWhatsApp,
}) => {
  // Calculations
  const totalClients = leads.length;
  const newEnquiries = leads.filter((l) => l.status === 'New').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const followUpsDue = leads.filter(
    (l) => l.followUpDate && (l.followUpDate <= todayStr) && l.status !== 'Converted' && l.status !== 'Not Interested'
  );

  const activeProjects = projects.filter((p) => p.stage !== 'Delivered');
  const completedWebsites = projects.filter((p) => p.stage === 'Delivered').length;

  // Pending payments: sum of remainingAmount from active/completed projects
  const totalPendingPayments = projects.reduce((acc, p) => acc + (p.remainingAmount || 0), 0);

  // Monthly revenue: total payments received this month
  const currentMonthPrefix = todayStr.slice(0, 7); // e.g. "2026-11"
  const monthlyRevenue = payments
    .filter((pay) => pay.paymentDate && pay.paymentDate.startsWith(currentMonthPrefix))
    .reduce((acc, pay) => acc + (pay.amount || 0), 0);

  const totalAllTimeRevenue = payments.reduce((acc, pay) => acc + (pay.amount || 0), 0);

  // Today's urgent follow-ups
  const urgentFollowUps = followUpsDue.slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome with Quick Actions */}
      <div className="relative isolate overflow-hidden rounded-[28px] border border-cyan-400/15 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.12),transparent_38%),linear-gradient(120deg,#101d35_0%,#0b1428_55%,#0d1b33_100%)] p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03] lg:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 -bottom-12 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>MOTI Technologies Agency OS</span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl tracking-tight">
              Work Smarter. Grow Faster.
            </h2>
            <p className="mt-1 text-sm text-slate-400 max-w-xl">
              All website client inquiries, WhatsApp follow-ups, PDF quotations, live project stages, and payment collections in one unified workspace.
            </p>
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onOpenQuickAction('lead')}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-3.5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 active:scale-95 transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span>New Enquiry</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('quote')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-slate-700 hover:border-slate-600 active:scale-95 transition-all"
            >
              <FileSpreadsheet className="h-4 w-4 text-blue-400" />
              <span>Create Quotation</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('whatsapp')}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3.5 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 active:scale-95 transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Send WhatsApp</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('task')}
              className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3.5 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 active:scale-95 transition-all"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Follow-up Alert Banner (if any due today or overdue) */}
      {followUpsDue.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/20 p-2.5 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                {followUpsDue.length} Follow-up{followUpsDue.length > 1 ? 's' : ''} require attention today!
              </h4>
              <p className="text-xs text-amber-300/80">
                Consistent follow-ups increase website deal conversion by up to 60%.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('leads')}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
          >
            <span>View Due Leads</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Primary 7 Key Metric Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients & Leads"
          value={totalClients}
          subtitle="In CRM database"
          icon={Users}
          color="cyan"
          onClick={() => setActiveTab('leads')}
        />
        <StatCard
          title="New Enquiries"
          value={newEnquiries}
          subtitle="Awaiting first contact"
          icon={UserPlus}
          color="blue"
          onClick={() => setActiveTab('leads')}
        />
        <StatCard
          title="Follow-ups Due"
          value={followUpsDue.length}
          subtitle="Action needed"
          icon={Calendar}
          color={followUpsDue.length > 0 ? 'rose' : 'emerald'}
          onClick={() => setActiveTab('leads')}
        />
        <StatCard
          title="Active Projects"
          value={activeProjects.length}
          subtitle="In design & dev"
          icon={FolderKanban}
          color="purple"
          onClick={() => setActiveTab('projects')}
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <StatCard
          title="Completed Websites"
          value={completedWebsites}
          subtitle="Delivered & live"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => setActiveTab('delivery')}
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(totalPendingPayments, privacyMode)}
          subtitle="Receivables from clients"
          icon={Clock}
          color="amber"
          onClick={() => setActiveTab('payments')}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(monthlyRevenue, privacyMode)}
          subtitle={`Total: ${formatCurrency(totalAllTimeRevenue, privacyMode)}`}
          trend="+18%"
          icon={IndianRupee}
          color="cyan"
          onClick={() => setActiveTab('reports')}
        />
      </div>

      {/* Two Column Layout: Urgent Follow-ups & Active Projects */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Urgent Follow-ups list */}
        <div className="rounded-[22px] border border-slate-700/70 bg-gradient-to-br from-[#111d33] via-[#0d172b] to-[#0a1222] p-5 shadow-xl shadow-black/10 ring-1 ring-white/[0.025] sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Priority Follow-ups</h3>
            </div>
            <button
              onClick={() => setActiveTab('leads')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {urgentFollowUps.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 opacity-60" />
                <p className="mt-2 text-xs text-slate-400">All follow-ups are up to date! Great job.</p>
              </div>
            ) : (
              urgentFollowUps.map((lead) => {
                const statusInfo = getFollowUpStatus(lead.followUpDate);
                return (
                  <div
                    key={lead.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-700/60 bg-slate-950/35 p-4 transition-all hover:border-cyan-500/25 hover:bg-slate-900/70"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{lead.name}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusInfo.colorClass}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{lead.businessName} • {lead.category}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {maskPhone(lead.phone, privacyMode)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectLeadForWhatsApp(lead)}
                        className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors"
                        title="Send personalized WhatsApp message"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </button>
                      <a
                        href={`tel:${lead.phone}`}
                        className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:text-white transition-colors"
                        title="Call Client"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Active Projects Status */}
        <div className="rounded-[22px] border border-slate-700/70 bg-gradient-to-br from-[#111d33] via-[#0d172b] to-[#0a1222] p-5 shadow-xl shadow-black/10 ring-1 ring-white/[0.025] sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">Active Projects in Pipeline</h3>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Kanban view</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {activeProjects.length === 0 ? (
              <div className="py-8 text-center">
                <FolderKanban className="mx-auto h-8 w-8 text-slate-600" />
                <p className="mt-2 text-xs text-slate-400">No active projects currently.</p>
                <button
                  onClick={() => onOpenQuickAction('project')}
                  className="mt-3 text-xs text-cyan-400 font-semibold"
                >
                  + Start a new project
                </button>
              </div>
            ) : (
              activeProjects.map((proj) => {
                const stageBadge = getStageBadge(proj.stage);
                return (
                  <div
                    key={proj.id}
                    className="rounded-xl border border-slate-700/60 bg-slate-950/35 p-4 transition-all hover:border-cyan-500/25 hover:bg-slate-900/70"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{proj.projectName}</h4>
                        <p className="text-xs text-slate-400">
                          {proj.clientName} ({proj.clientBusiness})
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${stageBadge.bg} ${stageBadge.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${stageBadge.dot}`} />
                        {stageBadge.label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Milestone Progress</span>
                        <span className="font-mono font-bold text-cyan-400">{proj.progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/50 pt-2">
                      <span>Deadline: <strong className="text-slate-300">{formatDate(proj.deadline)}</strong></span>
                      <span>Balance Due: <strong className="text-amber-400 font-mono">{formatCurrency(proj.remainingAmount, privacyMode)}</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed & Daily Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-[22px] border border-slate-700/70 bg-gradient-to-br from-[#111d33] via-[#0d172b] to-[#0a1222] p-5 shadow-xl shadow-black/10 ring-1 ring-white/[0.025] sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <h3 className="font-bold text-white text-base">Recent Agency Activities</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Live Logs</span>
          </div>

          <div className="mt-4 space-y-3">
            {payments.slice(0, 3).map((pay) => (
              <div key={pay.id} className="flex items-center justify-between text-xs border-b border-slate-800/40 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-emerald-500/15 p-1.5 text-emerald-400">
                    <IndianRupee className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">
                      Payment received from {pay.clientName}
                    </p>
                    <p className="text-[11px] text-slate-400">{pay.notes || pay.paymentType + ' Payment'} • {pay.paymentMethod}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400">
                    +{formatCurrency(pay.amount, privacyMode)}
                  </span>
                  <p className="text-[10px] text-slate-400">{formatDate(pay.paymentDate)}</p>
                </div>
              </div>
            ))}

            {leads.slice(0, 2).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between text-xs border-b border-slate-800/40 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-cyan-500/15 p-1.5 text-cyan-400">
                    <UserPlus className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">New Lead: {lead.name}</p>
                    <p className="text-[11px] text-slate-400">{lead.businessName} ({lead.category})</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">{formatDate(lead.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Priority Tasks */}
        <div className="rounded-[22px] border border-slate-700/70 bg-gradient-to-br from-[#111d33] via-[#0d172b] to-[#0a1222] p-5 shadow-xl shadow-black/10 ring-1 ring-white/[0.025] sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Today's Priority Tasks</h3>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>Manage tasks</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                      task.priority === 'High'
                        ? 'bg-rose-400 shadow-[0_0_8px_#f43f5e]'
                        : task.priority === 'Medium'
                        ? 'bg-amber-400'
                        : 'bg-slate-400'
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        task.status === 'Completed'
                          ? 'line-through text-slate-500'
                          : 'text-slate-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.relatedClientName && (
                      <p className="text-[11px] text-cyan-400/80 mt-0.5">
                        Client: {task.relatedClientName}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    task.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
