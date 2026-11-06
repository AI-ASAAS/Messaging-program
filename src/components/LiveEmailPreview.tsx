'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BrandIdentity, EmailContent, EmailRecord, TeamMember } from '@/types';
import { renderEmailHtml } from '@/lib/email-renderer';
import { RecipientSelector } from './RecipientSelector';
import {
  Monitor,
  Smartphone,
  Code,
  Send,
  Save,
  Copy,
  Check,
  Download,
  Edit3,
  Eye,
  Sparkles,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveEmailPreviewProps {
  email: EmailContent;
  brand: BrandIdentity;
  members: TeamMember[];
  suggestedRecipients?: string[];
  to: string[];
  cc: string[];
  bcc: string[];
  onRecipientsChange: (to: string[], cc: string[], bcc: string[]) => void;
  onEmailChange: (updated: EmailContent) => void;
  onSendSuccess?: (record: EmailRecord) => void;
}

export function LiveEmailPreview({
  email,
  brand,
  members,
  suggestedRecipients = [],
  to,
  cc,
  bcc,
  onRecipientsChange,
  onEmailChange,
  onSendSuccess,
}: LiveEmailPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'code' | 'edit'>('desktop');
  const [clientStyle, setClientStyle] = useState<'gmail' | 'outlook'>('gmail');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Render HTML email
  const renderedHtml = renderEmailHtml(email, brand);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(renderedHtml);
    setCopied(true);
    showToast('تم نسخ كود HTML الخاص بالبريد إلى الحافظة بنجاح');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadEml = () => {
    const emlContent = `From: "${brand.officialSignature.signerNameAr}" <${brand.supportEmail}>
To: ${to.join(', ')}
${cc.length > 0 ? `Cc: ${cc.join(', ')}\n` : ''}Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(email.subject)))}?=
MIME-Version: 1.0
Content-Type: text/html; charset=utf-8

${renderedHtml}`;

    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${email.subject.replace(/[/\\?%*:|"<>]/g, '_') || 'email'}.eml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('تم تنزيل ملف البريد الإلكتروني (.eml)');
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: email.subject,
          headline: email.headline,
          templateId: email.templateId,
          language: email.language,
          senderName: brand.officialSignature.signerNameAr,
          senderEmail: brand.supportEmail,
          to,
          cc,
          bcc,
          content: email,
          renderedHtml,
          status: 'draft',
        }),
      });

      if (!res.ok) throw new Error('فشل حفظ المسودة');
      showToast('تم حفظ الرسالة كمسودة بنجاح');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendEmail = async () => {
    if (to.length === 0) {
      showToast('يرجى تحديد مستلم واحد على الأقل في حقل (إلى)', 'error');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: email.subject,
          headline: email.headline,
          templateId: email.templateId,
          language: email.language,
          senderName: brand.officialSignature.signerNameAr,
          senderEmail: brand.supportEmail,
          to,
          cc,
          bcc,
          content: email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل إرسال البريد');
      }

      // Celebratory Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ba9555', '#221f1f', '#d3c6b4', '#10b981'],
        });
      } catch (e) {
        // confetti fallback
      }

      setConfirmModalOpen(false);
      showToast('تم إرسال البريد الإلكتروني بنجاح وتسجيله في السجل الرسمي! 🎉');

      if (onSendSuccess && data.record) {
        onSendSuccess(data.record);
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f1ea] border-r border-[#e8e2d5] relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-xl text-xs font-bold transition flex items-center gap-2 ${
            toastMessage.type === 'success'
              ? 'bg-[#10b981] text-white'
              : 'bg-[#ef4444] text-white'
          }`}
        >
          {toastMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Control Top Bar */}
      <div className="p-3 bg-white border-b border-[#e8e2d5] flex flex-wrap items-center justify-between gap-2 shadow-xs">
        {/* View Mode Switcher */}
        <div className="flex items-center bg-[#f0ece1] p-0.5 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              viewMode === 'desktop'
                ? 'bg-white text-[#221f1f] shadow-xs font-bold'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            سطح المكتب (Desktop)
          </button>

          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              viewMode === 'mobile'
                ? 'bg-white text-[#221f1f] shadow-xs font-bold'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            الجوال (Mobile)
          </button>

          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              viewMode === 'edit'
                ? 'bg-white text-[#ba9555] shadow-xs font-bold'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            تعديل مباشر
          </button>

          <button
            type="button"
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              viewMode === 'code'
                ? 'bg-white text-[#221f1f] shadow-xs font-bold'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            كود HTML
          </button>
        </div>

        {/* Client Style & Actions */}
        <div className="flex items-center gap-2 text-xs">
          {viewMode === 'desktop' && (
            <div className="flex items-center gap-1 bg-[#fcf9f5] border border-[#e8e2d5] p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setClientStyle('gmail')}
                className={`px-2 py-1 rounded transition ${
                  clientStyle === 'gmail' ? 'bg-[#ba9555] text-white font-bold' : 'text-gray-600'
                }`}
              >
                Gmail
              </button>
              <button
                type="button"
                onClick={() => setClientStyle('outlook')}
                className={`px-2 py-1 rounded transition ${
                  clientStyle === 'outlook' ? 'bg-[#0078d4] text-white font-bold' : 'text-gray-600'
                }`}
              >
                Outlook
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyHtml}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#fcf9f5] hover:bg-[#ba9555]/10 text-gray-700 border border-[#e8e2d5] rounded-lg transition"
            title="نسخ كود HTML"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">نسخ HTML</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadEml}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#fcf9f5] hover:bg-[#ba9555]/10 text-gray-700 border border-[#e8e2d5] rounded-lg transition"
            title="تنزيل ملف .eml"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تنزيل EML</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-1 px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition font-medium"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ كمسودة</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#ba9555] hover:bg-[#a88344] text-white font-bold rounded-lg shadow-sm transition active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إرسال البريد</span>
          </button>
        </div>
      </div>

      {/* Recipients Selector Panel */}
      <div className="p-3 bg-[#faf8f4] border-b border-[#e8e2d5]">
        <RecipientSelector
          to={to}
          cc={cc}
          bcc={bcc}
          onChange={onRecipientsChange}
          members={members}
          suggestedRecipients={suggestedRecipients}
        />
      </div>

      {/* Main Email Preview Frame Workspace */}
      <div className="flex-1 overflow-y-auto p-4 flex justify-center items-start">
        {/* 1. Desktop Mode */}
        {viewMode === 'desktop' && (
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-[#e2dcce] overflow-hidden flex flex-col">
            {/* Realistic Client Header */}
            {clientStyle === 'gmail' ? (
              <div className="bg-[#f2f6fc] p-3 border-b border-gray-200 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#ea4335] text-sm">Gmail</span>
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px]">
                      صندوق الوارد الرسمي
                    </span>
                  </div>
                  <span className="text-gray-400 text-[11px]">اليوم، 10:30 ص</span>
                </div>
                <div className="font-bold text-sm text-[#221f1f] mb-1">{email.subject}</div>
                <div className="flex items-center justify-between text-gray-600 text-[11px]">
                  <div>
                    <span className="font-semibold text-black">{brand.officialSignature.signerNameAr}</span> &lt;
                    {brand.supportEmail}&gt;
                  </div>
                  <div>
                    إلى: <span className="text-black font-medium">{to.length > 0 ? to.join(', ') : 'لم يتم تحديد مستلمين'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0078d4] text-white p-3 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold tracking-wide">Outlook Enterprise</span>
                  <span className="text-blue-100 text-[11px]">رسالة معتمدة</span>
                </div>
                <div className="font-bold text-sm text-white mb-1">{email.subject}</div>
                <div className="text-blue-100 text-[11px]">
                  المرسل: {brand.officialSignature.signerNameAr} ({brand.supportEmail})
                </div>
              </div>
            )}

            {/* Rendered HTML Email Content */}
            <div className="p-4 bg-[#fcf9f5] flex justify-center">
              <iframe
                title="Live Email Preview"
                srcDoc={renderedHtml}
                className="w-full min-h-[680px] border-0 rounded-lg shadow-xs bg-white"
              />
            </div>
          </div>
        )}

        {/* 2. Mobile Smartphone Frame Mode */}
        {viewMode === 'mobile' && (
          <div className="relative mx-auto my-4 w-[385px] h-[780px] bg-[#1a1717] rounded-[48px] p-3.5 shadow-2xl border-4 border-[#332f2c] flex flex-col">
            {/* Phone Speaker Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#1a1717] ml-2"></div>
              <div className="w-10 h-1 rounded-full bg-[#2a2626]"></div>
            </div>

            {/* Phone Screen */}
            <div className="w-full h-full bg-[#fcf9f5] rounded-[36px] overflow-hidden flex flex-col relative z-10 pt-7">
              {/* Phone Status Bar */}
              <div className="px-5 py-1.5 flex items-center justify-between text-[11px] font-bold text-gray-800 bg-[#f8f5ee] border-b border-gray-200">
                <span>9:41</span>
                <span className="text-[10px]">5G 100% 🔋</span>
              </div>

              {/* Mobile Mail Header */}
              <div className="p-2.5 bg-white border-b border-gray-200 text-xs">
                <div className="font-bold text-xs text-[#221f1f] truncate mb-0.5">{email.subject}</div>
                <div className="text-[10px] text-gray-500 truncate">
                  من: {brand.officialSignature.signerNameAr}
                </div>
              </div>

              {/* Mobile Rendered HTML */}
              <iframe
                title="Mobile Email Preview"
                srcDoc={renderedHtml}
                className="w-full flex-1 border-0"
              />
            </div>
          </div>
        )}

        {/* 3. Direct In-Place Edit Mode */}
        {viewMode === 'edit' && (
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-[#e8e2d5] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#ba9555]" />
                <h3 className="font-bold text-[#221f1f]">تحرير محتوى الإيميل مباشرة</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('desktop')}
                className="text-xs text-[#8f6626] hover:underline flex items-center gap-1 font-bold"
              >
                <Eye className="w-3.5 h-3.5" />
                العودة للمعاينة
              </button>
            </div>

            {/* Edit Subject */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">عنوان البريد (Subject)</label>
              <input
                type="text"
                value={email.subject}
                onChange={(e) => onEmailChange({ ...email, subject: e.target.value })}
                className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
              />
            </div>

            {/* Edit Headline */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">المانشيت الرئيسي داخل الرسالة</label>
              <input
                type="text"
                value={email.headline}
                onChange={(e) => onEmailChange({ ...email, headline: e.target.value })}
                className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
              />
            </div>

            {/* Edit Summary */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">الملخص الافتتاحي</label>
              <textarea
                rows={3}
                value={email.summary}
                onChange={(e) => onEmailChange({ ...email, summary: e.target.value })}
                className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ba9555] outline-none"
              />
            </div>

            {/* Edit Sections */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">أقسام المحتوى والبنود</label>
              <div className="space-y-3">
                {email.sections.map((sec, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                    <input
                      type="text"
                      placeholder="عنوان القسم (اختياري)"
                      value={sec.title || ''}
                      onChange={(e) => {
                        const newSections = [...email.sections];
                        newSections[idx].title = e.target.value;
                        onEmailChange({ ...email, sections: newSections });
                      }}
                      className="w-full p-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg outline-none"
                    />
                    <textarea
                      rows={2}
                      value={sec.content}
                      onChange={(e) => {
                        const newSections = [...email.sections];
                        newSections[idx].content = e.target.value;
                        onEmailChange({ ...email, sections: newSections });
                      }}
                      className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Edit CTA */}
            {email.callToAction && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نص زر الإجراء (CTA)</label>
                  <input
                    type="text"
                    value={email.callToAction.text}
                    onChange={(e) =>
                      onEmailChange({
                        ...email,
                        callToAction: { ...email.callToAction!, text: e.target.value },
                      })
                    }
                    className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">رابط الزر (URL)</label>
                  <input
                    type="text"
                    value={email.callToAction.url}
                    onChange={(e) =>
                      onEmailChange({
                        ...email,
                        callToAction: { ...email.callToAction!, url: e.target.value },
                      })
                    }
                    className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Raw HTML Code Inspector */}
        {viewMode === 'code' && (
          <div className="w-full max-w-3xl bg-[#1e1e1e] text-gray-100 rounded-2xl shadow-xl overflow-hidden flex flex-col font-mono text-xs">
            <div className="p-3 bg-[#2d2d2d] flex items-center justify-between border-b border-gray-700">
              <span className="text-gray-300">index.html (Email Template Render)</span>
              <button
                type="button"
                onClick={handleCopyHtml}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#ba9555] hover:bg-[#a88344] text-white rounded text-[11px] font-sans font-bold"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>نسخ الكود الكامل</span>
              </button>
            </div>
            <pre className="p-4 overflow-auto max-h-[650px] leading-relaxed text-blue-300">
              <code>{renderedHtml}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Send Confirmation Security Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e8e2d5] w-full max-w-lg overflow-hidden">
            <div className="p-5 bg-[#fcf9f5] border-b border-[#f0ece1] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ba9555]/15 flex items-center justify-center text-[#8f6626]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#221f1f]">تأكيد إرسال البريد الإلكتروني الرسمي</h3>
                <p className="text-xs text-gray-500">مراجعة بيانات الإرسال النهائية قبل الاعتماد</p>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">عنوان الرسالة:</span>
                  <span className="font-bold text-[#221f1f] text-right">{email.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">اسم وهوية المرسل:</span>
                  <span className="font-medium text-gray-800">
                    {brand.officialSignature.signerNameAr} ({brand.supportEmail})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">إجمالي المستلمين:</span>
                  <span className="px-2 py-0.5 bg-[#ba9555]/15 text-[#8f6626] font-bold rounded-full">
                    {to.length + cc.length + bcc.length} مستلم
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-700 block mb-1">المستلمون الأساسيون (To):</span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                  {to.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {cc.length > 0 && (
                <div>
                  <span className="font-bold text-gray-700 block mb-1">نسخة (CC):</span>
                  <div className="flex flex-wrap gap-1 p-1.5 bg-gray-50 rounded-lg text-[11px]">
                    {cc.join(', ')}
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed">
                ⚠️ بمجرد الضغط على «تأكيد الإرسال»، سيتم تسليم البريد عبر مزود الخدمة المعتمد وتسجيل المعاملة في سجل
                المراسلات الرسمية.
              </div>
            </div>

            <div className="p-4 bg-[#fcf9f5] border-t border-[#f0ece1] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                disabled={isSending}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition"
              >
                إلغاء ومراجعة
              </button>
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isSending}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[#ba9555] hover:bg-[#a88344] text-white rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جارٍ الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>تأكيد الإرسال الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
