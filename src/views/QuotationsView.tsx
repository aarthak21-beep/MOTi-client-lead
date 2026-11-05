/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Printer,
  Download,
  Share2,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Building,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { AgencySettings, Lead, PricingPlan, Quotation, QuotationAddon } from '../types';
import { Modal } from '../components/Modal';
import { deleteQuotation, saveQuotation } from '../services/storage';
import { formatCurrency, formatDate, maskPhone } from '../utils/formatters';

interface QuotationsViewProps {
  quotations: Quotation[];
  pricingPlans: PricingPlan[];
  leads: Lead[];
  settings: AgencySettings;
  privacyMode: boolean;
  onSendQuoteViaWhatsApp: (quote: Quotation) => void;
  preSelectedLeadForQuote?: Lead | null;
}

const COMMON_ADDONS: QuotationAddon[] = [
  { id: 'addon-domain', name: '.com / .in Domain Registration (1 Year)', price: 999 },
  { id: 'addon-email', name: 'Professional Google Workspace / Zoho Email', price: 799 },
  { id: 'addon-pages', name: 'Extra Custom Pages (2 Pages Pack)', price: 999 },
  { id: 'addon-pg', name: 'Razorpay / PhonePe Payment Gateway Setup', price: 1499 },
  { id: 'addon-seo', name: 'Google Local SEO & Business Map Verification', price: 1299 },
  { id: 'addon-amc', name: '1 Year Maintenance, Backups & SSL Support', price: 2999 },
  { id: 'addon-logo', name: 'High-Res Vector Logo & Favicon Design', price: 999 },
];

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  quotations,
  pricingPlans,
  leads,
  settings,
  privacyMode,
  onSendQuoteViaWhatsApp,
  preSelectedLeadForQuote,
}) => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeQuotationForPrint, setActiveQuotationForPrint] = useState<Quotation | null>(null);

  // Builder Form State
  const [clientSource, setClientSource] = useState<'lead' | 'custom'>('lead');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(preSelectedLeadForQuote?.id || leads[0]?.id || '');

  const [clientName, setClientName] = useState(preSelectedLeadForQuote?.name || '');
  const [clientBusiness, setClientBusiness] = useState(preSelectedLeadForQuote?.businessName || '');
  const [clientPhone, setClientPhone] = useState(preSelectedLeadForQuote?.phone || '');
  const [clientEmail, setClientEmail] = useState(preSelectedLeadForQuote?.email || '');
  const [clientAddress, setClientAddress] = useState(preSelectedLeadForQuote?.address || '');

  const [selectedPlanId, setSelectedPlanId] = useState<string>('business');
  const [selectedAddons, setSelectedAddons] = useState<QuotationAddon[]>([]);
  const [customDiscount, setCustomDiscount] = useState<number>(0);
  const [timeline, setTimeline] = useState<string>('5 Business Days');
  const [validDays, setValidDays] = useState<number>(14);

  // Sync when selecting lead
  const handleLeadChange = (leadId: string) => {
    setSelectedLeadId(leadId);
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      setClientName(lead.name);
      setClientBusiness(lead.businessName);
      setClientPhone(lead.phone);
      setClientEmail(lead.email || '');
      setClientAddress(lead.address || '');
    }
  };

  const selectedPlan = pricingPlans.find((p) => p.id === selectedPlanId) || pricingPlans[1] || pricingPlans[0];
  const basePrice = selectedPlan?.price || 4999;
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const subtotal = basePrice + addonsTotal;
  const finalPrice = Math.max(0, subtotal - customDiscount);
  const advanceAmount = Math.round(finalPrice * 0.5);
  const remainingAmount = finalPrice - advanceAmount;

  const toggleAddon = (addon: QuotationAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Please provide client name and phone number.');
      return;
    }

    const today = new Date();
    const validUntilDate = new Date();
    validUntilDate.setDate(today.getDate() + validDays);

    const quoteNumber = `MOTI-Q${today.getFullYear()}-${String(quotations.length + 1).padStart(3, '0')}`;

    const newQuote: Quotation = {
      id: 'quote-' + Date.now(),
      quoteNumber,
      leadId: clientSource === 'lead' ? selectedLeadId : undefined,
      clientName,
      clientBusiness: clientBusiness || clientName,
      clientPhone,
      clientEmail,
      clientAddress,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      basePrice,
      addons: selectedAddons,
      discount: customDiscount,
      finalPrice,
      advanceAmount,
      remainingAmount,
      timeline,
      deliverables: selectedPlan.features,
      terms: settings.termsAndConditions,
      status: 'Draft',
      createdAt: today.toISOString().split('T')[0],
      validUntil: validUntilDate.toISOString().split('T')[0],
    };

    saveQuotation(newQuote);
    setIsBuilderOpen(false);
    setActiveQuotationForPrint(newQuote);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this quotation record?')) {
      deleteQuotation(id);
      if (activeQuotationForPrint?.id === id) {
        setActiveQuotationForPrint(null);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-400" />
            Website Plans & Quotation Generator
          </h2>
          <p className="text-xs text-slate-400">
            Generate formal itemized proposals with automatic 50% advance calculations & clean PDF print exports.
          </p>
        </div>

        <button
          onClick={() => {
            if (preSelectedLeadForQuote) {
              handleLeadChange(preSelectedLeadForQuote.id);
            }
            setIsBuilderOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-400 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Create New Quotation</span>
        </button>
      </div>

      {/* Pricing Packages Overview Cards */}
      <div className="no-print grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              plan.popular
                ? 'border-cyan-500/50 bg-[#0c1930] shadow-xl shadow-cyan-500/10'
                : 'border-white/10 bg-slate-900/65 backdrop-blur-xl'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {plan.badge || 'Package'}
                </span>
                {plan.popular && (
                  <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                    Recommended
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-base font-bold text-white">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-extrabold text-white">
                  {formatCurrency(plan.price, privacyMode)}
                </span>
                <span className="text-xs text-slate-400">/ one-time</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 line-clamp-2">{plan.description}</p>

              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span className="text-[11px]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10/80 flex items-center justify-between text-xs text-slate-400">
              <span>Delivery: <strong className="text-slate-200">{plan.deliveryDays} Days</strong></span>
              <button
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  setIsBuilderOpen(true);
                }}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Quote This →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quotations List */}
      <div className="no-print space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Generated Quotations ({quotations.length})
        </h3>

        {quotations.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/65 backdrop-blur-xl p-8 text-center text-xs text-slate-400">
            No quotations created yet. Click "+ Create New Quotation" to generate your first proposal.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotations.map((quote) => (
              <div
                key={quote.id}
                className="rounded-2xl border border-white/10 bg-slate-900/65 backdrop-blur-xl p-5 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-cyan-400">{quote.quoteNumber}</span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {quote.status}
                    </span>
                  </div>

                  <h4 className="mt-2 text-base font-bold text-white">{quote.clientBusiness}</h4>
                  <p className="text-xs text-slate-400">{quote.clientName} • {maskPhone(quote.clientPhone, privacyMode)}</p>

                  <div className="mt-3 rounded-xl bg-slate-900/60 p-3 border border-white/10/60 text-xs space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Package:</span>
                      <span className="font-semibold text-white">{quote.planName}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Total Price:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {formatCurrency(quote.finalPrice, privacyMode)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px] border-t border-white/10 pt-1">
                      <span>50% Advance: {formatCurrency(quote.advanceAmount, privacyMode)}</span>
                      <span>Balance: {formatCurrency(quote.remainingAmount, privacyMode)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500">Valid: {formatDate(quote.validUntil)}</span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveQuotationForPrint(quote)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white"
                      title="View & Print Formal Quotation PDF"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>View/Print</span>
                    </button>
                    <button
                      onClick={() => onSendQuoteViaWhatsApp(quote)}
                      className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 p-1.5 text-emerald-400 hover:bg-emerald-500/25"
                      title="Send WhatsApp Quote Summary"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(quote.id)}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/15 p-1.5 text-rose-400 hover:bg-rose-500/25"
                      title="Delete Quotation"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formal Quotation Viewer & Print Document Modal */}
      {activeQuotationForPrint && (
        <Modal
          isOpen={!!activeQuotationForPrint}
          onClose={() => setActiveQuotationForPrint(null)}
          title={`Official Proposal: ${activeQuotationForPrint.quoteNumber}`}
          subtitle={`${activeQuotationForPrint.clientBusiness} • Ready for A4 Print / PDF Download`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            {/* Action Bar (hidden during print) */}
            <div className="no-print flex items-center justify-between rounded-xl bg-slate-900 p-3 border border-white/10">
              <span className="text-xs text-slate-300">
                Click <strong>"Print / Save PDF"</strong> below. In the print dialog, select <strong>"Save as PDF"</strong>.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>

            {/* Print Container: Formatted cleanly for A4 Page */}
            <div
              id="quotation-print-sheet"
              className="print-container rounded-2xl bg-white p-8 text-slate-900 shadow-2xl border border-slate-200"
            >
              {/* Official Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      {settings.agencyName}
                    </h2>
                    <span className="rounded-sm bg-slate-900 px-1.5 py-0.5 text-[11px] font-bold text-white uppercase">
                      Official Proposal
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-cyan-700 mt-0.5">{settings.tagline}</p>
                  <p className="text-xs text-slate-600 mt-2 max-w-sm">
                    {settings.address}
                    <br />
                    Phone: {settings.phone} | Email: {settings.email}
                  </p>
                </div>

                <div className="text-right">
                  <h3 className="text-lg font-mono font-extrabold text-slate-900">
                    {activeQuotationForPrint.quoteNumber}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Date: <strong>{formatDate(activeQuotationForPrint.createdAt)}</strong>
                  </p>
                  <p className="text-xs text-slate-600">
                    Valid Until: <strong>{formatDate(activeQuotationForPrint.validUntil)}</strong>
                  </p>
                </div>
              </div>

              {/* Quotation Prepared For */}
              <div className="mt-6 grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Client Details
                  </p>
                  <h4 className="mt-1 text-base font-bold text-slate-900">
                    {activeQuotationForPrint.clientBusiness}
                  </h4>
                  <p className="text-xs font-semibold text-slate-700">
                    Attention: {activeQuotationForPrint.clientName}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Phone: {activeQuotationForPrint.clientPhone}
                    {activeQuotationForPrint.clientEmail ? ` | ${activeQuotationForPrint.clientEmail}` : ''}
                  </p>
                  {activeQuotationForPrint.clientAddress && (
                    <p className="text-xs text-slate-600">{activeQuotationForPrint.clientAddress}</p>
                  )}
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Project Scope & Timeline
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {activeQuotationForPrint.planName}
                  </p>
                  <p className="text-xs text-slate-700 mt-1">
                    Estimated Delivery: <strong>{activeQuotationForPrint.timeline}</strong>
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Service: Full Design, Development, Hosting & Domain Integration
                  </p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="mt-6">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 bg-slate-100 text-[11px] font-bold uppercase text-slate-800">
                      <th className="py-2.5 px-3">Description & Scope of Work</th>
                      <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-3 px-3">
                        <strong className="text-sm text-slate-900">{activeQuotationForPrint.planName}</strong>
                        <ul className="mt-2 space-y-1 list-disc pl-4 text-slate-600 text-[11px]">
                          {activeQuotationForPrint.deliverables.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 align-top text-sm">
                        ₹{activeQuotationForPrint.basePrice.toLocaleString('en-IN')}
                      </td>
                    </tr>

                    {/* Addons */}
                    {activeQuotationForPrint.addons.map((addon) => (
                      <tr key={addon.id}>
                        <td className="py-2 px-3 text-slate-800 font-medium">
                          + {addon.name}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                          ₹{addon.price.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}

                    {/* Discount */}
                    {activeQuotationForPrint.discount > 0 && (
                      <tr className="text-emerald-700">
                        <td className="py-2 px-3 font-semibold">Special Client Courtesy Discount</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">
                          - ₹{activeQuotationForPrint.discount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals & Advance Breakdown */}
              <div className="mt-4 flex justify-end">
                <div className="w-72 space-y-1.5 border-t-2 border-slate-900 pt-3 text-xs">
                  <div className="flex justify-between font-bold text-base text-slate-900">
                    <span>Total Investment:</span>
                    <span className="font-mono">
                      ₹{activeQuotationForPrint.finalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 font-medium border-t border-slate-200 pt-1">
                    <span>50% Advance to Begin:</span>
                    <span className="font-mono font-bold text-cyan-800">
                      ₹{activeQuotationForPrint.advanceAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>50% Balance upon Review:</span>
                    <span className="font-mono font-semibold">
                      ₹{activeQuotationForPrint.remainingAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details & Bank Transfer */}
              <div className="mt-6 rounded-xl border border-slate-300 bg-slate-50 p-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Payment Methods (UPI / Bank Transfer)
                  </p>
                  <p className="mt-1 text-slate-700">
                    UPI ID: <strong className="font-mono text-cyan-800 text-sm">{settings.upiId}</strong>
                  </p>
                  <p className="text-slate-600 mt-1">
                    PhonePe / GPay / Paytm: <strong>{settings.phone}</strong>
                  </p>
                  <p className="text-slate-600">
                    Account: {settings.bankDetails.accountNo} | IFSC: {settings.bankDetails.ifsc}
                  </p>
                  <p className="text-slate-500 text-[10px]">Bank: {settings.bankDetails.bankName}, {settings.bankDetails.branch}</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Terms & Conditions
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[10px] text-slate-600 list-disc pl-3">
                    {activeQuotationForPrint.terms.slice(0, 4).map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-8 flex items-end justify-between pt-4 border-t border-slate-200 text-xs">
                <div>
                  <p className="text-[11px] text-slate-500">Client Approval Signature</p>
                  <div className="mt-6 border-b border-slate-400 w-44"></div>
                  <p className="text-[10px] text-slate-400 mt-1">Sign & Date</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">{settings.agencyName}</p>
                  <div className="my-2 inline-block rounded-md border border-cyan-700 px-3 py-1 text-[10px] font-bold text-cyan-800 uppercase tracking-widest">
                    Authorized Signatory
                  </div>
                  <p className="text-[10px] text-slate-500">{settings.ownerName}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Quotation Builder Modal */}
      {isBuilderOpen && (
        <Modal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          title="Create New Official Quotation"
          subtitle="Customize package, choose features, calculate advance and generate formal PDF"
          maxWidth="3xl"
        >
          <form onSubmit={handleCreateQuotation} className="space-y-4">
            {/* Step 1: Client Selection */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Client Information
                </label>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setClientSource('lead')}
                    className={`rounded-lg px-2.5 py-1 ${
                      clientSource === 'lead'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Select from Leads
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientSource('custom')}
                    className={`rounded-lg px-2.5 py-1 ${
                      clientSource === 'custom'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Manual Entry
                  </button>
                </div>
              </div>

              {clientSource === 'lead' ? (
                <div>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => handleLeadChange(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.businessName} — {l.name} ({l.phone})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={clientBusiness}
                    onChange={(e) => setClientBusiness(e.target.value)}
                    placeholder="Business Name (e.g. Apex Hospital)"
                    className="rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Owner / Contact Person"
                    className="rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white"
                  />
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Phone / WhatsApp (+91 ...)"
                    className="rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white font-mono"
                  />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Email Address"
                    className="rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Step 2: Package Selection */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Choose Website Package
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setTimeline(`${plan.deliveryDays} Business Days`);
                    }}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      selectedPlanId === plan.id
                        ? 'border-cyan-500 bg-cyan-950/40 text-white'
                        : 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs">{plan.name}</span>
                      <span className="font-mono font-bold text-cyan-400">
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{plan.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Optional Addons */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Additional Add-ons & Features
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_ADDONS.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer select-none text-xs transition-colors ${
                        isChecked
                          ? 'border-blue-500/50 bg-blue-950/40 text-blue-200'
                          : 'border-white/10 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddon(addon)}
                          className="rounded-sm border-slate-700 bg-slate-900 text-blue-500"
                        />
                        <span className="text-[11px] font-medium">{addon.name}</span>
                      </div>
                      <span className="font-mono font-semibold text-slate-300 shrink-0">
                        +₹{addon.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Pricing Summary & Discounts */}
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 to-blue-950/30 p-4 text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Base Package ({selectedPlan.name}):</span>
                <span className="font-mono">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              {addonsTotal > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Add-ons Total ({selectedAddons.length}):</span>
                  <span className="font-mono">+₹{addonsTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <span>Special Discount (₹):</span>
                <input
                  type="number"
                  value={customDiscount}
                  onChange={(e) => setCustomDiscount(Number(e.target.value) || 0)}
                  className="w-24 rounded-lg border border-slate-700 bg-slate-900 py-1 px-2 text-right font-mono text-xs text-white"
                />
              </div>

              <div className="border-t border-slate-700/60 pt-2 flex justify-between text-sm font-extrabold text-white">
                <span>Final Quotation Price:</span>
                <span className="font-mono text-cyan-400">₹{finalPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                <div className="rounded-xl bg-slate-900/80 p-2.5 border border-white/10">
                  <span className="text-slate-400 block">50% Advance Required:</span>
                  <strong className="text-emerald-400 font-mono text-sm">
                    ₹{advanceAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-2.5 border border-white/10">
                  <span className="text-slate-400 block">50% Balance on Delivery:</span>
                  <strong className="text-amber-400 font-mono text-sm">
                    ₹{remainingAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBuilderOpen(false)}
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-400 transition-all"
              >
                Generate Official Proposal
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
