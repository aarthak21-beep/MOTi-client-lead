/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OwnerLockModal } from './components/OwnerLockModal';
import {
  getDemoTemplates,
  getLeads,
  getMessageTemplates,
  getPayments,
  getPricingPlans,
  getProjects,
  getSettings,
  getTasks,
  initializeStorageIfNeeded,
  isOwnerAuthenticated,
  saveLead,
  saveProject,
  saveTask,
  setOwnerAuthenticated,
  subscribeToStorage,
} from './services/storage';
import {
  AgencySettings,
  AgencyTask,
  DemoTemplate,
  Lead,
  MessageTemplate,
  PaymentRecord,
  PricingPlan,
  Project,
  Quotation,
} from './types';
import { getQuotations } from './services/storage';

// Views
import { DashboardView } from './views/DashboardView';
import { LeadsView } from './views/LeadsView';
import { WhatsAppCentreView } from './views/WhatsAppCentreView';
import { QuotationsView } from './views/QuotationsView';
import { DemoLibraryView } from './views/DemoLibraryView';
import { ProjectsView } from './views/ProjectsView';
import { PaymentsView } from './views/PaymentsView';
import { DeliveryView } from './views/DeliveryView';
import { TasksView } from './views/TasksView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { NewspaperProspectsView } from './views/NewspaperProspectsView';
import { WebsiteProspectsView } from './views/WebsiteProspectsView';
import { WebsiteProspectsView } from './views/WebsiteProspectsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [tasks, setTasks] = useState<AgencyTask[]>([]);
  const [demoTemplates, setDemoTemplates] = useState<DemoTemplate[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([]);
  const [settings, setSettings] = useState<AgencySettings>(getSettings());

  // Privacy & Lock Screen state
  const [privacyMode, setPrivacyMode] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Cross-view navigation parameters
  const [preSelectedLeadId, setPreSelectedLeadId] = useState<string | undefined>(undefined);
  const [preSelectedTemplateId, setPreSelectedTemplateId] = useState<string | undefined>(undefined);
  const [preSelectedLeadForQuote, setPreSelectedLeadForQuote] = useState<Lead | null>(null);
  const [preSelectedProjectForPayment, setPreSelectedProjectForPayment] = useState<Project | null>(null);
  const [preSelectedProjectForDelivery, setPreSelectedProjectForDelivery] = useState<Project | null>(null);

  // Initialize and subscribe
  useEffect(() => {
    initializeStorageIfNeeded();

    const reloadData = () => {
      setLeads(getLeads());
      setProjects(getProjects());
      setQuotations(getQuotations());
      setPayments(getPayments());
      setTasks(getTasks());
      setDemoTemplates(getDemoTemplates());
      setPricingPlans(getPricingPlans());
      setMessageTemplates(getMessageTemplates());
      const s = getSettings();
      setSettings(s);
      setPrivacyMode(s.privacyMode || false);

      if (s.pinProtectionEnabled && !isOwnerAuthenticated()) {
        setIsLocked(true);
      }
    };

    reloadData();
    const unsubscribe = subscribeToStorage(reloadData);
    return () => unsubscribe();
  }, []);

  const handleUnlock = () => {
    setOwnerAuthenticated(true);
    setIsLocked(false);
  };

  const handleLockApp = () => {
    setOwnerAuthenticated(false);
    setIsLocked(true);
  };

  const handleTogglePrivacyMode = () => {
    const next = !privacyMode;
    setPrivacyMode(next);
  };

  // Cross-view trigger helpers
  const handleSelectLeadForWhatsApp = (lead: Lead, templateId?: string) => {
    setPreSelectedLeadId(lead.id);
    setPreSelectedTemplateId(templateId || 'intro');
    setActiveTab('whatsapp');
  };

  const handleOpenCreateQuoteForLead = (lead: Lead) => {
    setPreSelectedLeadForQuote(lead);
    setActiveTab('quotations');
  };

  const handleConvertLeadToProject = (lead: Lead) => {
    const today = new Date();
    const deadline = new Date();
    deadline.setDate(today.getDate() + 5);

    const newProject: Project = {
      id: 'proj-' + Date.now(),
      clientName: lead.name,
      clientBusiness: lead.businessName,
      clientPhone: lead.phone,
      clientEmail: lead.email,
      leadId: lead.id,
      projectName: `${lead.businessName} Website`,
      selectedPackage: lead.interestedPlan || 'Business Website',
      startDate: today.toISOString().split('T')[0],
      deadline: deadline.toISOString().split('T')[0],
      stage: 'Discussion',
      progress: 20,
      totalAmount: lead.estimatedBudget || 4999,
      advancePaid: 0,
      remainingAmount: lead.estimatedBudget || 4999,
      notes: `Converted from CRM enquiry on ${today.toISOString().split('T')[0]}.`,
      tasks: [
        { id: 'ct-1', title: 'Collect business logo & requirements', completed: true },
        { id: 'ct-2', title: 'Prepare quotation & receive 50% advance', completed: false },
        { id: 'ct-3', title: 'Design mockup for client review', completed: false },
        { id: 'ct-4', title: 'Development & mobile testing', completed: false },
        { id: 'ct-5', title: 'Final deployment & handover', completed: false },
      ],
      createdAt: today.toISOString().split('T')[0],
      updatedAt: today.toISOString().split('T')[0],
    };

    saveProject(newProject);
    saveLead({ ...lead, status: 'Converted' });
    setActiveTab('projects');
  };

  const handleShareDemoOnWhatsApp = (demo: DemoTemplate) => {
    setPreSelectedTemplateId('demo');
    setActiveTab('whatsapp');
  };

  const handleSendQuoteViaWhatsApp = (quote: Quotation) => {
    setPreSelectedTemplateId('pricing');
    setActiveTab('whatsapp');
  };

  const handleSendPaymentReminderWhatsApp = (project: Project, isAdvance: boolean) => {
    setPreSelectedTemplateId(isAdvance ? 'payment_advance' : 'payment_final');
    setActiveTab('whatsapp');
  };

  const handleSendHandoverMessageWhatsApp = (project: Project) => {
    setPreSelectedTemplateId('handover');
    setActiveTab('whatsapp');
  };

  // Quick Action Dispatcher
  const handleQuickAction = (action: 'lead' | 'quote' | 'whatsapp' | 'project' | 'task') => {
    switch (action) {
      case 'lead':
        setActiveTab('leads');
        break;
      case 'quote':
        setActiveTab('quotations');
        break;
      case 'whatsapp':
        setActiveTab('whatsapp');
        break;
      case 'project':
        setActiveTab('projects');
        break;
      case 'task':
        setActiveTab('tasks');
        break;
    }
  };

  // Calculate overdue counts
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueFollowUps = leads.filter(
    (l) => l.followUpDate && l.followUpDate <= todayStr && l.status !== 'Converted' && l.status !== 'Not Interested'
  ).length;

  const activeProjectsCount = projects.filter((p) => p.stage !== 'Delivered').length;
  const pendingPaymentsCount = projects.filter((p) => (p.remainingAmount || 0) > 0).length;

  return (
    <div className="flex min-h-screen bg-[#080d1a] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Owner PIN Lock Screen */}
      <OwnerLockModal
        isLocked={isLocked}
        onUnlock={handleUnlock}
        correctPin={settings.securityPin || '1234'}
      />

      {/* Sidebar (Desktop sticky & Mobile drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        overdueCount={overdueFollowUps}
        activeProjectsCount={activeProjectsCount}
        pendingPaymentsCount={pendingPaymentsCount}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        {/* Global Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          privacyMode={privacyMode}
          onTogglePrivacyMode={handleTogglePrivacyMode}
          onOpenQuickAction={handleQuickAction}
          overdueCount={overdueFollowUps}
          onLockApp={handleLockApp}
          pinProtectionEnabled={settings.pinProtectionEnabled}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* View Content Body */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              leads={leads}
              projects={projects}
              payments={payments}
              tasks={tasks}
              setActiveTab={setActiveTab}
              onOpenQuickAction={handleQuickAction}
              privacyMode={privacyMode}
              onSelectLeadForWhatsApp={handleSelectLeadForWhatsApp}
            />
          )}

          {activeTab === 'leads' && (
            <LeadsView
              leads={leads}
              privacyMode={privacyMode}
              onSelectLeadForWhatsApp={handleSelectLeadForWhatsApp}
              onOpenCreateQuoteForLead={handleOpenCreateQuoteForLead}
              onConvertLeadToProject={handleConvertLeadToProject}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'newspaper-prospects' && <NewspaperProspectsView />}
          {activeTab === 'website-prospects' && <WebsiteProspectsView />}
          {activeTab === 'website-prospects' && <WebsiteProspectsView />}

          {activeTab === 'whatsapp' && (
            <WhatsAppCentreView
              leads={leads}
              projects={projects}
              demoTemplates={demoTemplates}
              messageTemplates={messageTemplates}
              settings={settings}
              preSelectedLeadId={preSelectedLeadId}
              preSelectedTemplateId={preSelectedTemplateId}
            />
          )}

          {activeTab === 'quotations' && (
            <QuotationsView
              quotations={quotations}
              pricingPlans={pricingPlans}
              leads={leads}
              settings={settings}
              privacyMode={privacyMode}
              onSendQuoteViaWhatsApp={handleSendQuoteViaWhatsApp}
              preSelectedLeadForQuote={preSelectedLeadForQuote}
            />
          )}

          {activeTab === 'demos' && (
            <DemoLibraryView
              demoTemplates={demoTemplates}
              onShareDemoOnWhatsApp={handleShareDemoOnWhatsApp}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              leads={leads}
              pricingPlans={pricingPlans}
              privacyMode={privacyMode}
              onNavigateToDelivery={(p) => {
                setPreSelectedProjectForDelivery(p);
                setActiveTab('delivery');
              }}
              onNavigateToPayment={(p) => {
                setPreSelectedProjectForPayment(p);
                setActiveTab('payments');
              }}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsView
              payments={payments}
              projects={projects}
              settings={settings}
              privacyMode={privacyMode}
              onSendPaymentReminderWhatsApp={handleSendPaymentReminderWhatsApp}
              preSelectedProjectForPayment={preSelectedProjectForPayment}
            />
          )}

          {activeTab === 'delivery' && (
            <DeliveryView
              projects={projects}
              privacyMode={privacyMode}
              onSendHandoverMessageWhatsApp={handleSendHandoverMessageWhatsApp}
              preSelectedProjectForDelivery={preSelectedProjectForDelivery}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              leads={leads}
              projects={projects}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              leads={leads}
              projects={projects}
              payments={payments}
              pricingPlans={pricingPlans}
              privacyMode={privacyMode}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              pricingPlans={pricingPlans}
              messageTemplates={messageTemplates}
            />
          )}
        </main>
      </div>
    </div>
  );
}
