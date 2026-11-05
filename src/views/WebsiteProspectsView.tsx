import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Plus, Search, Trash2, Edit2, MapPin, Globe } from 'lucide-react';
import { WebsiteProspect, WebsiteProspectStatus, ContactPermission } from '../types';
import { deleteWebsiteProspect, getWebsiteProspects, saveWebsiteProspect, subscribeToStorage } from '../services/storage';

const STATUSES: WebsiteProspectStatus[] = ['New', 'Contacted', 'Interested', 'Demo Given', 'Converted', 'Not Interested'];
const PERMISSIONS: ContactPermission[] = ['Not Asked', 'Opted In', 'Opted Out'];
const emptyForm = (): WebsiteProspect => ({
  id: '', businessName: '', contactName: '', businessType: 'Other', phone: '', whatsapp: '',
  city: '', district: '', state: 'Maharashtra', websiteStatus: 'No Website', website: '',
  source: '', notes: '', status: 'New', contactPermission: 'Not Asked', createdAt: '', updatedAt: '',
});
const cleanPhone = (value: string) => { const digits = value.replace(/\D/g, ''); return digits.length === 10 ? `91${digits}` : digits; };
const whatsappUrl = (p: WebsiteProspect) => {
  const phone = cleanPhone(p.whatsapp);
  const message = 'Namaskar! तुमच्या व्यवसायासाठी एक professional website तयार करून देण्याबद्दल माहिती share करू का? नको असल्यास कृपया कळवा.';
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : '#';
};

