import fs from 'fs';
import path from 'path';
import { AppDatabase, BrandIdentity, EmailRecord, EmailTemplateDef, TeamMember } from '@/types';
import { EMAIL_TEMPLATES } from './templates-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const INITIAL_BRAND: BrandIdentity = {
  companyNameAr: 'شركة أساس للذكاء الاصطناعي',
  companyNameEn: 'ASAAS AI Enterprise',
  taglineAr: 'منظومة التواصل المؤسسي الذكي وإدارة المراسلات الرسمية',
  taglineEn: 'AI-Powered Enterprise Communications Platform',
  logoUrl: '/logo-dark.png',
  logoDarkUrl: '/logo-light.png',
  primaryColor: '#ba9555',
  secondaryColor: '#221f1f',
  accentColor: '#d3c6b4',
  backgroundColor: '#fcf9f5',
  fontHeading: 'Thmanyah Serif Display',
  fontBody: 'Thmanyah Sans',
  website: 'https://ai-asaas.com',
  phone: '+966 11 400 8899',
  addressAr: 'طريق الملك فهد، برج أساس للأعمال، الطابق 18، الرياض، المملكة العربية السعودية',
  addressEn: 'King Fahd Road, Asaas Business Tower, 18th Floor, Riyadh, Saudi Arabia',
  supportEmail: 'comms@ai-asaas.com',
  officialSignature: {
    signerNameAr: 'م. أيوب العبدالله',
    signerNameEn: 'Eng. Ayoub Al-Abdullah',
    signerTitleAr: 'نائب الرئيس للعمليات الرقمية والذكاء الاصطناعي',
    signerTitleEn: 'VP of Digital Operations & AI',
    departmentAr: 'الإدارة التنفيذية والتحول الرقمي',
    departmentEn: 'Executive Office & Digital Transformation',
    disclaimerAr: 'تنبيه سرية: هذه الرسالة ومرفقاتها ذات طابع سري ومخصصة حصرياً للمستلم الموجه إليه من منسوبي الشركة. يُمنع تداولها أو إعادة إرسالها دون إذن مسبق.',
    disclaimerEn: 'Confidentiality Notice: This communication is confidential and intended solely for the designated recipient within ASAAS AI Enterprise. Any unauthorized disclosure is strictly prohibited.',
  },
  emailHeaderBanner: true,
  emailFooterNote: 'تم إنشاء هذه الرسالة وإرسالها عبر المنصة الداخلية الذكية لشركة أساس للذكاء الاصطناعي.',
};

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'mem-1',
    name: 'م. أيوب العبدالله',
    nameEn: 'Eng. Ayoub Al-Abdullah',
    email: 'ayoub@ai-asaas.com',
    role: 'admin',
    department: 'الإدارة التنفيذية',
    initials: 'أ ع',
    status: 'active',
    phone: '+966 50 111 2233',
    titleAr: 'نائب الرئيس للعمليات والذكاء الاصطناعي',
    titleEn: 'VP of Operations & AI',
    joinedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'mem-2',
    name: 'سارة الشمري',
    nameEn: 'Sarah Al-Shammari',
    email: 'sarah.s@ai-asaas.com',
    role: 'manager',
    department: 'إدارة المنتجات',
    initials: 'س ش',
    status: 'active',
    phone: '+966 55 222 3344',
    titleAr: 'مديرة المنتجات الرقمية',
    titleEn: 'Head of Digital Products',
    joinedAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'mem-3',
    name: 'فيصل القحطاني',
    nameEn: 'Faisal Al-Qahtani',
    email: 'faisal.q@ai-asaas.com',
    role: 'member',
    department: 'هندسة الذكاء الاصطناعي',
    initials: 'ف ق',
    status: 'active',
    phone: '+966 54 333 4455',
    titleAr: 'كبير مهندسي نماذج الذكاء الاصطناعي',
    titleEn: 'Lead AI Systems Architect',
    joinedAt: '2024-03-10T08:30:00Z',
  },
  {
    id: 'mem-4',
    name: 'نورة الدوسري',
    nameEn: 'Noura Al-Dossary',
    email: 'noura.d@ai-asaas.com',
    role: 'manager',
    department: 'الموارد البشرية والعمليات',
    initials: 'ن د',
    status: 'active',
    phone: '+966 56 444 5566',
    titleAr: 'مديرة الموارد البشرية والتوظيف',
    titleEn: 'Human Resources Director',
    joinedAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'mem-5',
    name: 'عمر السعيد',
    nameEn: 'Omar Al-Saeed',
    email: 'omar.s@ai-asaas.com',
    role: 'member',
    department: 'تطوير البرمجيات',
    initials: 'ع س',
    status: 'active',
    phone: '+966 53 555 6677',
    titleAr: 'مهندس أول Full-Stack',
    titleEn: 'Senior Full-Stack Engineer',
    joinedAt: '2024-04-05T09:15:00Z',
  },
  {
    id: 'mem-6',
    name: 'ريم المالكي',
    nameEn: 'Reem Al-Malki',
    email: 'reem.m@ai-asaas.com',
    role: 'member',
    department: 'الاتصال المؤسسي والتسويق',
    initials: 'ر م',
    status: 'active',
    phone: '+966 59 666 7788',
    titleAr: 'أخصائية الاتصال المؤسسي والإعلام',
    titleEn: 'Corporate Comms & Media Specialist',
    joinedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'mem-7',
    name: 'خالد العتيبي',
    nameEn: 'Khaled Al-Otaibi',
    email: 'khaled.o@ai-asaas.com',
    role: 'manager',
    department: 'الإدارة المالية',
    initials: 'خ ع',
    status: 'active',
    phone: '+966 50 777 8899',
    titleAr: 'المدير المالي التنفيذي',
    titleEn: 'Chief Financial Officer (CFO)',
    joinedAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'mem-8',
    name: 'لما التميمي',
    nameEn: 'Lama Al-Tamimi',
    email: 'lama.t@ai-asaas.com',
    role: 'member',
    department: 'مكتب إدارة المشاريع (PMO)',
    initials: 'ل ت',
    status: 'active',
    phone: '+966 55 888 9900',
    titleAr: 'مديرة مشاريع تقنية',
    titleEn: 'Technical Project Manager',
    joinedAt: '2024-05-01T08:45:00Z',
  },
  {
    id: 'mem-9',
    name: 'تركي الغامدي',
    nameEn: 'Turki Al-Ghamdi',
    email: 'turki.g@ai-asaas.com',
    role: 'admin',
    department: 'الأمن السيبراني والامتثال',
    initials: 'ت غ',
    status: 'active',
    phone: '+966 54 999 0011',
    titleAr: 'رئيس قسم الأمن السيبراني وحماية البيانات',
    titleEn: 'Head of Cybersecurity & Compliance',
    joinedAt: '2024-02-20T08:00:00Z',
  },
  {
    id: 'mem-10',
    name: 'هدى الشهري',
    nameEn: 'Huda Al-Shehri',
    email: 'huda.s@ai-asaas.com',
    role: 'member',
    department: 'تصميم تجربة المستخدم',
    initials: 'هـ ش',
    status: 'active',
    phone: '+966 56 123 4567',
    titleAr: 'مصممة واجهات وتجربة مستخدم أولى',
    titleEn: 'Lead UI/UX Designer',
    joinedAt: '2024-03-01T09:30:00Z',
  },
  {
    id: 'mem-11',
    name: 'محمد الحربي',
    nameEn: 'Mohammed Al-Harbi',
    email: 'mohammed.h@ai-asaas.com',
    role: 'member',
    department: 'البنية التحتية والسحابية',
    initials: 'م ح',
    status: 'active',
    phone: '+966 53 234 5678',
    titleAr: 'مهندس سحابي وعمليات DevOps',
    titleEn: 'Cloud & DevOps Architect',
    joinedAt: '2024-04-18T08:15:00Z',
  },
  {
    id: 'mem-12',
    name: 'دينا الزهراني',
    nameEn: 'Deena Al-Zahrani',
    email: 'deena.z@ai-asaas.com',
    role: 'member',
    department: 'الدعم الإداري والمكتبي',
    initials: 'د ز',
    status: 'active',
    phone: '+966 59 345 6789',
    titleAr: 'منسقة العمليات والمكتب التنفيذي',
    titleEn: 'Executive Operations Coordinator',
    joinedAt: '2024-06-01T08:00:00Z',
  },
];

