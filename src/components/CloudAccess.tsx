import React, { useEffect, useState } from 'react';
import { account, getCurrentCloudUser, restoreCloudBackup, signInToMotiq, signOutFromMotiq, uploadLocalBackup } from '../services/appwrite';

type CloudUser = { $id: string; name?: string; email?: string };

export function CloudAccess({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CloudUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCurrentCloudUser().then((current) => {
      setUser(current as CloudUser | null);
      setChecking(false);
    });
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const current = await signInToMotiq(email.trim(), password);
      setUser(current as CloudUser);
      setPassword('');
    } catch (error: any) {
      setMessage(error?.message || 'Login failed. Check your email and password.');
    } finally {
      setBusy(false);
    }
  };

  const runSync = async (direction: 'upload' | 'restore') => {
    if (!user) return;
    const warning = direction === 'upload'
      ? 'This will replace the cloud backup with the data on this device. Continue?'
      : 'This will replace the data on this device with the cloud backup. A local export backup is recommended first. Continue?';
    if (!window.confirm(warning)) return;
    setBusy(true);
    setMessage('');
    try {
      if (direction === 'upload') {
        await uploadLocalBackup(user.$id);
        setMessage('Backup uploaded to Appwrite successfully.');
      } else {
        await restoreCloudBackup(user.$id);
        setMessage('Cloud backup restored. Reloading MOTIQ data…');
        window.location.reload();
      }
    } catch (error: any) {
      setMessage(error?.message || 'Cloud sync failed. Check Appwrite table permissions and columns.');
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await signOutFromMotiq();
      setUser(null);
    } catch (error: any) {
      setMessage(error?.message || 'Could not sign out.');
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080b18] text-slate-300">Connecting to MOTIQ…</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080b18] px-4 text-slate-100">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-7 shadow-2xl">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">MOTIQ • PRIVATE CRM</div>
          <h1 className="mb-2 text-2xl font-bold">Sign in to MOTIQ</h1>
          <p className="mb-6 text-sm text-slate-400">Use the Appwrite email and password created for your MOTIQ account. Your Gmail account on this device can be different.</p>
          <label className="mb-2 block text-sm text-slate-300">Email</label>
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400" placeholder="you@example.com" />
          <label className="mb-2 block text-sm text-slate-300">Password</label>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400" placeholder="Appwrite password" />
          {message && <p className="mb-4 text-sm text-rose-300">{message}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50">{busy ? 'Please wait…' : 'Sign in securely'}</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/70 px-4 py-2 text-xs text-slate-300 sm:px-6">
        <div><span className="text-cyan-400">Cloud account:</span> {user.email || user.$id}</div>
        <div className="flex flex-wrap items-center gap-2">
          <button disabled={busy} onClick={() => runSync('upload')} className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-50">Upload this device</button>
          <button disabled={busy} onClick={() => runSync('restore')} className="rounded-lg border border-violet-500/40 px-3 py-1.5 text-violet-300 hover:bg-violet-500/10 disabled:opacity-50">Restore from cloud</button>
          <button disabled={busy} onClick={handleSignOut} className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-50">Sign out</button>
        </div>
        {message && <div className="w-full text-cyan-300">{message}</div>}
      </div>
      {children}
    </>
  );
}
