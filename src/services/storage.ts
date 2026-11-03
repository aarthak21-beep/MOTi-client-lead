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
        source: 'Google Maps public business listing', notes: 'Yousufguda, Hyderabad. Newspaper insert/flyer distribution company; not a regular newspaper hawker agency. Public phone; Bharatibiz also lists 08686290009 for Flyersin, likely alternate contact; WhatsApp not verified.',
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
        businessType: 'Newspaper Agency', whatsapp: '919861046179', city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha',
        source: 'Publications Division — Agents & Journals directory', notes: 'Bus Stand Book Stall, Old Bus Stand. Magazine & Newspaper Agent; Employment News PDF also lists mobile contacts 9861046179 / 931012094 / 9861049987; government journal directory lists landlines 0674-2531702 / 2530810.',
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
        businessType: 'Newspaper Vendor', whatsapp: '', city: 'Agra', district: 'Agra', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'C/o Prakash News Agency, Kamla Nagar. Listed as Newspaper Agent; Current Publications Division listing does not publish a mobile number; the older Employment News PDF has a separate New Delhi entry. Phone left blank rather than guessing.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-timeagency-tirupati-085', businessName: 'The Time Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919849116363', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Employment News — published existing agents PDF', notes: '3-6-146/A1, Street No. 17, Himayat Nagar. Listed in Employment News agent PDF; a separate Tirupati listing exists without a phone.',
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
      {
        id: 'news-chaman-kota-088', businessName: 'Chaman Book Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919829036318', city: 'Kota', district: 'Kota', state: 'Rajasthan',
        source: 'Employment News — published existing agents PDF', notes: 'Chaman Hotel Building, Nayapura. Explicitly listed as Newspaper Agent; also book agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-students-gorakhpur-089', businessName: 'Students Corner — Newspaper Agent', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919415210262', city: 'Gorakhpur', district: 'Gorakhpur', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Cinema Road, Golghar. Explicitly listed as Newspaper Agent; separate from Students Corner in Patna.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-murari-patna-090', businessName: 'Murari Prasad — Book Sellers', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919430890211', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Employment News — published existing agents PDF', notes: 'New Market, Patna. Listed in government agent directory as book seller; newspaper supply role not explicit.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-madhab-cuttack-091', businessName: 'Madhab Book Store', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919437026311', city: 'Cuttack', district: 'Cuttack', state: 'Odisha',
        source: 'Employment News — published existing agents PDF', notes: 'Badambadi, Cuttack. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-central-bengaluru-092', businessName: 'Central News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919341968394', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Employment News — published existing agents PDF', notes: 'Basaveshwar Nagar. Listed as Central News Agency in government agent directory; newspaper distribution fit.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-anand-dhanbad-093', businessName: 'Anand Kumar Singh — Newspaper Agent', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919431123219', city: 'Dhanbad', district: 'Dhanbad', state: 'Jharkhand',
        source: 'Employment News — published existing agents PDF', notes: 'VPP Colony, Polytechnic Road. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-motilal-delhi-094', businessName: 'Moti Lal & Sons', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919868090583', city: 'New Delhi', district: 'New Delhi', state: 'Delhi',
        source: 'Employment News — published existing agents PDF', notes: 'Shivaji Stadium, Gate No. 7, near Clock Tower. Listed in government agent directory; newspaper distribution fit to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-telang-bhopal-095', businessName: 'Telang Brothers', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919827058587', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Under Bharat Bridge, near Bharat Talkies. Listed in government agent directory; newspaper agency fit.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-clgupta-haridwar-096', businessName: 'C.L. Gupta & Sons', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919897237811', city: 'Haridwar', district: 'Haridwar', state: 'Uttarakhand',
        source: 'Employment News — published existing agents PDF', notes: 'Devpura Chowk. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-arjunsingh-ludhiana-097', businessName: 'Arjun Singh & Sons', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919815626785', city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab',
        source: 'Employment News — published existing agents PDF', notes: 'Kidwai Nagar. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-naqvi-bareilly-098', businessName: 'Naqvi News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919897235665', city: 'Bareilly', district: 'Bareilly', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Kutub Khana, Ghantaghar. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-prakash-jhansi-099', businessName: 'Prakash News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919415031651', city: 'Jhansi', district: 'Jhansi', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Subhash Market, Sipri Bazar. Listed in government agent directory; newspaper agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-chhajar-bikaner-100', businessName: 'Chhajar News Agencies', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919829218705', city: 'Bikaner', district: 'Bikaner', state: 'Rajasthan',
        source: 'Employment News — published existing agents PDF', notes: 'Joshiwara, inside Kote Gate. Listed in government agent directory as news agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sangam-ajmer-101', businessName: 'Sangam News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918769632183', city: 'Ajmer', district: 'Ajmer', state: 'Rajasthan',
        source: 'Employment News — published existing agents PDF', notes: '70, Kutchery Road. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-keshri-ranchi-102', businessName: 'Keshri Book Depot', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919835163102', city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand',
        source: 'Employment News — published existing agents PDF', notes: 'Government Bus Stand, Station Road. Explicitly listed as Newspaper Agent; two mobile numbers are published, first entered.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-saraswati-hailakandi-103', businessName: 'Saraswati Book Stall', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919435078515', city: 'Hailakandi', district: 'Hailakandi', state: 'Assam',
        source: 'Employment News — published existing agents PDF', notes: 'Kalibari Road. Explicitly listed as Booksellers & Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-centralbook-agartala-104', businessName: 'Central Book House Distributor', contactName: '',
        businessType: 'Distributor', whatsapp: '919436450785', city: 'Agartala', district: 'West Tripura', state: 'Tripura',
        source: 'Employment News — published existing agents PDF', notes: 'Netajee Chowmuhani. Explicitly listed as Newspaper & Magazines distributor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-variety-kohima-105', businessName: 'Variety Book Depot', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919612156813', city: 'Kohima', district: 'Kohima', state: 'Nagaland',
        source: 'Employment News — published existing agents PDF', notes: 'Near NST Bus Stand. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-akdas-tinsukia-106', businessName: 'A.K. Das News Paper & Magazine Agent', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919435134347', city: 'Tinsukia', district: 'Tinsukia', state: 'Assam',
        source: 'Employment News — published existing agents PDF', notes: 'R.G. Road, Tinsukia. Explicitly listed as Newspaper & Magazine Agent; second mobile number also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-aditya-dehradun-107', businessName: 'Aditya News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919412349259', city: 'Dehradun', district: 'Dehradun', state: 'Uttarakhand',
        source: 'Employment News — published existing agents PDF', notes: '30, Paltan Bazar. Listed in government agent directory as news agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-op-udaipur-108', businessName: 'O.P. Book Stall', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919887955068', city: 'Udaipur', district: 'Udaipur', state: 'Rajasthan',
        source: 'Employment News — published existing agents PDF', notes: '15, A Jawahar Nagar. Explicitly listed as Newspaper Agent; second mobile number also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-goyal-malout-109', businessName: 'Goyal News Agencies', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919815963721', city: 'Malout', district: 'Sri Muktsar Sahib', state: 'Punjab',
        source: 'Employment News — published existing agents PDF', notes: 'Malout, PIN 152107. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-prasad-gorakhpur-110', businessName: 'Prasad News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919838883666', city: 'Gorakhpur', district: 'Gorakhpur', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Narayan Complex, Dharamshala Bazar. Listed in government agent directory as news agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-verma-etah-111', businessName: 'Verma News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919837637580', city: 'Etah', district: 'Etah', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Railway Road, Neelam Market. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rai-jhansi-112', businessName: 'Rai News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919889698132', city: 'Jhansi', district: 'Jhansi', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Swagat Book Center, Elite Crossing, Mewati Pura. Listed as Newspaper Agent; second mobile number also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-krishna-sirhind-113', businessName: 'Krishna News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919815033075', city: 'Sirhind', district: 'Fatehgarh Sahib', state: 'Punjab',
        source: 'Employment News — published existing agents PDF', notes: 'Street Bawa Mangal Nath. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ramkumar-bathinda-114', businessName: 'Ram Kumar Agarwal — Newspaper Agent', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919417235192', city: 'Maur Mandi', district: 'Bathinda', state: 'Punjab',
        source: 'Employment News — published existing agents PDF', notes: 'Maur Mandi, Bathinda district. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-deepbook-narsinghpur-115', businessName: 'Deep Book Stall', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919425468464', city: 'Narsinghpur', district: 'Narsinghpur', state: 'Madhya Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Bus Stand, Kandeli. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-versha-satna-116', businessName: 'Versha News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919425841819', city: 'Satna', district: 'Satna', state: 'Madhya Pradesh',
        source: 'Employment News — published existing agents PDF', notes: '41, Martand Complex, near Railway Station. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-anita-rewa-117', businessName: 'Anita Book Stall', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919425874823', city: 'Rewa', district: 'Rewa', state: 'Madhya Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Shop No. 60, Rewanchal Bus Stand. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rameshchander-udaipur-118', businessName: 'Ramesh Chander Manihar — Newspaper Agent', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919001009003', city: 'Deogarh Madaria', district: 'Rajsamand', state: 'Rajasthan',
        source: 'Employment News — published existing agents PDF', notes: 'Deogarh Madaria, Udaipur district as shown in published list. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-verma-thana-bhawan-119', businessName: 'M.S. Verma Book Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919410620039', city: 'Thana Bhawan', district: 'Shamli', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Listed as Newspaper Agent at Thana Bhawan. Contact published under Kapil Verma.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pcjain-imphal-120', businessName: 'P.C. Jain & Co.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919436027526', city: 'Imphal', district: 'Imphal West', state: 'Manipur',
        source: 'Employment News — published existing agents PDF', notes: 'Thangal Bazar, Imphal. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-prakash-leh-121', businessName: 'Prakash Sales Corporation', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919878878880', city: 'Leh', district: 'Leh', state: 'Ladakh',
        source: 'Employment News — published existing agents PDF', notes: 'P.O. Leh. Listed as Newspaper Agent & Stationer.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-patwal-haldwani-122', businessName: 'Patwal News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919690109581', city: 'Haldwani', district: 'Nainital', state: 'Uttarakhand',
        source: 'Employment News — published existing agents PDF', notes: 'Opposite Degree College, Haldwani. Explicitly listed as Newspaper Agent; second mobile number also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ahmad-rampur-123', businessName: 'Ahmad Ali Khan — Newspaper Agent', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919412717926', city: 'Rampur', district: 'Rampur', state: 'Uttar Pradesh',
        source: 'Employment News — published existing agents PDF', notes: 'Shop No. 4, New Market Station Road, Civil Lines. Explicitly listed as Newspaper Agent; second mobile number also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sunrise-aurangabad-124', businessName: 'Sunrise Newspaper & Magazine Distributors', contactName: '',
        businessType: 'Distributor', whatsapp: '919765754143', city: 'Chhatrapati Sambhajinagar', district: 'Chhatrapati Sambhajinagar', state: 'Maharashtra',
        source: 'Employment News — published existing agents PDF', notes: 'Railway Station Bhaji Mandi Road. Explicitly listed as Newspaper & Magazine Distributors.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ramesh-gurdaspur-125', businessName: 'Ramesh Kumar — Newspaper Agent', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919872032357', city: 'Gurdaspur', district: 'Gurdaspur', state: 'Punjab',
        source: 'Employment News — published existing agents PDF', notes: 'Listed as Newspaper Agent in Gurdaspur; contact number published in government agent list.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ideal-trivandrum-126', businessName: 'Ideal Books', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919526014411', city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala',
        source: 'Employment News — published existing agents PDF', notes: '26/2082, Sandhya Tutors Lane, Statue. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-surabhi-thane-127', businessName: 'Surabhi NewsPaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919323873068', city: 'Thane', district: 'Thane', state: 'Maharashtra',
        source: 'Public business listing', notes: 'Shop No. 1, Swastik Park, Kiran Mill Colony, Thane West. Listed as newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-janki-patna-128', businessName: 'Janki Prakashan', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919430246278', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Publications Division — Agents & Journals directory', notes: 'Chauhatta, Patna. Listed as an Agents Sales Emporium; publisher/book distribution contact, newspaper delivery scope to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pitara-bokaro-129', businessName: 'Pitara', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918935829712', city: 'Bokaro Steel City', district: 'Bokaro', state: 'Jharkhand',
        source: 'Publications Division — Agents & Journals directory', notes: 'KB-7, City Centre, Sector 4. Listed as an Agents Sales Emporium; book/periodical supply rather than confirmed daily newspaper circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ksagar-pune-130', businessName: 'K. Sagar House of Books', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918551049955', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Publications Division — Agents & Journals directory', notes: 'Durga Chambers, 39/1, Budhwar Peth, Appa Balwant Chowk. Official agent sales emporium listing; book/periodical distribution fit to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-siddhivinayak-thane-131', businessName: 'Siddhivinayak Book Stall', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919833584839', city: 'Thane', district: 'Thane', state: 'Maharashtra',
        source: 'Publications Division — Agents & Journals directory', notes: 'Near ST Bus Stand, opposite railway station, Thane West. Official agent directory; newspaper/periodical agency fit to verify. Different listing from Shree Siddhivinayak Leaflet Distribution.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hariprasad-bengaluru-132', businessName: 'Hari Prasad Book House', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919731961999', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Publications Division — Agents & Journals directory', notes: '#1156, 1st Main, 3rd Cross, Vijaya Nagar. Official Agents Sales Emporium; book/periodical supply, newspaper circulation to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-subhas-bengaluru-133', businessName: 'Subhas Book Stores', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919945737745', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Publications Division — Agents & Journals directory', notes: 'No. 22/23, Krishna Building, Avenue Road. Official agent directory; book and periodical supply scope to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-artsletters-hyderabad-134', businessName: 'Arts and Letters', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919492922764', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Publications Division — Agents & Journals directory', notes: 'C/o Hyderabad Study Circle, Domalguda. Listed as Agents Sales Emporium; newspaper distribution not independently confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ashokbook-vijayawada-135', businessName: 'Ashok Book Centre', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919849082096', city: 'Vijayawada', district: 'NTR', state: 'Andhra Pradesh',
        source: 'Publications Division — Agents & Journals directory', notes: '59-6-15, opposite Maris Stella College. Official Agents Sales Emporium listing; newspaper/periodical distribution scope to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-indianbook-tirupati-136', businessName: 'Indian Book House', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919392255390', city: 'Tirupati', district: 'Tirupati', state: 'Andhra Pradesh',
        source: 'Publications Division — Agents & Journals directory', notes: '249-A, Prakasam Road. Official Agents Sales Emporium listing; book/periodical supply, newspaper circulation to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-reddy-hyderabad-137', businessName: 'Reddy Book Stall', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919247289302', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Publications Division — Agents & Journals directory', notes: '1-10-247, IAS Study Circle, Ashok Nagar. Official Agents Sales Emporium listing; newspaper supply not confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-timesstationers-hyderabad-138', businessName: 'Times Book Stationers', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919959599444', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Publications Division — Agents & Journals directory', notes: '1-10-233/1/3, Ashok Nagar. Official Agents Sales Emporium listing; newspaper/periodical distribution scope to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mkbooks-trivandrum-139', businessName: 'M.K. Books', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919447324977', city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala',
        source: 'Publications Division — Agents & Journals directory', notes: 'Statue Junction. Official Agents Sales Emporium listing; book/periodical supply, newspaper circulation to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sarvodaya-madurai-140', businessName: 'Sarvodaya Ilakkiya Pannai', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919894642007', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu',
        source: 'Publications Division — Agents & Journals directory', notes: '31/1, West Veli Street. Official Agents Sales Emporium listing; publications/book distribution, newspaper supply not confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-srisiva-madurai-141', businessName: 'Sri Siva Books', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919444816231', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu',
        source: 'Publications Division — Agents & Journals directory', notes: '316/215A, Kamaraj Salai, near Munichalai ICICI Bank. Official Agents Sales Emporium listing; book/periodical supply, newspaper circulation to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-success-chennai-142', businessName: 'Success Book House', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919884912274', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Publications Division — Agents & Journals directory', notes: '12th Main Road, Anna Nagar. Official Agents Sales Emporium listing; published contact includes two consecutive mobile numbers, first entered.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kbp-bengaluru-143', businessName: 'KBP News Paper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919886686101', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Public business listing', notes: 'No. 05, Kousalyamm Nilaya, Pipeline Road, Malleshwaram. Listed as newspaper distribution service and local newspaper agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-suresh-chennai-144', businessName: 'Suresh News Mart', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919710196297', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Public business listing', notes: 'No. 67, 2nd Main Road, Perungudi. Listed for newspaper and magazine distribution, subscriptions and retail.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sairam-bengaluru-145', businessName: 'Sai Ram News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919986939753', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Public business listing', notes: 'Shop 1, Seegehalli Bus Stop, Whitefield-Hoskote Road. Newspaper distribution and home delivery service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-adp-chennai-146', businessName: 'ADP Enterprises', contactName: '',
        businessType: 'Distributor', whatsapp: '919094806563', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Public business listing', notes: 'TNHB Building, Anna Nagar West. Newspaper distribution and pamphlet/leaflet insertion service; advertising-distribution segment, not a daily paper agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pamphlet-bengaluru-147', businessName: 'Pamphlet Distribution & Newspaper Inserts', contactName: '',
        businessType: 'Distributor', whatsapp: '919743224774', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Public business listing', notes: '1st Cross Road, Tavarekere, Bengaluru. Explicitly offers newspaper insertions and pamphlet/flyer distribution; advertising distribution business.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-adslagao-kolkata-148', businessName: 'Ads Lagao Media Solutions', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919073353325', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Public business listing', notes: 'Ahiripukur First Lane, Beck Bagan, Ballygunge. Newspaper advertising/classified booking agency; advertising only, not newspaper circulation vendor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nextgen-kolkata-149', businessName: 'NextGen Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919804715266', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Public business listing', notes: '6, Kiran Shankar Roy Road, B.B.D. Bagh. Newspaper, TV, radio and outdoor advertising agency; ad placement service, not newspaper delivery.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-releaseadnow-kolkata-150', businessName: 'ReleaseAdNow', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '916291130948', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Public business listing', notes: 'Jhowtala Road, Park Circus. Newspaper classified/display ad booking agency; advertising only, not newspaper circulation vendor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mukund-raipur-151', businessName: 'Mukund Parekh News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919827145302', city: 'Raipur', district: 'Raipur', state: 'Chhattisgarh',
        source: 'Public business listing', notes: 'Shop No. 1, Old Bus Stand, near Raj Talkies. Official Employment News agent PDF lists mobile 9827145302 and landlines 0771-2225851 / 4030851; public Maps listing also showed 7712225851. Book/newsstand wholesaler with newspapers and magazines.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kiran-indore-152', businessName: 'Kiran News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Public business listing', notes: 'Sai Market, Patel Bridge, Jawari Bagh Nasiya. Listed as newspaper distribution service; Bharatibiz lists landline 0731-4050553 and website knaeshop.com; no mobile number verified.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-choudhary-indore-153', businessName: 'Choudhary News Agency & Stationery', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919907008623', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Public business listing', notes: 'Shop No. 3, Bus Stand, Ahilyapur, Navlakha. Explicitly listed as newspaper distribution service; also classified/ad-related categories.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nagpur-insertion-154', businessName: 'Nagpur Newspaper Leaflet & Pamphlet Insertion', contactName: '',
        businessType: 'Distributor', whatsapp: '919730803192', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'Public business listing', notes: 'Ajay Nagar, Ambazari Road, Ram Nagar. Explicit newspaper leaflet insertion and pamphlet distribution service; advertising distribution segment.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-maheshwari-raipur-155', businessName: 'Maheshwari News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '', city: 'Raipur', district: 'Raipur', state: 'Chhattisgarh',
        source: 'Maps of India public business directory', notes: 'Satti Bazar, Raipur. Listed under newspaper and magazine suppliers; published contact is landline 0771-2534302, not WhatsApp/mobile.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ankur-ahmedabad-156', businessName: 'Ankur Advertising Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919033876181', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Public business listing', notes: 'Gujarat Samachar Road, Khanpur. Newspaper advertisement/classified booking agency; advertising only, not a newspaper circulation vendor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jyoti-ahmedabad-157', businessName: 'Jyoti Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919173734848', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Public business listing', notes: 'Ajanta Commercial Centre, Ashram Road. Newspaper classified/display ad booking agency; advertising only, not a newspaper circulation vendor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jkstall-mumbai-158', businessName: 'J.K. Newspaper Stall', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919324682322', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Fastbase public newspaper-distribution directory', notes: 'Dharavi Village, Dharavi. Listed under newspaper distribution; local stall/vendor listing.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-vision-nashik-159', businessName: 'Vision News', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '917744923142', city: 'Nashik', district: 'Nashik', state: 'Maharashtra',
        source: 'Fastbase public newspaper-distribution directory', notes: 'Flat No. 5, Bhakti Apartment, Nagji Signal, Wadala Road. Listed under newspaper distribution; exact delivery footprint to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hemant-wagholi-160', businessName: 'Hemant News Paper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919923663834', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Fastbase public newspaper-distribution directory', notes: 'Wagholi/Charholi Budruk area. Newspaper agency listing with published mobile and website hnewspa.com.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-prabhat-raipur-161', businessName: 'Prabhat News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919926135825', city: 'Raipur', district: 'Raipur', state: 'Chhattisgarh',
        source: 'Fastbase public newspaper-distribution directory', notes: 'Mana Camp area; directory city field was blank, location mapped to Raipur from Mana Camp locality. Confirm exact address before outreach.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kamal-pune-162', businessName: 'Kamal Newspapers', contactName: '',
        businessType: 'Distributor', whatsapp: '919035078245', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Justdial public listing — pamphlet insertion services', notes: 'Pune. Justdial-verified listing with 30 years in business; pamphlet distributor and advertising agency, insertion campaigns.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-bappa-pune-163', businessName: 'Bappa Advertising Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919972255004', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Justdial public listing — pamphlet insertion services', notes: 'Pune. Listed as advertising agency and newspaper advertising agency; ad booking/service, not confirmed circulation vendor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-bhise-pune-164', businessName: 'The Bhise Advertising', contactName: '',
        businessType: 'Distributor', whatsapp: '919972815944', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Justdial public listing — pamphlet insertion services', notes: 'Pune. Listed under newspaper vendors and pamphlet distributors; newspaper leaflet distribution/insertion segment.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dainikbhaskar-indore-165', businessName: 'Dainik Bhaskar Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919926525700', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Bharatibiz public business listing', notes: '13, Mahu Naka Road, Swastik Nagar, Chhatribagh. Explicitly listed as newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-andhrajyothi-hyderabad-166', businessName: 'Andhra Jyothi Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919848518004', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Bharatibiz public business listing', notes: '10-3-12/1, Royal Colony, Humayun Nagar. Explicitly listed as newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jkm-delhi-167', businessName: 'JKM Pamphlet Distribution', contactName: '',
        businessType: 'Distributor', whatsapp: '918105736395', city: 'New Delhi', district: 'South East Delhi', state: 'Delhi',
        source: 'Justdial public listing — newspaper vendors', notes: 'Car Market, Lajpat Nagar. Justdial-verified pamphlet insertion service and advertising agency; insertion/distribution segment, not newspaper circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mitansh-delhi-168', businessName: 'Mitansh News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918123573199', city: 'New Delhi', district: 'South Delhi', state: 'Delhi',
        source: 'Justdial public listing — newspaper vendors', notes: 'Nanak Chand Basti, Kotla Mubarakpur. Listed as pamphlet distributor and newspaper advertising agency; verify whether it also handles newspaper circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dolphin-pune-169', businessName: 'Dolphin Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919011722323', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Official business website — Dolphin Advertising', notes: '541 Sadashiv Peth, Jondhale Chowk. Newspaper advertising specialists and official partner of leading dailies; ad booking only, not newspaper circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shubindia-pune-170', businessName: 'Shubindia Ad Works', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919850219850', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Official business website — Shubindia Ad Works', notes: 'Shop No. 66, Vastushree Complex, Market Yard. Website publishes a dedicated mobile contact for newspaper ads; advertising only, not newspaper circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nagpuragency-nagpur-171', businessName: 'Nagpur News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919881308009', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'Employment News — official existing agents PDF', notes: 'Kakde Bhawan, Hanuman Gali, Sita Buldi. Explicitly listed as Newspaper Agent; additional mobile 9811077111 and landline 0712-2527695 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sridevi-chennai-172', businessName: 'Sridevi News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919790836909', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Employment News — official existing agents PDF', notes: 'No. 85/102, Raghavan Street, Perambur. Listed as an existing Employment News agent; newspaper agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kkpuri-kolkata-173', businessName: 'K.K. Puri News Distributors', contactName: '',
        businessType: 'Distributor', whatsapp: '919831012084', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Employment News — official existing agents PDF', notes: '9, Dacres Lane, Ground Floor, Flat 2. Listed as News Distributors Pvt. Ltd.; second mobile 9903012084 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mehta-amritsar-174', businessName: 'Mehta News Agency — Amritsar', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919888384103', city: 'Amritsar', district: 'Amritsar', state: 'Punjab',
        source: 'Employment News — official existing agents PDF', notes: 'Pt. Beli Ram and Sons Hall, Gate, near Jain Homeopathic, Ravidass Mandir. Separate Amritsar agent entry; additional published mobiles 9813676627 and 9518215751.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ebs-chandigarh-175', businessName: 'E.B.S. News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919814110136', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Employment News — official existing agents PDF', notes: 'SCO 33, Sector 21-C, Chandigarh. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sujit-kohima-176', businessName: 'Sujit Bhattacharjee News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919774699147', city: 'Kohima', district: 'Kohima', state: 'Nagaland',
        source: 'Employment News — official existing agents PDF', notes: 'Agency listing covers Kohima, Dimapur and Medziphema, Nagaland. Listed as existing Employment News agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rathis-jodhpur-177', businessName: 'Rathis Media Centre', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919829023580', city: 'Jodhpur', district: 'Jodhpur', state: 'Rajasthan',
        source: 'Employment News — official existing agents PDF', notes: 'Rathi Bhawan, Over Bridge, Mohan Pura. Listed in existing agents PDF; media/book/periodical supply fit, daily newspaper distribution to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pathak-nashik-178', businessName: 'Pathak Brothers', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918446660684', city: 'Nashik', district: 'Nashik', state: 'Maharashtra',
        source: 'Employment News — official existing agents PDF', notes: 'Plot No. 15, Shreeniwas Basement, Sahakar Nagar, Ganjmal. Listed as an existing Employment News agent; newspaper agency fit.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pawan-najibabad-179', businessName: 'Pawan Kumar Jain — Newspaper Agent', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919837555565', city: 'Najibabad', district: 'Bijnor', state: 'Uttar Pradesh',
        source: 'Employment News — official existing agents PDF', notes: 'Mohalla Shamli, Najibabad. Explicitly listed as Newspaper Agent; landline 01341-222028 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shiela-jammu-180', businessName: 'Shiela Book Center', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919419146803', city: 'Jammu', district: 'Jammu', state: 'Jammu and Kashmir',
        source: 'Employment News — official existing agents PDF', notes: 'Kachi Chowni, Jammu. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rajeshmanish-jaipur-181', businessName: 'Rajesh Manish Agencies', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919461070071', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Employment News — official existing agents PDF', notes: 'G-3B, Mayur Tower, Nehru Bazar. Listed as existing Employment News agent; newspaper distribution role to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-chhabra-sonipat-182', businessName: 'Chhabra News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919253199131', city: 'Sonipat', district: 'Sonipat', state: 'Haryana',
        source: 'Employment News — official existing agents PDF', notes: 'Fajha Bazar, Sonipat. Listed as existing Employment News agent; landline numbers 0130-2241578 / 2250170 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-geeta-mukteshwar-183', businessName: 'Geeta News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919690566512', city: 'Mukteshwar', district: 'Nainital', state: 'Uttarakhand',
        source: 'Employment News — official existing agents PDF', notes: 'Mukteshwar, Kumaon, Nainital district. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sharma-yamunanagar-184', businessName: 'Sharma News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919896923242', city: 'Yamunanagar', district: 'Yamunanagar', state: 'Haryana',
        source: 'Employment News — official existing agents PDF', notes: 'House No. 110, Jawahar Nagar, Jagadhari. Listed as existing Employment News agent; newspaper agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-katare-sagar-185', businessName: 'Katare Book Depot', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918109251910', city: 'Deori Kalan', district: 'Sagar', state: 'Madhya Pradesh',
        source: 'Employment News — official existing agents PDF', notes: 'Main Road, Deori Kalan, Sagar district. Explicitly listed as Newspaper Agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hema-portblair-186', businessName: 'Hema News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919476002726', city: 'Port Blair', district: 'South Andaman', state: 'Andaman and Nicobar Islands',
        source: 'Employment News — official existing agents PDF', notes: 'Near Islander Inn Hotel, Phongy Chaung, Port Blair. Listed as existing Employment News agent.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-brijesh-meerut-187', businessName: 'Brijesh Gupta & Sons', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919720500422', city: 'Meerut', district: 'Meerut', state: 'Uttar Pradesh',
        source: 'Employment News — official existing agents PDF', notes: '209, Arya Nagar, Suraj Kund Road, Meerut. Listed as existing agent; book/periodical supply role, newspaper circulation fit to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-wadhwa-rewari-188', businessName: 'Wadhwa News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919416302430', city: 'Rewari', district: 'Rewari', state: 'Haryana',
        source: 'Employment News — official existing agents PDF', notes: 'G-53, Kamla Palace, near Dharuhera Chowk. Listed as News Agency in existing agent directory.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-swamy-trivandrum-189', businessName: 'Swamy Book Centre', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919497006656', city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala',
        source: 'Employment News — official existing agents PDF', notes: 'Opposite Ayurveda College, Dharmalayam Road. Listed in existing agent directory; book/periodical distribution, newspaper agency fit to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-manmohan-yamunanagar-190', businessName: 'Manmohan Pustak Bhandar', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919416493282', city: 'Radaur', district: 'Yamunanagar', state: 'Haryana',
        source: 'Employment News — official existing agents PDF', notes: 'Near Post Office, Main Bazar, Radaur. Listed in existing agent directory; book seller/periodical supplier, newspaper circulation fit to verify. Alternate mobile 9255481949 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-national-dehradun-191', businessName: 'National News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919837638773', city: 'Dehradun', district: 'Dehradun', state: 'Uttarakhand',
        source: 'Employment News — official existing agents PDF', notes: 'Paltan Bazar, Dehradun. Explicitly listed as Newspaper Agent; landline 0135-2716161 / 2717280 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagdishpatel-ahmedabad-192', businessName: 'Jagdish I. Patel — Liberty Agencies', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919727752019', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Employment News — official existing agents PDF', notes: 'C/o Liberty Agencies, Ravi Estate, Dudheshwar Road. Listed as an existing Employment News agent; published mobile alternatives 9825060848 and 9825108673.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sarvodaya-jodhpur-193', businessName: 'Sarvodaya Book Stall', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919414877100', city: 'Jodhpur', district: 'Jodhpur', state: 'Rajasthan',
        source: 'Employment News — official existing agents PDF', notes: '70, Jaswant Building, Station Road. Explicitly listed as Newspaper Agent; other mobiles 81075891417, 9829781548 and 9314985001 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-delhimagazines-delhi-194', businessName: 'Delhi Magazines Distributors Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '919871199263', city: 'New Delhi', district: 'New Delhi', state: 'Delhi',
        source: 'Employment News — official existing agents PDF', notes: '110, Bangla Sahib Marg, near Gole Market. Listed as magazine distributor; periodical distribution segment, newspaper circulation not confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rina-portblair-195', businessName: 'Rina Services', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919434293672', city: 'Port Blair', district: 'South Andaman', state: 'Andaman and Nicobar Islands',
        source: 'Employment News — official existing agents PDF', notes: '35, M.G. Road, Middle Point, Port Blair. Listed as existing Employment News agent; newspaper/periodical agency role is not explicit in the PDF, so confirm business fit. Additional mobile 8900906585 and landline 03192-238009 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-paperdistributor-bengaluru-196', businessName: 'News Paper & Magazine Distributor', contactName: '',
        businessType: 'Distributor', whatsapp: '919980548315', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Bharatibiz public business listing', notes: '41, 23rd Cross, 3rd Main Road, Banashankari 3rd Stage. Explicitly listed as newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dewan-jhansi-197', businessName: 'Dewan Books & News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919453908349', city: 'Jhansi', district: 'Jhansi', state: 'Uttar Pradesh',
        source: 'Bharatibiz public business listing', notes: 'Sadar Bazar, Cantt, Jhansi. Listed as book store/newsstand and news agency; delivery option is mentioned. Other directories show alternate contacts, so confirm the active number.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-spoorthi-bengaluru-198', businessName: 'Spoorthi News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919886075919', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Bharatibiz public business listing', notes: '5, Sri Venkateshwara Nilayam, 7th B Cross, Kaveri Nagar, R.T. Nagar. Explicitly listed as newspaper distribution service and advertising service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sagar-bengaluru-199', businessName: 'Sagar Newspaper And Pamphlet Agency', contactName: '',
        businessType: 'Distributor', whatsapp: '918147135076', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Bharatibiz public business listing', notes: '503-621, 80 Feet Road, Hosakerehalli Layout, Banashankari 3rd Stage. Explicitly listed as newspaper distribution and advertising service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-bhiwani-distribution-200', businessName: 'Newspaper Distribution Agencies', contactName: '',
        businessType: 'Distributor', whatsapp: '919991771273', city: 'Bhiwani', district: 'Bhiwani', state: 'Haryana',
        source: 'Bharatibiz public business listing', notes: 'Bus Stand, near Civil Police Station, Old Bhiwani. Explicitly listed as newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-balaji-kashipur-201', businessName: 'Balaji Hindustan News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919927026108', city: 'Kashipur', district: 'Udham Singh Nagar', state: 'Uttarakhand',
        source: 'Bharatibiz public business listing', notes: 'Kashipur, Uttarakhand 244713. Explicitly listed as newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hanuman-pune-202', businessName: 'Hanuman Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919922344535', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Bharatibiz public business listing', notes: 'Near Tambole Kirana Shop, Hanuman Temple, Gaonthan, Chikhali. Listed as newspaper publisher; daily morning newspaper service category to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagdish-mumbai-203', businessName: 'Jagdish Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919594756773', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Bharatibiz public business listing', notes: 'Jawahar Nehru Road, near Vakola Masjid and New Model High School, Santacruz East. Listed as newspaper agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-aagaz-varanasi-204', businessName: 'Aagaz India News', contactName: '',
        businessType: 'Distributor', whatsapp: '918112333133', city: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh',
        source: 'Bharatibiz public business listing', notes: 'N10/72 E4, New Colony Kakarmatta, Sundarpur, Nagwa. Listed as newspaper distribution service, publisher, newsstand and magazine store.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sindhudurg-kankavli-205', businessName: 'Sindhudurg Today', contactName: '',
        businessType: 'Distributor', whatsapp: '919420276093', city: 'Kankavli', district: 'Sindhudurg', state: 'Maharashtra',
        source: 'Bharatibiz public business listing', notes: '11, Laxmi Complex, near Daily Pudhari, opposite ST Stand. Listed as newspaper publisher and newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nishpaksh-barabanki-206', businessName: 'Nishpaksh Jan Avlokan', contactName: '',
        businessType: 'Distributor', whatsapp: '917080909054', city: 'Barabanki', district: 'Barabanki', state: 'Uttar Pradesh',
        source: 'Bharatibiz public business listing', notes: 'AN/703, Azad Nagar, Barabanki. Listed as newspaper publisher, newsstand and newspaper distribution service; additional mobile 8127779290 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-bhagwan-bahadurgarh-207', businessName: 'Bhagwan News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919541221222', city: 'Bahadurgarh', district: 'Jhajjar', state: 'Haryana',
        source: 'Bharatibiz public business listing', notes: 'National Highway 9, near Civil Police Station/Railway Station Road, Chhotu Ram Market. Explicitly listed as newspaper distribution service; alternate mobile 9416390706 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sanjay-sardarshahar-208', businessName: 'Sanjay News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919983991493', city: 'Sardarshahar', district: 'Churu', state: 'Rajasthan',
        source: 'Bharatibiz public business listing', notes: 'Kissan Hostel, near Ram Mandir, Janhit Pranyas Colony. Listed as magazine store and newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shreeji-tharad-209', businessName: 'Shreeji News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919408545835', city: 'Tharad', district: 'Banaskantha', state: 'Gujarat',
        source: 'Bharatibiz public business listing', notes: 'Highway Road, near Bus Station, Bhaktinagar, Tharad. Explicitly listed as newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-azad-rishikesh-210', businessName: 'Azad News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919837229222', city: 'Rishikesh', district: 'Dehradun', state: 'Uttarakhand',
        source: 'Bharatibiz public business listing', notes: '24, Haridwar Road, Manvendera Nagar, Rishikesh. Explicitly listed as newspaper distribution service; alternate mobile 8191012982 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },

      {
        id: 'news-dainikbharatpur-212', businessName: 'Dainik Bhaskar — Bharatpur Office', contactName: '',
        businessType: 'Distributor', whatsapp: '', city: 'Bharatpur', district: 'Bharatpur', state: 'Rajasthan',
        source: 'Bharatibiz public business listing', notes: 'D.R. Industries Campus, Ekta Vihar Colony, Sonkh Road. Listed as newspaper publisher and newspaper distribution service; published contact is landline 05644-236084.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-lokmat-jalgaon-213', businessName: 'Lokmat — Jalgaon', contactName: '',
        businessType: 'Distributor', whatsapp: '', city: 'Jalgaon', district: 'Jalgaon', state: 'Maharashtra',
        source: 'Bharatibiz public business listing', notes: '87, Bank Street, Navi Peth, Jaikisan Wadi. Listed as newspaper publisher and newspaper distribution service; published contact is landline 0257-2236022.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-raghu-hyderabad-214', businessName: 'Raghu Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918801720706', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'PinkBazaar public newspaper-delivery listing', notes: 'Lingampally Road, Bapu Nagar, Nallagandla. Listed as newspaper delivery service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-prajapati-lucknow-215', businessName: 'Prajapati Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919936509614', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh',
        source: 'Public business listing', notes: '4/125, Sector 4, Vikas Nagar. Listed as newspaper distribution service; customer reviews indicate local delivery.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ali-pamphlets-hyderabad-216', businessName: 'Ali Pamphlets Insertion & Newspaper', contactName: '',
        businessType: 'Distributor', whatsapp: '917386632938', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Public business listing', notes: 'LIG-65/1, Road No. 2, KPHB Phase 1, Kukatpally. Advertising agency focused on pamphlet insertion and newspaper distribution campaigns.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-laxmi-jaipur-217', businessName: 'Laxmi News Paper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '917014352962', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Public business listing', notes: 'Jyoti Vihar, Plot No. 16, Mansarovar/Manyawas area. Listed as newspaper distribution service and classified ad publisher.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shukla-lucknow-218', businessName: 'Shukla News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918299285945', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh',
        source: 'Public business listing', notes: 'IT Buildings, behind Hanumanji Temple, Hazratganj. Listed as wholesaler and newspaper distribution/counter-sales hub.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kings-hyderabad-219', businessName: 'Kings Pamphlet Distribution', contactName: '',
        businessType: 'Distributor', whatsapp: '919849457821', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Public business listing', notes: '23/5, Bus Stand, Nayapul, Afzal Gunj. Listed as newspaper distribution service; primary service is pamphlet/leaflet distribution.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-localpaper-chennai-220', businessName: 'Local Newspaper — Chennai', contactName: '',
        businessType: 'Distributor', whatsapp: '918428182676', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Public business listing', notes: '25, Vellala Street, Kodambakkam, Vadapalani. Local newspaper publisher/news service with free weekly circulation and advertising services.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-db-advertising-jaipur-221', businessName: 'Dainik Bhaskar Advertising Office — Jaipur', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919024227354', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Public business listing', notes: 'Niwaru Road, Nangal Jaisabohra. Newspaper classified/display advertising office; advertising service, not a circulation vendor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ads2publish-hyderabad-222', businessName: 'Ads2Publish', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918121003003', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Official Ads2Publish website', notes: 'Ahuja Estate, Abids. Official newspaper advertisement booking agency with partner offices across India; ad booking/placement, not circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-bhavesads-hyderabad-223', businessName: 'Bhaves Advertisers', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918121004004', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Official Bhaves Advertisers website', notes: 'Ahuja Estate, Abids. Newspaper advertising agency; mobile contact published for ad booking, not newspaper circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-suryaa-hyderabad-224', businessName: 'SPR Publications — Suryaa News', contactName: '',
        businessType: 'Distributor', whatsapp: '919603461234', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Official Suryaa Epaper contact page', notes: 'Plot No. 164, Siddhivinayak Nagar, Madhapur. Newspaper publisher; business enquiries contact. Newsroom phone 8919840785 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-arekay-chennai-225', businessName: 'Are Kay Books Distributors / R.K. News Agency', contactName: '',
        businessType: 'Distributor', whatsapp: '', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Official R.K. News Agency website', notes: 'No. 20, Narayana Dasari Street, Egmore, near Aradhana Hotel. Website identifies it as newspaper and magazine distributor; published telephone is landline 044-45552477.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-newsband-vashi-226', businessName: 'Newsband', contactName: '',
        businessType: 'Distributor', whatsapp: '919967520006', city: 'Navi Mumbai', district: 'Thane', state: 'Maharashtra',
        source: 'PinkBazaar public newspaper-delivery listing', notes: '1314, near Inorbit Mall, Sector 30A, Vashi. Newspaper publisher and local newspaper-delivery listing; confirm distribution/agency contact.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-punyanagari-nagpur-227', businessName: 'Punya Nagari', contactName: '',
        businessType: 'Distributor', whatsapp: '', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'Jupiter Yellow Pages / AskLaila public directory', notes: '5, Sundarlal Rai Path, VIP Road, Ramdaspeth. Listed as Newspaper Agency with home delivery available; published contact is landline 0712-2567418.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hitavada-nagpur-228', businessName: 'The Hitavada — Nagpur', contactName: '',
        businessType: 'Distributor', whatsapp: '', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'PinkBazaar public newspaper-delivery listing', notes: 'Wardha Road, near Gorakshan Temple, Dhantoli. Newspaper publisher with newspaper-delivery listing; published contact is landline 0712-2423155.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dainikprabhat-pune-229', businessName: 'Dainik Prabhat — Pune', contactName: '',
        businessType: 'Distributor', whatsapp: '917738641365', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'PinkBazaar public newspaper-delivery listing', notes: '303/304, Narayan Peth. Newspaper publisher and newspaper-delivery listing; official website also publishes head-office landlines 020-24455631 / 24456626.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-navakal-mumbai-230', businessName: 'Navakal', contactName: '',
        businessType: 'Distributor', whatsapp: '02223880981', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'PinkBazaar public newspaper-delivery listing', notes: '13, Navakal Path, off Khadilkar Road, Charni Road East, Girgaon. Newspaper publisher/delivery listing; published contact is landline 022-2388-0981, not WhatsApp.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-deshonnati-nagpur-231', businessName: 'Deshonnati — Nagpur', contactName: '',
        businessType: 'Distributor', whatsapp: '07122462481', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'PinkBazaar public newspaper-delivery listing', notes: 'W Park Road, opposite Yashwant Stadium, Dhantoli. Newspaper publisher/delivery listing; published contact is landline 0712-2462481, not WhatsApp.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sakal-nagpur-232', businessName: 'Sakal Media Pvt. Ltd. — Nagpur', contactName: '',
        businessType: 'Distributor', whatsapp: '07122428052', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'PinkBazaar public newspaper-delivery listing', notes: 'Wardha House, 274/1, Central Bazar Road, New Ramdaspeth. Newspaper publisher/delivery listing; published contact is landline 0712-2428052, not WhatsApp.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-group5-lucknow-233', businessName: 'Group 5 Samachar', contactName: '',
        businessType: 'Distributor', whatsapp: '05222206872', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh',
        source: 'Public business listing', notes: '55-B, Wazir Hasan Road, Gokhale Vihar, Butler Colony. News service/newspaper with local distribution and insert services; published contact is landline 0522-2206872, not WhatsApp.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ojas-chandigarh-234', businessName: 'OJAS News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919779855800', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Public business listing', notes: 'Near Government Model School, Sector 16A. Explicitly listed as newspaper distribution and home-delivery service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-walia-zirakpur-235', businessName: 'Walia Newspapers Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '917814437595', city: 'Zirakpur', district: 'SAS Nagar', state: 'Punjab',
        source: 'Public business listing', notes: 'MC Office Road, Panchsheel Enclave, Zirakpur. Newspaper distribution service; listings also mention pamphlet services.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ram-bhopal-236', businessName: 'Ram Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918518069139', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Public business listing', notes: 'HN-67, Regal Kasturi Phase 2 Road, Regal Town, Awadhpuri. Explicitly listed as newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-choudhary-gwalior-237', businessName: 'Choudhary Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919993428029', city: 'Gwalior', district: 'Gwalior', state: 'Madhya Pradesh',
        source: 'Public business listing', notes: 'Shop No. 2, Narsingh Ward, near Vidhya Bhawan School, Lalitpur Colony, Lashkar. Explicitly listed as newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-gaurav-kolkata-238', businessName: 'Gaurav Enterprise — Newspaper Insertion', contactName: '',
        businessType: 'Distributor', whatsapp: '919163635553', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Public business listing', notes: '41, Lenin Sarani Road, Esplanade, Taltala. Advertising agency focused on newspaper pamphlet/leaflet insertion and distribution campaigns.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-swadeshjyoti-bhopal-239', businessName: 'Swadesh Jyoti', contactName: '',
        businessType: 'Distributor', whatsapp: '917554026506', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Public business listing', notes: '26-A, Indira Press Complex, Zone I, MP Nagar. Local Hindi newspaper publisher/media house with newspaper distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-expressmedia-bhopal-240', businessName: 'Express Media Service', contactName: '',
        businessType: 'Distributor', whatsapp: '919229226532', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Public business listing', notes: 'Commercial Chittod Complex, 7, Zone I, MP Nagar. Newspaper publisher/media service associated with Express News and Jabalpur Express.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jailakshmi-noida-241', businessName: 'Jai Lakshmi Advertisers', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919810707457', city: 'Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh',
        source: 'Public business listing', notes: 'First Floor, Kaushik Tower, Sector 51. Advertising agency with newspaper advertising, publishing and newspaper distribution categories; verify circulation role.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-suresh-dadri-242', businessName: 'Suresh News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919350190110', city: 'Dadri', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh',
        source: 'Grotal public newspaper-distributor directory', notes: 'Aggarsain Bazar, Dadri, Greater Noida. Listed under Hindustan, Times of India, Hindustan Times and Dainik Jagran newspaper distributors.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shivam-greaternoida-243', businessName: 'Shivam News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919310045777', city: 'Greater Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh',
        source: 'AskLaila public newspaper-distributor directory', notes: 'Greater Noida. Listed as Newspaper Agency; landline 0120-4294776 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jyoti-greaternoida-244', businessName: 'Jyoti News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919818044203', city: 'Greater Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh',
        source: 'AskLaila public newspaper-distributor directory', notes: 'Greater Noida. Listed as Newspaper Agency; landline 0120-2326528 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rashtriya-noida-245', businessName: 'Rashtriya Hindi Samachar Patra', contactName: '',
        businessType: 'Distributor', whatsapp: '919810967541', city: 'Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh',
        source: 'AskLaila public newspaper-distributor directory', notes: 'Sector 11, Noida. Listed under Newspaper Agency; landline 0120-4226541 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagrukta-chandigarh-246', businessName: 'Jagrukta News Paper', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919988814680', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Grotal public newspaper-distributor directory', notes: '2542, Mariwala Town, Manimajra. Listed as Newspaper Agency and Newspaper Distributor; alternate published contact 6283624033.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-vijaychand-chandigarh-247', businessName: 'Vijay Chand — Newspaper Distributor', contactName: '',
        businessType: 'Distributor', whatsapp: '919815471521', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Grotal public newspaper-distributor directory', notes: 'House No. 1448, Mauli Complex, Manimajra. Listed for newspaper home delivery and magazine home delivery.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-panchkula-chandigarh-248', businessName: 'Panchkula Samachar', contactName: '',
        businessType: 'Distributor', whatsapp: '919417600117', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Grotal public newspaper directory', notes: 'SCO 58-59, Cabin 117, First Floor, Sector 17-D, Chandigarh. Listed as newspaper business; publisher/distribution contact.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-prabhat-ahmedabad-249', businessName: 'Prabhat News Papers Services', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919879191019', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Grotal public newspaper-advertising directory', notes: 'Prabhat House, JP Complex, near Old Police Station, Naroda Main Bazaar. Newspaper advertisement services; advertising agency rather than confirmed circulation distributor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hindusthan-bhopal-250', businessName: 'Hindusthan Samachar — Bhopal', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919425601264', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Grotal public newspaper-distributor directory', notes: 'Plot No. 8, Zone 1, Press Complex, MP Nagar. Listed as Hindustan Samachar News Agency and newspaper publisher.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-agniban-bhopal-251', businessName: 'Agniban — Bhopal', contactName: '',
        businessType: 'Distributor', whatsapp: '919827010709', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Grotal public newspaper-publisher directory', notes: '11, Press Complex, Zone 1, MP Nagar. Newspaper publisher; mobile 9827010709 and landline 0755-2576231 published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pamm-bhopal-252', businessName: 'PAMM Advertising and Marketing', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919826939385', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Grotal public newspaper-advertising directory', notes: '10-B, Press Complex, Zone 1, MP Nagar. Newspaper advertising agency; ad placement, not circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-prudential-bhopal-253', businessName: 'Prudential Advertiser and Media Planner', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919425301760', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Grotal public newspaper-advertising directory', notes: 'MM-33, Block C, Mansarover Complex, near Habibganj Railway Station. Advertising and media planning; newspaper ad service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hitech-chandigarh-254', businessName: 'Hitech Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919888136488', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Grotal public newspaper-distributor directory', notes: 'Sector 41-A, Chandigarh. Listed under newspaper distributors and newspaper advertising agencies.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-empire-chandigarh-255', businessName: 'Empire Enterprises', contactName: '',
        businessType: 'Distributor', whatsapp: '919814006606', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Grotal public newspaper-distributor directory', notes: 'SCO 406, Sector 44-D. Listed under newspaper distributors; also stationery and book-binding services.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sunnytimes-chandigarh-256', businessName: 'Sunny Times', contactName: '',
        businessType: 'Distributor', whatsapp: '919814361244', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Grotal public newspaper-distributor directory', notes: '202/1, Badheri Market, Sector 41-D. Listed as a newspaper publisher; circulation/distribution contact.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-angelads-chandigarh-257', businessName: 'Angel Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919779298900', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Grotal public newspaper-advertising directory', notes: 'Booth No. 179, Sector 35-D. Newspaper advertising and classified booking centre; advertising only, not a circulation vendor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tribune-chandigarh-258', businessName: 'The Tribune — Circulation', contactName: '',
        businessType: 'Distributor', whatsapp: '919888488823', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Official Dainik Tribune contact page', notes: 'The Tribune Trust, Sector 29-C, Chandigarh. Official circulation contact mobile 9888488823; office numbers 0172-2670280 / 2670419.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pushpak-chandigarh-259', businessName: 'Pushpak Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919646622000', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Grotal public newspaper-advertising directory', notes: 'House No. 27, Sector 18-A, Chandigarh. Newspaper advertising and booking service; advertising only, not circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ascent-chandigarh-260', businessName: 'Ascent Media Solution Pvt. Ltd.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919316614111', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Grotal public newspaper-advertising directory', notes: 'Shop No. 2570, 3rd Floor, Sector 22-C. Media/advertising agency and newspaper advertisement booking centre.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-newznew-chandigarh-261', businessName: 'NewZNew', contactName: '',
        businessType: 'Distributor', whatsapp: '919814122794', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Grotal public news-publisher directory', notes: 'Sector 17, Chandigarh. Listed as English online newspaper publisher/news portal; publisher lead, print circulation not confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hariom-delhi-262', businessName: 'Hariom and Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919811555181', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-distributor directory', notes: '10/22, Ground Floor, East Patel Nagar, opposite Yes Bank. Listed as Newspaper Distributor and Newspaper Agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-thakur-delhi-263', businessName: 'Thakur News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919212080742', city: 'New Delhi', district: 'South West Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-distributor directory', notes: 'Plot G-54/B, Palam Extension, near DAV School. Listed as newspaper and magazine distributor; alternate mobile 9212210742 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-khabronversha-delhi-264', businessName: 'Khabron Ki Versha', contactName: '',
        businessType: 'Distributor', whatsapp: '919350175678', city: 'New Delhi', district: 'North East Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-distributor directory', notes: 'Office 959, Gali No. 16, Moujpur, Vijay Nagar. Listed as newspaper distributor and newspaper advertising service; alternate mobile 9353736394 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-lakshya-delhi-265', businessName: 'Lakshya News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919891862759', city: 'New Delhi', district: 'South East Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-distributor directory', notes: '198/46-A, 2nd Floor, Ramesh Market, East of Kailash. Newspaper and magazine distributor; also handles newspaper flyers and insert distribution in Delhi/NCR.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ramesh-delhi-266', businessName: 'Ramesh News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919818205927', city: 'New Delhi', district: 'South West Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-distributor directory', notes: 'RZ-364D, Raj Nagar, Palam. Listed as Newspaper Distributor and magazine supplier.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-maurya-delhi-267', businessName: 'Maurya News Agencies', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919818560684', city: 'New Delhi', district: 'South West Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-distributor directory', notes: 'RZ-C-2/23-C, Vijay Enclave, Vinod Puri, Palam. Listed as Newspaper Distributor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ravi-delhi-268', businessName: 'Ravi News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919899536956', city: 'New Delhi', district: 'North Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-distributor directory', notes: 'D-222, First Floor, Gandhi Vihar. Listed as Newspaper Distributor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-saisumiran-delhi-269', businessName: 'Shri Sai Sumiran Times', contactName: '',
        businessType: 'Distributor', whatsapp: '919818023070', city: 'New Delhi', district: 'West Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-distributor directory', notes: 'F-44/D, MIG Flats, G-8 Area, Hari Nagar. Listed under newspaper distributors and advertising.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-newspapermag-delhi-270', businessName: 'News Paper and Magazine', contactName: '',
        businessType: 'Distributor', whatsapp: '919891666531', city: 'New Delhi', district: 'East Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-distributor directory', notes: '12/340, Kalyanpuri. Listed as Newspaper Distributor.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-awaz-delhi-271', businessName: 'Awaz Samaj Ki Buraiyon Ke Khilaaf', contactName: '',
        businessType: 'Distributor', whatsapp: '919753840005', city: 'New Delhi', district: 'East Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-publisher directory', notes: 'D-131, Second Floor, Street No. 7, Laxmi Nagar. Hindi newspaper publisher; distribution/publisher contact.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dayafter-delhi-272', businessName: 'The Day After', contactName: '',
        businessType: 'Distributor', whatsapp: '919810010421', city: 'New Delhi', district: 'South East Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-publisher directory', notes: 'B-101, Second Floor, Lajpat Nagar. Newspaper publisher/distributor listing; landline 011-29810450 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-perfact-delhi-273', businessName: 'The Perfact News International', contactName: '',
        businessType: 'Distributor', whatsapp: '918447712079', city: 'New Delhi', district: 'South West Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-publisher directory', notes: '4th Floor, Plot 5, Tockes Complex, Sector 19, Dwarka. Newspaper publisher and newspaper advertising listing.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hindusthan-delhi-274', businessName: 'Hindusthan Samachar — Delhi', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919810776750', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-agency directory', notes: '1st Floor, Prachin Shiv Mandir, 10-A, Aarambag, Paharganj. Listed as Hindustan Samachar News Agency and newspaper advertising service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-newsline-delhi-275', businessName: 'Newsline Publication Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '919810030533', city: 'New Delhi', district: 'East Delhi', state: 'Delhi',
        source: 'Grotal public media-directory listing', notes: '4C, Pocket IV, Mayur Vihar Phase 1. Magazine publisher/media advertising services; newspaper distribution not independently confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-adcorp-delhi-276', businessName: 'The Advertising Corporation of India', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919968677283', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-advertising directory', notes: '1701, Nirmal Tower, 26 Barakhamba Road, Connaught Place. Advertising agency with newspaper/print advertising services.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-meenaads-delhi-277', businessName: 'Meena Advertising Agency and Advertising Solution', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919213240870', city: 'New Delhi', district: 'East Delhi', state: 'Delhi',
        source: 'Grotal public newspaper-advertising directory', notes: 'E-11, Radhey Puri. Newspaper, radio, TV and magazine advertising services; ad placement, not newspaper circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dreamfly-kolkata-278', businessName: 'Dream Fly Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918961876926', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Grotal public newspaper-advertising directory', notes: 'A.P.C. Road, Kolkata. Newspaper advertisement booking/classified agency; advertising only, not circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-bookallads-kolkata-279', businessName: 'Book All Ads', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918335824700', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Grotal public newspaper-advertising directory', notes: '207, AJC Bose Road, Ultadanga. Newspaper and online advertisement booking agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hindusthan-jaipur-280', businessName: 'Hindusthan Samachar — Jaipur', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '917597892495', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Grotal public news-publisher directory', notes: 'C-29A, Bajaj Nagar. Listed as Hindustan Samachar News Agency, newspaper publisher and advertising agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sandesh-jaipur-281', businessName: 'The Sandesh Limited — Jaipur', contactName: '',
        businessType: 'Distributor', whatsapp: '919414071609', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Grotal public newspaper-publisher directory', notes: '7, Chha-6, Jawahar Nagar. Gujarati newspaper publisher/distributor contact for Sandesh publications.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-goodday-jaipur-282', businessName: 'Good Day News Today', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919351300526', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Grotal public newspaper-advertising directory', notes: '511/513, Gaurav Tower, Malviya Nagar. Newspaper advertising agency and local news publication listing.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-chetna-ahmedabad-283', businessName: 'Chetna Industrial News', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919825901751', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Grotal public newspaper-advertising directory', notes: '2, Shah Chambers, CG Road/CTM Cross Road. Newspaper advertising and outdoor advertising agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nutan-ahmedabad-284', businessName: 'Nutan Art Corporation', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919825030199', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Grotal public newspaper-advertising directory', notes: '8/9, Harisiddha Chambers, 2nd Floor, Ashram Road. Newspaper advertising, hoardings and outdoor advertising agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-arun-jaipur-285', businessName: 'Arun News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '01412563701', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Grotal public news-agency directory', notes: '1569, Ghat Gate, Jaipur. Listed as Arun News Agency; published contact is landline 0141-2563701, newspaper distribution role to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-newspaperdealing-mumbai-286', businessName: 'Newspaper Dealing Agency', contactName: '',
        businessType: 'Distributor', whatsapp: '919967476508', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Grotal public pamphlet/newspaper distributor directory', notes: 'G-4, 30-B, Harmony House, Chuime Village, Danpada, Khar West. Listed as newspaper distributor, pamphlet and flyer distributor; alternate mobile 9004800843.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pamphletinsertion-mumbai-287', businessName: 'Pamphlet Insertion', contactName: '',
        businessType: 'Distributor', whatsapp: '918828814629', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Grotal public flyer-distributor directory', notes: '1, Gandhi Mansion, 3rd Floor, Bomanji Street, Kalbadevi. Newspaper insertion, pamphlet and leaflet distribution service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-adplanet-airoli-288', businessName: 'Ad Planet', contactName: '',
        businessType: 'Distributor', whatsapp: '919987082465', city: 'Navi Mumbai', district: 'Thane', state: 'Maharashtra',
        source: 'Grotal public pamphlet-distributor directory', notes: 'Shop 6, Plot C-17/18, Sector 9, Airoli. Pamphlet distribution, newspaper insertion and advertising service; alternate mobile 9867382465.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-seagull-pune-289', businessName: 'Seagull Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919545552750', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Grotal public newspaper-advertising directory', notes: 'Office 10, 5th Floor, Windsor Commerce, Baner. Newspaper and magazine advertising services; advertising only, not circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pamm-pune-290', businessName: 'PAMM Advertising and Marketing — Pune', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919970944289', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Grotal public magazine/newspaper advertising directory', notes: '61-A/9, Saiprasad Apartment, Erandawada. Newspaper and magazine advertising service; separate Pune contact from Bhopal branch.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-malayalamanorama-pune-291', businessName: 'Malayala Manorama — Pune', contactName: '',
        businessType: 'Distributor', whatsapp: '919860070511', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Grotal public newspaper directory', notes: 'Trupti Business Center, Darekar Heights A, Karve Road. Newspaper publisher contact; listing also shows advertising and outdoor promotion services.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hitendra-pune-292', businessName: 'Hitendra Advertising and Marketing Limited', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919890234569', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Grotal public newspaper-advertising directory', notes: '135, Akshay Complex, Dhole Patil Road. Advertising agency with print/newspaper advertising services.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sachomaarg-surat-293', businessName: 'Sacho Maarg', contactName: '',
        businessType: 'Distributor', whatsapp: '918460617844', city: 'Surat', district: 'Surat', state: 'Gujarat',
        source: 'Grotal public newspaper directory', notes: '209, Shyam Chamber, opposite Sub Jail, Ring Road. Gujarati newspaper publisher; additional landline 0261-2310087 published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-foursquare-surat-294', businessName: 'Four Square Media Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '919998167934', city: 'Surat', district: 'Surat', state: 'Gujarat',
        source: 'Grotal public newspaper-publisher directory', notes: '03, Shree Raj, Sambhavnath Apartment, B/72, Ram Krishna Society, LH Road. Listed as newspaper and business newspaper publisher.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-krishnaads-surat-295', businessName: 'Krishna Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919924568283', city: 'Surat', district: 'Surat', state: 'Gujarat',
        source: 'Grotal public newspaper-advertising directory', notes: '201, Radhe Complex, Katargam Singanpor Road. Newspaper advertising agency for Divya Bhaskar and Gujarati newspapers; alternate mobile 8487958888.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mediaconcept-surat-296', businessName: 'Media Concept', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919687608043', city: 'Surat', district: 'Surat', state: 'Gujarat',
        source: 'Grotal public newspaper-advertising directory', notes: '212, Mirambika Complex, opposite Gandhi Baug, Gopipura. Newspaper advertisement and media agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shraddha-surat-297', businessName: 'Shraddha Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919960702424', city: 'Surat', district: 'Surat', state: 'Gujarat',
        source: 'Grotal public newspaper-advertising directory', notes: '404, Abhisek Complex, near LIC Office, Railway Station. Advertising agency; newspaper placement and outdoor promotion services.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-adfield-surat-298', businessName: 'Ad Field Advertising Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919824108082', city: 'Surat', district: 'Surat', state: 'Gujarat',
        source: 'Grotal public newspaper-advertising directory', notes: '312, Mirambika Complex, opposite Gandhi Baug, Nanpura. Classified advertisement and newspaper ad booking agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hnmarketing-surat-299', businessName: 'HN Marketing', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918866793071', city: 'Surat', district: 'Surat', state: 'Gujarat',
        source: 'Grotal public newspaper-advertising directory', notes: 'Varachha Road. Advertising agency listed for newspaper advertising and classified ads.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shreepublicity-surat-300', businessName: 'Shree Publicity', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919879240110', city: 'Surat', district: 'Surat', state: 'Gujarat',
        source: 'Grotal public publicity-directory listing', notes: '5, Gruh Swapna Society, opposite Ganga Sagar, Godadara. Publicity and advertising agency; newspaper advertising/distribution scope to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rajpublicity-surat-301', businessName: 'Raj Publicity', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919327939056', city: 'Surat', district: 'Surat', state: 'Gujarat',
        source: 'Grotal public newspaper-advertising directory', notes: '549, Poddar Arcade, Khan Bazar, Varachha Road. Newspaper advertising, radio and banner advertising agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ajitshelar-mumbai-302', businessName: 'Ajit Shelar Book Stall', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919892759777', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Grotal public newspaper-distributor directory', notes: 'Opposite Mehboob Studio, Bandra West. Listed as Newspaper Distributor and Newspaper Supplier; also book stall.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-snyadav-mumbai-303', businessName: 'S.N. Yadav', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919819931188', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Grotal public newspaper-distributor directory', notes: 'Chapel Road, Bandra West. Listed as Newspaper Distributor and Newspaper Supplier; individual vendor listing.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-prism-mumbai-304', businessName: 'Prism Publications', contactName: '',
        businessType: 'Distributor', whatsapp: '', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Grotal public magazine/newspaper distributor directory', notes: 'Shivpuri Building No. 15, V.N. Purav Marg, Chembur. Listed as newspaper and magazine distributor/publisher; published contact is landline 022-25272829.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shreerang-mumbai-305', businessName: 'Shreerang Mercantile India Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Grotal public magazine/newspaper distributor directory', notes: '501, Lotus House, Sir Vithaldas Thackersey Road, Marine Lines. Listed as newspaper and magazine distributor/publisher; published contact is landline 022-22015692.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-anandbazaar-mumbai-306', businessName: 'Anand Bazaar Patrika', contactName: '',
        businessType: 'Distributor', whatsapp: '02224962601', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Grotal public newspaper-distributor directory', notes: '2/B, Paragon Building, opposite Century Mills, Delisle Road. Listed as newspaper supplier/distributor and magazine advertiser; published contact is landline 022-24962601.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-newsprintcorp-mumbai-307', businessName: 'The Newsprint Trading and Distributing Corporation Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '02222617729', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Grotal public newspaper-distributor directory', notes: '203, Bora Bazar Street, First Floor, Fort. Listed as newspaper printer, publisher, distributor and supplier; published contact is landline 022-22617729.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-studentsagencies-mumbai-308', businessName: 'Students Agencies India Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '919821214775', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Grotal public magazine/newspaper distributor directory', notes: '102, Konark Shram, behind Everest Building, Tardeo Road. Listed as magazine distributor; periodical supply business.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kisanbale-thane-309', businessName: 'Kisan Bale Newspapers and Book Stall', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '02225407695', city: 'Thane', district: 'Thane', state: 'Maharashtra',
        source: 'Grotal public newspaper directory', notes: 'Near Sahityik Naka, Dhanashri Building, Gokhale Road, Naupada. Listed as newspaper/book stall; published contact is landline 022-25407695.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sachitanand-mumbai-310', businessName: 'Sachitanand Enterprises', contactName: '',
        businessType: 'Distributor', whatsapp: '02222075041', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Grotal public newspaper/magazine distributor directory', notes: 'Shanti Niwas, 4, Gazdhar Street, Kalbadevi. Listed for newspaper and magazine distribution/supply; published contact is landline 022-22075041.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pioneerbook-mumbai-311', businessName: 'Pioneer Book Company Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '02224138723', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Grotal public newspaper/magazine distributor directory', notes: 'C-14, Royal Industrial Estate, 5-B, Naigaum Cross Road, Wadala. Listed as newspaper and magazine distributor/publisher; published contact is landline 022-24138723.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-puja-magazines-mumbai-312', businessName: 'Puja Magazine Distributors Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '02266311168', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Grotal public magazine-distributor directory', notes: '231, Commissariat Building, D.N. Road, Fort. Magazine/periodical distributor; published contact is landline 022-66311168.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-murugan-magazines-mumbai-313', businessName: 'Murugan Magazine Distributors Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '02266776777', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Grotal public magazine-distributor directory', notes: '204, Raylon Arcade, Kondivita Road, Andheri East. Magazine distributor; periodical distribution segment, published contact is landline 022-66776777.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-apexsubscription-mumbai-314', businessName: 'Apex Subscription Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '02228413114', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Grotal public magazine-distributor directory', notes: 'G-116, Shagun Arcade, Gen. A.K. Vaidya Marg, Dindoshi, Malad East. Magazine subscription and book distribution company; landline 022-28413114.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ibhbooks-mumbai-315', businessName: 'IBH Books and Magazines Distributors Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '02240497474', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Grotal public magazine-distributor directory', notes: 'Gala No. 29, West Approach, below Mahalaxmi Station Bridge. Book and magazine distributor; landline 022-40497474. Another Lower Parel office number 022-66296999.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-foreignmag-mumbai-316', businessName: 'Foreign Books and Magazine Subscription Agency', contactName: '',
        businessType: 'Distributor', whatsapp: '919820180602', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Grotal public magazine-distributor directory', notes: '203, Shri Ram, Kandivali West. Magazine subscription agency; periodical distribution, not confirmed daily newspaper circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-divyamedia-thane-317', businessName: 'Divya Media Publications Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '919820551279', city: 'Thane', district: 'Thane', state: 'Maharashtra',
        source: 'Grotal public magazine-publisher directory', notes: '303, 3rd Floor, Harmony Tower, Netaji Subhash Road, Court Naka, Thane West. Magazine publisher/media house; periodical publishing and distribution lead.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-agniban-chennai-318', businessName: 'Agniban — Chennai', contactName: '',
        businessType: 'Distributor', whatsapp: '919176684818', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Grotal public newspaper-publisher directory', notes: 'Kalyan Owners Court, Perambur. Listed as newspaper publisher and newspaper advertising service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-foursquare-chennai-319', businessName: 'Four Square Media Pvt. Ltd. — Chennai', contactName: '',
        businessType: 'Distributor', whatsapp: '919381872944', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Grotal public newspaper-publisher directory', notes: 'Old No. 70, New No. 18, Halls Road, Kilpauk. Newspaper/business newspaper publisher; mobile 9381872944 and landline 044-26448016 published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dinamalar-chennai-320', businessName: 'Dina Malar Newspaper', contactName: '',
        businessType: 'Distributor', whatsapp: '919944309600', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Grotal public newspaper-publisher directory', notes: '39, Whites Road, Anna Salai. Tamil newspaper publisher; mobile 9944309600 and landline 044-28540001 published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-victorria-chennai-321', businessName: 'Victorria Book Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '919282411419', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Grotal public magazine-distributor directory', notes: 'Shop No. 3, Anand Complex, Duraisamy Reddy Street, Tambaram. Magazine distributor and book centre; landline 044-65663877 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-harrison-chennai-322', businessName: 'Harrison Book Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '919841314247', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Grotal public magazine-distributor directory', notes: 'Shop No. 810, opposite LIC, Anna Salai. Magazine distributor and book centre; landline 044-28592761 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-swasam-chennai-323', businessName: 'Swasam Bookart', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919152180609', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Grotal public newspaper/book directory', notes: 'No. 5, Castle Valley, Vengadamangalam Main Road. Listed for English newspaper, magazines and books; newspaper supply role to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-spbook-chennai-324', businessName: 'SP Book House', contactName: '',
        businessType: 'Distributor', whatsapp: '919152185748', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Grotal public magazine/book directory', notes: 'No. 2178/20, Flat 1, SP Groups, Raj Parrys Karpagam, 12th Main Road, Anna Nagar. Magazine/book supplier.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kavinbook-chennai-325', businessName: 'Kavin Book House', contactName: '',
        businessType: 'Distributor', whatsapp: '919152191337', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Grotal public magazine/book directory', notes: 'Shop G3, Redhills Road, 200 Feet Road, Kolathur. Magazine and book supplier; periodical distribution scope to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tempest-hyderabad-326', businessName: 'Tempest Advertising Pvt. Ltd.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918008556135', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Grotal public newspaper-advertising directory', notes: '102, Saisagar Heights, opposite Begumpet Airport, Prakash Nagar. Advertising agency; newspaper advertising and media placement.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nikhilesh-hyderabad-327', businessName: 'Nikhilesh Ads Media Advertisers', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919948728284', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Grotal public newspaper-advertising directory', notes: '3-4-539, Reddy College Lane, YMCA, Narayanaguda. Outdoor advertising and media agency; newspaper advertising scope to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mediavision-hyderabad-328', businessName: 'Media Vision Ads', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919704142434', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Grotal public newspaper-advertising directory', notes: 'EWS 1311, KPHB Colony, Kukatpally. Newspaper, radio, TV and magazine advertising agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-alamads-hyderabad-329', businessName: 'Alam Ads Digital Media', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919849383884', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Grotal public advertising directory', notes: '3-5-780/11/D, Sajid Majestic Height, King Koti. Digital and outdoor advertising agency; newspaper advertising scope to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-admedia-hyderabad-330', businessName: 'AD Media', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919849024904', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Grotal public newspaper-advertising directory', notes: 'Near MCH Market, Ameerpet. Newspaper, magazine and TV advertising agency; landline 040-66822990 also published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-revathi-hyderabad-331', businessName: 'Revathi Creative Communication Pvt. Ltd.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919440404675', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Grotal public advertising directory', notes: '301, 3rd Floor, Moghal Mansion, Khairatabad. Advertising and media agency; mobile 9440404675 and landline 040-23310670 published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-aditya-hyderabad-332', businessName: 'Aditya Communications', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919246363246', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Grotal public advertising directory', notes: 'Flat 402, 4th Floor, Everest Block, Aditya Enclave, Ameerpet. Advertising agency; mobile 9246363246 and landline 040-66614770 published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dhankar-hyderabad-333', businessName: 'Dhankar Publications Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '918410005014', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Grotal public magazine-publisher directory', notes: '5-4-23/A, opposite RK Theater, Abids. Magazine and competition-book publisher; periodical distribution lead, newspaper circulation not confirmed.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-daarads-patna-334', businessName: 'Daar Advertisement Solutions', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919835417906', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Grotal public newspaper-advertising directory', notes: 'MIG 61, near Anandnath Shiv Mandir, Kankarbagh. Newspaper advertisement solutions and ad booking services; alternate mobile 8102708541.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-galaxy-patna-335', businessName: 'Galaxy Consultancy', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919006921560', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Grotal public newspaper-advertising directory', notes: 'Shri Awas Property, Boring Road. Listed for newspaper advertisements; advertising agency, not circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sagarmedia-patna-336', businessName: 'Sagar Media Service', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919304890737', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Grotal public newspaper-advertising directory', notes: 'Goraiyatoli, Chiraiya Tand Bridge, near Nisha Hotel, Station Road. Media/advertising service; newspaper advertising scope to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-adslive-patna-337', businessName: 'ADS Live', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919939432786', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Grotal public newspaper-advertising directory', notes: 'Shop G-25, Abu Fakhruddin Plaza, Langertoli, Bari Path. Advertising service; mobile 9939432786 and 9122132786 published.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-expression-patna-338', businessName: 'Expression', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919334114000', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Grotal public advertising directory', notes: 'Shivahar Sadan, 2nd Floor, Fraser Road. Advertising agency; newspaper ad booking scope to verify. Alternate mobile 9334113880.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-eminent-patna-339', businessName: 'Eminent Advertising Events and Media Consultancy', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919470444431', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Grotal public newspaper-advertising directory', notes: 'Below Dhanush Setu Flyover, Rajendra Nagar. Advertising and media consultancy with newspaper advertisement services; alternate mobile 9334513911.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-landmark-patna-340', businessName: 'Landmark Outdoor Media Service Pvt. Ltd.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919835091939', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Grotal public advertising directory', notes: 'Road No. 25, M-32, Sri Krishnapuri. Outdoor and media advertising service; alternate mobile 9431016421.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-oriental-kolkata-341', businessName: 'Oriental Communication', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '03333015783', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Grotal public newspaper-advertising directory', notes: 'Khashmallick, Baripur/Mallickpore, Kolkata. Listed in newspaper advertisement booking category; published contact is landline 033-33015783.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-signet-kolkata-342', businessName: 'Signet Media Service Pvt. Ltd.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '03322267622', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Grotal public newspaper-advertising directory', notes: '87, Ground Floor, Lenin Sarani. Media/ad agency listed in newspaper advertising booking directory; published contact is landline 033-22267622.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tcp-kolkata-343', businessName: 'TCP Advertising Pvt. Ltd.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '03322364076', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Grotal public newspaper-advertising directory', notes: '6/2, Madan Street, Esplanade. Advertising agency listed in newspaper advertisement booking category; published contact is landline 033-22364076.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-universalads-kolkata-344', businessName: 'Universal Advertising Association', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '03322399692', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Grotal public newspaper-advertising directory', notes: '1, Nather Began Street, Beniatola. Advertising agency listed in newspaper ad booking directory; published contact is landline 033-22399692.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-phoenix-kolkata-345', businessName: 'Phoenix Advertising Pvt. Ltd.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '03322172947', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Grotal public newspaper-advertising directory', notes: '18, Chowringhee Mansions, Chowringhee Road. Advertising agency listed in newspaper ad booking category; landline 033-22172947.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-indianads-kolkata-346', businessName: 'Indian Advertising Service', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '03324647421', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Grotal public newspaper-advertising directory', notes: '2/1-A, Hindustan Park. Advertising agency listed in newspaper ad booking category; landline 033-24647421.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-indianpublicity-kolkata-347', businessName: 'Indian Publicity Bureau Pvt. Ltd.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '03322126583', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Grotal public newspaper-advertising directory', notes: '6/2, Madan Street, Chandni Market. Publicity and newspaper advertising agency; landline 033-22126583.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jjcommunication-kolkata-348', businessName: 'JJ Communication Pvt. Ltd.', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '03324640915', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Grotal public newspaper-advertising directory', notes: '48, Room F/2, Gariahat Road. Communication/advertising agency listed in newspaper ad booking directory; landline 033-24640915.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sharma-meerut-349', businessName: 'Sharma News Agency — Meerut', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919837430821', city: 'Meerut', district: 'Meerut', state: 'Uttar Pradesh',
        source: 'Grotal public newspaper-distributor directory', notes: 'J-56, Phase 1, Modipuram, Pallavpuram. Listed as Newspaper Distributor; also pamphlet and competition-book supplier.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-abp-ahmedabad-350', businessName: 'ABP Pvt. Ltd. — Ahmedabad', contactName: '',
        businessType: 'Distributor', whatsapp: '919825733435', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Grotal public newspaper-publisher directory', notes: '304, Pratibha Complex, near Gandhigram Railway Station, Ashram Road. Anandabazar Patrika/The Telegraph publisher contact; mobile 9825733435 and landline 079-40320202.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sambhaav-ahmedabad-351', businessName: 'Sambhaav Metro', contactName: '',
        businessType: 'Distributor', whatsapp: '919909967292', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Grotal public newspaper-publisher directory', notes: 'Sambhaav House, opposite Judges Bunglow, Bodakdev. Gujarati newspaper publisher; mobile 9909967292 and landline 079-26873914.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-foursquare-baroda-352', businessName: 'Four Square Media Pvt. Ltd. — Vadodara', contactName: '',
        businessType: 'Distributor', whatsapp: '919879550414', city: 'Vadodara', district: 'Vadodara', state: 'Gujarat',
        source: 'Grotal public newspaper-publisher directory', notes: '301, 3rd Floor, Lalita Tower, near Hotel Rajpath, Alkapuri/Baroda. Newspaper/business publication and advertising company; mobile 9879550414.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-foursquare-ahmedabad-353', businessName: 'Four Square Media Pvt. Ltd. — Ahmedabad', contactName: '',
        businessType: 'Distributor', whatsapp: '919815530924', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Grotal public newspaper-publisher directory', notes: '404, Chunilal Chambers, near Chice Restaurant, CG Road/Navrangpura. Advertising and book-publishing company; mobile 9815530924 and landline 079-40094190.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dhanraj-ahmedabad-354', businessName: 'Dhanraj News and Media Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '07926401310', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Grotal public newspaper-agent directory', notes: '4th Floor, Anison Building, C.G. Road. Listed as newspaper agent, newspaper distributor and magazine dealer; published contact is landline 079-26401310.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sandesh-ahmedabad-355', businessName: 'The Sandesh Limited — Ahmedabad', contactName: '',
        businessType: 'Distributor', whatsapp: '07940004000', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Grotal public newspaper-publisher directory', notes: 'Sandesh Bhavan, Lad Society Road, Vastrapur, Bodakdev. Gujarati newspaper publisher; published contact is landline 079-40004000.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-amitymag-ahmedabad-356', businessName: 'Amity Magazine Publisher', contactName: '',
        businessType: 'Distributor', whatsapp: '07925354847', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Grotal public newspaper/magazine distributor directory', notes: 'Shanti Sadan Estate, Mirzapur. Listed as newspaper agent, newspaper distributor and magazine dealer; published contact is landline 079-25354847.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tribune-bhopal-357', businessName: 'M/s Imprint Media Consultants Pvt. Ltd. — Tribune Bhopal', contactName: '',
        businessType: 'Distributor', whatsapp: '919425017188', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Official Tribune India regional contact directory', notes: 'Regional Tribune contact: Mr. Rahul / Sweety Bichpuriya, Bhopal. Published mobiles 9425017188 and 9425006237; exact circulation vs advertising role to confirm.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tribune-chennai-358', businessName: 'M/s CNR Enterprises — Tribune Chennai', contactName: '',
        businessType: 'Distributor', whatsapp: '919884492122', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Official Tribune India regional contact directory', notes: 'Regional Tribune contact: Mr. Archit K, B/16, Maduran Apartments, Mogappair. Published mobile 9884492122; exact circulation vs advertising role to confirm.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tribune-dehradun-359', businessName: 'Preeti — Tribune Dehradun Contact', contactName: '',
        businessType: 'Distributor', whatsapp: '919837789993', city: 'Dehradun', district: 'Dehradun', state: 'Uttarakhand',
        source: 'Official Tribune India regional contact directory', notes: 'Regional Tribune contact: Ms. Preeti, 28 Idgah, Chakrata Road, Dehradun. Published mobile 9837789993; exact circulation vs advertising role to confirm.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tribune-jaipur-360', businessName: 'Yogesh Joshi — Tribune Jaipur Contact', contactName: '',
        businessType: 'Distributor', whatsapp: '919829038811', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Official Tribune India regional contact directory', notes: 'Regional Tribune contact: 38, Van Vihar Colony, Tonk Road, Jaipur. Published mobile 9829038811; exact circulation vs advertising role to confirm.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tribune-kolkata-361', businessName: 'Shibhadra Sen — Tribune Kolkata Contact', contactName: '',
        businessType: 'Distributor', whatsapp: '919830808393', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Official Tribune India regional contact directory', notes: 'Regional Tribune contact: Panchwati Flat, GG-2, Bediadanga 1st Lane, Kasba, Kolkata. Published mobile 9830808393; exact circulation vs advertising role to confirm.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tribune-lucknow-362', businessName: 'Shekhar Tandon — Tribune Lucknow Contact', contactName: '',
        businessType: 'Distributor', whatsapp: '919936249866', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh',
        source: 'Official Tribune India regional contact directory', notes: 'Regional Tribune contact: D-8/1, 9th Street, Rajendra Nagar, Lucknow. Published mobile 9936249866 and landline 0522-2693362; exact circulation vs advertising role to confirm.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-advertisementindia-noida-363', businessName: 'Advertisement India — Delhi NCR', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919810293243', city: 'Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh',
        source: 'Official Advertisement India contact page', notes: '5th Floor, SB Tower, Sector 16A, Film City, Noida. Newspaper advertising/ad-booking agency; Delhi-NCR branch.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-advertisementindia-lucknow-364', businessName: 'Advertisement India — UP & Uttarakhand', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919935357575', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh',
        source: 'Official Advertisement India contact page', notes: '6/364, Vineet Khand, Gomti Nagar. Newspaper advertising/ad-booking agency; UP and Uttarakhand branch.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-advertisementindia-mumbai-365', businessName: 'Advertisement India — Mumbai', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919769875375', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra',
        source: 'Official Advertisement India contact page', notes: 'Flat 125, Chandrama Building, New Vasundhara CHS, Thakur Village, Kandivali East. Newspaper advertising/ad-booking agency; Mumbai branch.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-advertisementindia-bhopal-366', businessName: 'Advertisement India — Bhopal', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919981511889', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Official Advertisement India contact page', notes: '21-B, near Kwality Restaurant, New Market, TT Nagar. Newspaper advertising/ad-booking agency; Bhopal branch.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-hyderabad-367', businessName: 'Dainik Jagran — Hyderabad Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919849273753', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'Flat 403/404, GNR Heights, 1-7-387, Bakaram, Musheerabad. Official Jagran office; mobile 9849273753 for newspaper ad booking.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-kochi-368', businessName: 'Dainik Jagran — Kochi Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919895169603', city: 'Kochi', district: 'Ernakulam', state: 'Kerala',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'Dileep K, Jagran Prakashan Ltd., 1st Floor, Vykundam, PRA-98, Kalavath Cross Road, Palarivattom. Official regional contact mobile 9895169603.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-rajkot-369', businessName: 'Dainik Jagran — Rajkot Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918128080880', city: 'Rajkot', district: 'Rajkot', state: 'Gujarat',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'Rajesh C. Jani, Flat 201, Om Apartment, 2/3 Subash Nagar, Raiya Road. Official regional contact mobile 8128080880.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-vadodara-370', businessName: 'Dainik Jagran — Vadodara Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919825741504', city: 'Vadodara', district: 'Vadodara', state: 'Gujarat',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'C/o Arvinda Bhai C. Patel, 121-A, Moti Nagar-11, Sussen Ring Road, Tarsali. Official regional contact mobile 9825741504.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-meerut-371', businessName: 'Dainik Jagran — Meerut Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919837310824', city: 'Meerut', district: 'Meerut', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds booking-centres directory', notes: '86/8, Mohkampur, Delhi Road, Meerut. Official Jagran Prakashan office; mobile 9837310824.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-patiala-372', businessName: 'Dainik Jagran — Patiala Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918284865100', city: 'Patiala', district: 'Patiala', state: 'Punjab',
        source: 'Official Jagran BookAds booking-centres directory', notes: '#45, Bachhittar Nagar, near 22 No. Phatak. Official Jagran office; mobile 8284865100.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-raebareli-373', businessName: 'Dainik Jagran — Rae Bareilly Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919415034700', city: 'Rae Bareli', district: 'Rae Bareli', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'Durga Market, First Floor, Kachehri Road. Official Jagran office; mobile 9415034700.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-bookads-374', businessName: 'Jagran BookAds — Newspaper Ad Booking', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919311850250', city: 'New Delhi', district: 'South East Delhi', state: 'Delhi',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'Central support for newspaper ad booking and rate enquiries; published mobile 9311850250, Monday to Friday.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-jaipur-375', businessName: 'Dainik Jagran — Jaipur Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '01412221393', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'A-37, Bhagat Vatika, Raj Bhawan Civil Lines Road. Official Jagran office; published landline 0141-2221393.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-bengaluru-376', businessName: 'Jagran Prakashan — Bengaluru Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '08030721700', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'Phoenix Pinnacle, 2nd Floor, 46 Ulsoor Road. Official Jagran office; published landline 080-30721700.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-bhubaneswar-377', businessName: 'Dainik Jagran — Bhubaneswar Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '06742575623', city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'EB-397, Stage II, Laxmisagar. Official Jagran office; published landline 0674-2575623.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-chennai-378', businessName: 'Dainik Jagran — Chennai Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '04428554047', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'No. 9, 2nd Floor, Sindur Plaza, Egmore, 42 Montieth Road. Official Jagran office; landlines 044-28554047 / 28554555.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-ahmedabad-379', businessName: 'Dainik Jagran — Ahmedabad Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '07926460135', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat',
        source: 'Official Jagran BookAds booking-centres directory', notes: '206, Anand Mangal-2, behind Femina Town, CG Road, Navrangpura. Official Jagran office; landline 079-26460135.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-chandigarh-380', businessName: 'Dainik Jagran — Chandigarh Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '01722784756', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'SCO 43-44, 2nd Floor, Sector 8-C, Madhya Marg. Official Jagran office; landlines 0172-2784756 / 2784757.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-coimbatore-381', businessName: 'Dainik Jagran — Coimbatore Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '04222496161', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu',
        source: 'Official Jagran BookAds booking-centres directory', notes: '297, Rajeshwari Complex, 7th Street, Gandhipuram. Official Jagran office; landline 0422-2496161.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-faridabad-382', businessName: 'Dainik Jagran — Faridabad Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '01292411681', city: 'Faridabad', district: 'Faridabad', state: 'Haryana',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'E/7, B.P. Railway Road, NIT Chowk. Official Jagran office; landlines 0129-2411681 / 3051000.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-goa-383', businessName: 'Dainik Jagran — Goa Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '08322437346', city: 'Panaji', district: 'North Goa', state: 'Goa',
        source: 'Official Jagran BookAds booking-centres directory', notes: '111, Kamat Towers, Patto, Panjim. Official Jagran office; landline 0832-2437346.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-gurgaon-384', businessName: 'Dainik Jagran — Gurugram Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '01243914600', city: 'Gurugram', district: 'Gurugram', state: 'Haryana',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'Old Judicial Complex, SCO-42, 2nd Floor, Civil Lines. Official Jagran office; landlines 0124-3914600 / 2315440.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-guwahati-385', businessName: 'Dainik Jagran — Guwahati Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '03612528885', city: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'C/o Pulak Talukdar, Lachit Nagar, Bye-Lane 5. Official Jagran office; landline 0361-2528885.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-kolkata-386', businessName: 'Jagran Prakashan — Kolkata Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '03322838807', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal',
        source: 'Official Jagran BookAds booking-centres directory', notes: 'Unit 4A, 13 Lala Lajpat Rai Sarani. Official Jagran office; landlines 033-22838807 / 22838810.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-mumbai-387', businessName: 'Jagran Prakashan — Mumbai Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '02239413000', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra',
        source: 'Official Jagran BookAds booking-centres directory', notes: '409/410, Trade World, B-Wing, Kamala Mills Compound, Senapati Bapat Marg, Lower Parel. Official Jagran office; landlines 022-39413000 / 30454700.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-pune-388', businessName: 'Dainik Jagran — Pune Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '02066052400', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'Official Jagran BookAds booking-centres directory', notes: '301, Sai Gaurav, 2040 S.K. Jaan Mohd. Street, near Baba Jaan Chowk, Camp. Official Jagran office; published telefax 020-660524.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-raipur-389', businessName: 'Dainik Jagran — Raipur Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '07712422112', city: 'Raipur', district: 'Raipur', state: 'Chhattisgarh',
        source: 'Official Jagran BookAds booking-centres directory', notes: '2, Prem Kunj, 1st Floor, Civil Lines. Official Jagran office; landline 0771-2422112.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-vizag-390', businessName: 'Dainik Jagran — Visakhapatnam Office', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '08912569232', city: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh',
        source: 'Official Jagran BookAds booking-centres directory', notes: '29-42-18, SBI Colony, Visakhapatnam. Official Jagran office; landlines 0891-2569232 / 2573573.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-agra-391', businessName: 'Dainik Jagran — Agra Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '05623001234', city: 'Agra', district: 'Agra', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'B-1, Site A, UPSIDC Industrial Area, Sikandara. Official Jagran publishing centre; landline 0562-3001234.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-aligarh-392', businessName: 'Dainik Jagran — Aligarh Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '05713081700', city: 'Aligarh', district: 'Aligarh', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'A-32, Sector 2, Tala Nagri Industrial Area. Official Jagran publishing centre; landline 0571-3081700.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-allahabad-393', businessName: 'Dainik Jagran — Prayagraj Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '05323912700', city: 'Prayagraj', district: 'Prayagraj', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: '7, P.D. Tandon Road, Civil Lines, opposite Boys High School. Official Jagran publishing centre; landlines 0532-3912700 / 6662333.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-ayodhya-394', businessName: 'Dainik Jagran — Ayodhya Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '919415004001', city: 'Ayodhya', district: 'Ayodhya', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'B-Civil Lines, Faizabad. Official Jagran publishing centre; published mobile 9415004001.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-amritsar-395', businessName: 'Dainik Jagran — Amritsar Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '0183500155', city: 'Amritsar', district: 'Amritsar', state: 'Punjab',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'SCO-52, Ranjeet Avenue, B-Block. Official Jagran publishing centre; landline 0183-500155.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-bhagalpur-396', businessName: 'Dainik Jagran — Bhagalpur Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '06413941300', city: 'Bhagalpur', district: 'Bhagalpur', state: 'Bihar',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Mahatma Gandhi Road, Katchhehri Chowk. Official Jagran publishing centre; landline 0641-3941300.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-bathinda-397', businessName: 'Dainik Jagran — Bathinda Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '01642241148', city: 'Bathinda', district: 'Bathinda', state: 'Punjab',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Shop 5/6, Ground Floor, Devraj Tower, 100 Ft Road, near Ghodawala Chowk. Official Jagran publishing centre; landline 0164-2241148.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-bhopal-398', businessName: 'Dainik Jagran — Bhopal Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '07554292000', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: '33, Press Complex, Zone 1, MP Nagar. Official Jagran publishing centre; landline 0755-4292000.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-dehradun-399', businessName: 'Dainik Jagran — Dehradun Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '01352723318', city: 'Dehradun', district: 'Dehradun', state: 'Uttarakhand',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Plot 918/922, Industrial Area, Patel Nagar. Official Jagran publishing centre; landline 0135-2723318.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-dhanbad-400', businessName: 'Dainik Jagran — Dhanbad Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '03263982700', city: 'Dhanbad', district: 'Dhanbad', state: 'Jharkhand',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Panchsheel Guest House, Dhaiya. Official Jagran publishing centre; landline 0326-3982700.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-gorakhpur-401', businessName: 'Dainik Jagran — Gorakhpur Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '05513060300', city: 'Gorakhpur', district: 'Gorakhpur', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: '23, Civil Lines, Gorakhpur. Official Jagran publishing centre; landline 0551-3060300.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-hisar-402', businessName: 'Dainik Jagran — Hisar Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '01662398400', city: 'Hisar', district: 'Hisar', state: 'Haryana',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Plot 15 and 21, Industrial Estate, Delhi Road. Official Jagran publishing centre; landline 01662-398400.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-indore-403', businessName: 'Dainik Jagran — Indore Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '07313918186', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: '302, Apollo Square, Narayan Kothi Chouraha. Official Jagran publishing centre; landlines 0731-3918186 / 3918189.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-jalandhar-404', businessName: 'Dainik Jagran — Jalandhar Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '01813067500', city: 'Jalandhar', district: 'Jalandhar', state: 'Punjab',
        source: 'Official Jagran BookAds publishing-centres directory', notes: '39, PUDA Complex, 3rd Floor, opposite DC Office, Ladowali Road. Official Jagran publishing centre; landline 0181-3067500.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-jamshedpur-405', businessName: 'Dainik Jagran — Jamshedpur Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '06573985200', city: 'Jamshedpur', district: 'East Singhbhum', state: 'Jharkhand',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Shailendra Singh Complex, Dimna Road, Mango, near Subhash Colony. Official Jagran publishing centre; landlines 0657-3985200 / 6611700.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-jammu-406', businessName: 'Dainik Jagran — Jammu City Office', contactName: '',
        businessType: 'Distributor', whatsapp: '01912457172', city: 'Jammu', district: 'Jammu', state: 'Jammu and Kashmir',
        source: 'Official Jagran BookAds publishing-centres directory', notes: '77 A/D, opposite Police Lines, Gandhi Nagar, Jammu Tawi. Official Jagran city office; landline 0191-2457172.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-jhansi-407', businessName: 'Dainik Jagran — Jhansi Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '05102330022', city: 'Jhansi', district: 'Jhansi', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: '362, Civil Lines, Jhansi. Official Jagran publishing centre; landlines 0510-2330022 / 2330656.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-kanpur-408', businessName: 'Dainik Jagran — Kanpur Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '05122216161', city: 'Kanpur', district: 'Kanpur Nagar', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: '2, Sarvodaya Nagar, Kanpur. Official Jagran publishing centre; landlines 0512-2216161 to 2216164.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-lucknow-409', businessName: 'Dainik Jagran — Lucknow Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '05222209483', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: '57 A-3, Meerabai Marg, Lucknow. Official Jagran publishing centre; landline 0522-2209483.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-ludhiana-410', businessName: 'Dainik Jagran — Ludhiana Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '01613066100', city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'BXX-630, Second Floor, Gurdev Nagar, Ferozpur Road, near Park Plaza Hotel. Official Jagran publishing centre; landline 0161-3066100.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-moradabad-411', businessName: 'Dainik Jagran — Moradabad Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '05916601591', city: 'Moradabad', district: 'Moradabad', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Kaanth Road, Harthala, Moradabad. Official Jagran publishing centre; landline 0591-6601591.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-muzaffarpur-412', businessName: 'Dainik Jagran — Muzaffarpur Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '06213041500', city: 'Muzaffarpur', district: 'Muzaffarpur', state: 'Bihar',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Pani Tanki Chowk, Mithanpura Road, Post-Ramna. Official Jagran publishing centre; landline 0621-3041500.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-haldwani-413', businessName: 'Dainik Jagran — Haldwani Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '059462235001', city: 'Haldwani', district: 'Nainital', state: 'Uttarakhand',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Devalchaur, Rampur Road, Haldwani. Official Jagran publishing centre; landline 05946-2235001.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-noida-414', businessName: 'Dainik Jagran — Noida Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '01203915800', city: 'Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'D-210/211, Sector 63, Noida. Official Jagran publishing centre; landline 0120-3915800.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-panipat-415', businessName: 'Dainik Jagran — Panipat Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '01802670991', city: 'Panipat', district: 'Panipat', state: 'Haryana',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Plot 75, Sector 29, HUDA Industrial Area, Phase II. Official Jagran publishing centre; landlines 0180-2670991 to 2670994.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-patna-416', businessName: 'Dainik Jagran — Patna Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '06123918900', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'C-5, C-6 & 15, Industrial Area, Patliputra. Official Jagran publishing centre; landline 0612-3918900.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-ranchi-417', businessName: 'Dainik Jagran — Ranchi Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '06512547680', city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand',
        source: 'Official Jagran BookAds publishing-centres directory', notes: '62, Kokar Industrial Area, Urrahat. Official Jagran publishing centre; landlines 0651-2547680 / 2547681 / 2547682.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-rewa-418', businessName: 'Dainik Jagran — Rewa Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '07662256450', city: 'Rewa', district: 'Rewa', state: 'Madhya Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Gandhi Nagar, Urrhat, Rewa. Official Jagran publishing centre; landline 07662-256450.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-varanasi-419', businessName: 'Dainik Jagran — Varanasi Publishing Centre', contactName: '',
        businessType: 'Distributor', whatsapp: '05423061000', city: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Plot 321, Purana G.T. Road, Nadesar. Official Jagran publishing centre; landlines 0542-3061000 / 6660201.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jagran-shimla-420', businessName: 'Dainik Jagran — Shimla Contact Office', contactName: '',
        businessType: 'Distributor', whatsapp: '01772652664', city: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh',
        source: 'Official Jagran BookAds publishing-centres directory', notes: 'Harish Tiwari, Dainik Jagran, Haridwar Road, Dehradun Tiraha, Rishikesh; directory entry also references Lakkar Bazaar, Shimla. Published landline 0177-2652664; confirm exact office location.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-puneri-pune-421', businessName: 'Puneri News', contactName: '',
        businessType: 'Distributor', whatsapp: '917758809699', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'PinkBazaar public business directory', notes: 'Pune Nagar Road, Ramwadi, Viman Nagar. Listed as newspaper delivery service; local publisher/distribution contact.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-anuradha-pune-422', businessName: 'Anuradha Daily Newspaper Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919922739711', city: 'Pune', district: 'Pune', state: 'Maharashtra',
        source: 'PinkBazaar public business directory', notes: 'Shop 11, near PCMC School, Sharda Colony, Pimpri. Listed as newspaper delivery service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sanjeev-delhi-423', businessName: 'Sanjeev Newspaper Supplier', contactName: '',
        businessType: 'Distributor', whatsapp: '919911700628', city: 'New Delhi', district: 'South West Delhi', state: 'Delhi',
        source: 'PinkBazaar public business directory', notes: 'A234Q, Gali No. 1A, Part-Mahaveer Enclave, Delhi. Listed as newspaper delivery/supplier service.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-devnewspaper-delhi-424', businessName: 'Dev Newspaper & Ads Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919069424243', city: 'New Delhi', district: 'West Delhi', state: 'Delhi',
        source: 'PinkBazaar public business directory', notes: 'F-139, near Gurudwara Street, Moti Nagar. Newspaper and advertising agency listing; circulation and ad services to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-janta-jabalpur-425', businessName: 'Janta News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '917614006237', city: 'Jabalpur', district: 'Jabalpur', state: 'Madhya Pradesh',
        source: 'Elets Digital Learning — historical publication availability directory (2012)', notes: '10, Malviya Chowk, Jabalpur. Listed as news agency; contact is historical and must be verified before outreach.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dewangan-bilaspur-426', businessName: 'Dewangan Book Stall', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919827158655', city: 'Bilaspur', district: 'Bilaspur', state: 'Chhattisgarh',
        source: 'Elets Digital Learning — historical publication availability directory (2012)', notes: 'New Bus Stand, Bilaspur. Listed in publication availability/agent directory; mobile 9827158655; verify current operation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dulichand-indore-427', businessName: 'M/s. Dulichand Jain', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919826045130', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Elets Digital Learning — historical publication availability directory (2012)', notes: '410, M.G. Road, Khajuri Bazar, Indore. Explicitly listed as Newspaper Agent; mobile 9826045130; historical contact, verify current.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kasthuri-coimbatore-428', businessName: 'Kasthuri News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '04222301083', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu',
        source: 'Elets Digital Learning — historical publication availability directory (2012)', notes: 'Desika Dharshan, 20-A, Hazur Road. Listed as news agency; landlines 0422-2301083 / 2301085; historical contact, verify current.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kalyani-salem-429', businessName: 'Kalyani News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '04272262386', city: 'Salem', district: 'Salem', state: 'Tamil Nadu',
        source: 'Elets Digital Learning — historical publication availability directory (2012)', notes: 'No. 1, Town Bus Stand, Salem. Listed as news agency; landlines 0427-2262386 / 2261477; historical contact, verify current.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-kailash-udaipur-430', businessName: 'Kailash News Agency', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '02942561145', city: 'Udaipur', district: 'Udaipur', state: 'Rajasthan',
        source: 'Elets Digital Learning — historical publication availability directory (2012)', notes: 'Near Town Hall, Nagar Palika Link Road, Udaipur. Listed as news agency; landline 0294-2561145; historical contact, verify current.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-agniban-booking-indore-431', businessName: 'Agniban/Dainik Bhaskar/Prabhat Kiran/Naidunia Ad Booking Point', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918989798468', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'PinkBazaar public business listing', notes: 'Railway Station, 39, opposite Lokmanya Nagar, Badri Baug Colony. Multi-publication newspaper advertisement booking point.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-indoresamachar-indore-432', businessName: 'Indore Samachar Press', contactName: '',
        businessType: 'Distributor', whatsapp: '919926000706', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Central Bureau of Communication — Madhya Pradesh newspaper partner directory', notes: '17, Sanjay Gandhi Marg, New Dewas Road, near SBI. Registered daily newspaper publisher; mobile 9926000706 listed by CBC. Landline 0731-2434701.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-freepress-indore-433', businessName: 'Free Press — Indore', contactName: '',
        businessType: 'Distributor', whatsapp: '919425082195', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Central Bureau of Communication — Madhya Pradesh newspaper partner directory', notes: '3/54, Press Complex, AB Road, Indore. English newspaper publisher; mobile 9425082195 listed by CBC; landline 0731-2555111.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dopahar-indore-434', businessName: 'Dainik Dopahar', contactName: '',
        businessType: 'Distributor', whatsapp: '919826667063', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Central Bureau of Communication — Madhya Pradesh newspaper partner directory', notes: '127, Devi Ahilya Marg, Chiman Bagh Main Road. Daily Hindi newspaper publisher; mobile 9826667063 listed by CBC; landline 0731-2544776.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-khulasa-indore-435', businessName: 'Khulasa First Pvt. Ltd.', contactName: '',
        businessType: 'Distributor', whatsapp: '918818956789', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Public Google Maps / CBC newspaper directory', notes: 'DO-3, Shopping Complex, AB Road, opposite Dainik Bhaskar Press. Newspaper publisher; mobile 8818956789.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-chaitanyalok-indore-436', businessName: 'Chaitanya Lok', contactName: '',
        businessType: 'Distributor', whatsapp: '919425902495', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Central Bureau of Communication — Madhya Pradesh newspaper partner directory', notes: 'Indore. Daily Hindi newspaper publisher; mobile 9425902495 listed by CBC; landline 0731-2456129.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rashtriyahindimail-indore-437', businessName: 'Rashtriya Hindi Mail', contactName: '',
        businessType: 'Distributor', whatsapp: '919617565371', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Central Bureau of Communication — Madhya Pradesh newspaper partner directory', notes: 'Indore. Daily Hindi newspaper publisher; mobile 9617565371 listed by CBC; landline 0731-4293988.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-apniduniya-indore-438', businessName: 'Apni Duniya', contactName: '',
        businessType: 'Distributor', whatsapp: '919826558989', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Central Bureau of Communication — Madhya Pradesh newspaper partner directory', notes: 'Indore. Daily Hindi newspaper publisher; mobile 9826558989 listed by CBC; landline 0731-4293647.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-navbharat-indore-439', businessName: 'Nav Bharat — Indore', contactName: '',
        businessType: 'Distributor', whatsapp: '919752650633', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Central Bureau of Communication — Madhya Pradesh newspaper partner directory', notes: 'Indore daily Hindi newspaper publisher; mobile 9752650633 listed by CBC; landline 0731-24086553.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dainikbhaskar-indore-440', businessName: 'Dainik Bhaskar — Indore Contact', contactName: '',
        businessType: 'Distributor', whatsapp: '919981382813', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Public media contact directory', notes: 'Vishwanath, Dainik Bhaskar Indore. Mobile listed for publication/media contact; confirm whether advertising, circulation or editorial.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nayiduniya-indore-441', businessName: 'Nayi Duniya — Indore', contactName: '',
        businessType: 'Distributor', whatsapp: '919893699943', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Public media contact directory', notes: 'Abhishek, Nayi Duniya Indore. Mobile listed for publication/media contact; confirm whether advertising, circulation or editorial.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-swadesh-indore-442', businessName: 'Indore Swadesh', contactName: '',
        businessType: 'Distributor', whatsapp: '919826031670', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Public media contact directory', notes: 'Sandeep Nirkhiwale, Indore Swadesh. Mobile 9826031670 listed in media contacts; newspaper publisher contact, exact role to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-toi-indore-443', businessName: 'The Times of India — Indore Contact', contactName: '',
        businessType: 'Distributor', whatsapp: '919833738992', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Public media contact directory', notes: 'Meenakshi, Times of India Indore. Mobile 9833738992 listed as media/publication contact; verify role before outreach.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-indoremirror-indore-444', businessName: 'Indore Mirror', contactName: '',
        businessType: 'Distributor', whatsapp: '919826030974', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Public media contact directory', notes: 'Sushil Tiwari, Indore Mirror. Mobile 9826030974 listed as publication contact; confirm current role.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-patrika-indore-445', businessName: 'Rajasthan Patrika — Indore Contact', contactName: '',
        businessType: 'Distributor', whatsapp: '919301031607', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Public media contact directory', notes: 'Hariom Panjwani, Patrika Indore. Mobile 9301031607 listed as media/publication contact; verify whether advertising or circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-navbharatkranti-indore-446', businessName: 'Navbharat Indorkranti', contactName: '',
        businessType: 'Distributor', whatsapp: '919826023921', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Public media contact directory', notes: 'Indore newspaper/media contact. Mobile 9826023921 listed in publication contact list; confirm current role and publication affiliation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nagpurtoday-nagpur-447', businessName: 'Nagpur Today News Paper', contactName: '',
        businessType: 'Distributor', whatsapp: '918407908145', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'Cybo public newspaper directory', notes: 'Ground Floor, 1 VRG House, 19 Great Nag Road, beside Dainik Bhaskar. Newspaper publisher/news service; listed mobile 8407908145.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mahasagar-nagpur-448', businessName: 'Dainik Mahasagar', contactName: '',
        businessType: 'Distributor', whatsapp: '919373117042', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'Cybo public newspaper directory', notes: 'Sitabuldi, Nagpur. Newspaper publisher; mobile 9373117042 published in local newspaper directory.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rashtrapatrika-nagpur-449', businessName: 'Rashtra Patrika — Nagpur', contactName: '',
        businessType: 'Distributor', whatsapp: '07122737847', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'Bharatibiz / Press Registrar General of India', notes: '2nd Floor, Brijbhumi Complex, Central Avenue Road, Telephone Exchange Chowk, Lakadganj. Registered weekly Hindi newspaper publisher; landlines 0712-2737847 / 3919113.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nationalsandesh-nagpur-450', businessName: 'National Sandesh Newspaper', contactName: '',
        businessType: 'Distributor', whatsapp: '07122548000', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra',
        source: 'Cybo public newspaper directory', notes: 'Teen Nal Chowk, Gandhi Bagh. Newspaper publisher; published landline 0712-2548000.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-vishalstores-indore-451', businessName: 'Vishal Stores', contactName: '',
        businessType: 'Newspaper Vendor', whatsapp: '919111111270', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'PinkBazaar public newspaper-delivery listing', notes: '588, Mahatma Gandhi Road, Kunwar Mandli, Khajuri Bazar. Listed as newspaper delivery service; mobile 9111111270.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-cityblast-indore-452', businessName: 'City Blast', contactName: '',
        businessType: 'Distributor', whatsapp: '919300701501', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh',
        source: 'Bharatibiz public business listing / official City Blast e-paper', notes: '242, Jawahar Marg, S. Rajmohalla. Active Hindi afternoon daily newspaper publisher and newspaper distribution service; mobile 9300701501.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-saiadvertisement-navi-453', businessName: 'SAI Advertisement', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '918433594448', city: 'Navi Mumbai', district: 'Thane', state: 'Maharashtra',
        source: 'PinkBazaar public business directory', notes: 'Shop 1, Plot 34, Navi Mumbai. Listed under newspaper delivery; advertising service and newspaper-ad booking/distribution role to verify.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sanvi-agra-454', businessName: 'SANVI Advertising', contactName: '',
        businessType: 'Newspaper Agency', whatsapp: '919997094077', city: 'Agra', district: 'Agra', state: 'Uttar Pradesh',
        source: 'PinkBazaar public business listing', notes: 'Shop 15, Basement, Block N, 23 Cloth Market, Sanjay Palace, Sanjay Place, Civil Lines. Listed under newspaper delivery; advertising agency.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nirmanbharti-muzaffarpur-455', businessName: 'Nirman Bharti', contactName: '',
        businessType: 'Distributor', whatsapp: '919835223288', city: 'Muzaffarpur', district: 'Muzaffarpur', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Fortnightly Hindi publication listed on CBC panel; mobile 9835223288. Publisher contact; confirm current circulation and role.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-siyasipaigham-nalanda-456', businessName: 'Siyasi Paigham', contactName: '',
        businessType: 'Distributor', whatsapp: '917779984786', city: 'Nalanda', district: 'Nalanda', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu publication, Nalanda edition; mobile 7779984786. Publisher contact; confirm current circulation and role.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ghargharaawaz-patna-457', businessName: 'Ghar Ghar Ki Aawaz', contactName: '',
        businessType: 'Distributor', whatsapp: '919470092706', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9470092706 and landline 0612-2651763 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-jasaratbihar-patna-458', businessName: 'Jasarat-e-Bihar', contactName: '',
        businessType: 'Distributor', whatsapp: '919852071786', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9852071786 listed by CBC. Publisher contact; confirm current circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hamaranaara-patna-459', businessName: 'The Hamara Naara', contactName: '',
        businessType: 'Distributor', whatsapp: '917294050505', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 7294050505 and landline 0612-3216156 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hindustanexpress-patna-460', businessName: 'Hindustan Express — Patna', contactName: '',
        businessType: 'Distributor', whatsapp: '919540636786', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9540636786 and landline 0612-2555267 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-qaumirahbar-patna-461', businessName: 'Qaumi Rahbar', contactName: '',
        businessType: 'Distributor', whatsapp: '919871460936', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9871460936 and landline 0612-2301684 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-khabkmanzil-patna-462', businessName: 'Khab Ki Manzil', contactName: '',
        businessType: 'Distributor', whatsapp: '917301306584', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 7301306584 and landline 0612-2671130 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hindustantimes-patna-463', businessName: 'Hindustan Times — Patna', contactName: '',
        businessType: 'Distributor', whatsapp: '919810904947', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily English newspaper, Patna edition; mobile 9810904947 and landline 0612-2223434 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-milanexpress-banka-464', businessName: 'The Milan Express', contactName: '',
        businessType: 'Distributor', whatsapp: '919430059511', city: 'Banka', district: 'Banka', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily English newspaper, Banka; mobile 9430059511 and landline 0642-2222022 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-safatimes-bettiah-465', businessName: 'Safa Times', contactName: '',
        businessType: 'Distributor', whatsapp: '919958897948', city: 'Bettiah', district: 'West Champaran', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Bettiah; mobile 9958897948 listed by CBC. Publisher contact; verify current status.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-aziztanzim-patna-466', businessName: 'Aziz Tanzim', contactName: '',
        businessType: 'Distributor', whatsapp: '918271692540', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 8271692540 and landline 0612-257342 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-inquilab-patna-467', businessName: 'Inquilab — Patna', contactName: '',
        businessType: 'Distributor', whatsapp: '919717992045', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9717992045 and landline 0612-3918900 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-alwatantimes-patna-468', businessName: 'Al Watan Times', contactName: '',
        businessType: 'Distributor', whatsapp: '919934359611', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9934359611 and landline 0612-2332120 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-latiftimes-patna-469', businessName: 'Latif Times', contactName: '',
        businessType: 'Distributor', whatsapp: '919430984100', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9430984100 and landline 0612-2670082 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-roshniezindagi-patna-470', businessName: 'Roshni E Zindagi', contactName: '',
        businessType: 'Distributor', whatsapp: '918210520511', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 8210520511 and landline 0612-2670082 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-aawaminews-patna-471', businessName: 'Aawami News', contactName: '',
        businessType: 'Distributor', whatsapp: '919431170643', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9431170643 and landline 0612-2577643 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-awazebihar-patna-472', businessName: 'Awaz E Bihar', contactName: '',
        businessType: 'Distributor', whatsapp: '918298678272', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 8298678272 and landline 0612-2670082 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-noorehind-patna-473', businessName: 'Noor-E-Hind', contactName: '',
        businessType: 'Distributor', whatsapp: '919334721229', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9334721229 and landline 0612-2671130 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sonvarshavani-aurangabad-474', businessName: 'Son Varsha Vani', contactName: '',
        businessType: 'Distributor', whatsapp: '919934957121', city: 'Aurangabad', district: 'Aurangabad', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Aurangabad (Bihar); mobile 9934957121 and landline 0631-226116 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-navbihartimes-aurangabad-475', businessName: 'Nav Bihar Times', contactName: '',
        businessType: 'Distributor', whatsapp: '919431223574', city: 'Aurangabad', district: 'Aurangabad', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Aurangabad (Bihar); mobile 9431223574 and landline 0631-226173 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-deshbidesh-bhagalpur-476', businessName: 'Desh Bidesh', contactName: '',
        businessType: 'Distributor', whatsapp: '919137481069', city: 'Bhagalpur', district: 'Bhagalpur', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Bhagalpur; mobile 9137481069 and landline 0641-2501803 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pratahsandesh-darbhanga-477', businessName: 'Pratah Sandesh', contactName: '',
        businessType: 'Distributor', whatsapp: '919810264755', city: 'Darbhanga', district: 'Darbhanga', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Darbhanga; mobile 9810264755 and landline 06272-25214542 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-anugamini-hajipur-478', businessName: 'Anugamini', contactName: '',
        businessType: 'Distributor', whatsapp: '919431650916', city: 'Hajipur', district: 'Vaishali', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Hajipur; mobile 9431650916 and landline 06224-270644 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-aswat-katihar-479', businessName: 'Aswat', contactName: '',
        businessType: 'Distributor', whatsapp: '919140139050', city: 'Katihar', district: 'Katihar', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Katihar; mobile 9140139050 listed by CBC. Publisher contact; confirm current status.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-taasir-muzaffarpur-480', businessName: 'Taasir — Muzaffarpur', contactName: '',
        businessType: 'Distributor', whatsapp: '919431025219', city: 'Muzaffarpur', district: 'Muzaffarpur', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Muzaffarpur; mobile 9431025219 and landline 0621-2201707 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tasdeeque-patna-481', businessName: 'Tasdeeque', contactName: '',
        businessType: 'Distributor', whatsapp: '919835403556', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9835403556 and landline 0612-2370011 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sadaebihar-patna-482', businessName: 'Sada E Bihar', contactName: '',
        businessType: 'Distributor', whatsapp: '917903175169', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 7903175169 and landline 0612-2219074 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-qaumiduniya-patna-483', businessName: 'Qaumi Duniya', contactName: '',
        businessType: 'Distributor', whatsapp: '919811615435', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9811615435 and landline 0612-26953430 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-piyaritanzeem-patna-484', businessName: 'Piyari Tanzeem', contactName: '',
        businessType: 'Distributor', whatsapp: '919905940646', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9905940646 and landline 0612-2224656 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-saharaexpress-patna-485', businessName: 'Sahara Express — Patna', contactName: '',
        businessType: 'Distributor', whatsapp: '919334346898', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9334346898 and landline 0612-2651763 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-waqarehind-patna-486', businessName: 'Waqar E Hind', contactName: '',
        businessType: 'Distributor', whatsapp: '919958274003', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9958274003 and landline 0612-2201707 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-masihulhind-patna-487', businessName: 'Masih Ul Hind', contactName: '',
        businessType: 'Distributor', whatsapp: '919931688703', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9931688703 and landline 0612-2379795 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-divyarashmi-patna-488', businessName: 'Divya Rashmi', contactName: '',
        businessType: 'Distributor', whatsapp: '918986043076', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Monthly Hindi publication, Patna; mobile 8986043076 and landline 0612-2214425 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sonebhadra-patna-489', businessName: 'Sonebhadra Express', contactName: '',
        businessType: 'Distributor', whatsapp: '918368008162', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Patna; mobile 8368008162 listed by CBC. Publisher contact; confirm current circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-dainikbhaskar-bhagalpur-490', businessName: 'Dainik Bhaskar — Bhagalpur', contactName: '',
        businessType: 'Distributor', whatsapp: '919818039099', city: 'Bhagalpur', district: 'Bhagalpur', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Bhagalpur edition; mobile 9818039099 and landline 0641-3988884 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shubhamsandesh-patna-491', businessName: 'Shubham Sandesh', contactName: '',
        businessType: 'Distributor', whatsapp: '919431090899', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Patna; mobile 9431090899 and landline 0612-2507242 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rashtriyasagar-patna-492', businessName: 'Rashtriya Sagar', contactName: '',
        businessType: 'Distributor', whatsapp: '919891227633', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Patna; mobile 9891227633 listed by CBC. Publisher contact; verify current circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-prabhatkhabar-patna-493', businessName: 'Prabhat Khabar — Patna', contactName: '',
        businessType: 'Distributor', whatsapp: '919811572850', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Patna edition; mobile 9811572850 and landline 0612-2540550 listed by CBC. Same mobile also appears for its Bhagalpur/Muzaffarpur editions.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-toi-patna-494', businessName: 'The Times of India — Patna', contactName: '',
        businessType: 'Distributor', whatsapp: '919810419203', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily English newspaper, Patna edition; mobile 9810419203 and landline 0612-2216301 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-shafina-patna-495', businessName: 'Shafina', contactName: '',
        businessType: 'Distributor', whatsapp: '918789342127', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 8789342127 and landline 0612-2680816 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-aalmidarpan-patna-496', businessName: 'Aalmi Darpan', contactName: '',
        businessType: 'Distributor', whatsapp: '919334311970', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9334311970 and landline 0612-2332186 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-amanchain-patna-497', businessName: 'Aman Chain', contactName: '',
        businessType: 'Distributor', whatsapp: '919835033956', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9835033956 and landline 0612-2210799 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-daurejadeed-patna-498', businessName: 'Daur E Jadeed', contactName: '',
        businessType: 'Distributor', whatsapp: '919810094321', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9810094321 and landline 0612-2250452 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-ekqaum-patna-499', businessName: 'Ek Qaum', contactName: '',
        businessType: 'Distributor', whatsapp: '919304979320', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9304979320 listed by CBC. Publisher contact; verify current status.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pyariurdu-patna-500', businessName: 'Pyari Urdu', contactName: '',
        businessType: 'Distributor', whatsapp: '919431821986', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9431821986 and landline 0612-2216144 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-qaumitanzeem-patna-501', businessName: 'Qaumi Tanzeem', contactName: '',
        businessType: 'Distributor', whatsapp: '919431448225', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9431448225 and landline 0612-2675845 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sangam-patna-502', businessName: 'Sangam — Patna', contactName: '',
        businessType: 'Distributor', whatsapp: '918210420745', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 8210420745 and landline 0612-2671936 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-indinon-patna-503', businessName: 'In Dinon', contactName: '',
        businessType: 'Distributor', whatsapp: '919958777786', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9958777786 and landline 0612-23585382 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-farooqui-patna-504', businessName: 'Farooqui Tanzeem', contactName: '',
        businessType: 'Distributor', whatsapp: '919431044046', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9431044046 and landline 0612-2689912 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-qurrahtanzeem-patna-505', businessName: 'The Qurrah Tanzeem', contactName: '',
        businessType: 'Distributor', whatsapp: '919431061062', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9431061062 and landline 0612-2225405 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-roznama-patna-506', businessName: 'Roznama Rashtriya Sahara — Patna', contactName: '',
        businessType: 'Distributor', whatsapp: '918789091154', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 8789091154 and landline 0612-3911421 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-hamarasamaj-patna-507', businessName: 'Hamara Samaj', contactName: '',
        businessType: 'Distributor', whatsapp: '919431470003', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Urdu newspaper, Patna; mobile 9431470003 and landline 0612-2340093 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-bekhaofindia-patna-508', businessName: 'Bekhaof India', contactName: '',
        businessType: 'Distributor', whatsapp: '919334119117', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Monthly Hindi publication, Patna; mobile 9334119117 and landline 0612-6415363 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-rashtriyasahara-patna-509', businessName: 'Rashtriya Sahara — Patna', contactName: '',
        businessType: 'Distributor', whatsapp: '917004534093', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Patna; mobile 7004534093 and landline 0612-2205934 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sampurnabharat-patna-510', businessName: 'Sampurna Bharat', contactName: '',
        businessType: 'Distributor', whatsapp: '919334386881', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Patna; mobile 9334386881 and landline 0612-3252688 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pratakkiran-patna-511', businessName: 'Pratah Kiran — Patna', contactName: '',
        businessType: 'Distributor', whatsapp: '919212228045', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Patna; mobile 9212228045 and landline 0612-43670323 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-yugnaisoch-patna-512', businessName: 'Yug Ki Nai Soch', contactName: '',
        businessType: 'Distributor', whatsapp: '919472072441', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Monthly Hindi publication, Patna; mobile 9472072441 and landline 0612-2524441 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-vivarantimes-patna-513', businessName: 'Vivaran Times', contactName: '',
        businessType: 'Distributor', whatsapp: '919308243682', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Weekly Hindi newspaper, Patna; mobile 9308243682 and landline 0612-3318751 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-tisariankh-patna-514', businessName: 'Tisari Ankh', contactName: '',
        businessType: 'Distributor', whatsapp: '919199365342', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Monthly Hindi publication, Patna; mobile 9199365342 and landline 0612-3208042 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-amritvarsha-patna-515', businessName: 'Amrit Varsha', contactName: '',
        businessType: 'Distributor', whatsapp: '919868608231', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Patna; mobile 9868608231 and landline 0612-2210714 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sattakikhoj-patna-516', businessName: 'Satta Ki Khoj', contactName: '',
        businessType: 'Distributor', whatsapp: '919431427289', city: 'Patna', district: 'Patna', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Patna; mobile 9431427289 and landline 0612-2527857 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-mediadarshan-sasaram-517', businessName: 'Media Darshan', contactName: '',
        businessType: 'Distributor', whatsapp: '919971898328', city: 'Sasaram', district: 'Rohtas', state: 'Bihar',
        source: 'Central Bureau of Communication — Bihar newspaper panel (2021)', notes: 'Daily Hindi newspaper, Sasaram; mobile 9971898328 and landline 06184-230150 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-nafanuksan-jaipur-518', businessName: 'Nafanuksan', contactName: '',
        businessType: 'Distributor', whatsapp: '919829267000', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Central Bureau of Communication — Rajasthan newspaper panel (2021)', notes: 'Daily Hindi publication, Jaipur; mobile 9829267000 and landline 0141-4011152 listed by CBC. Publisher contact; verify current status.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-janhira-jaipur-519', businessName: 'Jan Hira', contactName: '',
        businessType: 'Distributor', whatsapp: '919468768681', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Central Bureau of Communication — Rajasthan newspaper panel (2021)', notes: 'Fortnightly Hindi publication, Jaipur; mobile 9468768681 listed by CBC. Publisher contact; verify current circulation.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-pinkcitydotcom-jaipur-520', businessName: 'Pinkcity Dot Com', contactName: '',
        businessType: 'Distributor', whatsapp: '918003100100', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Central Bureau of Communication — Rajasthan newspaper panel (2021)', notes: 'Fortnightly Hindi publication, Jaipur; mobile 8003100100 and landline 0141-2651400 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-sindhichaman-jaipur-521', businessName: 'Sindhi Chaman', contactName: '',
        businessType: 'Distributor', whatsapp: '918079098089', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Central Bureau of Communication — Rajasthan newspaper panel (2021)', notes: 'Fortnightly Sindhi publication, Jaipur; mobile 8079098089 and landline 0141-2280161 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-subhahkiran-jaipur-522', businessName: 'Subhah Ki Kiran', contactName: '',
        businessType: 'Distributor', whatsapp: '919887423590', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Central Bureau of Communication — Rajasthan newspaper panel (2021)', notes: 'Fortnightly Hindi publication, Jaipur; mobile 9887423590 and landline 0141-5143744 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-royalpatrika-jaipur-523', businessName: 'Royal Patrika', contactName: '',
        businessType: 'Distributor', whatsapp: '919772552446', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Central Bureau of Communication — Rajasthan newspaper panel (2021)', notes: 'Weekly Hindi publication, Jaipur; mobile 9772552446 and landline 0141-2609886 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-badatarajasthan-jaipur-524', businessName: 'Badata Rajasthan', contactName: '',
        businessType: 'Distributor', whatsapp: '919414242258', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Central Bureau of Communication — Rajasthan newspaper panel (2021)', notes: 'Weekly Hindi publication, Jaipur; mobile 9414242258 and landline 0141-2796794 listed by CBC.',
        status: 'New', contactPermission: 'Not Asked', createdAt: '2026-11-03', updatedAt: '2026-11-03',
      },
      {
        id: 'news-schoolihalchal-jaipur-525', businessName: 'Schooli Halchal', contactName: '',
        businessType: 'Distributor', whatsapp: '919414405471', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan',
        source: 'Central Bureau of Communication — Rajasthan newspaper panel (2021)', notes: 'Fortnightly Hindi publication, Jaipur; mobile 9414405471 listed by CBC. Publisher contact; verify current status.',
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
