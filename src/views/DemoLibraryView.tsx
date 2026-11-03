/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  ExternalLink,
  Copy,
  Check,
  Plus,
  MessageSquare,
  Smartphone,
  Monitor,
  CheckCircle2,
  Trash2,
  Eye,
  Sparkles,
} from 'lucide-react';
import { BusinessCategory, DemoTemplate } from '../types';
import { Modal } from '../components/Modal';
import { deleteDemoTemplate, saveDemoTemplate } from '../services/storage';

interface DemoLibraryViewProps {
  demoTemplates: DemoTemplate[];
  onShareDemoOnWhatsApp: (demo: DemoTemplate) => void;
}

const CATEGORIES: BusinessCategory[] = [
  'Coaching Institute',
  'Restaurant & Cafe',
  'Healthcare & Clinic',
  'Retail & Shop',
  'E-Commerce',
  'Real Estate',
  'Professional Services',
  'Manufacturing',
  'Salon & Beauty',
  'Portfolio / Personal',
  'Other',
];

export const DemoLibraryView: React.FC<DemoLibraryViewProps> = ({
  demoTemplates,
  onShareDemoOnWhatsApp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live Preview Modal
  const [previewingDemo, setPreviewingDemo] = useState<DemoTemplate | null>(null);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');

  // Add Template Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<DemoTemplate>>({
    title: '',
    category: 'Coaching Institute',
    previewImage: '',
    demoUrl: '',
    description: '',
    features: [],
    tags: [],
  });
  const [featureInput, setFeatureInput] = useState('');

  const filteredDemos = demoTemplates.filter(
    (d) => selectedCategory === 'all' || d.category === selectedCategory
  );

  const handleCopyLink = (demo: DemoTemplate) => {
    navigator.clipboard.writeText(demo.demoUrl);
    setCopiedId(demo.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.demoUrl) {
      alert('Please provide Title and Live Demo URL.');
      return;
    }

    const newTemplate: DemoTemplate = {
      id: 'demo-' + Date.now(),
      title: formData.title || '',
      category: (formData.category as BusinessCategory) || 'Other',
      previewImage:
        formData.previewImage ||
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      demoUrl: formData.demoUrl || '',
      description: formData.description || '',
      features:
        formData.features && formData.features.length > 0
          ? formData.features
          : ['Mobile Responsive', 'Fast Speed', 'WhatsApp Integration', 'Contact Form'],
      tags: [(formData.category as string) || 'Website', 'Demo'],
    };

    saveDemoTemplate(newTemplate);
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      category: 'Coaching Institute',
      previewImage: '',
      demoUrl: '',
      description: '',
      features: [],
      tags: [],
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this template from the demo library?')) {
      deleteDemoTemplate(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            Demo Website Library
          </h2>
          <p className="text-xs text-slate-400">
            Showcase pre-built, industry-specific website demos to prospects to close deals fast.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add New Template</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          All Templates ({demoTemplates.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = demoTemplates.filter((d) => d.category === cat).length;
          if (count === 0 && selectedCategory !== cat) return null;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Demos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDemos.map((demo) => (
          <div
            key={demo.id}
            className="group rounded-3xl border border-slate-800 bg-[#0b1224] overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Image Preview with Hover Overlay */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={demo.previewImage}
                  alt={demo.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1224] via-transparent to-black/40" />

                <div className="absolute top-3 left-3">
                  <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-cyan-300 border border-white/10">
                    {demo.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewingDemo(demo)}
                    className="rounded-lg bg-black/70 backdrop-blur-md p-1.5 text-white hover:text-cyan-300 border border-white/10"
                    title="Interactive Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(demo.id)}
                    className="rounded-lg bg-black/70 backdrop-blur-md p-1.5 text-slate-400 hover:text-rose-400 border border-white/10"
                    title="Delete Template"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {demo.title}
                </h3>
                <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {demo.description}
                </p>

                {/* Features Bullets */}
                <div className="mt-4 space-y-1.5">
                  {demo.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span className="text-[11px] line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {demo.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewingDemo(demo)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 py-2 px-3 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => handleCopyLink(demo)}
                className="flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 py-2 px-3 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                title="Copy Demo Link"
              >
                {copiedId === demo.id ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedId === demo.id ? 'Copied' : 'Link'}</span>
              </button>

              <button
                onClick={() => onShareDemoOnWhatsApp(demo)}
                className="flex items-center justify-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/15 py-2 px-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-colors"
                title="Send Demo to Client on WhatsApp"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive In-App Demo Preview Modal */}
      {previewingDemo && (
        <Modal
          isOpen={!!previewingDemo}
          onClose={() => setPreviewingDemo(null)}
          title={`Live Demo: ${previewingDemo.title}`}
          subtitle={`${previewingDemo.category} • MOTI Technologies Live Client Preview`}
          maxWidth="5xl"
        >
          <div className="space-y-4">
            {/* Viewport Switcher & External Link */}
            <div className="flex items-center justify-between rounded-xl bg-slate-900 p-2.5 border border-slate-800">
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg">
                <button
                  onClick={() => setPreviewViewport('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    previewViewport === 'desktop'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Desktop View</span>
                </button>
                <button
                  onClick={() => setPreviewViewport('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    previewViewport === 'mobile'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mobile View</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(previewingDemo)}
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-white font-medium"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Demo Link</span>
                </button>
                <button
                  onClick={() => {
                    onShareDemoOnWhatsApp(previewingDemo);
                    setPreviewingDemo(null);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Frame Simulation */}
            <div className="flex justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-hidden min-h-[460px]">
              <div
                className={`transition-all duration-300 bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col ${
                  previewViewport === 'desktop' ? 'w-full h-[520px]' : 'w-[360px] h-[580px] border-4 border-slate-800 rounded-3xl'
                }`}
              >
                {/* Browser address bar simulation */}
                <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-mono text-slate-500 bg-white px-3 py-0.5 rounded border border-slate-200 truncate max-w-xs">
                    🔒 {previewingDemo.demoUrl}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">100% Secure</span>
                </div>

                {/* Simulated Interactive Page Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 text-slate-900 font-sans">
                  {/* Hero */}
                  <div className="text-center py-6 border-b border-slate-200">
                    <span className="inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800">
                      {previewingDemo.category} Demo
                    </span>
                    <h2 className="mt-3 text-2xl font-black text-slate-900 tracking-tight">
                      {previewingDemo.title}
                    </h2>
                    <p className="mt-2 text-xs text-slate-600 max-w-md mx-auto">
                      {previewingDemo.description}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md">
                        Enquire Now / Book
                      </button>
                      <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
                        View Menu & Pricing
                      </button>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="py-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
                      Interactive Features Included
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {previewingDemo.features.map((feat, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-semibold text-slate-800">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Floating CTA simulation */}
                  <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Direct WhatsApp Ordering / Booking</p>
                      <p className="text-[11px] text-emerald-700">Connects leads straight to owner mobile</p>
                    </div>
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                      💬 Chat Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Template Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Demo Website Template"
          subtitle="Expand your agency library with high-converting niche designs"
          maxWidth="2xl"
        >
          <form onSubmit={handleAddTemplate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Template Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Elite Real Estate & Property Brokers"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as BusinessCategory })
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Live Demo URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="https://preview-realestate.moti-templates.live"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cover Image URL (Unsplash / Hosted)
              </label>
              <input
                type="url"
                value={formData.previewImage}
                onChange={(e) => setFormData({ ...formData, previewImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Template Description & Target Audience
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe why this website layout converts visitors and what key sections are included..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Add Key Features
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="e.g. Property Filter, Mortgage Calculator"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (featureInput.trim()) {
                      setFormData({
                        ...formData,
                        features: [...(formData.features || []), featureInput.trim()],
                      });
                      setFeatureInput('');
                    }
                  }}
                  className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  + Add
                </button>
              </div>

              {formData.features && formData.features.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {formData.features.map((feat, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-cyan-950/60 px-2.5 py-1 text-[11px] text-cyan-300 border border-cyan-800/40 flex items-center gap-1"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            features: formData.features?.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-slate-400 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                Save Template
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
