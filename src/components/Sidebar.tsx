/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Globe,
  MessageSquare,
  FileSpreadsheet,
  Layers,
  FolderKanban,
  CreditCard,
  Send,
  CheckSquare,
  BarChart3,
  Settings,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'leads'
  | 'newspaper-prospects'
  | 'website-prospects'
  | 'whatsapp'
  | 'quotations'
  | 'demos'
  | 'projects'
  | 'payments'
  | 'delivery'
  | 'tasks'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  overdueCount: number;
  activeProjectsCount: number;
  pendingPaymentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  overdueCount,
  activeProjectsCount,
  pendingPaymentsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'leads' as ActiveTab,
      label: 'Leads & CRM',
      icon: Users,
      badge: overdueCount > 0 ? `${overdueCount} due` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    {
      id: 'newspaper-prospects' as ActiveTab,
      label: 'Newspaper Leads',
      icon: Newspaper,
      badge: 'WhatsApp',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'website-prospects' as ActiveTab,
      label: 'Website Leads',
      icon: Globe,
      badge: 'No Website',
      badgeColor: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    },
    {
      id: 'whatsapp' as ActiveTab,
      label: 'WhatsApp Centre',
      icon: MessageSquare,
      badge: 'Bilingual',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'quotations' as ActiveTab,
      label: 'Plans & Quotations',
      icon: FileSpreadsheet,
      badge: null,
    },
    {
      id: 'demos' as ActiveTab,
      label: 'Demo Library',
      icon: Layers,
      badge: '6 Demos',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    },
    {
      id: 'projects' as ActiveTab,
      label: 'Projects',
      icon: FolderKanban,
      badge: activeProjectsCount > 0 ? `${activeProjectsCount}` : null,
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    },
    {
      id: 'payments' as ActiveTab,
      label: 'Payments',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} pending` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'delivery' as ActiveTab,
      label: 'Delivery & Handover',
      icon: Send,
      badge: null,
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Tasks & Reminders',
      icon: CheckSquare,
      badge: null,
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-700/60 bg-[linear-gradient(180deg,#0d192d_0%,#080f1e_100%)] shadow-[18px_0_50px_rgba(0,0,0,.18)] transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-700/60 bg-white/[0.015] px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 shadow-lg shadow-violet-500/30 ring-1 ring-violet-300/30">
              <span className="text-2xl font-black italic tracking-tighter text-white">M</span>
              <TrendingUp className="absolute -right-1 -top-1 h-4 w-4 text-cyan-200 drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-base">MOTIQ</span>
                <span className="rounded-sm bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-200 border border-violet-400/30">
                  OS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Think Smart. Grow Faster.</p>
            </div>
          </div>
        </div>

        {/* Agency Status Card */}
        <div className="px-4 pt-4 pb-2">
          <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-400/[0.12] via-blue-500/[0.06] to-transparent p-3 shadow-lg shadow-cyan-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-xs font-semibold text-slate-200">Agency Operating</span>
              </div>
              <span className="text-[11px] text-violet-300 font-mono">Personal</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              MOTIQ • Personal Workspace
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <p className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Core Workflow
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpenMobile(false);
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/30 via-blue-600/25 to-transparent text-violet-200 shadow-xs border border-violet-400/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-violet-300' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-violet-300" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Owner Mode</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">Pune, IN</span>
          </div>
        </div>
      </aside>
    </>
  );
};