const INITIAL_EMAILS: EmailRecord[] = [
  {
    id: 'em-101',
    subject: 'تعميم إداري: إطلاق منظومة المراسلات الداخلية الذكية لشركة أساس',
    headline: 'إطلاق منصة التواصل الداخلي المعتمدة رسمياً',
    templateId: 'announcement',
    language: 'ar',
    senderName: 'م. أيوب العبدالله',
    senderEmail: 'ayoub@ai-asaas.com',
    to: ['all-team@ai-asaas.com'],
    cc: ['executive@ai-asaas.com'],
    bcc: [],
    content: {
      subject: 'تعميم إداري: إطلاق منظومة المراسلات الداخلية الذكية لشركة أساس',
      headline: 'إطلاق منصة التواصل الداخلي المعتمدة رسمياً',
      summary: 'يسر الإدارة التنفيذية إعلان بدء العمل رسمياً بمنظومة المراسلات الداخلية المدعومة بالذكاء الاصطناعي لتوحيد الهوية المؤسسية وتسريع التواصل.',
      templateId: 'announcement',
      language: 'ar',
      urgency: 'high',
      sections: [
        {
          title: 'الأهداف الاستراتيجية للإطلاق',
          content: 'تهدف المنصة إلى توحيد الهوية البصرية لجميع الخطابات والمراسلات الرسمية وتسهيل صياغة الرسائل عبر المساعد الذكي بما يعزز الاحترافية ويضمن سرعة التنسيق الداخلي بين مختلف الإدارات.',
          type: 'paragraph',
        },
        {
          title: 'التعليمات والتوجيهات',
          content: 'يرجى من كافة الزملاء والمدراء استخدام المنصة لكافة المراسلات الرسمية والتعاميم ودعوات الاجتماعات.',
          type: 'bullet_list',
          data: [
            'الاعتماد الحصري على قوالب المنصة الموحدة بدءاً من مطلع هذا الأسبوع.',
            'التأكد من مراجعة المستلمين الرسميين (To/CC) عبر دليل أعضاء الشركة.',
            'تطبيق توقيع الهوية المعتمد المضمن تلقائياً دون تعديل يدوي.',
          ],
        },
      ],
      callToAction: {
        text: 'دخول المنصة وتجربة إنشاء إيميل',
        url: 'https://ai-asaas.com/comms',
        style: 'primary',
      },
    },
    renderedHtml: '',
    status: 'sent',
    sentAt: '2026-11-05T09:30:00Z',
    createdAt: '2026-11-05T09:20:00Z',
    updatedAt: '2026-11-05T09:30:00Z',
    provider: 'test',
    providerResponse: { messageId: 'msg-seed-101', status: 'delivered', provider: 'Simulation Engine' },
  },
  {
    id: 'em-102',
    subject: 'دعوة لحضور ورشة عمل: استعراض مخرجات نماذج الذكاء الاصطناعي التوليدي',
    headline: 'جلسة العمل الربعية لمراجعة النماذج التوليدية',
    templateId: 'meeting_invitation',
    language: 'ar',
    senderName: 'فيصل القحطاني',
    senderEmail: 'faisal.q@ai-asaas.com',
    to: ['faisal.q@ai-asaas.com', 'sarah.s@ai-asaas.com', 'omar.s@ai-asaas.com'],
    cc: ['ayoub@ai-asaas.com'],
    bcc: [],
    content: {
      subject: 'دعوة لحضور ورشة عمل: استعراض مخرجات نماذج الذكاء الاصطناعي التوليدي',
      headline: 'جلسة العمل الربعية لمراجعة النماذج التوليدية',
      summary: 'ندعوكم لحضور الجلسة الفنية المفتوحة لمناقشة أداء نماذج المعالجة اللغوية ودقة استخراج القوالب البريدية.',
      templateId: 'meeting_invitation',
      language: 'ar',
      urgency: 'normal',
      sections: [
        {
          title: 'تفاصيل الموعد والمكان',
          content: 'الأحد القادم الساعة 10:00 صباحاً حتى 11:30 صباحاً | قاعة الابتكار وقناة Microsoft Teams',
          type: 'key_value',
          data: {
            'اليوم والتاريخ': 'الأحد 10 نوفمبر 2026',
            'التوقيت': '10:00 ص - 11:30 ص (بتوقيت مكة المكرمة)',
            'الموقع': 'قاعة الابتكار (الطابق 18) ورابط Teams الافتراضي',
          },
        },
        {
          title: 'جدول الأعمال الرئيسي',
          content: 'نقاط النقاش في الجلسة',
          type: 'bullet_list',
          data: [
            'استعراض دقة تصنيف النوايا واختيار القوالب الذكية.',
            'قياس سرعة المعالجة واستجابة نماذج التوليد.',
            'مناقشة سيناريوهات التعديل اللغوي متعدد الجولات.',
          ],
        },
      ],
      callToAction: {
        text: 'الانضمام للاجتماع الافتراضي عبر Teams',
        url: 'https://teams.microsoft.com/l/meetup-join/asaas-ai-sync',
        style: 'primary',
      },
    },
    renderedHtml: '',
    status: 'sent',
    sentAt: '2026-11-05T14:15:00Z',
    createdAt: '2026-11-05T14:00:00Z',
    updatedAt: '2026-11-05T14:15:00Z',
    provider: 'test',
    providerResponse: { messageId: 'msg-seed-102', status: 'delivered', provider: 'Simulation Engine' },
  },
];

