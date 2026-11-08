import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Plus, Search, Trash2, Edit2, MapPin, Building2 } from 'lucide-react';
import { NewspaperProspect, ProspectBusinessType, ProspectStatus, ContactPermission, WhatsAppAvailability } from '../types';
import { deleteNewspaperProspect, getNewspaperProspects, saveNewspaperProspect, subscribeToStorage } from '../services/storage';

const BUSINESS_TYPES: ProspectBusinessType[] = ['Newspaper Vendor', 'Newspaper Agency', 'Distributor', 'Newspaper Publisher', 'Printing Press'];
const STATUSES: ProspectStatus[] = ['New', 'Contacted', 'Interested', 'Demo Given', 'Converted', 'Not Interested'];
const PERMISSIONS: ContactPermission[] = ['Not Asked', 'Opted In', 'Opted Out'];
const WHATSAPP_AVAILABILITY: WhatsAppAvailability[] = ['Unknown', 'Available', 'Not Available'];
const emptyForm = (): NewspaperProspect => ({
  id: '', businessName: '', contactName: '', businessType: 'Newspaper Vendor',
  whatsapp: '', whatsappAvailability: 'Unknown', city: '', district: '', state: 'Maharashtra',
  status: 'New', contactPermission: 'Not Asked',
  createdAt: '', updatedAt: '',
});

