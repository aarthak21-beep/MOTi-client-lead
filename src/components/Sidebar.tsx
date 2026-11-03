/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Newspaper,
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
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'leads'
  | 'newspaper-prospects'
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
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/80 bg-[#090f1e] transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-500 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-base">MOTI</span>
                <span className="rounded-sm bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                  OS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Work Smarter. Grow Faster.</p>
            </div>
          </div>
        </div>

        {/* Agency Status Card */}
        <div className="px-4 pt-4 pb-2">
          <div className="rounded-xl border border-cyan-900/30 bg-gradient-to-b from-cyan-950/30 to-blue-950/20 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-xs font-semibold text-slate-200">Agency Operating</span>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">v1.2 Solo</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              MOTI Technologies • Web Agency
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
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/25 via-blue-600/20 to-transparent text-cyan-300 shadow-xs border border-cyan-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
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
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />}
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