function getDatabase(): AppDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: AppDatabase = {
      brand: INITIAL_BRAND,
      members: INITIAL_MEMBERS,
      emails: INITIAL_EMAILS,
      templates: EMAIL_TEMPLATES,
      settings: {
        email: {
          activeProvider: 'test',
          testMode: true,
          senderAddress: 'internal-comms@ai-asaas.com',
          senderName: 'ASAAS AI Corporate Comms',
        },
        ai: {
          provider: 'gemini',
          model: 'gemini-2.5-flash',
          temperature: 0.2,
          customSystemPrompt: 'You are the enterprise communications AI for ASAAS AI Enterprise. Always write dignified, crisp, highly professional corporate Arabic and English emails adhering strictly to company brand identity and tone.',
        },
      },
      auditLogs: [
        {
          id: 'log-1',
          action: 'PLATFORM_INITIALIZED',
          userEmail: 'ayoub@ai-asaas.com',
          targetType: 'SYSTEM',
          details: 'Initialized ASAAS AI Internal Email Platform with 12 enterprise templates and 12 team members.',
          timestamp: '2026-11-05T08:00:00Z',
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data) as AppDatabase;
    // ensure templates match latest
    if (!parsed.templates || parsed.templates.length === 0) {
      parsed.templates = EMAIL_TEMPLATES;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse database.json, resetting to default', err);
    return {
      brand: INITIAL_BRAND,
      members: INITIAL_MEMBERS,
      emails: INITIAL_EMAILS,
      templates: EMAIL_TEMPLATES,
      settings: {
        email: {
          activeProvider: 'test',
          testMode: true,
          senderAddress: 'internal-comms@ai-asaas.com',
          senderName: 'ASAAS AI Corporate Comms',
        },
        ai: {
          provider: 'gemini',
          model: 'gemini-2.5-flash',
          temperature: 0.2,
        },
      },
      auditLogs: [],
    };
  }
}

function saveDatabase(db: AppDatabase): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Brand CRUD
export function getBrand(): BrandIdentity {
  return getDatabase().brand;
}

export function updateBrand(brandUpdate: Partial<BrandIdentity>): BrandIdentity {
  const db = getDatabase();
  db.brand = { ...db.brand, ...brandUpdate };
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'BRAND_UPDATED',
    userEmail: 'admin@ai-asaas.com',
    targetType: 'BRAND',
    details: 'Updated company brand guidelines and visual identity assets.',
    timestamp: new Date().toISOString(),
  });
  saveDatabase(db);
  return db.brand;
}

