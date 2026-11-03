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
