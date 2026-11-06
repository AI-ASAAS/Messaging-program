export type Role = 'admin' | 'manager' | 'member';

export interface TeamMember {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  role: Role;
  department: string;
  avatar?: string;
  initials: string;
  status: 'active' | 'invited';
  phone?: string;
  titleAr: string;
  titleEn: string;
  joinedAt: string;
  provider?: 'google' | 'email' | 'system';
}

export interface BrandIdentity {
  companyNameAr: string;
  companyNameEn: string;
  taglineAr: string;
  taglineEn: string;
  logoUrl: string;
  logoDarkUrl: string;
  primaryColor: string; // e.g. #ba9555 (Gold)
  secondaryColor: string; // e.g. #221f1f (Ink)
  accentColor: string; // e.g. #d3c6b4 (Sand)
  backgroundColor: string; // e.g. #fcf9f5 (Paper)
  fontHeading: string;
  fontBody: string;
  website: string;
  phone: string;
  addressAr: string;
  addressEn: string;
  supportEmail: string;
  officialSignature: {
    signerNameAr: string;
    signerNameEn: string;
    signerTitleAr: string;
    signerTitleEn: string;
    departmentAr: string;
    departmentEn: string;
    disclaimerAr: string;
    disclaimerEn: string;
  };
  emailHeaderBanner: boolean;
  emailFooterNote: string;
}

export type TemplateCategory =
  | 'announcements'
  | 'meetings'
  | 'projects'
  | 'hr'
  | 'approvals'
  | 'general'
  | 'custom'
  | string;

export interface EmailTemplateDef {
  id: string;
  slug: string;
  category: TemplateCategory;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  accentColor: string;
  defaultSubjectAr: string;
  defaultSubjectEn: string;
  features: string[];
  isCustom?: boolean;
  createdAt?: string;
}

export interface EmailSection {
  title?: string;
  content: string;
  type: 'paragraph' | 'key_value' | 'bullet_list' | 'callout' | 'table';
  data?: Record<string, string> | Array<Record<string, string>> | string[];
}

export interface EmailContent {
  subject: string;
  headline: string;
  summary: string;
  templateId: string;
  language: 'ar' | 'en';
  urgency: 'normal' | 'high' | 'urgent';
  sections: EmailSection[];
  callToAction?: {
    text: string;
    url: string;
    style?: 'primary' | 'secondary';
  };
  customNotes?: string;
}

export interface EmailRecord {
  id: string;
  subject: string;
  headline: string;
  templateId: string;
  language: 'ar' | 'en';
  senderName: string;
  senderEmail: string;
  to: string[];
  cc: string[];
  bcc: string[];
  content: EmailContent;
  renderedHtml: string;
  status: 'draft' | 'sent' | 'failed' | 'queued';
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  provider: 'resend' | 'smtp' | 'test';
  providerResponse?: any;
  errorMessage?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedTemplateId?: string;
  suggestedRecipients?: string[];
  clarifyingQuestions?: string[];
  emailSnapshot?: EmailContent;
}

export interface EmailProviderSettings {
  activeProvider: 'test' | 'resend' | 'smtp';
  testMode: boolean;
  senderAddress: string;
  senderName: string;
  resendApiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
}

export interface AISettings {
  provider: 'gemini';
  model: string;
  apiKey?: string;
  temperature: number;
  customSystemPrompt?: string;
}

export interface AppDatabase {
  brand: BrandIdentity;
  members: TeamMember[];
  emails: EmailRecord[];
  templates: EmailTemplateDef[];
  settings: {
    email: EmailProviderSettings;
    ai: AISettings;
  };
  auditLogs: {
    id: string;
    action: string;
    userEmail: string;
    targetType: string;
    details: string;
    timestamp: string;
  }[];
}