// Members CRUD
export function getMembers(): TeamMember[] {
  return getDatabase().members;
}

export function getMemberById(id: string): TeamMember | undefined {
  return getDatabase().members.find((m) => m.id === id);
}

export function addMember(member: Omit<TeamMember, 'id' | 'joinedAt'>): TeamMember {
  const db = getDatabase();
  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join(' ');
  const newMember: TeamMember = {
    ...member,
    id: `mem-${Date.now()}`,
    initials: initials || 'ع',
    joinedAt: new Date().toISOString(),
  };
  db.members.push(newMember);
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'MEMBER_INVITED',
    userEmail: 'admin@ai-asaas.com',
    targetType: 'MEMBER',
    details: `Added new team member: ${newMember.name} (${newMember.email}) to department: ${newMember.department}`,
    timestamp: new Date().toISOString(),
  });
  saveDatabase(db);
  return newMember;
}

export function updateMember(id: string, updates: Partial<TeamMember>): TeamMember | null {
  const db = getDatabase();
  const index = db.members.findIndex((m) => m.id === id);
  if (index === -1) return null;
  db.members[index] = { ...db.members[index], ...updates };
  saveDatabase(db);
  return db.members[index];
}

export function deleteMember(id: string): boolean {
  const db = getDatabase();
  const index = db.members.findIndex((m) => m.id === id);
  if (index === -1) return false;
  const removed = db.members.splice(index, 1)[0];
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'MEMBER_REMOVED',
    userEmail: 'admin@ai-asaas.com',
    targetType: 'MEMBER',
    details: `Removed team member: ${removed.name} (${removed.email})`,
    timestamp: new Date().toISOString(),
  });
  saveDatabase(db);
  return true;
}

