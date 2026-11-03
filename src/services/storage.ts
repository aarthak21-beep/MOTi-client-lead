/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AgencySettings,
  AgencyTask,
  DemoTemplate,
  Lead,
  LeadNote,
  NewspaperProspect,
  MessageTemplate,
  PaymentRecord,
  PricingPlan,
  Project,
  ProjectStage,
  Quotation,
} from '../types';
import {
  DEFAULT_DEMO_TEMPLATES,
  DEFAULT_MESSAGE_TEMPLATES,
  DEFAULT_PRICING_PLANS,
  DEFAULT_SETTINGS,
  INITIAL_LEADS,
  INITIAL_PAYMENTS,
  INITIAL_PROJECTS,
  INITIAL_QUOTATIONS,
  INITIAL_TASKS,
} from './initialData';

const STORAGE_KEYS = {
  LEADS: 'moti_leads_v1',
  PROJECTS: 'moti_projects_v1',
  QUOTATIONS: 'moti_quotations_v1',
  PAYMENTS: 'moti_payments_v1',
  TASKS: 'moti_tasks_v1',
  DEMO_TEMPLATES: 'moti_demo_templates_v1',
  PRICING_PLANS: 'moti_pricing_plans_v1',
  MESSAGE_TEMPLATES: 'moti_msg_templates_v1',
  SETTINGS: 'moti_settings_v1',
  IS_INITIALIZED: 'moti_initialized_v1',
  OWNER_AUTH: 'moti_owner_auth_v1',
  NEWSPAPER_PROSPECTS: 'moti_newspaper_prospects_v1',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error notifying storage listener:', e);
    }
  });
}

export function subscribeToStorage(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Initialize seed data if not present
export function initializeStorageIfNeeded(): void {
  if (typeof window === 'undefined') return;

  const isInitialized = localStorage.getItem(STORAGE_KEYS.IS_INITIALIZED);
  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(INITIAL_QUOTATIONS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEYS.DEMO_TEMPLATES, JSON.stringify(DEFAULT_DEMO_TEMPLATES));
    localStorage.setItem(STORAGE_KEYS.PRICING_PLANS, JSON.stringify(DEFAULT_PRICING_PLANS));
    localStorage.setItem(STORAGE_KEYS.MESSAGE_TEMPLATES, JSON.stringify(DEFAULT_MESSAGE_TEMPLATES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true');
  }
}

// Reset all storage to factory defaults
export function resetStorageToDefaults(): void {
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(INITIAL_QUOTATIONS));
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
  localStorage.setItem(STORAGE_KEYS.DEMO_TEMPLATES, JSON.stringify(DEFAULT_DEMO_TEMPLATES));
  localStorage.setItem(STORAGE_KEYS.PRICING_PLANS, JSON.stringify(DEFAULT_PRICING_PLANS));
  localStorage.setItem(STORAGE_KEYS.MESSAGE_TEMPLATES, JSON.stringify(DEFAULT_MESSAGE_TEMPLATES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true');
  notifyListeners();
}

// LEADS CRUD
export function getLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    return raw ? JSON.parse(raw) : INITIAL_LEADS;
  } catch {
    return INITIAL_LEADS;
  }
}

export function saveLead(lead: Lead): void {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === lead.id);
  if (index >= 0) {
    leads[index] = { ...lead, updatedAt: new Date().toISOString().split('T')[0] };
  } else {
    leads.unshift({
      ...lead,
      createdAt: lead.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
  }
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  notifyListeners();
}

export function deleteLead(id: string): void {
  const leads = getLeads().filter((l) => l.id !== id);
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  notifyListeners();
}

export function addLeadNote(leadId: string, noteText: string, type: 'call' | 'whatsapp' | 'meeting' | 'general' = 'general'): void {
  const leads = getLeads();
  const lead = leads.find((l) => l.id === leadId);
  if (lead) {
    const newNote: LeadNote = {
      id: 'note-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      note: noteText,
      type,
    };
    lead.notesHistory = [newNote, ...(lead.notesHistory || [])];
    lead.updatedAt = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    notifyListeners();
  }
}

// PROJECTS CRUD
export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveProject(project: Project): void {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    projects[index] = { ...project, updatedAt: new Date().toISOString().split('T')[0] };
  } else {
    projects.unshift({
      ...project,
      createdAt: project.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
  }
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  notifyListeners();
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  notifyListeners();
}

export function updateProjectStage(id: string, stage: ProjectStage): void {
  const projects = getProjects();
  const proj = projects.find((p) => p.id === id);
  if (proj) {
    proj.stage = stage;
    // Auto-update progress percentage estimation based on stage
    const stageMap: Record<ProjectStage, number> = {
      Enquiry: 10,
      Discussion: 20,
      'Advance Received': 35,
      Design: 50,
      Development: 75,
      'Client Review': 90,
      'Final Payment': 95,
      Delivered: 100,
    };
    proj.progress = stageMap[stage] ?? proj.progress;
    if (stage === 'Delivered') {
      proj.handoverStatus = 'Delivered';
      proj.deliveryDate = new Date().toISOString().split('T')[0];
    }
    proj.updatedAt = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    notifyListeners();
  }
}

export function updateProjectProgress(id: string, progress: number): void {
  const projects = getProjects();
  const proj = projects.find((p) => p.id === id);
  if (proj) {
    proj.progress = Math.min(100, Math.max(0, progress));
    proj.updatedAt = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    notifyListeners();
  }
}

// QUOTATIONS CRUD
export function getQuotations(): Quotation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return raw ? JSON.parse(raw) : INITIAL_QUOTATIONS;
  } catch {
    return INITIAL_QUOTATIONS;
  }
}

export function saveQuotation(quotation: Quotation): void {
  const quotes = getQuotations();
  const index = quotes.findIndex((q) => q.id === quotation.id);
  if (index >= 0) {
    quotes[index] = quotation;
  } else {
    quotes.unshift(quotation);
  }
  localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotes));
  notifyListeners();
}

