/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Copy,
  Check,
  User,
  Globe,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { AgencySettings, DemoTemplate, Lead, MessageTemplate, Project } from '../types';
import { cleanPhoneForWhatsApp } from '../utils/formatters';

interface WhatsAppCentreViewProps {
  leads: Lead[];
  projects: Project[];
  demoTemplates: DemoTemplate[];
  messageTemplates: MessageTemplate[];
  settings: AgencySettings;
  preSelectedLeadId?: string;
  preSelectedTemplateId?: string;
}

export const WhatsAppCentreView: React.FC<WhatsAppCentreViewProps> = ({
  leads,
  projects,
  demoTemplates,
  messageTemplates,
  settings,
  preSelectedLeadId,
  preSelectedTemplateId,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(preSelectedLeadId || (leads[0]?.id || 'custom'));
  const [customName, setCustomName] = useState('');
  const [customBusiness, setCustomBusiness] = useState('');
  const [customPhone, setCustomPhone] = useState('');

  const [language, setLanguage] = useState<'english' | 'marathi'>('english');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(preSelectedTemplateId || 'intro');

  // Dynamic overrides
  const [selectedDemoId, setSelectedDemoId] = useState<string>(demoTemplates[0]?.id || '');
  const [selectedPackageName, setSelectedPackageName] = useState<string>('Business Website (₹4,999)');
  const [dueAmount, setDueAmount] = useState<number>(2499);
  const [totalAmount, setTotalAmount] = useState<number>(4999);
  const [advancePaid, setAdvancePaid] = useState<number>(2500);
  const [liveUrl, setLiveUrl] = useState<string>('https://yourbrand.com');

  const [editableMessage, setEditableMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [confirmedByUser, setConfirmedByUser] = useState<boolean>(false);

  // Sync if props change
  useEffect(() => {
    if (preSelectedLeadId) {
      setSelectedLeadId(preSelectedLeadId);
    }
  }, [preSelectedLeadId]);

  useEffect(() => {
    if (preSelectedTemplateId) {
      setSelectedTemplateId(preSelectedTemplateId);
    }
  }, [preSelectedTemplateId]);

  // Determine current active client
  const activeLead = leads.find((l) => l.id === selectedLeadId);
  const activeProject = projects.find((p) => p.leadId === selectedLeadId || p.clientPhone === activeLead?.phone);

  const customerName = activeLead ? activeLead.name : customName || 'Valued Client';
  const businessName = activeLead ? activeLead.businessName : customBusiness || 'Your Business';
  const phone = activeLead ? activeLead.whatsapp || activeLead.phone : customPhone;

  // Selected Demo
  const activeDemo = demoTemplates.find((d) => d.id === selectedDemoId) || demoTemplates[0];

  // Re-generate message whenever template, language, or variables change
  useEffect(() => {
    const templateObj = messageTemplates.find((t) => t.id === selectedTemplateId) || messageTemplates[0];
    if (!templateObj) return;

    let text = language === 'english' ? templateObj.englishText : templateObj.marathiText;

    // Project values if available
    const projTotal = activeProject ? activeProject.totalAmount : totalAmount;
    const projAdvance = activeProject ? activeProject.advancePaid : advancePaid;
    const projDue = activeProject ? activeProject.remainingAmount : dueAmount;
    const projLive = activeProject?.liveUrl || liveUrl;
    const projName = activeProject?.projectName || `${businessName} Official Website`;

    // Replace variables
    text = text
      .replace(/{{customer_name}}/g, customerName)
      .replace(/{{business_name}}/g, businessName)
      .replace(/{{agency_phone}}/g, settings.whatsapp || settings.phone)
      .replace(/{{package_name}}/g, selectedPackageName)
      .replace(/{{demo_url}}/g, activeDemo?.demoUrl || 'https://motitechnologies.com/demos')
      .replace(/{{project_name}}/g, projName)
      .replace(/{{total_amount}}/g, projTotal.toLocaleString('en-IN'))
      .replace(/{{advance_paid}}/g, projAdvance.toLocaleString('en-IN'))
      .replace(/{{due_amount}}/g, projDue.toLocaleString('en-IN'))
      .replace(/{{upi_id}}/g, settings.upiId)
      .replace(/{{live_url}}/g, projLive);

    setEditableMessage(text);
    setConfirmedByUser(false);
  }, [
    selectedLeadId,
    customName,
    customBusiness,
    language,
    selectedTemplateId,
    selectedDemoId,
    selectedPackageName,
    dueAmount,
    totalAmount,
    advancePaid,
    liveUrl,
    messageTemplates,
    settings,
    activeProject,
    activeDemo,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = cleanPhoneForWhatsApp(phone);
    if (!cleanPhone) {
      alert('Please enter or select a valid WhatsApp phone number.');
      return;
    }
    const encoded = encodeURIComponent(editableMessage);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
            WhatsApp Message Centre
          </h2>
          <p className="text-xs text-slate-400">
            Professional personalized templates in English and Marathi. Never sent automatically without confirmation.
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center rounded-2xl border border-slate-800 bg-[#0b1224] p-1 self-start sm:self-auto">
          <button
            onClick={() => setLanguage('english')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              language === 'english'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🇬🇧 English</span>
          </button>
          <button
            onClick={() => setLanguage('marathi')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              language === 'marathi'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🇮🇳 मराठी (Marathi)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration & Selectors (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Step 1: Select Customer */}
          <div className="rounded-2xl border border-slate-800 bg-[#0b1224] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <User className="h-4 w-4 text-cyan-400" />
                Step 1: Select Client
              </label>
              {activeLead && (
                <span className="text-[11px] font-semibold text-emerald-400">
                  {activeLead.category}
                </span>
              )}
            </div>

            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
            >
              <optgroup label="Active Leads & Clients">
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} - {l.businessName} ({l.phone})
                  </option>
                ))}
              </optgroup>
              <option value="custom">✏️ Enter Custom Recipient</option>
            </select>

            {selectedLeadId === 'custom' && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Customer Name (e.g. Ramesh Kulkarni)"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  value={customBusiness}
                  onChange={(e) => setCustomBusiness(e.target.value)}
                  placeholder="Business Name (e.g. Kulkarni Jewelers)"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="WhatsApp Number (e.g. +91 98221 11223)"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            )}
          </div>

          {/* Step 2: Select Message Template */}
          <div className="rounded-2xl border border-slate-800 bg-[#0b1224] p-4 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              Step 2: Choose Message Template
            </label>

            <div className="space-y-1.5">
              {messageTemplates.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs text-left transition-all ${
                      isSelected
                        ? 'border border-emerald-500/40 bg-emerald-500/15 font-semibold text-emerald-300'
                        : 'border border-slate-800/80 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <span>{template.title}</span>
                    {isSelected && <Check className="h-4 w-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Dynamic Variables & Customization */}
          <div className="rounded-2xl border border-slate-800 bg-[#0b1224] p-4 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-400" />
              Template Variables & Details
            </label>

            {selectedTemplateId === 'demo' && (
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Select Demo Link:</span>
                <select
                  value={selectedDemoId}
                  onChange={(e) => setSelectedDemoId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  {demoTemplates.map((demo) => (
                    <option key={demo.id} value={demo.id}>
                      {demo.title} ({demo.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(selectedTemplateId === 'followup' || selectedTemplateId === 'pricing') && (
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Package Mentioned:</span>
                <select
                  value={selectedPackageName}
                  onChange={(e) => setSelectedPackageName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="Starter Website (₹2,999)">Starter Website (₹2,999)</option>
                  <option value="Business Website (₹4,999)">Business Website (₹4,999)</option>
                  <option value="Premium Corporate (₹7,999)">Premium Corporate (₹7,999)</option>
                  <option value="E-Commerce Store (₹12,999)">E-Commerce Store (₹12,999)</option>
                </select>
              </div>
            )}

            {(selectedTemplateId === 'payment_advance' || selectedTemplateId === 'payment_final') && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">Total (₹):</span>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-1.5 px-3 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 mb-1">Due Amount (₹):</span>
                  <input
                    type="number"
                    value={dueAmount}
                    onChange={(e) => setDueAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-1.5 px-3 text-xs text-white font-mono"
                  />
                </div>
              </div>
            )}

            {selectedTemplateId === 'handover' && (
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Live Website URL:</span>
                <input
                  type="text"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-1.5 px-3 text-xs text-white font-mono"
                />
              </div>
            )}

            <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-800/60">
              <span>Agency UPI: <strong className="text-slate-200">{settings.upiId}</strong></span>
              <span>Sender: <strong className="text-slate-200">{settings.whatsapp}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: WhatsApp Simulator & Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-[#07131e] overflow-hidden shadow-2xl flex flex-col h-full">
            {/* WhatsApp Phone Mock Header */}
            <div className="bg-[#121b22] px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/30 text-emerald-400 font-bold text-sm border border-emerald-500/40">
                  {customerName.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {customerName}
                    <span className="text-[11px] font-normal text-slate-400">({businessName})</span>
                  </h4>
                  <p className="text-[11px] text-emerald-400 font-mono">
                    {phone || 'No phone selected'}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                WhatsApp Ready
              </span>
            </div>

            {/* Chat Bubble Area */}
            <div className="p-5 flex-1 bg-[radial-gradient(#152433_1px,transparent_1px)] [background-size:16px_16px] min-h-[340px] flex flex-col justify-end">
              <div className="max-w-xl self-end rounded-2xl rounded-tr-xs bg-[#005c4b] p-4 text-white shadow-xl">
                <p className="text-[11px] text-emerald-200 font-semibold mb-1 flex items-center justify-between">
                  <span>MOTI Technologies</span>
                  <span className="text-[10px] opacity-75">Just now</span>
                </p>
                <textarea
                  rows={10}
                  value={editableMessage}
                  onChange={(e) => setEditableMessage(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-100 leading-relaxed resize-none focus:outline-hidden font-sans border-0 p-0"
                  placeholder="Type message..."
                />
                <div className="mt-2 flex items-center justify-between border-t border-emerald-400/20 pt-2 text-[10px] text-emerald-200/80">
                  <span>Click inside bubble to edit before sending</span>
                  <span>✓✓ Read</span>
                </div>
              </div>
            </div>

            {/* Safety Confirmation & Send Bar */}
            <div className="bg-[#121b22] p-4 border-t border-slate-800 space-y-3">
              {/* Mandatory Safety Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmedByUser}
                  onChange={(e) => setConfirmedByUser(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded-sm border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">I confirm this message content is correct.</span>{' '}
                  <span className="text-slate-400">
                    MOTI Business OS will never send messages automatically without your explicit click.
                  </span>
                </div>
              </label>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 px-4 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Message Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  disabled={!confirmedByUser}
                  className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-5 text-xs font-bold transition-all shadow-lg ${
                    confirmedByUser
                      ? 'bg-[#25d366] text-slate-950 hover:bg-[#20ba5a] active:scale-98 shadow-emerald-500/20 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  <Send className="h-4 w-4" />
                  <span>Open in WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