// Emails CRUD
export function getEmails(): EmailRecord[] {
  return getDatabase().emails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getEmailById(id: string): EmailRecord | undefined {
  return getDatabase().emails.find((e) => e.id === id);
}

export function saveEmailRecord(record: EmailRecord): EmailRecord {
  const db = getDatabase();
  const index = db.emails.findIndex((e) => e.id === record.id);
  if (index >= 0) {
    db.emails[index] = { ...record, updatedAt: new Date().toISOString() };
  } else {
    db.emails.unshift(record);
  }
  if (record.status === 'sent') {
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      action: 'EMAIL_SENT',
      userEmail: record.senderEmail,
      targetType: 'EMAIL',
      details: `Sent email "${record.subject}" to ${record.to.length} primary recipients using template ${record.templateId}`,
      timestamp: new Date().toISOString(),
    });
  }
  saveDatabase(db);
  return record;
}

export function deleteEmailRecord(id: string): boolean {
  const db = getDatabase();
  const index = db.emails.findIndex((e) => e.id === id);
  if (index === -1) return false;
  db.emails.splice(index, 1);
  saveDatabase(db);
  return true;
}

// Find or auto-register member on Gmail / Google Login
export function findOrCreateMemberByEmail(params: {
  email: string;
  name?: string;
  avatar?: string;
  provider?: 'google' | 'email';
  department?: string;
}): { member: TeamMember; isNew: boolean } {
  const db = getDatabase();
  const cleanEmail = params.email.toLowerCase().trim();
  const existingIndex = db.members.findIndex((m) => m.email.toLowerCase() === cleanEmail);

  if (existingIndex >= 0) {
    // Update existing member if new info provided
    if (params.name && !db.members[existingIndex].name) {
      db.members[existingIndex].name = params.name;
    }
    if (params.avatar) {
      db.members[existingIndex].avatar = params.avatar;
    }
    saveDatabase(db);
    return { member: db.members[existingIndex], isNew: false };
  }

  // Auto-register new member from Gmail / Google login!
  const displayName = params.name || cleanEmail.split('@')[0];
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join(' ')
    .toUpperCase();

  const newMember: TeamMember = {
    id: `mem-${Date.now()}`,
    name: displayName,
    nameEn: displayName,
    email: cleanEmail,
    role: 'member',
    department: params.department || 'منسوب جديد (Gmail)',
    avatar: params.avatar,
    initials: initials || 'ع',
    status: 'active',
    titleAr: 'عضو فريق معتمد',
    titleEn: 'Verified Team Member',
    joinedAt: new Date().toISOString(),
    provider: params.provider || 'google',
  };

  db.members.push(newMember);
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'MEMBER_GMAIL_AUTO_REGISTERED',
    userEmail: cleanEmail,
    targetType: 'AUTH',
    details: `سجل المستخدم ${displayName} دخوله عبر Gmail (${cleanEmail}) وتم إدراجه تلقائياً في قائمة أعضاء المنصة.`,
    timestamp: new Date().toISOString(),
  });
  saveDatabase(db);
  return { member: newMember, isNew: true };
}

