/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Follow-up' | 'Converted' | 'Not Interested';

export type BusinessCategory =
  | 'Coaching Institute'
  | 'Restaurant & Cafe'
  | 'Healthcare & Clinic'
  | 'Retail & Shop'
  | 'E-Commerce'
  | 'Real Estate'
  | 'Professional Services'
  | 'Manufacturing'
  | 'Salon & Beauty'
  | 'Portfolio / Personal'
  | 'Other';

export interface LeadNote {
  id: string;
  date: string;
  note: string;
  type: 'call' | 'whatsapp' | 'meeting' | 'general';
}

export interface Lead {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  category: BusinessCategory;
  status: LeadStatus;
  notesHistory: LeadNote[];
  followUpDate?: string;
  followUpTime?: string;
  estimatedBudget?: number;
  interestedPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: number;
  deliveryDays: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface QuotationAddon {
  id: string;
  name: string;
  price: number;
  selected?: boolean;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  leadId?: string;
  clientName: string;
  clientBusiness: string;
  clientPhone: string;
  clientEmail?: string;
  clientAddress?: string;
  planId: string;
  planName: string;
  basePrice: number;
  addons: QuotationAddon[];
  discount: number;
  finalPrice: number;
  advanceAmount: number;
  remainingAmount: number;
  timeline: string;
  deliverables: string[];
  terms: string[];
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  createdAt: string;
  validUntil: string;
}

export interface DemoTemplate {
  id: string;
  title: string;
  category: BusinessCategory;
  previewImage: string;
  demoUrl: string;
  description: string;
  features: string[];
  tags: string[];
}

export type ProjectStage =
  | 'Enquiry'
  | 'Discussion'
  | 'Advance Received'
  | 'Design'
  | 'Development'
  | 'Client Review'
  | 'Final Payment'
  | 'Delivered';

export interface ProjectTaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  clientName: string;
  clientBusiness: string;
  clientPhone: string;
  clientEmail?: string;
  leadId?: string;
  quotationId?: string;
  projectName: string;
  selectedPackage: string;
  startDate: string;
  deadline: string;
  stage: ProjectStage;
  progress: number;
  tasks: ProjectTaskItem[];
  totalAmount: number;
  advancePaid: number;
  remainingAmount: number;
  notes: string;
  // Delivery & Handover fields
  liveUrl?: string;
  domainInfo?: string;
  hostingPlatform?: string;
  handoverStatus?: 'Pending' | 'Credentials Sent' | 'Training Provided' | 'Delivered';
  deliveryDate?: string;
  supportNotes?: string;
  credentialsSecure?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  projectId: string;
  clientName: string;
  projectName: string;
  amount: number;
  paymentType: 'Advance' | 'Remaining' | 'Full' | 'Milestone';
  paymentMethod: 'UPI' | 'Bank Transfer' | 'Cash' | 'Card' | 'Cheque';
  paymentDate: string;
  utrOrRef?: string;
  notes?: string;
  createdAt: string;
}

export interface AgencyTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  priority: 'High' | 'Medium' | 'Low';
  relatedClientId?: string;
  relatedClientName?: string;
  relatedProjectId?: string;
  status: 'Pending' | 'Completed';
  createdAt: string;
}

export interface AgencySettings {
  agencyName: string;
  tagline: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  upiId: string;
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifsc: string;
    branch: string;
  };
  currency: string;
  currencySymbol: string;
  termsAndConditions: string[];
  privacyMode: boolean;
  pinProtectionEnabled: boolean;
  securityPin: string;
}

export type MessageTemplateType =
  | 'intro'
  | 'followup'
  | 'pricing'
  | 'demo'
  | 'payment_advance'
  | 'payment_final'
  | 'handover';

export interface MessageTemplate {
  id: MessageTemplateType;
  title: string;
  englishText: string;
  marathiText: string;
}


export type ProspectBusinessType = 'Newspaper Vendor' | 'Newspaper Agency' | 'Distributor';
export type ProspectStatus = 'New' | 'Contacted' | 'Interested' | 'Demo Given' | 'Converted' | 'Not Interested';
export type ContactPermission = 'Not Asked' | 'Opted In' | 'Opted Out';

export interface NewspaperProspect {
  id: string;
  businessName: string;
  contactName: string;
  businessType: ProspectBusinessType;
  whatsapp: string;
  city: string;
  district: string;
  state: string;
  website?: string;
  source?: string;
  notes?: string;
  status: ProspectStatus;
  contactPermission: ContactPermission;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}