const cleanPhone = (value: string) => { const digits = value.replace(/\D/g, ''); return digits.length === 10 ? `91${digits}` : digits; };
const whatsappUrl = (prospect: NewspaperProspect) => {
  const phone = cleanPhone(prospect.whatsapp);
  if (!phone) return '#';
  const message = prospect.contactPermission === 'Opted In'
    ? 'नमस्कार!\n\nआम्ही MOTi Technologies या कंपनीतर्फे व्यवसायांसाठी उपयुक्त डिजिटल सॉफ्टवेअर आणि CRM सोल्यूशन्स तयार करतो.\n\nआपल्या व्यवसायाचे कामकाज अधिक सोपे, जलद आणि व्यवस्थित करण्यासाठी आम्ही विविध सॉफ्टवेअर सोल्यूशन्स उपलब्ध करून देतो.\n\nआमच्या कंपनीची आणि सेवांची अधिक माहिती जाणून घेण्यासाठी वेबसाइटला भेट द्या: https://moti-technologies.onrender.com/\n\nआपल्याला आपल्या व्यवसायासाठी उपयुक्त सॉफ्टवेअरचा छोटा डेमो पाहायला आवडेल का? आपण कधी बोलू शकतो?\n\nधन्यवाद!\nTeam MOTi Technologies'
    : 'नमस्कार!\n\nतुमचा वर्तमानपत्र व्यवसाय आता होणार अधिक स्मार्ट!\n\nआम्ही MOTi Technologies तर्फे खास वर्तमानपत्र विक्रेते, एजन्सी आणि वितरकांसाठी MOTi Newspaper CRM तयार केले आहे.\n\nयाच्या मदतीने तुम्ही:\n- ग्राहकांची माहिती व्यवस्थित सांभाळू शकता.\n- व्यवसायाचे व्यवस्थापन अधिक सोपे करू शकता.\n- वेळ आणि मेहनत वाचवू शकता.\n\nसर्वात खास गोष्ट म्हणजे हे सॉफ्टवेअर मोबाईल, टॅबलेट किंवा कॉम्प्युटरवरून कुठेही वापरता येते! म्हणजे तुमचा व्यवसाय तुमच्या हातात!\n\nतुमच्या व्यवसायासाठी हे किती उपयुक्त ठरू शकते, याचा छोटासा डेमो पाहायला आवडेल का?\n\nतुमची परवानगी असल्यास अधिक माहिती WhatsApp वर पाठवू.\n\nधन्यवाद!\nTeam MOTi Technologies\nhttps://moti-technologies.onrender.com/';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const NewspaperProspectsView: React.FC = () => {
  const [prospects, setProspects] = useState<NewspaperProspect[]>([]);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NewspaperProspect | null>(null);
  const [form, setForm] = useState<NewspaperProspect>(emptyForm());

  useEffect(() => {
    const reload = () => setProspects(getNewspaperProspects());
    reload();
    return subscribeToStorage(reload);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prospects.filter((p) => !q || [p.businessName, p.contactName, p.whatsapp, p.city, p.district, p.businessType].join(' ').toLowerCase().includes(q));
  }, [prospects, query]);

  const openNew = () => { setEditing(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit = (p: NewspaperProspect) => { setEditing(p); setForm(p); setShowForm(true); };
  const update = (key: keyof NewspaperProspect, value: string) => setForm((current) => ({ ...current, [key]: value } as NewspaperProspect));

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const digits = cleanPhone(form.whatsapp);
    if (digits && (digits.length < 10 || digits.length > 15)) {
      alert('कृपया योग्य WhatsApp नंबर टाका (country code सहित).');
      return;
    }
    saveNewspaperProspect({
      ...form,
      id: editing?.id || `news-${Date.now()}`,
      whatsapp: digits,
      createdAt: editing?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const statusClass = (status: ProspectStatus) => status === 'Converted' ? 'bg-emerald-500/15 text-emerald-300' : status === 'Interested' ? 'bg-cyan-500/15 text-cyan-300' : status === 'Not Interested' ? 'bg-rose-500/15 text-rose-300' : 'bg-slate-700/70 text-slate-300';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Prospecting • India</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white">Newspaper Business Leads</h1>
          <p className="mt-1 text-sm text-slate-400">Newspaper Vendors, Agencies, Distributors, Publishers आणि Printing Press contacts व्यवस्थापित करा.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-400">
          <Plus className="h-4 w-4" /> Add Newspaper Lead
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#14233b] to-[#0d1729] p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.025]"><p className="text-xs text-slate-400">Total Leads</p><p className="mt-1 text-2xl font-bold text-white">{prospects.length}</p></div>
        <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#14233b] to-[#0d1729] p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.025]"><p className="text-xs text-slate-400">Interested</p><p className="mt-1 text-2xl font-bold text-cyan-300">{prospects.filter(p => p.status === 'Interested').length}</p></div>
        <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#14233b] to-[#0d1729] p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.025]"><p className="text-xs text-slate-400">Opted In</p><p className="mt-1 text-2xl font-bold text-emerald-300">{prospects.filter(p => p.contactPermission === 'Opted In').length}</p></div>
        <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#14233b] to-[#0d1729] p-4 shadow-lg shadow-black/10 ring-1 ring-white/[0.025]"><p className="text-xs text-slate-400">Converted</p><p className="mt-1 text-2xl font-bold text-white">{prospects.filter(p => p.status === 'Converted').length}</p></div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-[#111d32] px-3 shadow-inner shadow-black/10">
        <Search className="h-4 w-4 text-slate-500" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search business, WhatsApp, city or district..." className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500" />
      </div>

      <div className="overflow-hidden rounded-[22px] border border-slate-700/70 bg-[#0b1528]/90 shadow-xl shadow-black/10 ring-1 ring-white/[0.025]">
        {filtered.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Building2 className="mx-auto h-9 w-9 text-slate-600" />
            <h3 className="mt-3 text-sm font-semibold text-white">{prospects.length ? 'No matching leads' : 'No newspaper leads added yet'}</h3>
            <p className="mt-1 text-xs text-slate-500">व्यवसायाची सार्वजनिक संपर्क माहिती उपलब्ध असल्यास Lead Add करा; WhatsApp नंबर नसेल तरी नोंद ठेवता येईल.</p>
            {!prospects.length && <button onClick={openNew} className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950">Add First Lead</button>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="bg-slate-800/80 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300"><tr><th className="px-4 py-3">Business</th><th className="px-4 py-3">Type / Location</th><th className="px-4 py-3">WhatsApp</th><th className="px-4 py-3">WhatsApp Check (Manual)</th><th className="px-4 py-3">Permission</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-700/50">
                {filtered.map(p => (
                  <tr key={p.id} className="transition-colors hover:bg-cyan-400/[0.045]">
                    <td className="px-4 py-3"><p className="font-semibold text-white">{p.businessName}</p><p className="mt-1 text-slate-500">{p.contactName || 'Contact name not added'}</p></td>
                    <td className="px-4 py-3"><p className="text-slate-200">{p.businessType}</p><p className="mt-1 flex items-center gap-1 text-slate-500"><MapPin className="h-3 w-3" />{[p.city, p.district, p.state].filter(Boolean).join(', ')}</p></td>
                    <td className="px-4 py-3 font-mono text-slate-200">{p.whatsapp ? `+${p.whatsapp}` : 'Not provided'}</td>
                    <td className="px-4 py-3"><select title="ही उपलब्धता तुम्ही स्वतः तपासून नोंदवा" value={p.whatsappAvailability || 'Unknown'} onChange={e => saveNewspaperProspect({...p, whatsappAvailability: e.target.value as WhatsAppAvailability})} className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200">{WHATSAPP_AVAILABILITY.map(v => <option key={v} value={v}>{v === 'Available' ? 'WhatsApp आहे' : v === 'Not Available' ? 'WhatsApp नाही' : 'तपासायचे आहे'}</option>)}</select></td>
                    <td className="px-4 py-3"><select value={p.contactPermission} onChange={e => saveNewspaperProspect({...p, contactPermission: e.target.value as ContactPermission})} className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200">{PERMISSIONS.map(v => <option key={v}>{v}</option>)}</select></td>
                    <td className="px-4 py-3"><select value={p.status} onChange={e => saveNewspaperProspect({...p, status: e.target.value as ProspectStatus})} className={`rounded-lg border-0 px-2 py-1.5 text-xs ${statusClass(p.status)}`}>{STATUSES.map(v => <option key={v}>{v}</option>)}</select></td>
                    <td className="px-4 py-3"><div className="flex justify-end gap-2">
                      {p.contactPermission === 'Opted Out' ? <span className="rounded-lg border border-rose-500/30 px-3 py-2 text-rose-300">मेसेज बंद (Opted Out)</span> : p.whatsappAvailability === 'Available' ? <a href={whatsappUrl(p)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 font-bold text-white hover:bg-emerald-500"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a> : <span className="rounded-lg border border-slate-700 px-3 py-2 text-slate-400">{p.whatsappAvailability === 'Not Available' ? 'WhatsApp नाही' : 'तपासायचे आहे'}</span>}
                      <button onClick={() => openEdit(p)} className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:text-white" title="Edit"><Edit2 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => { if (confirm('हा lead delete करायचा?')) deleteNewspaperProspect(p.id); }} className="rounded-lg border border-rose-500/30 p-2 text-rose-300 hover:bg-rose-500/10" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/70 p-4">
        <form onSubmit={handleSave} className="my-6 w-full max-w-2xl space-y-4 rounded-2xl border border-slate-700 bg-[#0b1220] p-5 shadow-2xl">
          <div className="flex items-start justify-between"><div><h2 className="text-lg font-bold text-white">{editing ? 'Edit Newspaper Lead' : 'Add Newspaper Lead'}</h2><p className="mt-1 text-xs text-slate-400">नंबर टाका. WhatsApp आहे की नाही हे स्वतः तपासून नोंदवा; ही स्वयंचलित तपासणी नाही.</p></div><button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">✕</button></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-300">Business / Agency Name *<input required value={form.businessName} onChange={e => update('businessName', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
            <label className="text-xs text-slate-300">Contact Person<input value={form.contactName} onChange={e => update('contactName', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
            <label className="text-xs text-slate-300">Business Type<select value={form.businessType} onChange={e => update('businessType', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white">{BUSINESS_TYPES.map(v => <option key={v}>{v}</option>)}</select></label>
            <label className="text-xs text-slate-300">WhatsApp Number (optional)<input type="tel" value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} placeholder="91XXXXXXXXXX" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
            <label className="text-xs text-slate-300">WhatsApp Availability (Manual Check)<select value={form.whatsappAvailability || 'Unknown'} onChange={e => update('whatsappAvailability', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white">{WHATSAPP_AVAILABILITY.map(v => <option key={v} value={v}>{v === 'Available' ? 'WhatsApp आहे' : v === 'Not Available' ? 'WhatsApp नाही' : 'तपासायचे आहे'}</option>)}</select></label>
            <label className="text-xs text-slate-300">City<input value={form.city} onChange={e => update('city', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
            <label className="text-xs text-slate-300">District<input value={form.district} onChange={e => update('district', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
            <label className="text-xs text-slate-300">State<input value={form.state} onChange={e => update('state', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
            <label className="text-xs text-slate-300">Website<input value={form.website || ''} onChange={e => update('website', e.target.value)} placeholder="https://" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
            <label className="text-xs text-slate-300">Contact Permission<select value={form.contactPermission} onChange={e => update('contactPermission', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white">{PERMISSIONS.map(v => <option key={v}>{v}</option>)}</select></label>
            <label className="text-xs text-slate-300">Lead Status<select value={form.status} onChange={e => update('status', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white">{STATUSES.map(v => <option key={v}>{v}</option>)}</select></label>
          </div>
          <label className="block text-xs text-slate-300">Notes<textarea value={form.notes || ''} onChange={e => update('notes', e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white" /></label>
          <div className="flex justify-end gap-2 border-t border-slate-800 pt-4"><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300">Cancel</button><button type="submit" className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950">Save Lead</button></div>
        </form>
      </div>}
    </div>
  );
};
