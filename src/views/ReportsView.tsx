/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  IndianRupee,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Lead, PaymentRecord, PricingPlan, Project } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ReportsViewProps {
  leads: Lead[];
  projects: Project[];
  payments: PaymentRecord[];
  pricingPlans: PricingPlan[];
  privacyMode: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  leads,
  projects,
  payments,
  pricingPlans,
  privacyMode,
}) => {
  const [dateFilter, setDateFilter] = useState<'30days' | '90days' | 'all'>('all');

  // Key KPI metrics
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalLeads = leads.length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const completedProjects = projects.filter((p) => p.stage === 'Delivered').length;
  const totalPending = projects.reduce((sum, p) => sum + (p.remainingAmount || 0), 0);

  // Package Popularity count
  const packagePopularity: Record<string, number> = {
    'Starter Website': 0,
    'Business Website': 0,
    'Premium Corporate': 0,
    'E-Commerce Online Store': 0,
  };

  projects.forEach((p) => {
    const pkg = p.selectedPackage;
    if (pkg.includes('Starter')) packagePopularity['Starter Website'] = (packagePopularity['Starter Website'] || 0) + 1;
    else if (pkg.includes('Business')) packagePopularity['Business Website'] = (packagePopularity['Business Website'] || 0) + 1;
    else if (pkg.includes('Premium')) packagePopularity['Premium Corporate'] = (packagePopularity['Premium Corporate'] || 0) + 1;
    else if (pkg.includes('Commerce')) packagePopularity['E-Commerce Online Store'] = (packagePopularity['E-Commerce Online Store'] || 0) + 1;
    else packagePopularity['Business Website'] = (packagePopularity['Business Website'] || 0) + 1;
  });

  // Category Breakdown for leads
  const categoryCounts: Record<string, number> = {};
  leads.forEach((l) => {
    categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
  });

  // Simulated monthly revenue trend (6 months)
  const monthlyData = [
    { month: 'Jun', revenue: 9500, leads: 3 },
    { month: 'Jul', revenue: 14999, leads: 5 },
    { month: 'Aug', revenue: 18500, leads: 6 },
    { month: 'Sep', revenue: 23998, leads: 8 },
    { month: 'Oct', revenue: 31499, leads: 9 },
    { month: 'Nov', revenue: totalRevenue > 0 ? totalRevenue : 38997, leads: totalLeads },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 40000);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            Agency Reports & Business Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Real-time conversion metrics, package distribution and revenue performance.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center rounded-xl border border-white/10 bg-slate-900/65 backdrop-blur-xl p-1">
          <button
            onClick={() => setDateFilter('30days')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              dateFilter === '30days'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateFilter('90days')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              dateFilter === '90days'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quarter (90d)
          </button>
          <button
            onClick={() => setDateFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              dateFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 5 High-Level Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-cyan-500/30 bg-[#0c1830] p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            Total Revenue
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-white font-mono">
            {formatCurrency(totalRevenue, privacyMode)}
          </h3>
          <p className="mt-1 text-[10px] text-cyan-300/70 font-semibold">+24% month-over-month</p>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-[#0c152a] p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
            Total Enquiries
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-white font-mono">{totalLeads}</h3>
          <p className="mt-1 text-[10px] text-slate-400">Across 6 industries</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-[#0c221c] p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Conversion Rate
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-emerald-300 font-mono">
            {conversionRate}%
          </h3>
          <p className="mt-1 text-[10px] text-emerald-400/70">{convertedLeads} converted into deals</p>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-[#160d26] p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
            Websites Delivered
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-purple-300 font-mono">
            {completedProjects}
          </h3>
          <p className="mt-1 text-[10px] text-purple-300/70">100% Client satisfaction</p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-[#1b1409] p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Pending Receivables
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-amber-300 font-mono">
            {formatCurrency(totalPending, privacyMode)}
          </h3>
          <p className="mt-1 text-[10px] text-amber-400/70">Awaiting milestones</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-slate-900/65 backdrop-blur-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10/80 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                Monthly Revenue Growth (INR)
              </h3>
              <p className="text-xs text-slate-400">Consistent upward trajectory for MOTI Technologies</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
              Avg Ticket: ₹5,499
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyData.map((d, i) => {
              const heightPct = Math.max(15, Math.round((d.revenue / maxRevenue) * 100));
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-cyan-300 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5">
                    {formatCurrency(d.revenue, privacyMode)}
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-slate-800 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        i === monthlyData.length - 1
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_12px_#06b6d4]'
                          : 'bg-gradient-to-t from-blue-700 to-cyan-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span className="text-xs font-semibold text-slate-400 mt-1">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Popular Packages Distribution (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-slate-900/65 backdrop-blur-xl p-6 space-y-4">
          <div className="border-b border-white/10/80 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="h-4 w-4 text-emerald-400" />
              Most Popular Packages
            </h3>
            <p className="text-xs text-slate-400">Website package demand breakdown</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {Object.entries(packagePopularity).map(([pkgName, count], idx) => {
              const colors = ['bg-blue-500', 'bg-cyan-500', 'bg-purple-500', 'bg-emerald-500'];
              const pct = projects.length > 0 ? Math.round((count / projects.length) * 100) : 25;
              return (
                <div key={pkgName} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{pkgName}</span>
                    <span className="font-mono text-slate-400">{count} projects ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors[idx % colors.length]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-3 mt-4 text-xs text-slate-400">
            💡 <strong>Agency Insight:</strong> The <strong>Business Website (₹4,999)</strong> is your highest margin and most requested package by local coaching institutes and clinics.
          </div>
        </div>
      </div>

      {/* Category Breakdown & Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Category Distribution */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/65 backdrop-blur-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" />
            Client Industries / Business Niches
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {Object.entries(categoryCounts).map(([cat, cnt]) => (
              <div
                key={cat}
                className="rounded-xl border border-white/10 bg-slate-900/60 p-3 flex items-center justify-between"
              >
                <span className="text-xs text-slate-300 font-medium">{cat}</span>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30">
                  {cnt}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead-to-Delivery Funnel */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/65 backdrop-blur-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Agency Conversion Funnel
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex justify-between items-center">
              <span className="font-semibold text-slate-300">1. Total Inquiries & Leads:</span>
              <span className="font-mono font-bold text-white text-sm">{totalLeads}</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 flex justify-between items-center ml-2">
              <span className="font-semibold text-blue-300">2. Active Negotiations & Quotations:</span>
              <span className="font-mono font-bold text-blue-200 text-sm">
                {leads.filter((l) => l.status === 'Interested' || l.status === 'Follow-up').length}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/40 flex justify-between items-center ml-4">
              <span className="font-semibold text-cyan-300">3. Projects Started (Advance Received):</span>
              <span className="font-mono font-bold text-cyan-200 text-sm">{projects.length}</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 flex justify-between items-center ml-6">
              <span className="font-semibold text-emerald-300">4. Final Delivered Websites:</span>
              <span className="font-mono font-bold text-emerald-300 text-sm">{completedProjects}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