// Templates CRUD
export function getTemplates(): EmailTemplateDef[] {
  const db = getDatabase();
  if (!db.templates || db.templates.length === 0) {
    db.templates = [...EMAIL_TEMPLATES];
    saveDatabase(db);
  }
  return db.templates;
}

export function getTemplateById(id: string): EmailTemplateDef | undefined {
  const templates = getTemplates();
  return templates.find((t) => t.id === id);
}

export function addCustomTemplate(template: Omit<EmailTemplateDef, 'id'>): EmailTemplateDef {
  const db = getDatabase();
  if (!db.templates || db.templates.length === 0) {
    db.templates = [...EMAIL_TEMPLATES];
  }

  const id = `tmpl-custom-${Date.now()}`;
  const newTemplate: EmailTemplateDef = {
    ...template,
    id,
    slug: template.slug || `custom-${Date.now()}`,
    isCustom: true,
    createdAt: new Date().toISOString(),
  };

  db.templates.push(newTemplate);
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'TEMPLATE_CREATED',
    userEmail: 'admin@ai-asaas.com',
    targetType: 'TEMPLATE',
    details: `تم إنشاء قالب بريد جديد: "${newTemplate.nameAr}" (${newTemplate.nameEn}) وإضافته لمكتبة القوالب.`,
    timestamp: new Date().toISOString(),
  });
  saveDatabase(db);
  return newTemplate;
}

export function deleteCustomTemplate(id: string): boolean {
  const db = getDatabase();
  const index = db.templates.findIndex((t) => t.id === id);
  if (index === -1) return false;
  const removed = db.templates.splice(index, 1)[0];
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action: 'TEMPLATE_DELETED',
    userEmail: 'admin@ai-asaas.com',
    targetType: 'TEMPLATE',
    details: `تم حذف القالب: "${removed.nameAr}"`,
    timestamp: new Date().toISOString(),
  });
  saveDatabase(db);
  return true;
}

// Settings
export function getSettings() {
  const db = getDatabase();
  return db.settings;
}

export function updateSettings(settingsUpdate: {
  email?: Partial<AppDatabase['settings']['email']>;
  ai?: Partial<AppDatabase['settings']['ai']>;
}) {
  const db = getDatabase();
  if (settingsUpdate.email) {
    db.settings.email = { ...db.settings.email, ...settingsUpdate.email };
  }
  if (settingsUpdate.ai) {
    db.settings.ai = { ...db.settings.ai, ...settingsUpdate.ai };
  }
  saveDatabase(db);
  return db.settings;
}

// Audit Logs
export function getAuditLogs() {
  return getDatabase().auditLogs;
}