export function deleteQuotation(id: string): void {
  const quotes = getQuotations().filter((q) => q.id !== id);
  localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotes));
  notifyListeners();
}

// PAYMENTS CRUD
export function getPayments(): PaymentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return raw ? JSON.parse(raw) : INITIAL_PAYMENTS;
  } catch {
    return INITIAL_PAYMENTS;
  }
}

export function savePayment(payment: PaymentRecord): void {
  const payments = getPayments();
  const index = payments.findIndex((p) => p.id === payment.id);
  if (index >= 0) {
    payments[index] = payment;
  } else {
    payments.unshift(payment);
  }
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

  // Also auto-sync project balances if matching project
  if (payment.projectId) {
    const projects = getProjects();
    const proj = projects.find((p) => p.id === payment.projectId);
    if (proj) {
      if (payment.paymentType === 'Advance') {
        proj.advancePaid = (proj.advancePaid || 0) + payment.amount;
        proj.remainingAmount = Math.max(0, proj.totalAmount - proj.advancePaid);
        if (proj.stage === 'Discussion' || proj.stage === 'Enquiry') {
          proj.stage = 'Advance Received';
        }
      } else if (payment.paymentType === 'Remaining' || payment.paymentType === 'Full') {
        proj.remainingAmount = Math.max(0, proj.remainingAmount - payment.amount);
      }
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
  }

  notifyListeners();
}

export function deletePayment(id: string): void {
  const payments = getPayments().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  notifyListeners();
}

// TASKS CRUD
export function getTasks(): AgencyTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveTask(task: AgencyTask): void {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === task.id);
  if (index >= 0) {
    tasks[index] = task;
  } else {
    tasks.unshift(task);
  }
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  notifyListeners();
}

export function toggleTaskStatus(id: string): void {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    notifyListeners();
  }
}

export function deleteTask(id: string): void {
  const tasks = getTasks().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  notifyListeners();
}

// DEMO TEMPLATES CRUD
export function getDemoTemplates(): DemoTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEMO_TEMPLATES);
    return raw ? JSON.parse(raw) : DEFAULT_DEMO_TEMPLATES;
  } catch {
    return DEFAULT_DEMO_TEMPLATES;
  }
}

export function saveDemoTemplate(template: DemoTemplate): void {
  const templates = getDemoTemplates();
  const index = templates.findIndex((t) => t.id === template.id);
  if (index >= 0) {
    templates[index] = template;
  } else {
    templates.push(template);
  }
  localStorage.setItem(STORAGE_KEYS.DEMO_TEMPLATES, JSON.stringify(templates));
  notifyListeners();
}

export function deleteDemoTemplate(id: string): void {
  const templates = getDemoTemplates().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.DEMO_TEMPLATES, JSON.stringify(templates));
  notifyListeners();
}

// PRICING PLANS
export function getPricingPlans(): PricingPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRICING_PLANS);
    return raw ? JSON.parse(raw) : DEFAULT_PRICING_PLANS;
  } catch {
    return DEFAULT_PRICING_PLANS;
  }
}

