/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Eye,
  EyeOff,
  Plus,
  Bell,
  Lock,
  MessageSquare,
  FileSpreadsheet,
  Users,
  FolderKanban,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMobileSidebar: () => void;
  privacyMode: boolean;
  onTogglePrivacyMode: () => void;
  onOpenQuickAction: (action: 'lead' | 'quote' | 'whatsapp' | 'project' | 'task') => void;
  overdueCount: number;
  onLockApp?: () => void;
  pinProtectionEnabled: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Agency Dashboard', subtitle: 'Real-time overview of clients, pipeline & revenue' },
  leads: { title: 'Lead & Customer Management', subtitle: 'Capture enquiries, track follow-ups & log conversations' },
  'newspaper-prospects': { title: 'Newspaper Business Leads', subtitle: 'Publishers, agencies, distributors & print media prospects' },
  'website-prospects': { title: 'Website Development Leads', subtitle: 'Business prospects for website design & development' },
  whatsapp: { title: 'WhatsApp Message Centre', subtitle: 'Bilingual (English & Marathi) personalized client messaging' },
  quotations: { title: 'Plans & Quotations Generator', subtitle: 'Generate official proposals, itemized pricing & downloadable PDFs' },
  demos: { title: 'Demo Website Library', subtitle: 'Showcase ready-to-use industry templates & send preview links' },
  projects: { title: 'Project Management & Pipeline', subtitle: 'Track website milestones from enquiry to delivery' },
  payments: { title: 'Payment Ledger & Reminders', subtitle: 'Monitor 50% advances, balances & generate payment alerts' },
  delivery: { title: 'Website Delivery & Handover', subtitle: 'Live URLs, domain registrar, hosting & credential handovers' },
  tasks: { title: 'Tasks & Reminders', subtitle: 'Daily priorities, deadline alerts & client follow-up tasks' },
  reports: { title: 'Reports & Business Analytics', subtitle: 'Conversion rate, package popularity & monthly growth' },
  settings: { title: 'Settings & Agency Configuration', subtitle: 'Custom pricing, bank UPI details, templates & data backups' },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenMobileSidebar,
  privacyMode,
  onTogglePrivacyMode,
  onOpenQuickAction,
  overdueCount,
  onLockApp,
  pinProtectionEnabled,
  searchQuery,
  setSearchQuery,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const currentTabInfo = TAB_TITLES[activeTab] || { title: 'MOTI OS', subtitle: 'Agency Management' };

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-700/60 bg-[#081222]/90 px-4 shadow-lg shadow-black/10 backdrop-blur-xl sm:px-6">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:text-white lg:hidden"
          title="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-white sm:text-lg flex items-center gap-2">
            {currentTabInfo.title}
          </h1>
          <p className="hidden text-xs text-slate-400 sm:block">{currentTabInfo.subtitle}</p>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="hidden md:flex items-center relative max-w-xs w-full mx-4">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search leads, projects, clients..."
          className="w-full rounded-xl border border-slate-800 bg-[#0d1527] py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden focus:ring-1 focus:ring-cyan-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 text-[11px] text-slate-400 hover:text-slate-200 font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Privacy Screen-Sharing Toggle */}
        <button
          onClick={onTogglePrivacyMode}
          className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            privacyMode
              ? 'border-amber-500/40 bg-amber-500/20 text-amber-300'
              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
          title={privacyMode ? 'Privacy Mode is Active (Financials hidden)' : 'Turn on Screen-Sharing Privacy Mode'}
        >
          {privacyMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="hidden sm:inline">{privacyMode ? 'Privacy On' : 'Privacy'}</span>
        </button>

        {/* Notifications / Overdue alerts indicator */}
        <button
          onClick={() => setActiveTab('leads')}
          className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:border-slate-700 hover:text-slate-200"
          title={`${overdueCount} follow-ups due or overdue`}
        >
          <Bell className="h-4 w-4" />
          {overdueCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
              {overdueCount}
            </span>
          )}
        </button>

        {/* Lock App (if PIN configured) */}
        {pinProtectionEnabled && onLockApp && (
          <button
            onClick={onLockApp}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            title="Lock Dashboard (Owner PIN)"
          >
            <Lock className="h-4 w-4" />
          </button>
        )}

        {/* Quick Action Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>

          {showQuickMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowQuickMenu(false)}
              />
              <div className="absolute right-0 top-12 z-40 w-56 rounded-2xl border border-slate-800 bg-[#0d162a] p-1.5 shadow-2xl backdrop-blur-xl">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Create New
                </div>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenQuickAction('lead');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:text-cyan-300"
                >
                  <Users className="h-4 w-4 text-cyan-400" />
                  <span>New Client Enquiry</span>
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenQuickAction('quote');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:text-cyan-300"
                >
                  <FileSpreadsheet className="h-4 w-4 text-blue-400" />
                  <span>Generate Quotation</span>
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenQuickAction('whatsapp');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:text-cyan-300"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  <span>Send WhatsApp Message</span>
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenQuickAction('project');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:text-cyan-300"
                >
                  <FolderKanban className="h-4 w-4 text-purple-400" />
                  <span>Start New Project</span>
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenQuickAction('task');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:text-cyan-300"
                >
                  <CheckSquare className="h-4 w-4 text-amber-400" />
                  <span>Add Daily Task / Reminder</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
