'use client';

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Sidebar,
} from '@/components/Sidebar';
import { ChatWorkspace } from '@/components/ChatWorkspace';
import { LiveEmailPreview } from '@/components/LiveEmailPreview';
import { SentEmailsView } from '@/components/SentEmailsView';
import { TeamMembersView } from '@/components/TeamMembersView';
import { TemplatesView } from '@/components/TemplatesView';
import { BrandIdentityView } from '@/components/BrandIdentityView';
import { AdminSettingsView } from '@/components/AdminSettingsView';
import { LoginModal } from '@/components/LoginModal';
import {
  BrandIdentity,
  ChatMessage,
  EmailContent,
  EmailRecord,
  EmailTemplateDef,
  TeamMember,
} from '@/types';
import { EMAIL_TEMPLATES } from '@/lib/templates-data';
import confetti from 'canvas-confetti';
import { Check, Sparkles, UserCheck } from 'lucide-react';

const DEFAULT_BRAND: BrandIdentity = {
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

const DEFAULT_INITIAL_EMAIL: EmailContent = {
  subject: 'دعوة اجتماع: مواءمة خطة إطلاق منصة المراسلات الذكية - يوم الأحد 10:00 ص',
  headline: 'دعوة لحضور الاجتماع التنسيقي لإطلاق المنصة',
  summary: 'يسعدنا دعوتكم لحضور الاجتماع التنسيقي الخاص بمراجعة الجاهزية التشغيلية وإطلاق منصة التواصل الداخلي المعتمدة رسمياً لشركة أساس.',
  templateId: 'meeting_invitation',
  language: 'ar',
  urgency: 'high',
  sections: [
    {
      title: 'بيانات وتوقيت الاجتماع',
      content: 'تفاصيل الحضور والانعقاد الرسمي',
      type: 'key_value',
      data: {
        'اليوم والتاريخ': 'الأحد القادم، 10 نوفمبر 2026',
        'التوقيت': '10:00 ص - 11:00 ص (بتوقيت مكة المكرمة)',
        'المقر': 'قاعة الابتكار الرئيسية (الطابق 18) وعبر رابط Teams',
        'المنسق': 'مكتب العمليات والتحول الرقمي',
      },
    },
    {
      title: 'جدول الأعمال والمحاور الرئيسية',
      content: 'الموضوعات المدرجة للنقاش',
      type: 'bullet_list',
      data: [
        'استعراض جاهزية قوالب المراسلات الرسمية ومواءمتها مع هوية الشركة.',
        'تدريب ممثلي الإدارات على تجربة إنشاء الإيميلات عبر المساعد الذكي.',
        'مراجعة آلية التحقق من المستلمين والتأكيد الأمني قبل الإرسال.',
        'تحديد تاريخ الإطلاق الشامل لكافة منسوبي المنشأة.',
      ],
    },
    {
      title: 'إرشادات التحضير المسبق',
      content: 'نرجو من ممثلي الأقسام مراجعة قائمة المستلمين التابعين لإداراتهم قبل موعد الاجتماع وتجهيز الملاحظات التنظيمية.',
      type: 'callout',
    },
  ],
  callToAction: {
    text: 'الانضمام للاجتماع الافتراضي عبر Teams',
    url: 'https://teams.microsoft.com/l/meetup-join/asaas-comms',
    style: 'primary',
  },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('new');
  const [brand, setBrand] = useState<BrandIdentity>(DEFAULT_BRAND);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [templates, setTemplates] = useState<EmailTemplateDef[]>(EMAIL_TEMPLATES);

  // Authentication State
  const [loggedInUser, setLoggedInUser] = useState<TeamMember | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<{ text: string; icon?: 'user' | 'check' } | null>(null);

  // Studio State
  const [currentEmail, setCurrentEmail] = useState<EmailContent>(DEFAULT_INITIAL_EMAIL);
  const [to, setTo] = useState<string[]>(['all-team@ai-asaas.com']);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [suggestedRecipients, setSuggestedRecipients] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);

  const showGlobalToast = (text: string, icon: 'user' | 'check' = 'check') => {
    setGlobalToast({ text, icon });
    setTimeout(() => setGlobalToast(null), 4500);
  };

  const loadData = async () => {
    try {
      const [brandRes, membersRes, emailsRes, templatesRes] = await Promise.all([
        fetch('/api/brand'),
        fetch('/api/members'),
        fetch('/api/emails'),
        fetch('/api/templates'),
      ]);

      if (brandRes.ok) {
        const b = await brandRes.json();
        if (b.brand) setBrand(b.brand);
      }
      if (membersRes.ok) {
        const m = await membersRes.json();
        if (m.members) {
          setMembers(m.members);
          // Set initial suggestion
          if (suggestedRecipients.length === 0 && m.members.length > 0) {
            setSuggestedRecipients(m.members.slice(0, 3).map((item: TeamMember) => item.email));
          }
        }
      }
      if (emailsRes.ok) {
        const e = await emailsRes.json();
        if (e.emails) setEmails(e.emails);
      }
      if (templatesRes.ok) {
        const t = await templatesRes.json();
        if (t.templates) setTemplates(t.templates);
      }
    } catch (err) {
      console.error('Error loading platform data:', err);
    }
  };

  useEffect(() => {
    loadData();

    // Restore login session from localStorage
    try {
      const savedUser = localStorage.getItem('asaas_email_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as TeamMember;
        setLoggedInUser(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLoginSuccess = (member: TeamMember, isNew: boolean) => {
    setLoggedInUser(member);
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === member.id || m.email.toLowerCase() === member.email.toLowerCase());
      if (exists) {
        return prev.map((m) => (m.email.toLowerCase() === member.email.toLowerCase() ? member : m));
      }
      return [member, ...prev];
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#ba9555', '#4285F4', '#34A853', '#EA4335'],
      });
    } catch (e) {
      // confetti
    }

    if (isNew) {
      showGlobalToast(
        `أهلاً بك يا ${member.name}! تم تسجيل دخولك بنجاح عبر Gmail وإدراجك تلقائياً في قائمة أعضاء الفريق.`,
        'user'
      );
    } else {
      showGlobalToast(`مرحباً بعودتك يا ${member.name}! تم تسجيل الدخول بنجاح.`, 'check');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    try {
      localStorage.removeItem('asaas_email_user');
    } catch (e) {
      // ignore
    }
    showGlobalToast('تم تسجيل الخروج بنجاح. أنت الآن في وضع الحساب الافتراضي.', 'check');
  };

  const handleEmailGenerated = (newEmail: EmailContent, suggested?: string[]) => {
    setCurrentEmail(newEmail);
    if (suggested && suggested.length > 0) {
      setSuggestedRecipients(suggested);
    }
  };

  const handleSendSuccess = (sentRecord: EmailRecord) => {
    setEmails((prev) => [sentRecord, ...prev]);
  };

  const handleReuseEmail = (record: EmailRecord) => {
    setCurrentEmail(record.content);
    setTo(record.to || []);
    setCc(record.cc || []);
    setBcc(record.bcc || []);
    setActiveTab('new');
  };

  const handleSelectTemplate = (template: EmailTemplateDef) => {
    setCurrentEmail((prev) => ({
      ...prev,
      templateId: template.id,
      subject: template.defaultSubjectAr,
      headline: template.nameAr,
    }));
    setActiveTab('new');
  };

  const handleSendToMember = (memberEmail: string) => {
    setTo([memberEmail]);
    setActiveTab('new');
  };

  const handleTemplateCreated = (newTmpl: EmailTemplateDef) => {
    setTemplates((prev) => [...prev, newTmpl]);
    showGlobalToast(`تمت إضافة القالب الجديد "${newTmpl.nameAr}" بنجاح!`, 'check');
  };

  // Current Logged in User fallback
  const currentUser: TeamMember = loggedInUser || members[0] || {
    id: 'mem-1',
    name: 'م. أيوب العبدالله',
    nameEn: 'Eng. Ayoub Al-Abdullah',
    email: 'ayoub@ai-asaas.com',
    role: 'admin',
    department: 'الإدارة التنفيذية',
    initials: 'أ ع',
    status: 'active',
    titleAr: 'نائب الرئيس للعمليات والذكاء الاصطناعي',
    titleEn: 'VP of Operations & AI',
    joinedAt: new Date().toISOString(),
  };

  const sentCount = emails.filter((e) => e.status === 'sent').length;
  const draftCount = emails.filter((e) => e.status === 'draft').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fcf9f5] text-[#221f1f] relative">
      {/* Global Toast Notification */}
      {globalToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-gradient-to-r from-[#1a1717] to-[#292423] text-white rounded-2xl shadow-2xl border border-[#ba9555]/50 flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          {globalToast.icon === 'user' ? (
            <UserCheck className="w-4 h-4 text-[#ba9555]" />
          ) : (
            <Check className="w-4 h-4 text-green-400" />
          )}
          <span>{globalToast.text}</span>
        </div>
      )}

      {/* SaaS Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        brand={brand}
        sentCount={sentCount}
        draftCount={draftCount}
        membersCount={members.length}
        currentUser={currentUser}
        isLoggedIn={Boolean(loggedInUser)}
        onOpenLogin={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main App Workspace */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Tab 1: New Email Studio (Chat + Live Email Preview Split Screen) */}
        {activeTab === 'new' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden">
            {/* Left Column (in RTL): Conversational AI Workspace (5 cols) */}
            <div className="lg:col-span-5 h-full overflow-hidden border-l border-[#e8e2d5]">
              <ChatWorkspace
                currentEmail={currentEmail}
                brand={brand}
                members={members}
                onEmailGenerated={handleEmailGenerated}
                conversationHistory={conversationHistory}
                onUpdateHistory={setConversationHistory}
                currentUser={currentUser}
                isLoggedIn={Boolean(loggedInUser)}
                onOpenLogin={() => setLoginModalOpen(true)}
                onLogout={handleLogout}
              />
            </div>

            {/* Right Column (in RTL): Live Email Rendering Studio (7 cols) */}
            <div className="lg:col-span-7 h-full overflow-hidden">
              <LiveEmailPreview
                email={currentEmail}
                brand={brand}
                members={members}
                suggestedRecipients={suggestedRecipients}
                to={to}
                cc={cc}
                bcc={bcc}
                onRecipientsChange={(newTo, newCc, newBcc) => {
                  setTo(newTo);
                  setCc(newCc);
                  setBcc(newBcc);
                }}
                onEmailChange={setCurrentEmail}
                onSendSuccess={handleSendSuccess}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Sent Emails History */}
        {(activeTab === 'sent' || activeTab === 'drafts') && (
          <SentEmailsView
            emails={emails}
            brand={brand}
            onReuseEmail={handleReuseEmail}
            onRefresh={loadData}
          />
        )}

        {/* Tab 3: Team Members Directory */}
        {activeTab === 'members' && (
          <TeamMembersView
            members={members}
            onRefresh={loadData}
            onSendToMember={handleSendToMember}
          />
        )}

        {/* Tab 4: Smart Templates Library (with Custom Template Creation) */}
        {activeTab === 'templates' && (
          <TemplatesView
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            onTemplateCreated={handleTemplateCreated}
            onRefreshTemplates={loadData}
          />
        )}

        {/* Tab 5: Brand Identity Customizer */}
        {activeTab === 'brand' && (
          <BrandIdentityView
            brand={brand}
            onUpdateBrand={(newBrand) => {
              setBrand(newBrand);
              loadData();
            }}
          />
        )}

        {/* Tab 6: Admin Dashboard & Settings */}
        {activeTab === 'settings' && <AdminSettingsView />}
      </main>

      {/* Gmail / Google Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