export function savePricingPlans(plans: PricingPlan[]): void {
  localStorage.setItem(STORAGE_KEYS.PRICING_PLANS, JSON.stringify(plans));
  notifyListeners();
}

// MESSAGE TEMPLATES
export function getMessageTemplates(): MessageTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGE_TEMPLATES);
    return raw ? JSON.parse(raw) : DEFAULT_MESSAGE_TEMPLATES;
  } catch {
    return DEFAULT_MESSAGE_TEMPLATES;
  }
}

export function saveMessageTemplates(templates: MessageTemplate[]): void {
  localStorage.setItem(STORAGE_KEYS.MESSAGE_TEMPLATES, JSON.stringify(templates));
  notifyListeners();
}

// SETTINGS
export function getSettings(): AgencySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AgencySettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  notifyListeners();
}

// OWNER PIN AUTH
export function isOwnerAuthenticated(): boolean {
  try {
    const authState = sessionStorage.getItem(STORAGE_KEYS.OWNER_AUTH);
    return authState === 'unlocked';
  } catch {
    return false;
  }
}

export function setOwnerAuthenticated(authenticated: boolean): void {
  if (authenticated) {
    sessionStorage.setItem(STORAGE_KEYS.OWNER_AUTH, 'unlocked');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.OWNER_AUTH);
  }
  notifyListeners();
}

// BACKUP & RESTORE
export function exportAllData(): string {
  const data = {
    exportDate: new Date().toISOString(),
    agency: 'MOTI Technologies',
    version: '1.0',
    leads: getLeads(),
    projects: getProjects(),
    quotations: getQuotations(),
    payments: getPayments(),
    tasks: getTasks(),
    demoTemplates: getDemoTemplates(),
    pricingPlans: getPricingPlans(),
    messageTemplates: getMessageTemplates(),
    settings: getSettings(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') return false;

    if (Array.isArray(parsed.leads)) localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(parsed.leads));
    if (Array.isArray(parsed.projects)) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(parsed.projects));
    if (Array.isArray(parsed.quotations)) localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(parsed.quotations));
    if (Array.isArray(parsed.payments)) localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(parsed.payments));
    if (Array.isArray(parsed.tasks)) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(parsed.tasks));
    if (Array.isArray(parsed.demoTemplates)) localStorage.setItem(STORAGE_KEYS.DEMO_TEMPLATES, JSON.stringify(parsed.demoTemplates));
    if (Array.isArray(parsed.pricingPlans)) localStorage.setItem(STORAGE_KEYS.PRICING_PLANS, JSON.stringify(parsed.pricingPlans));
    if (Array.isArray(parsed.messageTemplates)) localStorage.setItem(STORAGE_KEYS.MESSAGE_TEMPLATES, JSON.stringify(parsed.messageTemplates));
    if (parsed.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));

    notifyListeners();
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}


