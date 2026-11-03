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
        id: 'news-delhipress-national-014',
        businessName: 'Delhi Press — Subscription WhatsApp',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '918588843408',
        city: 'New Delhi', district: 'Central Delhi', state: 'Delhi',
        source: 'Delhi Press official contact page — explicitly labelled Mobile/SMS/WhatsApp',
        notes: 'Publisher/subscription contact, not a local newspaper vendor. Official site lists this WhatsApp number and branches across multiple Indian cities. Confirm relevance before CRM demo.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sakal-national-015',
        businessName: 'Sakal Times — Contact / WhatsApp Support',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '919730444669',
        city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Sakal Times contact listing — explicitly labelled Contact/WhatsApp Support',
        notes: 'Newspaper publisher support contact, not confirmed as a distributor/vendor. Verify business fit before pitching MOTi circulation CRM.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-riyo-national-016',
        businessName: 'Riyo Advertising — Newspaper Ad Partner',
        contactName: '',
        businessType: 'Newspaper Agency',
        whatsapp: '919821984000',
        city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Riyo Advertising official website — explicitly labelled WhatsApp',
        notes: 'Newspaper advertising partner with pan-India ad booking; not a newspaper circulation distributor. Could be an advertising agency prospect.',
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
      {
        id: 'news-dangat-mumbai-017', businessName: 'The Dangat Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '912222017494', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Google Maps public business listing', notes: 'Fort, Mumbai. Listed as newspaper distribution service. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pnmuthu-mumbai-018', businessName: 'P. N. Muthu Newspaper', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919867971853', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Google Maps public business listing', notes: 'Chembur East. Listed as newspaper distribution service. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pankaj-delhi-019', businessName: 'Newspaper Service Pankaj', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '918587079978', city: 'New Delhi', district: 'West Delhi', state: 'Delhi',
        source: 'Google Maps public business listing', notes: 'West Patel Nagar. Listed as newspaper distribution/home-delivery service. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-anilphalke-navi-mumbai-020', businessName: 'Anil Phalke Newspaper Stall', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919930321781', city: 'Navi Mumbai', district: 'Thane', state: 'Maharashtra',
        source: 'Google Maps public business listing', notes: 'Seawoods, Sector 48. Newsstand listing. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sandeep-bkc-021', businessName: 'Sandeep Singh Newspaper Vendor', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '918087993380', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Google Maps public business listing', notes: 'BKC, Bandra East. Listed as newspaper distribution service. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ganeshmule-mumbai-022', businessName: 'Ganesh Mule Newspaper Stall', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919967371701', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Google Maps public business listing', notes: 'Kurla East. Listed as neighborhood newspaper stall/vendor. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-vikram-mulund-023', businessName: 'Vikram Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Google Maps public business listing', notes: 'Mulund West. Listing identifies a newspaper distribution agency; phone number not available in returned listing.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shreedatta-pune-024', businessName: 'Shree Datta Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919595222124', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Google Maps public business listing', notes: 'Wakad, Pimpri-Chinchwad. Listed as newspaper distribution service. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mangat-ludhiana-025', businessName: 'Mangat News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919872875489', city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab',
        source: 'Mera Ludhiana public directory', notes: 'Doraha, Ludhiana. Listed under news agencies. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mittal-ludhiana-026', businessName: 'Mittal Communication', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919876944603', city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab',
        source: 'Mera Ludhiana public directory', notes: 'Rajpura Road, Ludhiana. Listed under news agencies. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jaiprakash-delhi-027', businessName: 'Jai Prakash Newspaper & Magazine Supplier', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919313039246', city: 'New Delhi', district: 'South Delhi', state: 'Delhi',
        source: 'Google Maps public business listing; FPBAI listing referenced in business profile', notes: 'Kalkaji/Alaknanda. Newspaper and magazine supply; distributor/stockist. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-indirapuram-distribution-028', businessName: 'Newspaper/Pamphlet Distribution — Indirapuram', contactName: '',
        businessType: 'Distributor', whatsapp: '919250960277', city: 'Ghaziabad', district: 'Ghaziabad', state: 'Uttar Pradesh',
        source: 'Google Maps public business listing', notes: 'Indirapuram, Ghaziabad. Listed as newspaper distribution and pamphlet distribution service. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-flyersin-hyderabad-029', businessName: 'Flyersin — Newspaper Insert & Distribution', contactName: '',
        businessType: 'Distributor', whatsapp: '918801430009', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Google Maps public business listing', notes: 'Yousufguda, Hyderabad. Newspaper insert/flyer distribution company; not a regular newspaper hawker agency. Public phone; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-primebooks-guwahati-030', businessName: 'Prime Books & Periodicals', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919954126701', city: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Panbazar, Guwahati. Listed as Sales Emporium for journals/periodicals; confirm newspaper circulation role.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dipak-shillong-031', businessName: 'M/S Dipak Enterprise', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918794702782', city: 'Shillong', district: 'East Khasi Hills', state: 'Meghalaya',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Listed explicitly as newspaper agency, near R.K. Ashram Mission Dispensary, Shillong.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shyamal-agartala-032', businessName: 'M/S Shyamal Bhattacharjee', contactName: '',
        businessType: 'Distributor', whatsapp: '919436460145', city: 'Agartala', district: 'West Tripura', state: 'Tripura',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Lenin Sarani, Akhaura Road. Listed as books and newspaper supplier.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kumarbook-delhi-033', businessName: 'Kumar Book Centre', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918826403255', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Old Rajender Nagar, Delhi. Listed among agents/sales emporiums; newspaper-specific distribution needs confirmation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-premmagazine-delhi-034', businessName: 'Prem Magazine Distributor', contactName: '',
        businessType: 'Distributor', whatsapp: '919212402505', city: 'New Delhi', district: 'North Delhi', state: 'Delhi',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Naya Bazar, Delhi. Magazine distributor; verify newspaper agency/circulation fit.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rdchawla-delhi-035', businessName: 'R.D. Chawla', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919810045752', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Ansari Road, Darya Ganj. Listed as an agent; confirm newspaper distribution before outreach.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-bright-mumbai-036', businessName: 'Bright News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919870606536', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Opposite CST Station, Fort. Public mobile contact; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ashah-mumbai-037', businessName: 'A. Shah Book House', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919004078746', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Kavasji Patel Street, Fort. Periodicals agent; newspaper circulation fit to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-universal-lucknow-038', businessName: 'Universal Book Sellers', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919839020290', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Hazratganj, Lucknow. Listed as sales emporium; newspaper agency operations to confirm.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-studentscorner-patna-039', businessName: 'Students Corner', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919470641861', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'P.U. Gate, Patna. Listed among agents/sales emporiums; newspaper distribution fit to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-studentsbook-patna-040', businessName: 'Students Book Centre', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919835263598', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'P.U. Road, Patna. Periodicals sales emporium; newspaper distribution fit to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-india-book-patna-041', businessName: 'India Book Centre', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919431022986', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Ashoka Rajpath, Patna. Books/periodicals sales emporium; newspaper role to confirm.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mohanbook-kolkata-043', businessName: 'Mohan Book Supplier', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919830590078', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Deckers Lane, Esplanade East. Periodicals supplier; newspaper circulation role to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-bookmark-chennai-045', businessName: 'Book Mark', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919962486468', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Anna Nagar, Chennai. Books/periodicals agent; newspaper distribution role to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-cheran-coimbatore-046', businessName: 'Cheran Book House', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919488986623', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Big Bazaar Street, Coimbatore. Periodicals listing; newspaper distribution fit to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-anand-hyderabad-047', businessName: 'Anand Agencies', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919246826191', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Publications Division, Government of India — Agents/Journals directory', notes: 'Bagh Lingampally, Hyderabad. Listed among agents/sales emporiums; newspaper role to confirm.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-agarwal-jaipur-050', businessName: 'Agarwal News Paper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919950107143', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Mera Jaipur public newspaper-vendors directory', notes: 'Mayapuri, Jagatpura, Jaipur. Listed under Newspaper Vendors; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-chandraprakash-jaipur-051', businessName: 'Chandra Prakash Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919929589788', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Mera Jaipur public newspaper-vendors directory', notes: 'Chandpole Bazar, Jaipur. Listed under Newspaper Vendors; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sharma-jaipur-052', businessName: 'Sharma News Paper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918387938808', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Mera Jaipur public newspaper-vendors directory', notes: 'Sharma Pustak Bhandar, Watika, Jaipur. Listed under Newspaper Vendors; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dainikprakash-jaipur-053', businessName: 'Dainik Prakash Kunj', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919828237134', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Mera Jaipur public newspaper-vendors directory', notes: 'Mission Compound, Ajmer Road, Jaipur. Listed under Newspaper Vendors; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-todayprint-ludhiana-055', businessName: 'Today News Print', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '917696968959', city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab',
        source: 'Mera Ludhiana public newspaper-vendors directory', notes: 'Siddhu Complex, Yellow Road, Ludhiana. Listed in newspaper-vendor directory; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mani-wadala-056', businessName: 'M.S. Mani Newspaper Vendor Service', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919167550141', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Google Maps public business listing', notes: 'Bhakti Park, Wadala East. Listed as newspaper distribution service; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-siddhivinayak-mahim-057', businessName: 'Shree Siddhivinayak Newspaper & Leaflet Distribution', contactName: '',
        businessType: 'Distributor', whatsapp: '919833173080', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Google Maps public business listing', notes: 'Mahim, Mumbai. Newspaper and leaflet distribution/advertising service; circulation vendor fit to verify; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rafter-borivali-058', businessName: 'Rafter — Newspaper Insert & Pamphlet Distribution', contactName: '',
        businessType: 'Distributor', whatsapp: '919619070553', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Google Maps public business listing', notes: 'Gorai, Borivali West. Newspaper insert/pamphlet distribution provider, not a confirmed daily newspaper vendor; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shiv-jaipur-059', businessName: 'Shiv News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918387901870', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Mera Jaipur public newspaper-vendors directory', notes: 'Agra Road, Green Park, Jaipur. Listed under Newspaper Vendors; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-chetwanijaipur-060', businessName: 'Chetwani Newspaper', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919351462005', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Mera Jaipur public newspaper-vendors directory', notes: 'Malviya Nagar, Jaipur. Listed under Newspaper Vendors; WhatsApp not verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jaipurpatrika-061', businessName: 'Jaipur Patrika', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919829253099', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Mera Jaipur public newspaper-vendors directory', notes: 'Vaishali Nagar, Jaipur. Publisher/listing appears under newspaper vendors; local distribution contact not confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dainiksavera-ludhiana-062', businessName: 'Dainik Savera', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919646500233', city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab',
        source: 'Mera Ludhiana public newspaper-vendors directory', notes: 'Surya Arcade, National Road, Ghumar Mandi, Ludhiana. Newspaper listing; vendor/distribution role to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-gulati-ludhiana-063', businessName: 'Gulati Ad Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919779925100', city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab',
        source: 'Mera Ludhiana public newspaper-vendors directory', notes: 'Shyam Nagar, Ludhiana. Advertising agency listed in newspaper-vendors directory; circulation distribution not confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mehta-thane-064', businessName: 'Mehta Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919821680048', city: 'Thane', district: 'Thane', state: 'Maharashtra',
        source: 'Public business listing', notes: 'Naupada, Thane West. Listed as newspaper agency/stationery shop; newspaper subscription/distribution role indicated; confirm scope.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-bhagwat-pune-065', businessName: 'Bhagwat & Sons Newspaper & Magazine Agent', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '917769985192', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Public business listing', notes: 'Fatima Nagar/Wanowrie. Listed as newspaper and magazine agent; directory category also advertising agency; confirm distribution coverage.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-risingsun-hyderabad-066', businessName: 'Rising Sun News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919666680857', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Public business listing', notes: 'Abids. Listed as news service and magazine store; periodical distribution fit, daily newspaper circulation to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sankalp-nagpur-067', businessName: 'Sankalp Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919423404695', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'Public business listing', notes: 'Ladikar Layout, Ayodhya Nagar. Newspaper distribution service with delivery reviews.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tricel-patna-068', businessName: 'Tricel', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919334207665', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Publications Division — Agents & Journals directory', notes: 'Fraser Road. Listed by Publications Division as an Agents Sales Emporium; newspaper vendor status not independently confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-novelty-patna-069', businessName: 'Novelty & Co.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919835038078', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Publications Division — Agents & Journals directory', notes: 'Ashoka Rajpath. Official directory lists as Agents Sales Emporium; likely books/periodicals, newspaper circulation needs verification.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-prakashbook-patna-070', businessName: 'Prakash Book Depot', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919386253465', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Publications Division — Agents & Journals directory', notes: 'Gandhi Market, Ashoka Rajpath. Listed as sales emporium agent; book/periodical supply rather than confirmed newspaper delivery.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-minakshi-varanasi-071', businessName: 'Minakshi Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919918302131', city: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh',
        source: 'Publications Division — Agents & Journals directory', notes: 'Sainpura, Chetganj. Official directory lists as Headquarter Agent; contact listing shows three adjacent mobile numbers, primary number entered.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-raju-pustak-allahabad-072', businessName: 'M/S Raju Pustak Kendra', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919453460552', city: 'Prayagraj', district: 'Prayagraj', state: 'Uttar Pradesh',
        source: 'Publications Division — Agents & Journals directory', notes: 'Allahpur, Labour Chauraha. Listed as Headquarter Agent; book/newspaper distribution role needs confirmation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-aknayak-bhubaneswar-073', businessName: 'M/S A.K. Nayak', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '', city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha',
        source: 'Publications Division — Agents & Journals directory', notes: 'Bus Stand Book Stall, Old Bus Stand. Magazine & Newspaper Agent; published contacts are landlines 0674-2531702 / 2530810, so mobile/WhatsApp unavailable.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-parash-kolkata-074', businessName: 'Parash Keshri', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919475742578', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Publications Division — Agents & Journals directory', notes: '1, Deckers Lane, Esplanade East. Listed in official Agents Sales Emporium directory; periodical/newspaper agent fit to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-saaidutt-nagpur-075', businessName: 'Saaidutt Distributors', contactName: '',
        businessType: 'Distributor', whatsapp: '', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'Public business listing', notes: 'Sitabuldi Commercial Complex, Ramdaspeth. Listed as newspaper distribution service; only landline 0712-2458518 published, WhatsApp/mobile not available.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ashok-sahu-jabalpur-076', businessName: 'Ashok Kumar Sahu — Newspaper Agent', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919425865222', city: 'Jabalpur', district: 'Jabalpur', state: 'Madhya Pradesh',
        source: 'Publications Division — Agents & Journals directory', notes: '3/4 Satna Building, Jabalpur. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-manoj-patna-077', businessName: 'Manoj News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919905271351', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Sahitya Bhawan public dealer directory', notes: 'Listed in Patna dealer directory as Manoj News Agency; newspaper distribution fit indicated by business name.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mehta-patiala-078', businessName: 'Mehta News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919888254325', city: 'Patiala', district: 'Patiala', state: 'Punjab',
        source: 'Publications Division — Employment News agents list', notes: 'Tiripury Town, Patiala. Explicitly listed as Newspaper Agent; mobile number in published agent list.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-eastern-patna-079', businessName: 'Eastern News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919334115121', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Publications Division — Employment News agents list', notes: 'New Market, Patna. Explicitly listed as Newspaper Agent; mobile number published in agent list.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-durga-guwahati-080', businessName: 'M/S Durga News Agency', contactName: '',
        businessType: 'Distributor', whatsapp: '919435049511', city: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam',
        source: 'Publications Division — Agents & Journals directory', notes: '21, Motilal Nehru Road, Pan Bazar. Explicitly listed as Newspapers Distributor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sandesh-pune-081', businessName: 'Sandesh Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919422008348', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Publications Division — Agents & Journals directory', notes: '658, Narayan Peth, Appa Balwant Chowk. Listed as agent sales emporium; newspaper/periodical distribution scope to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-unique-pune-082', businessName: 'Unique Book Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919221982227', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Publications Division — Agents & Journals directory', notes: 'Shirol Road, opposite Fergusson College. Official agent directory listing; book/periodical supplier, newspaper circulation not confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shivtej-pune-083', businessName: 'Shivtej Book Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919850602149', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Publications Division — Agents & Journals directory', notes: '26, Budhwar Peth, Appa Balwant Chowk. Official agent sales emporium listing; newspaper/periodical fit to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-devshanker-agra-084', businessName: 'Dev Shanker — Newspaper Agent', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919899568421', city: 'Agra', district: 'Agra', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'C/o Prakash News Agency, Kamla Nagar. Listed as Newspaper Agent; same published contact also appears against other Dev Shanker agency locations.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-timeagency-tirupati-085', businessName: 'The Time Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919849116363', city: 'Tirupati', district: 'Tirupati', state: 'Andhra Pradesh',
        source: 'Employment News — published existing agents PDF', notes: '271-A, Nethaji Road. Listed in government agent directory.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mahendra-kanpur-086', businessName: 'Mahendra Kumar Arora — Book Seller & News Agent', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919935535333', city: 'Kanpur', district: 'Kanpur Nagar', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'B-31, Triveni Nagar, Cantt. Explicitly listed as Book Seller & News Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-arora-lucknow-087', businessName: 'Arora News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919335911140', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Janpath Market, Hazratganj. Explicitly listed as Newspaper Agent; landline also published.',
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
