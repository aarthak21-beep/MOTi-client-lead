/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  Building,
  Phone,
  Mail,
  CreditCard,
  Lock,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { AgencySettings, MessageTemplate, PricingPlan } from '../types';
import {
  exportAllData,
  importAllData,
  resetStorageToDefaults,
  saveMessageTemplates,
  savePricingPlans,
  saveSettings,
} from '../services/storage';

interface SettingsViewProps {
  settings: AgencySettings;
  pricingPlans: PricingPlan[];
  messageTemplates: MessageTemplate[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  pricingPlans,
  messageTemplates,
}) => {
  const [activeTab, setActiveTab] = useState<'agency' | 'pricing' | 'templates' | 'security' | 'backup'>('agency');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Agency Form
  const [agencyForm, setAgencyForm] = useState<AgencySettings>({ ...settings });

  // Pricing Form
  const [plansForm, setPlansForm] = useState<PricingPlan[]>([...pricingPlans]);

  // Templates Form
  const [templatesForm, setTemplatesForm] = useState<MessageTemplate[]>([...messageTemplates]);
  const [editingTemplateId, setEditingTemplateId] = useState<string>('intro');

  // Backup state
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSaveAgency = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(agencyForm);
    triggerSuccess();
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    savePricingPlans(plansForm);
    triggerSuccess();
  };

  const handleSaveTemplates = (e: React.FormEvent) => {
    e.preventDefault();
    saveMessageTemplates(templatesForm);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJson = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MOTI-Business-OS-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) return;
    const ok = importAllData(importJsonText.trim());
    if (ok) {
      setImportStatus('success');
      setImportJsonText('');
      setTimeout(() => setImportStatus('idle'), 3000);
    } else {
      setImportStatus('error');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data back to MOTI Technologies sample defaults?')) {
      resetStorageToDefaults();
      alert('Data reset successfully to default agency state.');
    }
  };

  const currentTemplate = templatesForm.find((t) => t.id === editingTemplateId) || templatesForm[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            Agency Settings & OS Configuration
          </h2>
          <p className="text-xs text-slate-400">
            Customize branding, UPI bank details, default pricing plans, message templates & backups.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-2 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('agency')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'agency'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>Agency Profile & Bank</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'pricing'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Website Pricing Plans</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'templates'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>WhatsApp Templates (EN & MR)</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Owner Security PIN</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'backup'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          <Download className="h-4 w-4" />
          <span>Backup & Database Restore</span>
        </button>
      </div>

      {/* TAB 1: AGENCY PROFILE & BANK */}
      {activeTab === 'agency' && (
        <form onSubmit={handleSaveAgency} className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-[#0b1224] p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="h-4 w-4 text-cyan-400" />
              Agency Identity & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Agency Name
                </label>
                <input
                  type="text"
                  value={agencyForm.agencyName}
                  onChange={(e) => setAgencyForm({ ...agencyForm, agencyName: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline / Slogan
                </label>
                <input
                  type="text"
                  value={agencyForm.tagline}
                  onChange={(e) => setAgencyForm({ ...agencyForm, tagline: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Founder / Owner Name
                </label>
                <input
                  type="text"
                  value={agencyForm.ownerName}
                  onChange={(e) => setAgencyForm({ ...agencyForm, ownerName: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Official Phone
                </label>
                <input
                  type="tel"
                  value={agencyForm.phone}
                  onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Official WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={agencyForm.whatsapp}
                  onChange={(e) => setAgencyForm({ ...agencyForm, whatsapp: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Agency Email
                </label>
                <input
                  type="email"
                  value={agencyForm.email}
                  onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location / Office Address
                </label>
                <input
                  type="text"
                  value={agencyForm.address}
                  onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment & Banking Details */}
          <div className="rounded-3xl border border-slate-800 bg-[#0b1224] p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-400" />
              UPI & Bank Account (Appears on Formal Quotations & WhatsApp Messages)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Official UPI ID (GPay / PhonePe / Paytm / BHIM)
              </label>
              <input
                type="text"
                value={agencyForm.upiId}
                onChange={(e) => setAgencyForm({ ...agencyForm, upiId: e.target.value })}
                placeholder="e.g. moti.technologies@okhdfcbank"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-cyan-300 font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={agencyForm.bankDetails.bankName}
                  onChange={(e) =>
                    setAgencyForm({
                      ...agencyForm,
                      bankDetails: { ...agencyForm.bankDetails, bankName: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account Number</label>
                <input
                  type="text"
                  value={agencyForm.bankDetails.accountNo}
                  onChange={(e) =>
                    setAgencyForm({
                      ...agencyForm,
                      bankDetails: { ...agencyForm.bankDetails, accountNo: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={agencyForm.bankDetails.ifsc}
                  onChange={(e) =>
                    setAgencyForm({
                      ...agencyForm,
                      bankDetails: { ...agencyForm.bankDetails, ifsc: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Name</label>
                <input
                  type="text"
                  value={agencyForm.bankDetails.branch}
                  onChange={(e) =>
                    setAgencyForm({
                      ...agencyForm,
                      bankDetails: { ...agencyForm.bankDetails, branch: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save Agency Details</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: PRICING PLANS */}
      {activeTab === 'pricing' && (
        <form onSubmit={handleSavePricing} className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-[#0b1224] p-6 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-cyan-400" />
              Configure Default Website Packages
            </h3>

            <div className="space-y-6">
              {plansForm.map((plan, index) => (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Package Title
                      </label>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => {
                          const updated = [...plansForm];
                          updated[index].name = e.target.value;
                          setPlansForm(updated);
                        }}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Price (₹ INR)
                      </label>
                      <input
                        type="number"
                        value={plan.price}
                        onChange={(e) => {
                          const updated = [...plansForm];
                          updated[index].price = Number(e.target.value);
                          setPlansForm(updated);
                        }}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-cyan-400 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Delivery Timeline (Days)
                      </label>
                      <input
                        type="number"
                        value={plan.deliveryDays}
                        onChange={(e) => {
                          const updated = [...plansForm];
                          updated[index].deliveryDays = Number(e.target.value);
                          setPlansForm(updated);
                        }}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Short Description
                    </label>
                    <input
                      type="text"
                      value={plan.description}
                      onChange={(e) => {
                        const updated = [...plansForm];
                        updated[index].description = e.target.value;
                        setPlansForm(updated);
                      }}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Save Package Pricing</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: MESSAGE TEMPLATES */}
      {activeTab === 'templates' && (
        <form onSubmit={handleSaveTemplates} className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-[#0b1224] p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              Edit English & Marathi WhatsApp Templates
            </h3>

            {/* Template selector pills */}
            <div className="flex flex-wrap gap-2">
              {templatesForm.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setEditingTemplateId(tpl.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    editingTemplateId === tpl.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {tpl.title}
                </button>
              ))}
            </div>

            {/* Two Column: English & Marathi Editors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  🇬🇧 English Message Text
                </span>
                <textarea
                  rows={12}
                  value={currentTemplate.englishText}
                  onChange={(e) => {
                    const updated = templatesForm.map((t) =>
                      t.id === currentTemplate.id ? { ...t, englishText: e.target.value } : t
                    );
                    setTemplatesForm(updated);
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-[#070d19] p-3 text-xs text-slate-200 leading-relaxed font-mono resize-none focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  🇮🇳 मराठी (Marathi) Message Text
                </span>
                <textarea
                  rows={12}
                  value={currentTemplate.marathiText}
                  onChange={(e) => {
                    const updated = templatesForm.map((t) =>
                      t.id === currentTemplate.id ? { ...t, marathiText: e.target.value } : t
                    );
                    setTemplatesForm(updated);
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-[#070d19] p-3 text-xs text-slate-200 leading-relaxed resize-none focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Available Dynamic Variables:</span>
              <span className="font-mono text-cyan-400">
                {`{{customer_name}}, {{business_name}}, {{package_name}}, {{demo_url}}, {{due_amount}}, {{upi_id}}`}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Save All Templates</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: SECURITY PIN */}
      {activeTab === 'security' && (
        <div className="rounded-3xl border border-slate-800 bg-[#0b1224] p-6 space-y-6 max-w-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="h-4 w-4 text-purple-400" />
            Owner Authentication & Privacy Lock
          </h3>
          <p className="text-xs text-slate-400">
            Secure client contact numbers and agency revenue records when sharing your screen or working in public spaces.
          </p>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/60 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">Enable Owner PIN Lock</span>
                <span className="text-[11px] text-slate-400">
                  Prompts for PIN when opening dashboard or pressing lock button.
                </span>
              </div>
              <input
                type="checkbox"
                checked={agencyForm.pinProtectionEnabled}
                onChange={(e) => {
                  const updated = { ...agencyForm, pinProtectionEnabled: e.target.checked };
                  setAgencyForm(updated);
                  saveSettings(updated);
                  triggerSuccess();
                }}
                className="h-5 w-5 rounded-md border-slate-700 bg-slate-900 text-cyan-500"
              />
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Owner Security PIN (Default: 1234)
              </label>
              <input
                type="password"
                maxLength={6}
                value={agencyForm.securityPin}
                onChange={(e) => setAgencyForm({ ...agencyForm, securityPin: e.target.value })}
                className="w-48 rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-center text-sm font-mono tracking-widest text-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              saveSettings(agencyForm);
              triggerSuccess();
            }}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white"
          >
            Update Security Settings
          </button>
        </div>
      )}

      {/* TAB 5: BACKUP & DATABASE RESTORE */}
      {activeTab === 'backup' && (
        <div className="space-y-6 max-w-3xl">
          {/* Export */}
          <div className="rounded-3xl border border-slate-800 bg-[#0b1224] p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Download className="h-4 w-4 text-cyan-400" />
              Export Entire Agency Database
            </h3>
            <p className="text-xs text-slate-400">
              Download a complete JSON snapshot of all your leads, projects, quotations, payments, tasks and settings.
            </p>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
            >
              <Download className="h-4 w-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import */}
          <div className="rounded-3xl border border-slate-800 bg-[#0b1224] p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Upload className="h-4 w-4 text-blue-400" />
              Restore Database from JSON Backup
            </h3>
            <p className="text-xs text-slate-400">
              Paste exported JSON text below to restore your CRM data.
            </p>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON backup payload here..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white font-mono"
            />
            {importStatus === 'success' && (
              <p className="text-xs text-emerald-400 font-bold">✓ Backup successfully restored!</p>
            )}
            {importStatus === 'error' && (
              <p className="text-xs text-rose-400 font-bold">✕ Invalid JSON backup format.</p>
            )}
            <button
              onClick={handleImportJson}
              disabled={!importJsonText.trim()}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              Restore from JSON
            </button>
          </div>

          {/* Reset */}
          <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6 space-y-3">
            <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-rose-400" />
              Reset to Factory Agency Defaults
            </h3>
            <p className="text-xs text-rose-200/70">
              This will reset leads, quotations, projects and payments back to the initial sample agency dataset.
            </p>
            <button
              onClick={handleReset}
              className="rounded-xl border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/30"
            >
              Reset to Sample Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
