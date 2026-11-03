/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

interface OwnerLockModalProps {
  isLocked: boolean;
  onUnlock: () => void;
  correctPin: string;
}

export const OwnerLockModal: React.FC<OwnerLockModalProps> = ({
  isLocked,
  onUnlock,
  correctPin,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin || pin === '1234') {
      setError(false);
      setPin('');
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070b16]/95 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#0d162a] p-8 shadow-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
          <Lock className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-white">MOTI Business OS</h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter Owner Security PIN to unlock the agency dashboard.
        </p>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Enter 4-digit PIN (default: 1234)"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pl-10 pr-4 text-center font-mono text-lg tracking-widest text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                autoFocus
              />
            </div>
            {error && (
              <p className="mt-2 text-xs text-rose-400 flex items-center justify-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Incorrect PIN. Default is 1234.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 active:scale-98 transition-all"
          >
            Unlock Dashboard
          </button>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setPin('1234');
                onUnlock();
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
            >
              Owner Quick Access (Use PIN 1234)
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-slate-800/80 pt-4 text-[11px] text-slate-500">
          MOTI Technologies • Work Smarter. Grow Faster.
        </div>
      </div>
    </div>
  );
};
