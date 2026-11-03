/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  color?: 'cyan' | 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'cyan',
  onClick,
}) => {
  const colorStyles = {
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/15 text-cyan-400',
      glow: 'from-cyan-500/10 to-transparent',
    },
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/15 text-blue-400',
      glow: 'from-blue-500/10 to-transparent',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      glow: 'from-emerald-500/10 to-transparent',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/15 text-amber-400',
      glow: 'from-amber-500/10 to-transparent',
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/15 text-rose-400',
      glow: 'from-rose-500/10 to-transparent',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/15 text-purple-400',
      glow: 'from-purple-500/10 to-transparent',
    },
  }[color];

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border bg-[#0b1224] p-5 transition-all duration-200 ${
        colorStyles.border
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      {/* Background soft glow gradient */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${colorStyles.glow} blur-xl`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white font-mono">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
              {trend && (
                <span className="font-semibold text-emerald-400">{trend}</span>
              )}
              <span>{subtitle}</span>
            </p>
          )}
        </div>

        <div className={`rounded-xl p-3 ${colorStyles.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