export const WebsiteProspectsView: React.FC = () => {
  const [prospects, setProspects] = useState<WebsiteProspect[]>([]);
  const [query, setQuery] = useState('');
  const [websiteFilter, setWebsiteFilter] = useState<'All' | WebsiteProspect['websiteStatus']>('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WebsiteProspect | null>(null);
  const [form, setForm] = useState<WebsiteProspect>(emptyForm());
  useEffect(() => {
    const reload = () => setProspects(getWebsiteProspects());
    reload();
    return subscribeToStorage(reload);
  }, []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prospects.filter(p => (websiteFilter === 'All' || p.websiteStatus === websiteFilter) && (!q || [p.businessName,p.contactName,p.phone,p.whatsapp,p.city,p.district,p.businessType].join(' ').toLowerCase().includes(q)));
  }, [prospects, query, websiteFilter]);
  const openNew = () => { setEditing(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit = (p: WebsiteProspect) => { setEditing(p); setForm(p); setShowForm(true); };
  const update = (key: keyof WebsiteProspect, value: string) => setForm(current => ({ ...current, [key]: value } as WebsiteProspect));
  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const phone = cleanPhone(form.whatsapp);
    if (phone && (phone.length < 10 || phone.length > 15)) { alert('कृपया योग्य WhatsApp नंबर टाका.'); return; }
    saveWebsiteProspect({ ...form, id: editing?.id || `web-${Date.now()}`, phone: cleanPhone(form.phone), whatsapp: phone, createdAt: editing?.createdAt || new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };
  const statusClass = (s: WebsiteProspectStatus) => s === 'Converted' ? 'bg-emerald-500/15 text-emerald-300' : s === 'Interested' ? 'bg-cyan-500/15 text-cyan-300' : s === 'Not Interested' ? 'bg-rose-500/15 text-rose-300' : 'bg-slate-700/70 text-slate-300';
  return <div className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Prospecting • Maharashtra first</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white">Website Development Leads</h1><p className="mt-1 text-sm text-slate-400">WhatsApp वर संपर्क उपलब्ध आहे पण स्वतःची website नसल्याची नोंद असलेले व्यवसाय.</p></div>
      <button onClick={openNew} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-400"><Plus className="h-4 w-4" /> Add Website Lead</button>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#14233b] to-[#0d1729] p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.025]"><p className="text-xs text-slate-400">Total Leads</p><p className="mt-1 text-2xl font-bold text-white">{prospects.length}</p></div>
      <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#14233b] to-[#0d1729] p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.025]"><p className="text-xs text-slate-400">No Website</p><p className="mt-1 text-2xl font-bold text-violet-300">{prospects.filter(p => p.websiteStatus === 'No Website').length}</p></div>
      <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#14233b] to-[#0d1729] p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.025]"><p className="text-xs text-slate-400">Interested</p><p className="mt-1 text-2xl font-bold text-cyan-300">{prospects.filter(p => p.status === 'Interested').length}</p></div>
      <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#14233b] to-[#0d1729] p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.025]"><p className="text-xs text-slate-400">Converted</p><p className="mt-1 text-2xl font-bold text-white">{prospects.filter(p => p.status === 'Converted').length}</p></div>
    </div>
    <div className="flex flex-col gap-2 sm:flex-row"><div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-slate-700/70 bg-[#111d32] px-3 shadow-inner shadow-black/10"><Search className="h-4 w-4 text-slate-500" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search business, phone, WhatsApp, city or category..." className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500" /></div><select value={websiteFilter} onChange={e => setWebsiteFilter(e.target.value as typeof websiteFilter)} aria-label="Filter by website status" className="rounded-2xl border border-slate-700/70 bg-[#111d32] px-3 shadow-inner shadow-black/10 py-3 text-sm text-white"><option value="All">All website statuses</option><option value="No Website">No Website</option><option value="Needs Verification">Needs Verification</option><option value="Website Found">Website Found</option></select></div>
    <div className="overflow-hidden rounded-[22px] border border-slate-700/70 bg-[#0b1528]/90 shadow-xl shadow-black/10 ring-1 ring-white/[0.025]">
      {filtered.length === 0 ? <div className="px-6 py-14 text-center"><Globe className="mx-auto h-9 w-9 text-slate-600" /><h3 className="mt-3 text-sm font-semibold text-white">No website leads found</h3><p className="mt-1 text-xs text-slate-500">WhatsApp आणि website status source सह पडताळूनच नवीन lead add करा.</p></div> :
      <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-xs"><thead className="bg-slate-800/80 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300"><tr><th className="px-4 py-3">Business</th><th className="px-4 py-3">Category / Location</th><th className="px-4 py-3">Phone / WhatsApp</th><th className="px-4 py-3">Website Status</th><th className="px-4 py-3">Permission</th><th className="px-4 py-3">Lead Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-700/50">{filtered.map(p => <tr key={p.id} className="transition-colors hover:bg-cyan-400/[0.045]">
        <td className="px-4 py-3"><p className="font-semibold text-white">{p.businessName}</p><p className="mt-1 text-slate-500">{p.contactName || 'Contact name not added'}</p></td>
        <td className="px-4 py-3"><p className="text-slate-200">{p.businessType}</p><p className="mt-1 flex items-center gap-1 text-slate-500"><MapPin className="h-3 w-3" />{[p.city,p.district,p.state].filter(Boolean).join(', ')}</p></td>
        <td className="px-4 py-3 font-mono text-slate-200"><p>Phone: {p.phone || 'Not provided'}</p><p className="mt-1 text-slate-400">WhatsApp: {p.whatsapp ? `+${p.whatsapp}` : 'Not provided'}</p></td>
        <td className="px-4 py-3"><select value={p.websiteStatus} onChange={e => saveWebsiteProspect({...p, websiteStatus: e.target.value as WebsiteProspect['websiteStatus']})} className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200"><option>No Website</option><option>Needs Verification</option><option>Website Found</option></select></td>
        <td className="px-4 py-3"><select value={p.contactPermission} onChange={e => saveWebsiteProspect({...p, contactPermission: e.target.value as ContactPermission})} className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200">{PERMISSIONS.map(v => <option key={v}>{v}</option>)}</select></td>
        <td className="px-4 py-3"><select value={p.status} onChange={e => saveWebsiteProspect({...p, status: e.target.value as WebsiteProspectStatus})} className={`rounded-lg border-0 px-2 py-1.5 text-xs ${statusClass(p.status)}`}>{STATUSES.map(v => <option key={v}>{v}</option>)}</select></td>
        <td className="px-4 py-3"><div className="flex justify-end gap-2">{p.whatsapp ? <a href={whatsappUrl(p)} target="_blank" rel="noreferrer" onClick={e => { if (p.contactPermission === 'Opted Out') { e.preventDefault(); alert('या संपर्काने WhatsApp संदेश नको असल्याचे नोंदवले आहे.'); } }} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 font-bold text-white hover:bg-emerald-500"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a> : <span className="rounded-lg border border-slate-700 px-3 py-2 text-slate-400">No WhatsApp</span>}<button onClick={() => openEdit(p)} className="rounded-lg border border-slate-700 p-2 text-slate-300" title="Edit"><Edit2 className="h-3.5 w-3.5" /></button><button onClick={() => { if (confirm('हा lead delete करायचा?')) deleteWebsiteProspect(p.id); }} className="rounded-lg border border-rose-500/30 p-2 text-rose-300" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
      </tr>)}</tbody></table></div>}
    </div>
    {showForm && <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/70 p-4"><form onSubmit={handleSave} className="my-6 w-full max-w-2xl space-y-4 rounded-2xl border border-slate-700 bg-[#0b1220] p-5 shadow-2xl">
      <div className="flex items-start justify-between"><div><h2 className="text-lg font-bold text-white">{editing ? 'Edit Website Lead' : 'Add Website Lead'}</h2><p className="mt-1 text-xs text-slate-400">WhatsApp नंबर आणि website status source सह नोंदवा.</p></div><button type="button" onClick={() => setShowForm(false)} className="text-slate-400">✕</button></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-slate-300">Business Name *<input required value={form.businessName} onChange={e => update('businessName',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">Contact Person<input value={form.contactName} onChange={e => update('contactName',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">Business Type<input value={form.businessType} onChange={e => update('businessType',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">WhatsApp Number<input type="tel" value={form.whatsapp} onChange={e => update('whatsapp',e.target.value)} placeholder="91XXXXXXXXXX" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">Phone (optional)<input type="tel" value={form.phone} onChange={e => update('phone',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">City<input value={form.city} onChange={e => update('city',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">District<input value={form.district} onChange={e => update('district',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">State<input value={form.state} onChange={e => update('state',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">Website Status<select value={form.websiteStatus} onChange={e => update('websiteStatus',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"><option>No Website</option><option>Needs Verification</option><option>Website Found</option></select></label>
        <label className="text-xs text-slate-300">Website URL<input value={form.website || ''} onChange={e => update('website',e.target.value)} placeholder="https://" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">Source URL / Directory<input value={form.source} onChange={e => update('source',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
        <label className="text-xs text-slate-300">Contact Permission<select value={form.contactPermission} onChange={e => update('contactPermission',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white">{PERMISSIONS.map(v => <option key={v}>{v}</option>)}</select></label>
        <label className="text-xs text-slate-300">Lead Status<select value={form.status} onChange={e => update('status',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white">{STATUSES.map(v => <option key={v}>{v}</option>)}</select></label>
      </div>
      <label className="block text-xs text-slate-300">Notes<textarea value={form.notes} onChange={e => update('notes',e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
      <div className="flex justify-end gap-2 border-t border-slate-800 pt-4"><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300">Cancel</button><button type="submit" className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950">Save Lead</button></div>
    </form></div>}
  </div>;
};