// NEWSPAPER PROSPECTS CRUD
export function getNewspaperProspects(): NewspaperProspect[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NEWSPAPER_PROSPECTS);
    const starterLeads: NewspaperProspect[] = [
      {
        id: 'news-santosh-mumbai-001',
        businessName: 'Santosh Newspaper Suppliers',
        contactName: '',
        businessType: 'Newspaper Vendor',
        whatsapp: '918904010582',
        city: 'Mumbai',
        district: 'Mumbai Suburban',
        state: 'Maharashtra',
        source: 'Justdial — WhatsApp option and public number displayed',
        notes: 'Andheri East. Directory listing shows WhatsApp. Verify the account and business contact before messaging.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ravindra-pune-002',
        businessName: 'Ravindra Newspaper Agency',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '919035122584',
        city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Justdial — WhatsApp option and public number displayed',
        notes: 'Yerawada, Pune. Listing also describes leaflet distribution.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pune-wadgaon-003',
        businessName: 'Newspaper Agency — Wadgaon Sheri',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '919763383678',
        city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'PinkBazaar — WhatsApp and public number displayed',
        notes: 'Shop 09, opposite Moze School, Ganesh Nagar, Wadgaon Sheri. Listing labels service as Newspaper Agency / Newspaper Delivery.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-changes-mumbai-004',
        businessName: 'Changes Advertising',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '918904958725',
        city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Justdial — WhatsApp option and public number displayed',
        notes: 'Santacruz West. Advertising service; newspaper distribution not confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-samartha-palghar-005',
        businessName: 'Samartha Vision Advertising',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '919972329064',
        city: 'Vasai East', district: 'Palghar', state: 'Maharashtra',
        source: 'Justdial — WhatsApp option and public number displayed',
        notes: 'Advertising listing; confirm newspaper-related distribution before pitching circulation CRM.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-harshita-aurangabad-006',
        businessName: 'Harshita Advertisers',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '918460307674',
        city: 'Chhatrapati Sambhajinagar', district: 'Chhatrapati Sambhajinagar', state: 'Maharashtra',
        source: 'Justdial — WhatsApp option and public number displayed',
        notes: 'Newspaper advertising agency listing. Confirm distribution/vendor operations before pitching circulation CRM.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sanjevani-bengaluru-007',
        businessName: 'Sanjevani News Publication Pvt Ltd',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '919980037388',
        city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Justdial — Newspaper Vendors listing; WhatsApp and public number displayed',
        notes: 'Queens Road, Bengaluru. Listing category includes Kannada newspaper vendors and newspaper vendors.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-balamuri-bengaluru-008',
        businessName: 'Balamuri News Agency',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '919980101581',
        city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Justdial — Newspaper Vendors listing; WhatsApp and public number displayed',
        notes: '28th Jayanagar 4th T Block, Bengaluru. Listing category includes newspaper distributors.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-fnpa-hyderabad-009',
        businessName: 'FNPA Pamphlets Insertion & Newspaper Distributors',
        contactName: '',
        businessType: 'Distributor',
        whatsapp: '918197417290',
        city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Justdial — Newspaper Distributors listing; WhatsApp and public number displayed',
        notes: 'Yousufguda, Hyderabad. Directory lists newspaper distribution and pamphlet insertion.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-maanya-delhi-010',
        businessName: 'Maanya News Agency',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '918123706191',
        city: 'New Delhi', district: 'South East Delhi', state: 'Delhi',
        source: 'Justdial — Newspaper Vendors listing; WhatsApp and public number displayed',
        notes: 'Lajpat Nagar 1, Delhi. Listing category includes newspaper distributors.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sai-delhi-011',
        businessName: 'Sai News Agency',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '917795695280',
        city: 'New Delhi', district: 'South East Delhi', state: 'Delhi',
        source: 'Justdial — Newspaper Vendors listing; WhatsApp and public number displayed',
        notes: 'Lajpat Nagar 4, Delhi. Listing appears under newspaper vendor searches; directory categories also include advertising services.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-citypublicity-kolkata-012',
        businessName: 'City Publicity',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '919606225817',
        city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Justdial — Newspaper Inserts listing; WhatsApp and public number displayed',
        notes: 'Lenin Sarani, Kolkata. Newspaper insert service; confirm if they also handle newspaper distribution.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-radhe-jaipur-013',
        businessName: 'Radhe Advertiser',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '917041463097',
        city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Justdial — Newspaper Vendors category; WhatsApp and public number displayed',
        notes: 'Meera Marg, Bani Park, Jaipur. Advertising service listed in newspaper-vendor search; verify newspaper distribution fit.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
    ];
    if (raw) {
      const existing: NewspaperProspect[] = JSON.parse(raw);
      const knownIds = new Set(existing.map((item) => item.id));
      const merged = [...existing, ...starterLeads.filter((item) => !knownIds.has(item.id))];
      if (merged.length !== existing.length) {
        localStorage.setItem(STORAGE_KEYS.NEWSPAPER_PROSPECTS, JSON.stringify(merged));
      }
      return merged;
    }
    localStorage.setItem(STORAGE_KEYS.NEWSPAPER_PROSPECTS, JSON.stringify(starterLeads));
    return starterLeads;
  } catch {
    return [];
  }
}

export function saveNewspaperProspect(prospect: NewspaperProspect): void {
  const prospects = getNewspaperProspects();
  const index = prospects.findIndex((item) => item.id === prospect.id);
  const today = new Date().toISOString().split('T')[0];
  if (index >= 0) {
    prospects[index] = { ...prospect, updatedAt: today };
  } else {
    prospects.unshift({ ...prospect, createdAt: prospect.createdAt || today, updatedAt: today });
  }
  localStorage.setItem(STORAGE_KEYS.NEWSPAPER_PROSPECTS, JSON.stringify(prospects));
  notifyListeners();
}

export function deleteNewspaperProspect(id: string): void {
  const prospects = getNewspaperProspects().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.NEWSPAPER_PROSPECTS, JSON.stringify(prospects));
  notifyListeners();
}
